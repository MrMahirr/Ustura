import { Injectable } from '@nestjs/common';
import { Role } from '../../shared/auth/role.enum';
import type { JwtPayload } from '../../shared/auth/jwt-payload.interface';
import { DatabaseConstraintViolationError } from '../../database/database.errors';
import { DatabaseService } from '../../database/database.service';
import { SalonService } from '../salon/salon.service';
import { StaffService } from '../staff/staff.service';
import { UserService } from '../user/user.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationStatusDto } from './dto/update-reservation-status.dto';
import { ReservationStatus } from './enums/reservation-status.enum';
import { ReservationRecord } from './interfaces/reservation.types';
import { ReservationPolicy } from './policies/reservation.policy';
import { ReservationRepository } from './repositories/reservation.repository';
import { SlotService } from './slot/slot.service';
import {
  barberNotFoundError,
  customerDetailsRequiredError,
  customerNotFoundError,
  reservationNotFoundError,
  reservationSalonNotFoundError,
  slotAlreadyReservedError,
  slotBeingReservedError,
} from './errors/reservation.errors';

@Injectable()
export class ReservationService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly userService: UserService,
    private readonly slotService: SlotService,
    private readonly salonService: SalonService,
    private readonly staffService: StaffService,
    private readonly databaseService: DatabaseService,
    private readonly reservationPolicy: ReservationPolicy,
  ) {}

  async create(
    currentUser: JwtPayload,
    createReservationDto: CreateReservationDto,
  ): Promise<ReservationRecord> {
    const salon = await this.requireSalon(createReservationDto.salon_id);
    const staff = await this.requireBarber(
      createReservationDto.staff_id,
      createReservationDto.salon_id,
    );
    const membership = await this.findActiveMembershipForAuthorization(
      currentUser,
      salon.id,
    );

    this.reservationPolicy.assertCanCreate({
      currentUser,
      salonOwnerId: salon.ownerId,
      membership,
      targetStaffId: staff.id,
    });

    const slot = await this.slotService.assertSlotReservable({
      salonId: salon.id,
      staffId: staff.id,
      slotStart: createReservationDto.slot_start,
      requesterSelectionOwnerId: createReservationDto.selection_owner_id,
    });
    const customerId = await this.resolveCustomerId(
      currentUser,
      createReservationDto,
    );
    const lock = await this.slotService.acquireReservationLock(
      staff.id,
      slot.slotStart.toISOString(),
    );

    if (!lock) {
      throw slotBeingReservedError();
    }

    try {
      const reservation = await this.databaseService.transaction(
        async (transaction) => {
          return this.reservationRepository.create(
            {
              customerId,
              salonId: salon.id,
              staffId: staff.id,
              slotStart: slot.slotStart,
              slotEnd: slot.slotEnd,
              notes: createReservationDto.notes ?? null,
            },
            transaction,
          );
        },
      );

      if (createReservationDto.selection_owner_id) {
        await this.slotService.releaseSelection(
          {
            salonId: salon.id,
            date: slot.date,
            staffId: staff.id,
          },
          slot.slotStart.toISOString(),
          createReservationDto.selection_owner_id,
        );
      }

      return reservation;
    } catch (error) {
      if (error instanceof DatabaseConstraintViolationError) {
        throw slotAlreadyReservedError();
      }

      throw error;
    } finally {
      await this.slotService.releaseReservationLock(lock.key, lock.token);
    }
  }

  async findByCustomerId(currentUser: JwtPayload): Promise<ReservationRecord[]> {
    this.reservationPolicy.assertCanViewOwnReservations(currentUser);

    return this.reservationRepository.findByCustomerId(currentUser.sub);
  }

  async findBySalonId(
    currentUser: JwtPayload,
    salonId: string,
  ): Promise<ReservationRecord[]> {
    const salon = await this.requireSalon(salonId);
    const membership = await this.findActiveMembershipForAuthorization(
      currentUser,
      salonId,
    );
    const accessScope = this.reservationPolicy.determineSalonListScope({
      currentUser,
      salonOwnerId: salon.ownerId,
      membership,
    });

    const reservations = await this.reservationRepository.findBySalonId(salonId);

    if (accessScope === 'assigned_only') {
      return reservations.filter(
        (reservation) => reservation.staffId === membership!.id,
      );
    }

    return reservations;
  }

  async cancel(
    currentUser: JwtPayload,
    reservationId: string,
  ): Promise<ReservationRecord> {
    const reservation = await this.reservationRepository.findById(reservationId);

    if (!reservation) {
      throw reservationNotFoundError();
    }

    const salon = await this.requireSalon(reservation.salonId);
    const membership = await this.findActiveMembershipForAuthorization(
      currentUser,
      reservation.salonId,
    );

    this.reservationPolicy.assertCanCancel({
      currentUser,
      reservation,
      salonOwnerId: salon.ownerId,
      membership,
    });

    if (reservation.status === ReservationStatus.CANCELLED) {
      return reservation;
    }

    const cancelledReservation = await this.reservationRepository.cancel(
      reservationId,
      currentUser.sub,
    );

    if (!cancelledReservation) {
      throw reservationNotFoundError();
    }

    return cancelledReservation;
  }

  async updateStatus(
    currentUser: JwtPayload,
    reservationId: string,
    updateReservationStatusDto: UpdateReservationStatusDto,
  ): Promise<ReservationRecord> {
    const reservation = await this.reservationRepository.findById(reservationId);

    if (!reservation) {
      throw reservationNotFoundError();
    }

    const salon = await this.requireSalon(reservation.salonId);
    const membership = await this.findActiveMembershipForAuthorization(
      currentUser,
      reservation.salonId,
    );

    this.reservationPolicy.assertCanUpdateStatus({
      currentUser,
      reservation,
      salonOwnerId: salon.ownerId,
      membership,
    });

    if (reservation.status === updateReservationStatusDto.status) {
      return reservation;
    }

    this.reservationPolicy.assertCanTransitionStatus(
      reservation.status,
      updateReservationStatusDto.status,
    );

    const updatedReservation = await this.reservationRepository.updateStatus(
      reservationId,
      updateReservationStatusDto.status,
      currentUser.sub,
    );

    if (!updatedReservation) {
      throw reservationNotFoundError();
    }

    return updatedReservation;
  }

  private async resolveCustomerId(
    currentUser: JwtPayload,
    createReservationDto: CreateReservationDto,
  ): Promise<string> {
    if (currentUser.role === Role.CUSTOMER) {
      return currentUser.sub;
    }

    if (createReservationDto.customer_id) {
      const customer = await this.userService.findById(
        createReservationDto.customer_id,
      );

      if (!customer || customer.role !== Role.CUSTOMER || !customer.isActive) {
        throw customerNotFoundError();
      }

      return customer.id;
    }

    if (
      !createReservationDto.customer_name ||
      !createReservationDto.customer_email ||
      !createReservationDto.customer_phone
    ) {
      throw customerDetailsRequiredError();
    }

    const customer = await this.userService.findOrCreateManagedCustomer({
      name: createReservationDto.customer_name,
      email: createReservationDto.customer_email,
      phone: createReservationDto.customer_phone,
    });

    return customer.id;
  }

  private async requireSalon(salonId: string) {
    const salon = await this.salonService.findActiveById(salonId);

    if (!salon) {
      throw reservationSalonNotFoundError();
    }

    return salon;
  }

  private async requireBarber(staffId: string, salonId: string) {
    const staff = await this.staffService.findById(staffId);

    if (
      !staff ||
      !staff.isActive ||
      staff.salonId !== salonId ||
      staff.role !== Role.BARBER
    ) {
      throw barberNotFoundError();
    }

    return staff;
  }

  private async findActiveMembershipForAuthorization(
    currentUser: JwtPayload,
    salonId: string,
  ) {
    if (
      currentUser.role !== Role.BARBER &&
      currentUser.role !== Role.RECEPTIONIST
    ) {
      return null;
    }

    return this.staffService.findActiveByUserIdAndSalon(
      currentUser.sub,
      salonId,
    );
  }
}

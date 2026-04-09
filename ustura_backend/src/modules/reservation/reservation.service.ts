import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { ReservationStatus } from '../../common/enums/reservation-status.enum';
import { Role } from '../../common/enums/role.enum';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { DatabaseConstraintViolationError } from '../../database/database.errors';
import { DatabaseService } from '../../database/database.service';
import { UserService } from '../user/user.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationRecord } from './interfaces/reservation.types';
import { ReservationRepository } from './repositories/reservation.repository';
import { SlotService } from './slot/slot.service';
import { SalonRepository } from '../salon/repositories/salon.repository';
import { StaffRepository } from '../staff/repositories/staff.repository';
import {
  barberNotFoundError,
  barberScheduleOnlyError,
  cancellationForbiddenError,
  customerDetailsRequiredError,
  customerNotFoundError,
  onlyCustomersCanViewOwnReservationsError,
  ownerSalonOnlyError,
  receptionistSalonOnlyError,
  reservationListAccessDeniedError,
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
    private readonly salonRepository: SalonRepository,
    private readonly staffRepository: StaffRepository,
    private readonly databaseService: DatabaseService,
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

    await this.assertCreatePermission(currentUser, salon.id, staff.id);

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
    if (currentUser.role !== Role.CUSTOMER) {
      throw onlyCustomersCanViewOwnReservationsError();
    }

    return this.reservationRepository.findByCustomerId(currentUser.sub);
  }

  async findBySalonId(
    currentUser: JwtPayload,
    salonId: string,
  ): Promise<ReservationRecord[]> {
    const salon = await this.requireSalon(salonId);

    if (currentUser.role === Role.OWNER) {
      if (salon.ownerId !== currentUser.sub) {
        throw reservationListAccessDeniedError();
      }

      return this.reservationRepository.findBySalonId(salonId);
    }

    const membership = await this.staffRepository.findActiveByUserIdAndSalon(
      currentUser.sub,
      salonId,
    );

    if (!membership) {
      throw reservationListAccessDeniedError();
    }

    const reservations = await this.reservationRepository.findBySalonId(salonId);

    if (currentUser.role === Role.BARBER) {
      return reservations.filter(
        (reservation) => reservation.staffId === membership.id,
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

    await this.assertCancellationPermission(currentUser, reservation);

    if (reservation.status === ReservationStatus.CANCELLED) {
      return reservation;
    }

    const cancelledReservation = await this.reservationRepository.cancel(
      reservationId,
    );

    if (!cancelledReservation) {
      throw reservationNotFoundError();
    }

    return cancelledReservation;
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

  private async assertCreatePermission(
    currentUser: JwtPayload,
    salonId: string,
    staffId: string,
  ): Promise<void> {
    if (currentUser.role === Role.CUSTOMER) {
      return;
    }

    if (currentUser.role === Role.OWNER) {
      const salon = await this.requireSalon(salonId);

      if (salon.ownerId !== currentUser.sub) {
        throw ownerSalonOnlyError();
      }

      return;
    }

    const membership = await this.staffRepository.findActiveByUserIdAndSalon(
      currentUser.sub,
      salonId,
    );

    if (!membership) {
      throw reservationListAccessDeniedError();
    }

    if (
      currentUser.role === Role.BARBER &&
      (membership.role !== Role.BARBER || membership.id !== staffId)
    ) {
      throw barberScheduleOnlyError();
    }

    if (
      currentUser.role === Role.RECEPTIONIST &&
      membership.role !== Role.RECEPTIONIST
    ) {
      throw receptionistSalonOnlyError();
    }
  }

  private async assertCancellationPermission(
    currentUser: JwtPayload,
    reservation: ReservationRecord,
  ): Promise<void> {
    if (
      currentUser.role === Role.CUSTOMER &&
      reservation.customerId === currentUser.sub
    ) {
      return;
    }

    const salon = await this.requireSalon(reservation.salonId);

    if (
      currentUser.role === Role.OWNER &&
      salon.ownerId === currentUser.sub
    ) {
      return;
    }

    const membership = await this.staffRepository.findActiveByUserIdAndSalon(
      currentUser.sub,
      reservation.salonId,
    );

    if (!membership) {
      throw cancellationForbiddenError();
    }

    if (
      currentUser.role === Role.BARBER &&
      membership.id !== reservation.staffId
    ) {
      throw barberScheduleOnlyError();
    }
  }

  private async requireSalon(salonId: string) {
    const salon = await this.salonRepository.findById(salonId);

    if (!salon?.isActive) {
      throw reservationSalonNotFoundError();
    }

    return salon;
  }

  private async requireBarber(staffId: string, salonId: string) {
    const staff = await this.staffRepository.findById(staffId);

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
}

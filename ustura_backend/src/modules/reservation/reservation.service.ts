import { Inject, Injectable } from '@nestjs/common';
import { PrincipalKind } from '../../shared/auth/principal-kind.enum';
import { Role } from '../../shared/auth/role.enum';
import type { JwtPayload } from '../../shared/auth/jwt-payload.interface';
import { DatabaseConstraintViolationError } from '../../database/database.errors';
import { DatabaseService } from '../../database/database.service';
import { DomainEventBus } from '../../events/domain-event-bus.service';
import {
  SALON_CATALOG_SERVICE,
  type SalonCatalogServiceContract,
} from '../salon/interfaces/salon.contracts';
import { StaffService } from '../staff/staff.service';
import {
  USER_PROVISIONING_SERVICE,
  USER_QUERY_SERVICE,
  type UserProvisioningServiceContract,
  type UserQueryServiceContract,
} from '../user/interfaces/user.contracts';
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
    @Inject(USER_QUERY_SERVICE)
    private readonly userQueryService: UserQueryServiceContract,
    @Inject(USER_PROVISIONING_SERVICE)
    private readonly userProvisioningService: UserProvisioningServiceContract,
    private readonly slotService: SlotService,
    @Inject(SALON_CATALOG_SERVICE)
    private readonly salonCatalogService: SalonCatalogServiceContract,
    private readonly staffService: StaffService,
    private readonly databaseService: DatabaseService,
    private readonly reservationPolicy: ReservationPolicy,
    private readonly domainEventBus: DomainEventBus,
  ) {}

  async create(
    currentUser: JwtPayload,
    createReservationDto: CreateReservationDto,
  ): Promise<ReservationRecord> {
    const salon = await this.requireSalon(createReservationDto.salonId);
    const staff = await this.requireBarber(
      createReservationDto.staffId,
      createReservationDto.salonId,
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
      slotStart: createReservationDto.slotStart,
      requesterSelectionOwnerId: createReservationDto.selectionOwnerId,
    });
    const customer = await this.resolveCustomer(
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
              customerId: customer.id,
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

      if (createReservationDto.selectionOwnerId) {
        await this.slotService.releaseSelection(
          {
            salonId: salon.id,
            date: slot.date,
            staffId: staff.id,
          },
          slot.slotStart.toISOString(),
          createReservationDto.selectionOwnerId,
        );
      }

      this.domainEventBus.publish({
        name: 'reservation.created',
        occurredAt: new Date(),
        payload: {
          actorUserId: currentUser.sub,
          actorRole: currentUser.role,
          reservationId: reservation.id,
          customerId: customer.id,
          customerName: customer.name,
          customerEmail: customer.email,
          salonId: salon.id,
          salonName: salon.name,
          staffId: staff.id,
          staffDisplayName: staff.displayName,
          status: reservation.status,
          slotStart: reservation.slotStart.toISOString(),
          slotEnd: reservation.slotEnd.toISOString(),
        },
      });

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

    const [customer, staff] = await Promise.all([
      this.findCustomerForEvent(cancelledReservation.customerId),
      this.findStaffForEvent(cancelledReservation.staffId),
    ]);

    this.domainEventBus.publish({
      name: 'reservation.cancelled',
      occurredAt: new Date(),
      payload: {
        actorUserId: currentUser.sub,
        actorRole: currentUser.role,
        reservationId: cancelledReservation.id,
        customerId: cancelledReservation.customerId,
        customerName: customer?.name ?? null,
        customerEmail: customer?.email ?? null,
        salonId: cancelledReservation.salonId,
        salonName: salon.name,
        staffId: cancelledReservation.staffId,
        staffDisplayName: staff?.displayName ?? null,
        status: cancelledReservation.status,
        previousStatus: reservation.status,
        slotStart: cancelledReservation.slotStart.toISOString(),
        slotEnd: cancelledReservation.slotEnd.toISOString(),
      },
    });

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

    this.domainEventBus.publish({
      name: 'reservation.status_changed',
      occurredAt: new Date(),
      payload: {
        actorUserId: currentUser.sub,
        actorRole: currentUser.role,
        reservationId: updatedReservation.id,
        customerId: updatedReservation.customerId,
        salonId: updatedReservation.salonId,
        staffId: updatedReservation.staffId,
        previousStatus: reservation.status,
        nextStatus: updatedReservation.status,
        slotStart: updatedReservation.slotStart.toISOString(),
        slotEnd: updatedReservation.slotEnd.toISOString(),
      },
    });

    return updatedReservation;
  }

  private async resolveCustomer(
    currentUser: JwtPayload,
    createReservationDto: CreateReservationDto,
  ) {
    if (currentUser.role === Role.CUSTOMER) {
      const customer = await this.userQueryService.findByPrincipal(
        PrincipalKind.CUSTOMER,
        currentUser.sub,
      );

      if (!customer || customer.role !== Role.CUSTOMER || !customer.isActive) {
        throw customerNotFoundError();
      }

      return customer;
    }

    if (createReservationDto.customerId) {
      const customer = await this.userQueryService.findByPrincipal(
        PrincipalKind.CUSTOMER,
        createReservationDto.customerId,
      );

      if (!customer || customer.role !== Role.CUSTOMER || !customer.isActive) {
        throw customerNotFoundError();
      }

      return customer;
    }

    if (
      !createReservationDto.customerName ||
      !createReservationDto.customerEmail ||
      !createReservationDto.customerPhone
    ) {
      throw customerDetailsRequiredError();
    }

    const customer = await this.userProvisioningService.findOrCreateManagedCustomer({
      name: createReservationDto.customerName,
      email: createReservationDto.customerEmail,
      phone: createReservationDto.customerPhone,
    });

    return customer;
  }

  private async requireSalon(salonId: string) {
    const salon = await this.salonCatalogService.findActiveById(salonId);

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

  private async findCustomerForEvent(customerId: string) {
    try {
      const customer = await this.userQueryService.findByPrincipal(
        PrincipalKind.CUSTOMER,
        customerId,
      );

      if (!customer || customer.role !== Role.CUSTOMER) {
        return null;
      }

      return customer;
    } catch {
      return null;
    }
  }

  private async findStaffForEvent(staffId: string) {
    try {
      return await this.staffService.findById(staffId);
    } catch {
      return null;
    }
  }
}

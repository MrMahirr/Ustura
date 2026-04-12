import { Injectable } from '@nestjs/common';
import { Role } from '../../../shared/auth/role.enum';
import type { JwtPayload } from '../../../shared/auth/jwt-payload.interface';
import type { StaffMember } from '../../staff/interfaces/staff.types';
import {
  ReservationStatus,
  type OperationalReservationStatus,
} from '../enums/reservation-status.enum';
import {
  barberScheduleOnlyError,
  cancellationForbiddenError,
  invalidReservationStatusTransitionError,
  onlyCustomersCanViewOwnReservationsError,
  ownerSalonOnlyError,
  receptionistSalonOnlyError,
  reservationListAccessDeniedError,
  reservationStatusUpdateForbiddenError,
} from '../errors/reservation.errors';
import type { ReservationRecord } from '../interfaces/reservation.types';

export type SalonReservationAccessScope = 'all' | 'assigned_only';

interface ReservationCreatePolicyContext {
  currentUser: JwtPayload;
  salonOwnerId: string;
  membership: StaffMember | null;
  targetStaffId: string;
}

interface ReservationSalonListPolicyContext {
  currentUser: JwtPayload;
  salonOwnerId: string;
  membership: StaffMember | null;
}

interface ReservationCancellationPolicyContext {
  currentUser: JwtPayload;
  reservation: ReservationRecord;
  salonOwnerId: string;
  membership: StaffMember | null;
}

interface ReservationStatusUpdatePolicyContext {
  currentUser: JwtPayload;
  reservation: ReservationRecord;
  salonOwnerId: string;
  membership: StaffMember | null;
}

@Injectable()
export class ReservationPolicy {
  private readonly allowedStatusTransitions: Readonly<
    Record<ReservationStatus, readonly OperationalReservationStatus[]>
  > = {
    [ReservationStatus.PENDING]: [ReservationStatus.CONFIRMED],
    [ReservationStatus.CONFIRMED]: [
      ReservationStatus.COMPLETED,
      ReservationStatus.NO_SHOW,
    ],
    [ReservationStatus.CANCELLED]: [],
    [ReservationStatus.COMPLETED]: [],
    [ReservationStatus.NO_SHOW]: [],
  };

  assertCanCreate(context: ReservationCreatePolicyContext): void {
    const { currentUser, salonOwnerId, membership, targetStaffId } = context;

    if (currentUser.role === Role.CUSTOMER) {
      return;
    }

    if (currentUser.role === Role.OWNER) {
      if (salonOwnerId !== currentUser.sub) {
        throw ownerSalonOnlyError();
      }

      return;
    }

    if (!membership) {
      throw reservationListAccessDeniedError();
    }

    if (
      currentUser.role === Role.BARBER &&
      (membership.role !== Role.BARBER || membership.id !== targetStaffId)
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

  assertCanViewOwnReservations(currentUser: JwtPayload): void {
    if (currentUser.role !== Role.CUSTOMER) {
      throw onlyCustomersCanViewOwnReservationsError();
    }
  }

  determineSalonListScope(
    context: ReservationSalonListPolicyContext,
  ): SalonReservationAccessScope {
    const { currentUser, salonOwnerId, membership } = context;

    if (currentUser.role === Role.OWNER) {
      if (salonOwnerId !== currentUser.sub) {
        throw reservationListAccessDeniedError();
      }

      return 'all';
    }

    if (!membership) {
      throw reservationListAccessDeniedError();
    }

    if (currentUser.role === Role.BARBER) {
      return 'assigned_only';
    }

    if (currentUser.role === Role.RECEPTIONIST) {
      return 'all';
    }

    throw reservationListAccessDeniedError();
  }

  assertCanCancel(context: ReservationCancellationPolicyContext): void {
    const { currentUser, reservation, salonOwnerId, membership } = context;

    if (
      currentUser.role === Role.CUSTOMER &&
      reservation.customerId === currentUser.sub
    ) {
      return;
    }

    if (currentUser.role === Role.OWNER && salonOwnerId === currentUser.sub) {
      return;
    }

    if (!membership) {
      throw cancellationForbiddenError();
    }

    if (
      currentUser.role === Role.BARBER &&
      membership.id !== reservation.staffId
    ) {
      throw barberScheduleOnlyError();
    }

    if (
      currentUser.role === Role.BARBER ||
      currentUser.role === Role.RECEPTIONIST
    ) {
      return;
    }

    throw cancellationForbiddenError();
  }

  assertCanUpdateStatus(
    context: ReservationStatusUpdatePolicyContext,
  ): void {
    const { currentUser, reservation, salonOwnerId, membership } = context;

    if (currentUser.role === Role.OWNER && salonOwnerId === currentUser.sub) {
      return;
    }

    if (!membership) {
      throw reservationStatusUpdateForbiddenError();
    }

    if (
      currentUser.role === Role.BARBER &&
      membership.id === reservation.staffId &&
      membership.role === Role.BARBER
    ) {
      return;
    }

    if (
      currentUser.role === Role.RECEPTIONIST &&
      membership.role === Role.RECEPTIONIST
    ) {
      return;
    }

    throw reservationStatusUpdateForbiddenError();
  }

  assertCanTransitionStatus(
    currentStatus: ReservationStatus,
    nextStatus: OperationalReservationStatus,
  ): void {
    const allowedStatuses = this.allowedStatusTransitions[currentStatus];

    if (allowedStatuses.includes(nextStatus)) {
      return;
    }

    throw invalidReservationStatusTransitionError(currentStatus, nextStatus);
  }
}

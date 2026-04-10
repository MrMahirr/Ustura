import { Role } from '../../shared/auth/role.enum';
import { ReservationStatus } from '../../modules/reservation/enums/reservation-status.enum';

export type AppDomainEventName =
  | 'reservation.created'
  | 'reservation.cancelled'
  | 'reservation.status_changed'
  | 'staff.created'
  | 'owner.approved'
  | 'auth.logged_out';

export interface DomainEvent<
  TName extends AppDomainEventName,
  TPayload extends Record<string, unknown>,
> {
  name: TName;
  occurredAt: Date;
  payload: TPayload;
}

export interface ReservationCreatedEvent
  extends DomainEvent<
    'reservation.created',
    {
      actorUserId: string;
      actorRole: Role;
      reservationId: string;
      customerId: string;
      customerName: string;
      customerEmail: string;
      salonId: string;
      salonName: string;
      staffId: string;
      staffDisplayName: string;
      status: ReservationStatus;
      slotStart: string;
      slotEnd: string;
    }
  > {}

export interface ReservationCancelledEvent
  extends DomainEvent<
    'reservation.cancelled',
    {
      actorUserId: string;
      actorRole: Role;
      reservationId: string;
      customerId: string;
      customerName?: string | null;
      customerEmail?: string | null;
      salonId: string;
      salonName: string;
      staffId: string;
      staffDisplayName?: string | null;
      status: ReservationStatus;
      previousStatus: ReservationStatus;
      slotStart: string;
      slotEnd: string;
    }
  > {}

export interface ReservationStatusChangedEvent
  extends DomainEvent<
    'reservation.status_changed',
    {
      actorUserId: string;
      actorRole: Role;
      reservationId: string;
      customerId: string;
      salonId: string;
      staffId: string;
      previousStatus: ReservationStatus;
      nextStatus: ReservationStatus;
      slotStart: string;
      slotEnd: string;
    }
  > {}

export interface StaffCreatedEvent
  extends DomainEvent<
    'staff.created',
    {
      actorUserId: string;
      actorRole: Role;
      staffId: string;
      userId: string;
      salonId: string;
      staffRole: Role.BARBER | Role.RECEPTIONIST;
    }
  > {}

export interface OwnerApprovedEvent
  extends DomainEvent<
    'owner.approved',
    {
      applicationId: string;
      applicantName: string;
      applicantEmail: string;
      salonName: string;
      approvedAt: string;
      reviewedByUserId: string | null;
      approvedOwnerUserId: string | null;
      approvedSalonId: string | null;
    }
  > {}

export interface AuthLoggedOutEvent
  extends DomainEvent<
    'auth.logged_out',
    {
      userId: string;
      provider: 'refresh_token';
    }
  > {}

export type AppDomainEvent =
  | ReservationCreatedEvent
  | ReservationCancelledEvent
  | ReservationStatusChangedEvent
  | StaffCreatedEvent
  | OwnerApprovedEvent
  | AuthLoggedOutEvent;

export type DomainEventHandler<TEventName extends AppDomainEventName> = (
  event: Extract<AppDomainEvent, { name: TEventName }>,
) => void | Promise<void>;

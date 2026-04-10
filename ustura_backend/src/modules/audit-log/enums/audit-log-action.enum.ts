export enum AuditLogAction {
  AUTH_REGISTERED = 'auth.registered',
  AUTH_LOGGED_IN = 'auth.logged_in',
  AUTH_GOOGLE_CUSTOMER_AUTHENTICATED = 'auth.google_customer_authenticated',
  AUTH_GOOGLE_WEB_CUSTOMER_AUTHENTICATED = 'auth.google_web_customer_authenticated',
  AUTH_REFRESHED = 'auth.refreshed',
  AUTH_LOGGED_OUT = 'auth.logged_out',
  STAFF_CREATED = 'staff.created',
  STAFF_UPDATED = 'staff.updated',
  STAFF_DEACTIVATED = 'staff.deactivated',
  RESERVATION_CREATED = 'reservation.created',
  RESERVATION_CANCELLED = 'reservation.cancelled',
  RESERVATION_STATUS_UPDATED = 'reservation.status_updated',
}

export const ERROR_CODES = {
  AUTH: {
    ACCESS_TOKEN_INVALID: 'auth.access_token_invalid',
    ACCOUNT_INACTIVE: 'auth.account_inactive',
    CUSTOMER_GOOGLE_ONLY: 'auth.customer_google_only',
    GENERATED_TOKEN_INVALID: 'auth.generated_token_invalid',
    GOOGLE_ACCESS_TOKEN_INVALID: 'auth.google_access_token_invalid',
    GOOGLE_EMAIL_ALREADY_LINKED: 'auth.google_email_already_linked',
    GOOGLE_IDENTITY_TOKEN_INVALID: 'auth.google_identity_token_invalid',
    GOOGLE_VERIFICATION_UNAVAILABLE: 'auth.google_verification_unavailable',
    GOOGLE_WEB_NOT_CONFIGURED: 'auth.google_web_not_configured',
    INVALID_CREDENTIALS: 'auth.invalid_credentials',
    PASSWORD_CHANGE_REQUIRED: 'auth.password_change_required',
    REFRESH_TOKEN_INVALID: 'auth.refresh_token_invalid',
    REFRESH_TOKEN_REUSE_DETECTED: 'auth.refresh_token_reuse_detected',
    FIREBASE_GOOGLE_NOT_CONFIGURED: 'auth.firebase_google_not_configured',
    FIREBASE_CERTIFICATES_UNAVAILABLE:
      'auth.firebase_certificates_unavailable',
    FIREBASE_CERTIFICATES_INVALID: 'auth.firebase_certificates_invalid',
  },
  USER: {
    CUSTOMER_CREDENTIALS_REQUIRED: 'user.customer_credentials_required',
    CUSTOMER_INACTIVE: 'user.customer_inactive',
    CUSTOMER_ONLY_MANAGED_RESERVATION:
      'user.customer_only_managed_reservation',
    CUSTOMER_GOOGLE_ONLY: 'user.customer_google_only',
    EMAIL_ALREADY_EXISTS: 'user.email_already_exists',
    GOOGLE_IDENTITY_ALREADY_LINKED: 'user.google_identity_already_linked',
    INVALID_EMPLOYEE_ROLE: 'user.invalid_employee_role',
    NOT_FOUND: 'user.not_found',
    PHONE_ALREADY_EXISTS: 'user.phone_already_exists',
    PASSWORD_REQUIRED: 'user.password_required',
    PHONE_REQUIRED: 'user.phone_required',
    INVALID_CURRENT_PASSWORD: 'user.invalid_current_password',
    CANNOT_SELF_DEACTIVATE: 'user.cannot_self_deactivate',
  },
  PLATFORM_ADMIN: {
    ACCESS_FORBIDDEN: 'platform_admin.access_forbidden',
    OWNER_APPLICATION_ALREADY_EXISTS:
      'platform_admin.owner_application_already_exists',
    OWNER_APPLICATION_ALREADY_REVIEWED:
      'platform_admin.owner_application_already_reviewed',
    OWNER_APPLICATION_NOT_FOUND: 'platform_admin.owner_application_not_found',
    OWNER_APPLICATION_APPLICANT_EMAIL_USED_BY_STAFF:
      'platform_admin.owner_application_applicant_email_used_by_staff',
    OWNER_APPLICATION_APPLICANT_OWNER_INACTIVE:
      'platform_admin.owner_application_applicant_owner_inactive',
  },
  STAFF: {
    ALREADY_ASSIGNED: 'staff.already_assigned',
    INVALID_ACCOUNT_ROLE: 'staff.invalid_account_role',
    MANAGEMENT_FORBIDDEN: 'staff.management_forbidden',
    NOT_FOUND: 'staff.not_found',
    PROVISIONING_MODE_INVALID: 'staff.provisioning_mode_invalid',
    SALON_NOT_FOUND: 'staff.salon_not_found',
    SELF_VIEW_FORBIDDEN: 'staff.self_view_forbidden',
    USER_INACTIVE: 'staff.user_inactive',
    USER_NOT_FOUND: 'staff.user_not_found',
  },
  SALON: {
    INVALID_FIELD: 'salon.invalid_field',
    INACTIVE_UPDATE_FORBIDDEN: 'salon.inactive_update_forbidden',
    INVALID_WORKING_HOURS: 'salon.invalid_working_hours',
    MANAGEMENT_FORBIDDEN: 'salon.management_forbidden',
    NOT_FOUND: 'salon.not_found',
  },
  RESERVATION: {
    BARBER_NOT_FOUND: 'reservation.barber_not_found',
    BARBER_SCHEDULE_ONLY: 'reservation.barber_schedule_only',
    CANCELLATION_FORBIDDEN: 'reservation.cancellation_forbidden',
    CUSTOMER_DETAILS_REQUIRED: 'reservation.customer_details_required',
    CUSTOMER_NOT_FOUND: 'reservation.customer_not_found',
    LIST_ACCESS_DENIED: 'reservation.list_access_denied',
    ONLY_CUSTOMERS_CAN_VIEW_OWN: 'reservation.only_customers_can_view_own',
    OWNER_SALON_ONLY: 'reservation.owner_salon_only',
    RECEPTIONIST_SALON_ONLY: 'reservation.receptionist_salon_only',
    INVALID_STATUS_TRANSITION: 'reservation.invalid_status_transition',
    RESERVATION_NOT_FOUND: 'reservation.not_found',
    SALON_NOT_FOUND: 'reservation.salon_not_found',
    SLOT_ALREADY_RESERVED: 'reservation.slot_already_reserved',
    SLOT_BEING_RESERVED: 'reservation.slot_being_reserved',
    STATUS_UPDATE_FORBIDDEN: 'reservation.status_update_forbidden',
  },
  SLOT: {
    INVALID_SLOT_START: 'slot.invalid_slot_start',
    LIVE_SELECTION_STAFF_REQUIRED: 'slot.live_selection_staff_required',
    SALON_NOT_FOUND: 'slot.salon_not_found',
    SLOT_HELD_BY_OTHER: 'slot.held_by_other',
    SLOT_OUTSIDE_WORKING_HOURS: 'slot.outside_working_hours',
    SLOT_UNAVAILABLE: 'slot.unavailable',
    STAFF_NOT_FOUND: 'slot.staff_not_found',
  },
} as const;

type NestedValues<T> = T extends string
  ? T
  : {
      [K in keyof T]: NestedValues<T[K]>;
    }[keyof T];

export type AppErrorCode = NestedValues<typeof ERROR_CODES>;

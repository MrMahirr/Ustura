export interface StaffWelcomeEmailParams {
  recipientEmail: string;
  recipientName: string;
  salonName: string;
  temporaryPassword: string;
  loginUrl: string;
}

export interface OwnerApprovalEmailParams {
  recipientEmail: string;
  recipientName: string;
  salonName: string;
  loginUrl: string;
  /** Set when a new owner personnel row is created; omitted when linking to an existing owner. */
  temporaryPassword?: string;
  /** When true, the template should not instruct the user to use a newly generated password. */
  isExistingOwnerAccount?: boolean;
}

export interface EmailSendResult {
  success: boolean;
  status?: number;
  text?: string;
}

export const EMAIL_SERVICE = Symbol('EMAIL_SERVICE');

export interface EmailServiceContract {
  sendOwnerApprovalEmail(
    params: OwnerApprovalEmailParams,
  ): Promise<EmailSendResult>;
  sendStaffWelcomeEmail(
    params: StaffWelcomeEmailParams,
  ): Promise<EmailSendResult>;
}

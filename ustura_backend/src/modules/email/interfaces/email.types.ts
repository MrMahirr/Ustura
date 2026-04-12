export interface OwnerApprovalEmailParams {
  recipientEmail: string;
  recipientName: string;
  salonName: string;
  temporaryPassword: string;
  loginUrl: string;
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
}

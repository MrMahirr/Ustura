import { Injectable, Logger } from '@nestjs/common';
import emailjs from '@emailjs/nodejs';
import { AppConfigService } from '../../config/config.service';
import type {
  EmailSendResult,
  EmailServiceContract,
  OwnerApprovalEmailParams,
} from './interfaces/email.types';

@Injectable()
export class EmailJsService implements EmailServiceContract {
  private readonly logger = new Logger(EmailJsService.name);
  private readonly isConfigured: boolean;

  constructor(private readonly config: AppConfigService) {
    this.isConfigured = !!(
      config.emailJs.serviceId &&
      config.emailJs.publicKey &&
      config.emailJs.privateKey &&
      config.emailJs.templateApproval
    );

    if (!this.isConfigured) {
      this.logger.warn(
        'EmailJS is not fully configured — emails will be logged instead of sent.',
      );
    }
  }

  async sendOwnerApprovalEmail(
    params: OwnerApprovalEmailParams,
  ): Promise<EmailSendResult> {
    const templateParams = {
      to_email: params.recipientEmail,
      to_name: params.recipientName,
      salon_name: params.salonName,
      temporary_password: params.temporaryPassword,
      login_url: params.loginUrl,
    };

    if (!this.isConfigured) {
      this.logger.log(
        `[DRY-RUN] Owner approval email: ${JSON.stringify(templateParams)}`,
      );
      return { success: true, text: 'dry-run' };
    }

    try {
      const response = await emailjs.send(
        this.config.emailJs.serviceId,
        this.config.emailJs.templateApproval,
        templateParams,
        {
          publicKey: this.config.emailJs.publicKey,
          privateKey: this.config.emailJs.privateKey,
        },
      );

      this.logger.log(
        `Owner approval email sent to ${params.recipientEmail} — status: ${response.status}`,
      );

      return {
        success: response.status === 200,
        status: response.status,
        text: response.text,
      };
    } catch (error) {
      this.logger.error(
        `Failed to send owner approval email to ${params.recipientEmail}`,
        error instanceof Error ? error.stack : String(error),
      );
      return { success: false, text: String(error) };
    }
  }
}

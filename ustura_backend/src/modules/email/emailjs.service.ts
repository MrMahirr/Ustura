import { Injectable, Logger } from '@nestjs/common';
import emailjs from '@emailjs/nodejs';
import { AppConfigService } from '../../config/config.service';
import type {
  EmailSendResult,
  EmailServiceContract,
  OwnerApprovalEmailParams,
  StaffWelcomeEmailParams,
} from './interfaces/email.types';

interface EmailJsClient {
  init: (options: { publicKey: string; privateKey: string }) => void;
  send: (
    serviceId: string,
    templateId: string,
    templateParams: Record<string, unknown>,
    options: { publicKey: string; privateKey: string },
  ) => Promise<{ status: number; text: string }>;
}

const emailJsClient = emailjs as unknown as EmailJsClient;

const EMAILJS_NON_BROWSER_SECURITY_URL =
  'https://dashboard.emailjs.com/admin/account/security';

/** @emailjs/nodejs başarısızlıkta genelde Error değil { status, text } döner */
function formatEmailJsFailure(error: unknown): {
  message: string;
  status?: number;
} {
  if (error instanceof Error) {
    return { message: error.message, status: undefined };
  }
  if (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    'text' in error
  ) {
    const e = error as { status: number; text: string };
    let detail = e.text?.trim() || '(empty body)';
    try {
      const parsed = JSON.parse(e.text) as { message?: string; error?: string };
      if (typeof parsed.message === 'string') detail = parsed.message;
      else if (typeof parsed.error === 'string') detail = parsed.error;
    } catch {
      /* ham metin */
    }
    return { message: `EmailJS HTTP ${e.status}: ${detail}`, status: e.status };
  }
  try {
    return { message: JSON.stringify(error) };
  } catch {
    return { message: String(error) };
  }
}

function isNonBrowserApiDisabled403(
  status: number | undefined,
  message: string,
): boolean {
  return status === 403 && /non-browser|non browser/i.test(message);
}

@Injectable()
export class EmailJsService implements EmailServiceContract {
  private readonly logger = new Logger(EmailJsService.name);
  private readonly isConfigured: boolean;
  private readonly isStaffWelcomeConfigured: boolean;

  constructor(private readonly config: AppConfigService) {
    const keysReady = !!(
      config.emailJs.serviceId &&
      config.emailJs.publicKey &&
      config.emailJs.privateKey
    );
    this.isConfigured = keysReady && !!config.emailJs.templateApproval?.trim();
    this.isStaffWelcomeConfigured =
      keysReady && !!config.emailJs.templateStaffWelcome?.trim();

    if (!keysReady) {
      this.logger.warn(
        'EmailJS is not fully configured — emails will be logged instead of sent.',
      );
    } else {
      emailJsClient.init({
        publicKey: this.config.emailJs.publicKey,
        privateKey: this.config.emailJs.privateKey,
      });
      this.logger.log(
        `EmailJS (Node): Sunucudan gonderim icin EmailJS panelinde Account > Security bolumunde ` +
          `"Allow EmailJS API for non-browser applications" secenegini acmaniz gerekir; aksi halde HTTP 403 alinir. ` +
          `${EMAILJS_NON_BROWSER_SECURITY_URL}`,
      );
      if (!this.isConfigured && !this.isStaffWelcomeConfigured) {
        this.logger.warn(
          'EmailJS: Ne owner onay (EMAILJS_TEMPLATE_APPROVAL) ne de personel davet (EMAILJS_TEMPLATE_STAFF_WELCOME) sablonu ayarli.',
        );
      }
    }
  }

  async sendOwnerApprovalEmail(
    params: OwnerApprovalEmailParams,
  ): Promise<EmailSendResult> {
    // EmailJS şablonundaki "To Email" alanı hangi {{değişken}} adına bağlıysa o isim dolu olmalı;
    // yalnızca `to_email` gönderilip şablonda `{{email}}` kullanılırsa 422: recipients address is empty oluşur.
    const templateParams = {
      to_email: params.recipientEmail,
      email: params.recipientEmail,
      user_email: params.recipientEmail,
      recipient_email: params.recipientEmail,
      to_name: params.recipientName,
      user_name: params.recipientName,
      salon_name: params.salonName,
      temporary_password: params.temporaryPassword ?? '',
      temporaryPassword: params.temporaryPassword ?? '',
      login_url: params.loginUrl,
      is_existing_owner_account: params.isExistingOwnerAccount === true,
    };

    if (!this.isConfigured) {
      this.logger.log(
        `[DRY-RUN] Owner approval email: ${JSON.stringify(templateParams)}`,
      );
      return { success: true, text: 'dry-run' };
    }

    try {
      const response = await emailJsClient.send(
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
      const { message, status } = formatEmailJsFailure(error);
      if (isNonBrowserApiDisabled403(status, message)) {
        this.logger.error(
          `Failed to send owner approval email to ${params.recipientEmail} — ${message}. ` +
            `Cozum: EmailJS hesabinizda sunucu (Node) API cagrilari kapali. ` +
            `Panel > Account > Security > "Allow EmailJS API for non-browser applications" secenegini etkinlestirin: ` +
            `${EMAILJS_NON_BROWSER_SECURITY_URL}`,
        );
      } else {
        this.logger.error(
          `Failed to send owner approval email to ${params.recipientEmail} — ${message}`,
        );
      }
      if (error instanceof Error && error.stack) {
        this.logger.debug(error.stack);
      }
      return { success: false, status, text: message };
    }
  }

  async sendStaffWelcomeEmail(
    params: StaffWelcomeEmailParams,
  ): Promise<EmailSendResult> {
    const templateParams = {
      to_email: params.recipientEmail,
      email: params.recipientEmail,
      user_email: params.recipientEmail,
      recipient_email: params.recipientEmail,
      to_name: params.recipientName,
      user_name: params.recipientName,
      salon_name: params.salonName,
      temporary_password: params.temporaryPassword,
      temporaryPassword: params.temporaryPassword,
      login_url: params.loginUrl,
    };

    if (!this.isStaffWelcomeConfigured) {
      this.logger.log(
        `[DRY-RUN] Staff welcome email: ${JSON.stringify(templateParams)}`,
      );
      return { success: true, text: 'dry-run' };
    }

    try {
      const response = await emailJsClient.send(
        this.config.emailJs.serviceId,
        this.config.emailJs.templateStaffWelcome,
        templateParams,
        {
          publicKey: this.config.emailJs.publicKey,
          privateKey: this.config.emailJs.privateKey,
        },
      );

      this.logger.log(
        `Staff welcome email sent to ${params.recipientEmail} — status: ${response.status}`,
      );

      return {
        success: response.status === 200,
        status: response.status,
        text: response.text,
      };
    } catch (error) {
      const { message, status } = formatEmailJsFailure(error);
      if (isNonBrowserApiDisabled403(status, message)) {
        this.logger.error(
          `Failed to send staff welcome email to ${params.recipientEmail} — ${message}. ` +
            `Cozum: EmailJS hesabinizda sunucu (Node) API cagrilari kapali. ` +
            `Panel > Account > Security > "Allow EmailJS API for non-browser applications" secenegini etkinlestirin: ` +
            `${EMAILJS_NON_BROWSER_SECURITY_URL}`,
        );
      } else {
        this.logger.error(
          `Failed to send staff welcome email to ${params.recipientEmail} — ${message}`,
        );
      }
      if (error instanceof Error && error.stack) {
        this.logger.debug(error.stack);
      }
      return { success: false, status, text: message };
    }
  }
}

import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  AuthSecurityNotificationPayload,
  NotificationChannel,
  OwnerApprovedNotificationPayload,
  ReservationCancelledNotificationPayload,
  ReservationCreatedNotificationPayload,
} from './interfaces/notification.types';
import { NotificationTemplateService } from './templates/notification-template.service';
import { NOTIFICATION_CHANNELS } from './tokens/notification.tokens';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly notificationTemplateService: NotificationTemplateService,
    @Inject(NOTIFICATION_CHANNELS)
    private readonly channels: NotificationChannel[],
  ) {}

  sendReservationCreatedBestEffort(
    payload: ReservationCreatedNotificationPayload,
  ): void {
    this.runBestEffort('reservation.created', () =>
      this.sendMessage(
        this.notificationTemplateService.buildReservationCreatedMessage(payload),
      ),
    );
  }

  sendReservationCancelledBestEffort(
    payload: ReservationCancelledNotificationPayload,
  ): void {
    this.runBestEffort('reservation.cancelled', () =>
      this.sendMessage(
        this.notificationTemplateService.buildReservationCancelledMessage(payload),
      ),
    );
  }

  sendOwnerApprovedBestEffort(payload: OwnerApprovedNotificationPayload): void {
    this.runBestEffort('owner.approved', () =>
      this.sendMessage(
        this.notificationTemplateService.buildOwnerApprovedMessage(payload),
      ),
    );
  }

  sendAuthSecurityBestEffort(payload: AuthSecurityNotificationPayload): void {
    this.runBestEffort('auth.security', () =>
      this.sendMessage(
        this.notificationTemplateService.buildAuthSecurityMessage(payload),
      ),
    );
  }

  private runBestEffort(
    operation: string,
    work: () => Promise<void>,
  ): void {
    void work().catch((error: unknown) => {
      const message =
        error instanceof Error ? error.message : 'Unknown notification error.';

      this.logger.warn(
        `Notification delivery skipped for ${operation}: ${message}`,
      );
    });
  }

  private async sendMessage(
    message: ReturnType<
      NotificationTemplateService['buildReservationCreatedMessage']
    >,
  ): Promise<void> {
    for (const channelName of message.channels) {
      const channel = this.channels.find(
        (candidate) => candidate.channel === channelName,
      );

      if (!channel) {
        this.logger.warn(
          `Notification channel ${channelName} is not registered.`,
        );
        continue;
      }

      await channel.send(message);
    }
  }
}

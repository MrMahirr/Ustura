import { Inject, Injectable, Logger } from '@nestjs/common';
import type { JwtPayload } from '../../shared/auth/jwt-payload.interface';
import { ListNotificationsQueryDto } from './dto/list-notifications-query.dto';
import { NotificationListResponseDto } from './dto/notification-response.dto';
import {
  CreateNotificationInput,
  NotificationRecord,
} from './interfaces/notification-record.types';
import {
  AuthSecurityNotificationPayload,
  NotificationChannel,
  OwnerApprovedNotificationPayload,
  ReservationCancelledNotificationPayload,
  ReservationCreatedNotificationPayload,
} from './interfaces/notification.types';
import { NotificationRepository } from './repositories/notification.repository';
import { NotificationTemplateService } from './templates/notification-template.service';
import { NOTIFICATION_CHANNELS } from './tokens/notification.tokens';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly notificationTemplateService: NotificationTemplateService,
    private readonly notificationRepository: NotificationRepository,
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

  persistBestEffort(input: CreateNotificationInput): void {
    this.runBestEffort(`persist:${input.key}`, () =>
      this.notificationRepository.create(input).then(() => undefined),
    );
  }

  async list(
    _currentUser: JwtPayload,
    query: ListNotificationsQueryDto,
  ): Promise<NotificationListResponseDto> {
    const limit = query.pageSize;
    const offset = (query.page - 1) * query.pageSize;

    const filters = {
      recipientId: query.recipientId,
      key: query.key,
      isRead: query.isRead,
    };

    const [items, total] = await Promise.all([
      this.notificationRepository.findAll({ ...filters, limit, offset }),
      this.notificationRepository.countAll(filters),
    ]);

    return {
      items,
      total,
      page: query.page,
      pageSize: query.pageSize,
      totalPages: Math.ceil(total / query.pageSize),
    };
  }

  async markAsRead(id: string): Promise<NotificationRecord | null> {
    return this.notificationRepository.markAsRead(id);
  }

  async markAllAsRead(recipientId?: string): Promise<number> {
    return this.notificationRepository.markAllAsRead(recipientId);
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

import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import type { JwtPayload } from '../../shared/auth/jwt-payload.interface';
import { Role } from '../../shared/auth/role.enum';
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
        this.notificationTemplateService.buildReservationCreatedMessage(
          payload,
        ),
      ),
    );
  }

  sendReservationCancelledBestEffort(
    payload: ReservationCancelledNotificationPayload,
  ): void {
    this.runBestEffort('reservation.cancelled', () =>
      this.sendMessage(
        this.notificationTemplateService.buildReservationCancelledMessage(
          payload,
        ),
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
    currentUser: JwtPayload,
    query: ListNotificationsQueryDto,
  ): Promise<NotificationListResponseDto> {
    const limit = query.pageSize;
    const offset = (query.page - 1) * query.pageSize;

    const isSuperAdmin = currentUser.role === Role.SUPER_ADMIN;
    const filters = {
      recipientId: isSuperAdmin ? query.recipientId : currentUser.sub,
      key: query.key,
      isRead: query.isRead,
    };

    const unreadScope = isSuperAdmin
      ? { isRead: false as const }
      : { recipientId: currentUser.sub, isRead: false as const };

    const [items, total, unreadTotal] = await Promise.all([
      this.notificationRepository.findAll({ ...filters, limit, offset }),
      this.notificationRepository.countAll(filters),
      this.notificationRepository.countAll(unreadScope),
    ]);

    return {
      items,
      total,
      page: query.page,
      pageSize: query.pageSize,
      totalPages: Math.ceil(total / query.pageSize),
      unreadTotal,
    };
  }

  async markAsRead(
    currentUser: JwtPayload,
    id: string,
  ): Promise<NotificationRecord> {
    const isSuperAdmin = currentUser.role === Role.SUPER_ADMIN;
    const updated = isSuperAdmin
      ? await this.notificationRepository.markAsRead(id)
      : await this.notificationRepository.markAsReadForRecipient(
          id,
          currentUser.sub,
        );

    if (!updated) {
      throw new NotFoundException();
    }

    return updated;
  }

  async markAllAsRead(currentUser: JwtPayload): Promise<number> {
    const isSuperAdmin = currentUser.role === Role.SUPER_ADMIN;
    return this.notificationRepository.markAllAsRead(
      isSuperAdmin ? undefined : currentUser.sub,
    );
  }

  private runBestEffort(operation: string, work: () => Promise<void>): void {
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

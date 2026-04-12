import { Injectable } from '@nestjs/common';
import {
  AuthSecurityNotificationPayload,
  NotificationChannelName,
  NotificationMessage,
  OwnerApprovedNotificationPayload,
  ReservationCancelledNotificationPayload,
  ReservationCreatedNotificationPayload,
} from '../interfaces/notification.types';

@Injectable()
export class NotificationTemplateService {
  buildReservationCreatedMessage(
    payload: ReservationCreatedNotificationPayload,
  ): NotificationMessage {
    return {
      key: 'reservation.created',
      recipient: {
        email: payload.recipientEmail,
        name: payload.recipientName,
      },
      subject: `${payload.salonName} rezervasyonunuz olusturuldu`,
      body:
        `${payload.recipientName}, ${payload.salonName} icin ` +
        `${payload.staffDisplayName} ile rezervasyonunuz olusturuldu. ` +
        `Baslangic: ${payload.slotStart.toISOString()}, ` +
        `Bitis: ${payload.slotEnd.toISOString()}.`,
      channels: [NotificationChannelName.EMAIL],
      metadata: {
        salonName: payload.salonName,
        staffDisplayName: payload.staffDisplayName,
        slotStart: payload.slotStart.toISOString(),
        slotEnd: payload.slotEnd.toISOString(),
      },
    };
  }

  buildReservationCancelledMessage(
    payload: ReservationCancelledNotificationPayload,
  ): NotificationMessage {
    return {
      key: 'reservation.cancelled',
      recipient: {
        email: payload.recipientEmail,
        name: payload.recipientName,
      },
      subject: `${payload.salonName} rezervasyonunuz iptal edildi`,
      body:
        `${payload.recipientName}, ${payload.salonName} icin ` +
        `${payload.staffDisplayName} ile rezervasyonunuz iptal edildi. ` +
        `Baslangic: ${payload.slotStart.toISOString()}, ` +
        `Bitis: ${payload.slotEnd.toISOString()}.`,
      channels: [NotificationChannelName.EMAIL],
      metadata: {
        salonName: payload.salonName,
        staffDisplayName: payload.staffDisplayName,
        slotStart: payload.slotStart.toISOString(),
        slotEnd: payload.slotEnd.toISOString(),
        cancelledByRole: payload.cancelledByRole,
      },
    };
  }

  buildOwnerApprovedMessage(
    payload: OwnerApprovedNotificationPayload,
  ): NotificationMessage {
    return {
      key: 'owner.approved',
      recipient: {
        email: payload.recipientEmail,
        name: payload.recipientName,
      },
      subject: `${payload.salonName} basvurunuz onaylandi`,
      body:
        `${payload.recipientName}, ${payload.salonName} sahibi basvurunuz ` +
        `${payload.approvedAt.toISOString()} tarihinde onaylandi.`,
      channels: [NotificationChannelName.EMAIL],
      metadata: {
        salonName: payload.salonName,
        approvedAt: payload.approvedAt.toISOString(),
      },
    };
  }

  buildAuthSecurityMessage(
    payload: AuthSecurityNotificationPayload,
  ): NotificationMessage {
    const reasonLabel =
      payload.reason === 'suspicious_reuse'
        ? 'supheli oturum yenileme denemesi'
        : 'tum cihazlardan cikis';

    return {
      key: 'auth.security',
      recipient: {
        email: payload.recipientEmail,
        name: payload.recipientName ?? null,
      },
      subject: 'Ustura oturum guvenligi bildirimi',
      body:
        `${payload.recipientName ?? 'Merhaba'}, hesabiniz icin ${reasonLabel} ` +
        `tespit edildi. Etkilenen oturum sayisi: ${payload.revokedSessionCount}.`,
      channels: [NotificationChannelName.EMAIL],
      metadata: {
        reason: payload.reason,
        revokedSessionCount: payload.revokedSessionCount,
      },
    };
  }
}

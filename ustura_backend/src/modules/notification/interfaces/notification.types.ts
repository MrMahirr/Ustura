export enum NotificationChannelName {
  EMAIL = 'email',
}

export interface NotificationRecipient {
  email: string;
  name?: string | null;
}

export interface NotificationMessage {
  key: string;
  recipient: NotificationRecipient;
  subject: string;
  body: string;
  channels: NotificationChannelName[];
  metadata: Record<string, unknown>;
}

export interface NotificationChannel {
  readonly channel: NotificationChannelName;
  send(message: NotificationMessage): Promise<void>;
}

export interface ReservationCreatedNotificationPayload {
  recipientEmail: string;
  recipientName: string;
  salonName: string;
  staffDisplayName: string;
  slotStart: Date;
  slotEnd: Date;
}

export interface ReservationCancelledNotificationPayload
  extends ReservationCreatedNotificationPayload {
  cancelledByRole: string;
}

export interface OwnerApprovedNotificationPayload {
  recipientEmail: string;
  recipientName: string;
  salonName: string;
  approvedAt: Date;
}

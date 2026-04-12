import { Injectable, Logger } from '@nestjs/common';
import {
  NotificationChannel,
  NotificationChannelName,
  NotificationMessage,
} from '../interfaces/notification.types';

@Injectable()
export class LoggingNotificationChannel implements NotificationChannel {
  readonly channel = NotificationChannelName.EMAIL;

  private readonly logger = new Logger(LoggingNotificationChannel.name);

  async send(message: NotificationMessage): Promise<void> {
    this.logger.log(
      JSON.stringify({
        channel: this.channel,
        key: message.key,
        recipient: message.recipient,
        subject: message.subject,
        metadata: message.metadata,
      }),
    );
  }
}

import { Module } from '@nestjs/common';
import {
  NOTIFICATION_CHANNELS,
} from './tokens/notification.tokens';
import { LoggingNotificationChannel } from './channels/logging-notification.channel';
import { NotificationTemplateService } from './templates/notification-template.service';
import { NotificationService } from './notification.service';

@Module({
  providers: [
    LoggingNotificationChannel,
    NotificationTemplateService,
    NotificationService,
    {
      provide: NOTIFICATION_CHANNELS,
      inject: [LoggingNotificationChannel],
      useFactory: (loggingChannel: LoggingNotificationChannel) => [loggingChannel],
    },
  ],
  exports: [NotificationService],
})
export class NotificationModule {}

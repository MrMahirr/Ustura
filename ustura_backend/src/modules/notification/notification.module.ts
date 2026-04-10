import { Module } from '@nestjs/common';
import { EventsModule } from '../../events/events.module';
import {
  NOTIFICATION_CHANNELS,
} from './tokens/notification.tokens';
import { LoggingNotificationChannel } from './channels/logging-notification.channel';
import { NotificationEventsConsumer } from './notification.events-consumer';
import { NotificationTemplateService } from './templates/notification-template.service';
import { NotificationService } from './notification.service';

@Module({
  imports: [EventsModule],
  providers: [
    LoggingNotificationChannel,
    NotificationTemplateService,
    NotificationService,
    NotificationEventsConsumer,
    {
      provide: NOTIFICATION_CHANNELS,
      inject: [LoggingNotificationChannel],
      useFactory: (loggingChannel: LoggingNotificationChannel) => [loggingChannel],
    },
  ],
  exports: [NotificationService],
})
export class NotificationModule {}

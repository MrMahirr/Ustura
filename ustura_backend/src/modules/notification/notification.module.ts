import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { EventsModule } from '../../events/events.module';
import { NOTIFICATION_CHANNELS } from './tokens/notification.tokens';
import { LoggingNotificationChannel } from './channels/logging-notification.channel';
import { NotificationController } from './notification.controller';
import { NotificationEventsConsumer } from './notification.events-consumer';
import { NotificationRepository } from './repositories/notification.repository';
import { NotificationTemplateService } from './templates/notification-template.service';
import { NotificationService } from './notification.service';

@Module({
  imports: [DatabaseModule, EventsModule],
  controllers: [NotificationController],
  providers: [
    LoggingNotificationChannel,
    NotificationTemplateService,
    NotificationRepository,
    NotificationService,
    NotificationEventsConsumer,
    {
      provide: NOTIFICATION_CHANNELS,
      inject: [LoggingNotificationChannel],
      useFactory: (loggingChannel: LoggingNotificationChannel) => [
        loggingChannel,
      ],
    },
  ],
  exports: [NotificationService],
})
export class NotificationModule {}

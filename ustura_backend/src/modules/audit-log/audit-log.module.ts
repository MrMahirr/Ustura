import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { EventsModule } from '../../events/events.module';
import { AuditLogController } from './audit-log.controller';
import { AuditLogEventsConsumer } from './audit-log.events-consumer';
import { AuditLogService } from './audit-log.service';
import { AuditLogPolicy } from './policies/audit-log.policy';
import { AuditLogRepository } from './repositories/audit-log.repository';

@Module({
  imports: [DatabaseModule, EventsModule],
  controllers: [AuditLogController],
  providers: [
    AuditLogService,
    AuditLogPolicy,
    AuditLogRepository,
    AuditLogEventsConsumer,
  ],
  exports: [AuditLogService],
})
export class AuditLogModule {}

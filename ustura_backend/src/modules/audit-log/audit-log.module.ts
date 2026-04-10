import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { AuditLogController } from './audit-log.controller';
import { AuditLogService } from './audit-log.service';
import { AuditLogPolicy } from './policies/audit-log.policy';
import { AuditLogRepository } from './repositories/audit-log.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [AuditLogController],
  providers: [AuditLogService, AuditLogPolicy, AuditLogRepository],
  exports: [AuditLogService],
})
export class AuditLogModule {}

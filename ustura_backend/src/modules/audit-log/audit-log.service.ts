import { Injectable, Logger } from '@nestjs/common';
import type { JwtPayload } from '../../shared/auth/jwt-payload.interface';
import { ListAuditLogsQueryDto } from './dto/list-audit-logs-query.dto';
import {
  AuditLogListResult,
  CreateAuditLogInput,
} from './interfaces/audit-log.types';
import { AuditLogPolicy } from './policies/audit-log.policy';
import { AuditLogRepository } from './repositories/audit-log.repository';

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);

  constructor(
    private readonly auditLogRepository: AuditLogRepository,
    private readonly auditLogPolicy: AuditLogPolicy,
  ) {}

  recordBestEffort(input: CreateAuditLogInput): void {
    void this.auditLogRepository.create(input).catch((error: unknown) => {
      const message =
        error instanceof Error ? error.message : 'Unknown audit logging error.';

      this.logger.warn(`Audit log write skipped: ${message}`);
    });
  }

  async list(
    currentUser: JwtPayload,
    query: ListAuditLogsQueryDto,
  ): Promise<AuditLogListResult> {
    this.auditLogPolicy.assertCanList(currentUser);

    return this.auditLogRepository.findAll({
      actorUserId: query.actorUserId,
      action: query.action,
      entityType: query.entityType,
      entityId: query.entityId,
      limit: query.limit,
      page: query.page,
    });
  }
}

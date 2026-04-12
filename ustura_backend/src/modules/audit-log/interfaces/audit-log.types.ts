import { Role } from '../../../shared/auth/role.enum';
import { AuditLogAction } from '../enums/audit-log-action.enum';
import { AuditLogEntityType } from '../enums/audit-log-entity-type.enum';

export interface AuditLogRecord {
  id: string;
  actorUserId: string | null;
  actorRole: Role | null;
  action: AuditLogAction;
  entityType: AuditLogEntityType;
  entityId: string | null;
  metadata: Record<string, unknown>;
  createdAt: Date;
}

export interface CreateAuditLogInput {
  actorUserId?: string | null;
  actorRole?: Role | null;
  action: AuditLogAction;
  entityType: AuditLogEntityType;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
}

export interface ListAuditLogsFilters {
  actorUserId?: string;
  action?: AuditLogAction;
  entityType?: AuditLogEntityType;
  entityId?: string;
  limit: number;
}

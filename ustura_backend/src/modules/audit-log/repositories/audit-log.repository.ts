import { Injectable } from '@nestjs/common';
import { QueryResultRow } from 'pg';
import { DatabaseService } from '../../../database/database.service';
import type { SqlQueryExecutor } from '../../../database/database.types';
import { Role } from '../../../shared/auth/role.enum';
import {
  AuditLogRecord,
  CreateAuditLogInput,
  ListAuditLogsFilters,
} from '../interfaces/audit-log.types';
import { AuditLogAction } from '../enums/audit-log-action.enum';
import { AuditLogEntityType } from '../enums/audit-log-entity-type.enum';

@Injectable()
export class AuditLogRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(
    input: CreateAuditLogInput,
    executor: SqlQueryExecutor = this.databaseService,
  ): Promise<AuditLogRecord> {
    const result = await executor.query<AuditLogRow>({
      name: 'audit-log.create',
      text: `
        INSERT INTO audit_logs (
          actor_user_id,
          actor_role,
          action,
          entity_type,
          entity_id,
          metadata
        )
        VALUES ($1, $2, $3, $4, $5, $6::jsonb)
        RETURNING
          id,
          actor_user_id,
          actor_role,
          action,
          entity_type,
          entity_id,
          metadata,
          created_at
      `,
      values: [
        input.actorUserId ?? null,
        input.actorRole ?? null,
        input.action,
        input.entityType,
        input.entityId ?? null,
        JSON.stringify(input.metadata ?? {}),
      ],
    });

    return this.mapRow(result.rows[0]) as AuditLogRecord;
  }

  async findAll(filters: ListAuditLogsFilters): Promise<AuditLogRecord[]> {
    const clauses: string[] = [];
    const values: unknown[] = [];

    if (filters.actorUserId) {
      values.push(filters.actorUserId);
      clauses.push(`actor_user_id = $${values.length}`);
    }

    if (filters.action) {
      values.push(filters.action);
      clauses.push(`action = $${values.length}`);
    }

    if (filters.entityType) {
      values.push(filters.entityType);
      clauses.push(`entity_type = $${values.length}`);
    }

    if (filters.entityId) {
      values.push(filters.entityId);
      clauses.push(`entity_id = $${values.length}`);
    }

    values.push(filters.limit);

    const result = await this.databaseService.query<AuditLogRow>({
      text: `
        SELECT
          id,
          actor_user_id,
          actor_role,
          action,
          entity_type,
          entity_id,
          metadata,
          created_at
        FROM audit_logs
        ${clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : ''}
        ORDER BY created_at DESC
        LIMIT $${values.length}
      `,
      values,
    });

    return result.rows.map((row) => this.mapRow(row) as AuditLogRecord);
  }

  private mapRow(row?: AuditLogRow): AuditLogRecord | null {
    if (!row) {
      return null;
    }

    return {
      id: row.id,
      actorUserId: row.actor_user_id,
      actorRole: row.actor_role,
      action: row.action,
      entityType: row.entity_type,
      entityId: row.entity_id,
      metadata: row.metadata ?? {},
      createdAt: row.created_at,
    };
  }
}

interface AuditLogRow extends QueryResultRow {
  id: string;
  actor_user_id: string | null;
  actor_role: Role | null;
  action: AuditLogAction;
  entity_type: AuditLogEntityType;
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: Date;
}

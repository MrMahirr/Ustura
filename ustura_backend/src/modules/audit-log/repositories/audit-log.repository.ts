import { Injectable } from '@nestjs/common';
import { QueryResultRow } from 'pg';
import { DatabaseService } from '../../../database/database.service';
import type { SqlQueryExecutor } from '../../../database/database.types';
import { Role } from '../../../shared/auth/role.enum';
import {
  AuditLogRecord,
  AuditLogListResult,
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

  async findAll(filters: ListAuditLogsFilters): Promise<AuditLogListResult> {
    const clauses: string[] = [];
    const values: unknown[] = [];

    if (filters.actorUserId) {
      values.push(filters.actorUserId);
      clauses.push(`al.actor_user_id = $${values.length}`);
    }

    if (filters.action) {
      values.push(filters.action);
      clauses.push(`al.action = $${values.length}`);
    }

    if (filters.entityType) {
      values.push(filters.entityType);
      clauses.push(`al.entity_type = $${values.length}`);
    }

    if (filters.entityId) {
      values.push(filters.entityId);
      clauses.push(`al.entity_id = $${values.length}`);
    }

    const whereClause =
      clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '';

    const countResult = await this.databaseService.query<{ count: string }>({
      text: `SELECT COUNT(*)::text AS count FROM audit_logs al ${whereClause}`,
      values: [...values],
    });
    const total = Number(countResult.rows[0]?.count ?? 0);

    const offset = (filters.page - 1) * filters.limit;
    values.push(filters.limit);
    const limitIdx = values.length;
    values.push(offset);
    const offsetIdx = values.length;

    const result = await this.databaseService.query<AuditLogRow>({
      text: `
        SELECT
          al.id,
          al.actor_user_id,
          al.actor_role,
          al.action,
          al.entity_type,
          al.entity_id,
          al.metadata,
          al.created_at,
          COALESCE(p.name, pa.name) AS actor_name
        FROM audit_logs al
        LEFT JOIN personnel p ON p.id = al.actor_user_id
        LEFT JOIN platform_admins pa ON pa.id = al.actor_user_id
        ${whereClause}
        ORDER BY al.created_at DESC
        LIMIT $${limitIdx} OFFSET $${offsetIdx}
      `,
      values,
    });

    return {
      items: result.rows.map((row) => this.mapRow(row) as AuditLogRecord),
      total,
      page: filters.page,
      pageSize: filters.limit,
      totalPages: Math.ceil(total / filters.limit),
    };
  }

  private mapRow(row?: AuditLogRow): AuditLogRecord | null {
    if (!row) {
      return null;
    }

    return {
      id: row.id,
      actorUserId: row.actor_user_id,
      actorRole: row.actor_role,
      actorName: row.actor_name ?? null,
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
  actor_name?: string | null;
  action: AuditLogAction;
  entity_type: AuditLogEntityType;
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: Date;
}

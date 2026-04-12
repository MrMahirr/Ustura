import { Injectable } from '@nestjs/common';
import { QueryResultRow } from 'pg';
import { DatabaseService } from '../../../database/database.service';
import type { SqlQueryExecutor } from '../../../database/database.types';
import {
  CreateNotificationInput,
  ListNotificationsFilters,
  NotificationRecord,
  NotificationTone,
} from '../interfaces/notification-record.types';

@Injectable()
export class NotificationRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(
    input: CreateNotificationInput,
    executor: SqlQueryExecutor = this.databaseService,
  ): Promise<NotificationRecord> {
    const result = await executor.query<NotificationRow>({
      name: 'notification.create',
      text: `
        INSERT INTO notifications (
          recipient_id,
          recipient_kind,
          key,
          title,
          body,
          tone,
          metadata
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb)
        RETURNING
          id, recipient_id, recipient_kind, key, title, body, tone,
          metadata, is_read, created_at
      `,
      values: [
        input.recipientId ?? null,
        input.recipientKind,
        input.key,
        input.title,
        input.body,
        input.tone,
        JSON.stringify(input.metadata ?? {}),
      ],
    });

    return this.mapRow(result.rows[0])!;
  }

  async findAll(
    filters: ListNotificationsFilters,
  ): Promise<NotificationRecord[]> {
    const clauses: string[] = [];
    const values: unknown[] = [];

    if (filters.recipientId) {
      values.push(filters.recipientId);
      clauses.push(`recipient_id = $${values.length}`);
    }

    if (filters.key) {
      values.push(filters.key);
      clauses.push(`key = $${values.length}`);
    }

    if (filters.isRead !== undefined) {
      values.push(filters.isRead);
      clauses.push(`is_read = $${values.length}`);
    }

    values.push(filters.limit);
    const limitIdx = values.length;
    values.push(filters.offset);
    const offsetIdx = values.length;

    const result = await this.databaseService.query<NotificationRow>({
      text: `
        SELECT
          id, recipient_id, recipient_kind, key, title, body, tone,
          metadata, is_read, created_at
        FROM notifications
        ${clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : ''}
        ORDER BY created_at DESC
        LIMIT $${limitIdx} OFFSET $${offsetIdx}
      `,
      values,
    });

    return result.rows.map((row) => this.mapRow(row)!);
  }

  async countAll(
    filters: Omit<ListNotificationsFilters, 'limit' | 'offset'>,
  ): Promise<number> {
    const clauses: string[] = [];
    const values: unknown[] = [];

    if (filters.recipientId) {
      values.push(filters.recipientId);
      clauses.push(`recipient_id = $${values.length}`);
    }

    if (filters.key) {
      values.push(filters.key);
      clauses.push(`key = $${values.length}`);
    }

    if (filters.isRead !== undefined) {
      values.push(filters.isRead);
      clauses.push(`is_read = $${values.length}`);
    }

    const result = await this.databaseService.query<{ count: string }>({
      text: `
        SELECT COUNT(*)::text AS count
        FROM notifications
        ${clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : ''}
      `,
      values,
    });

    return parseInt(result.rows[0]?.count ?? '0', 10);
  }

  async markAsRead(id: string): Promise<NotificationRecord | null> {
    const result = await this.databaseService.query<NotificationRow>({
      name: 'notification.mark-read',
      text: `
        UPDATE notifications
        SET is_read = TRUE
        WHERE id = $1
        RETURNING
          id, recipient_id, recipient_kind, key, title, body, tone,
          metadata, is_read, created_at
      `,
      values: [id],
    });

    return this.mapRow(result.rows[0]);
  }

  async markAllAsRead(recipientId?: string): Promise<number> {
    const clauses: string[] = ['is_read = FALSE'];
    const values: unknown[] = [];

    if (recipientId) {
      values.push(recipientId);
      clauses.push(`recipient_id = $${values.length}`);
    }

    const result = await this.databaseService.query({
      text: `
        UPDATE notifications
        SET is_read = TRUE
        WHERE ${clauses.join(' AND ')}
      `,
      values,
    });

    return result.rowCount ?? 0;
  }

  private mapRow(row?: NotificationRow): NotificationRecord | null {
    if (!row) {
      return null;
    }

    return {
      id: row.id,
      recipientId: row.recipient_id,
      recipientKind: row.recipient_kind as NotificationRecord['recipientKind'],
      key: row.key,
      title: row.title,
      body: row.body,
      tone: row.tone as NotificationTone,
      metadata: row.metadata ?? {},
      isRead: row.is_read,
      createdAt: row.created_at,
    };
  }
}

interface NotificationRow extends QueryResultRow {
  id: string;
  recipient_id: string | null;
  recipient_kind: string;
  key: string;
  title: string;
  body: string;
  tone: string;
  metadata: Record<string, unknown> | null;
  is_read: boolean;
  created_at: Date;
}

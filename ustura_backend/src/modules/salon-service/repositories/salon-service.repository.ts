import { Injectable } from '@nestjs/common';
import { QueryResultRow } from 'pg';
import { DatabaseService } from '../../../database/database.service';
import type { SqlQueryExecutor } from '../../../database/database.types';
import type {
  CreateSalonServiceInput,
  SalonServiceItem,
  UpdateSalonServiceInput,
} from '../interfaces/salon-service.types';

@Injectable()
export class SalonServiceRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findById(
    id: string,
    executor: SqlQueryExecutor = this.databaseService,
  ): Promise<SalonServiceItem | null> {
    const result = await executor.query<SalonServiceRow>({
      name: 'salon-service.find-by-id',
      text: `
        SELECT
          id,
          salon_id,
          name,
          description,
          duration_minutes,
          price_amount,
          is_active,
          created_at,
          updated_at
        FROM salon_services
        WHERE id = $1
        LIMIT 1
      `,
      values: [id],
    });

    return this.mapRow(result.rows[0]);
  }

  async findBySalonId(
    salonId: string,
    options: { includeInactive?: boolean } = {},
  ): Promise<SalonServiceItem[]> {
    const values: unknown[] = [salonId];
    const inactiveClause = options.includeInactive
      ? ''
      : 'AND is_active = TRUE';

    const result = await this.databaseService.query<SalonServiceRow>({
      name: 'salon-service.find-by-salon-id',
      text: `
        SELECT
          id,
          salon_id,
          name,
          description,
          duration_minutes,
          price_amount,
          is_active,
          created_at,
          updated_at
        FROM salon_services
        WHERE salon_id = $1
          ${inactiveClause}
        ORDER BY is_active DESC, created_at ASC
      `,
      values,
    });

    return result.rows.map((row) => this.mapRow(row) as SalonServiceItem);
  }

  async create(
    input: CreateSalonServiceInput,
    executor: SqlQueryExecutor = this.databaseService,
  ): Promise<SalonServiceItem> {
    const result = await executor.query<SalonServiceIdentityRow>({
      name: 'salon-service.create',
      text: `
        INSERT INTO salon_services (
          salon_id,
          name,
          description,
          duration_minutes,
          price_amount,
          is_active
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
      `,
      values: [
        input.salonId,
        input.name,
        input.description ?? null,
        input.durationMinutes,
        input.priceAmount,
        input.isActive ?? true,
      ],
    });

    return (await this.findById(
      result.rows[0]?.id,
      executor,
    )) as SalonServiceItem;
  }

  async update(
    id: string,
    input: UpdateSalonServiceInput,
    executor: SqlQueryExecutor = this.databaseService,
  ): Promise<SalonServiceItem | null> {
    const updates: string[] = [];
    const values: unknown[] = [];

    if (input.name !== undefined) {
      values.push(input.name);
      updates.push(`name = $${values.length}`);
    }

    if (input.description !== undefined) {
      values.push(input.description);
      updates.push(`description = $${values.length}`);
    }

    if (input.durationMinutes !== undefined) {
      values.push(input.durationMinutes);
      updates.push(`duration_minutes = $${values.length}`);
    }

    if (input.priceAmount !== undefined) {
      values.push(input.priceAmount);
      updates.push(`price_amount = $${values.length}`);
    }

    if (input.isActive !== undefined) {
      values.push(input.isActive);
      updates.push(`is_active = $${values.length}`);
    }

    if (updates.length === 0) {
      return this.findById(id, executor);
    }

    values.push(id);

    const result = await executor.query<SalonServiceIdentityRow>({
      name: 'salon-service.update',
      text: `
        UPDATE salon_services
        SET ${updates.join(', ')}
        WHERE id = $${values.length}
        RETURNING id
      `,
      values,
    });

    if (!result.rows[0]?.id) {
      return null;
    }

    return this.findById(result.rows[0].id, executor);
  }

  async delete(
    id: string,
    executor: SqlQueryExecutor = this.databaseService,
  ): Promise<boolean> {
    const result = await executor.query<SalonServiceIdentityRow>({
      name: 'salon-service.delete',
      text: `
        DELETE FROM salon_services
        WHERE id = $1
        RETURNING id
      `,
      values: [id],
    });

    return Boolean(result.rows[0]?.id);
  }

  private mapRow(row?: SalonServiceRow): SalonServiceItem | null {
    if (!row) {
      return null;
    }

    return {
      id: row.id,
      salonId: row.salon_id,
      name: row.name,
      description: row.description,
      durationMinutes: row.duration_minutes,
      priceAmount: row.price_amount,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

interface SalonServiceRow extends QueryResultRow {
  id: string;
  salon_id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  price_amount: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

interface SalonServiceIdentityRow extends QueryResultRow {
  id: string;
}

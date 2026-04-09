import { Injectable } from '@nestjs/common';
import { QueryResultRow } from 'pg';
import { DatabaseService } from '../../../database/database.service';
import { SqlQueryExecutor } from '../../../database/database.types';
import {
  CreateSalonInput,
  FindSalonsFilters,
  Salon,
  UpdateSalonInput,
  WorkingHours,
} from '../interfaces/salon.types';

@Injectable()
export class SalonRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(filters: FindSalonsFilters = {}): Promise<Salon[]> {
    const clauses: string[] = [];
    const values: unknown[] = [];

    if (filters.ownerId) {
      values.push(filters.ownerId);
      clauses.push(`owner_id = $${values.length}`);
    }

    if (!filters.includeInactive) {
      clauses.push(`is_active = TRUE`);
    }

    if (filters.city) {
      values.push(filters.city);
      clauses.push(`LOWER(city) = LOWER($${values.length})`);
    }

    if (filters.search) {
      values.push(`%${filters.search}%`);
      clauses.push(
        `(name ILIKE $${values.length} OR address ILIKE $${values.length} OR COALESCE(district, '') ILIKE $${values.length})`,
      );
    }

    const whereClause =
      clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '';

    const result = await this.databaseService.query<SalonRow>({
      name: 'salon.find-all',
      text: `
        SELECT
          id,
          owner_id,
          name,
          address,
          city,
          district,
          photo_url,
          working_hours,
          is_active,
          created_at,
          updated_at
        FROM salons
        ${whereClause}
        ORDER BY is_active DESC, created_at DESC
      `,
      values,
    });

    return result.rows.map((row) => this.mapRow(row) as Salon);
  }

  async findById(id: string): Promise<Salon | null> {
    const result = await this.databaseService.query<SalonRow>({
      name: 'salon.find-by-id',
      text: `
        SELECT
          id,
          owner_id,
          name,
          address,
          city,
          district,
          photo_url,
          working_hours,
          is_active,
          created_at,
          updated_at
        FROM salons
        WHERE id = $1
        LIMIT 1
      `,
      values: [id],
    });

    return this.mapRow(result.rows[0]);
  }

  async findByOwnerId(ownerId: string): Promise<Salon[]> {
    return this.findAll({
      ownerId,
      includeInactive: true,
    });
  }

  async create(
    input: CreateSalonInput,
    executor: SqlQueryExecutor = this.databaseService,
  ): Promise<Salon> {
    const result = await executor.query<SalonRow>({
      name: 'salon.create',
      text: `
        INSERT INTO salons (
          owner_id,
          name,
          address,
          city,
          district,
          photo_url,
          working_hours
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING
          id,
          owner_id,
          name,
          address,
          city,
          district,
          photo_url,
          working_hours,
          is_active,
          created_at,
          updated_at
      `,
      values: [
        input.ownerId,
        input.name,
        input.address,
        input.city,
        input.district ?? null,
        input.photoUrl ?? null,
        input.workingHours,
      ],
    });

    return this.mapRow(result.rows[0]) as Salon;
  }

  async update(
    id: string,
    input: UpdateSalonInput,
    executor: SqlQueryExecutor = this.databaseService,
  ): Promise<Salon | null> {
    const updates: string[] = [];
    const values: unknown[] = [];

    if (input.name !== undefined) {
      values.push(input.name);
      updates.push(`name = $${values.length}`);
    }

    if (input.address !== undefined) {
      values.push(input.address);
      updates.push(`address = $${values.length}`);
    }

    if (input.city !== undefined) {
      values.push(input.city);
      updates.push(`city = $${values.length}`);
    }

    if (input.district !== undefined) {
      values.push(input.district);
      updates.push(`district = $${values.length}`);
    }

    if (input.photoUrl !== undefined) {
      values.push(input.photoUrl);
      updates.push(`photo_url = $${values.length}`);
    }

    if (input.workingHours !== undefined) {
      values.push(input.workingHours);
      updates.push(`working_hours = $${values.length}`);
    }

    if (input.isActive !== undefined) {
      values.push(input.isActive);
      updates.push(`is_active = $${values.length}`);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    const result = await executor.query<SalonRow>({
      name: 'salon.update',
      text: `
        UPDATE salons
        SET ${updates.join(', ')}
        WHERE id = $${values.length}
        RETURNING
          id,
          owner_id,
          name,
          address,
          city,
          district,
          photo_url,
          working_hours,
          is_active,
          created_at,
          updated_at
      `,
      values,
    });

    return this.mapRow(result.rows[0]);
  }

  async deactivate(
    id: string,
    executor: SqlQueryExecutor = this.databaseService,
  ): Promise<Salon | null> {
    return this.update(
      id,
      {
        isActive: false,
      },
      executor,
    );
  }

  private mapRow(row?: SalonRow): Salon | null {
    if (!row) {
      return null;
    }

    return {
      id: row.id,
      ownerId: row.owner_id,
      name: row.name,
      address: row.address,
      city: row.city,
      district: row.district,
      photoUrl: row.photo_url,
      workingHours: row.working_hours,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

interface SalonRow extends QueryResultRow {
  id: string;
  owner_id: string;
  name: string;
  address: string;
  city: string;
  district: string | null;
  photo_url: string | null;
  working_hours: WorkingHours;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

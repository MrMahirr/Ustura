import { Injectable } from '@nestjs/common';
import { QueryResultRow } from 'pg';
import { DatabaseService } from '../../../database/database.service';
import { SqlQueryExecutor } from '../../../database/database.types';
import {
  AdminSalonDetail,
  AdminSalonOverview,
  AdminSalonSummary,
  CreateSalonInput,
  FindAdminSalonsFilters,
  FindPaginatedSalonsFilters,
  FindSalonsFilters,
  PaginatedResult,
  PaginatedAdminSalonResult,
  Salon,
  AdminSalonSort,
  UpdateSalonInput,
  WorkingHours,
} from '../interfaces/salon.types';

@Injectable()
export class SalonRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(filters: FindSalonsFilters = {}): Promise<Salon[]> {
    const { values, whereClause } = this.buildFilters(filters);

    const result = await this.databaseService.query<SalonRow>({
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

  async findPublicPage(
    filters: FindPaginatedSalonsFilters,
  ): Promise<PaginatedResult<Salon>> {
    const { page, pageSize, ...baseFilters } = filters;
    const { values, whereClause } = this.buildFilters(baseFilters);
    const offset = (page - 1) * pageSize;

    const countResult = await this.databaseService.query<TotalCountRow>({
      name: 'salon.find-public-page-count',
      text: `
        SELECT COUNT(*)::int AS total_count
        FROM salons
        ${whereClause}
      `,
      values,
    });

    const total = countResult.rows[0]?.total_count ?? 0;
    const totalPages = total > 0 ? Math.ceil(total / pageSize) : 0;

    if (total === 0) {
      return {
        items: [],
        pagination: {
          page,
          pageSize,
          total,
          totalPages,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
    }

    const paginatedValues = [...values, pageSize, offset];
    const result = await this.databaseService.query<SalonRow>({
      name: 'salon.find-public-page',
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
        LIMIT $${paginatedValues.length - 1}
        OFFSET $${paginatedValues.length}
      `,
      values: paginatedValues,
    });

    return {
      items: result.rows.map((row) => this.mapRow(row) as Salon),
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findAdminPage(
    filters: FindAdminSalonsFilters,
  ): Promise<PaginatedResult<AdminSalonSummary>> {
    const { page, pageSize, sort, ...baseFilters } = filters;
    const { values, whereClause } = this.buildAdminFilters(baseFilters);
    const offset = (page - 1) * pageSize;

    const countResult = await this.databaseService.query<TotalCountRow>({
      name: 'salon.find-admin-page-count',
      text: `
        SELECT COUNT(*)::int AS total_count
        FROM salons s
        INNER JOIN personnel u ON u.id = s.owner_id
        ${whereClause}
      `,
      values,
    });

    const total = countResult.rows[0]?.total_count ?? 0;
    const totalPages = total > 0 ? Math.ceil(total / pageSize) : 0;

    if (total === 0) {
      return {
        items: [],
        pagination: {
          page,
          pageSize,
          total,
          totalPages,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
    }

    const paginatedValues = [...values, pageSize, offset];
    const result = await this.databaseService.query<AdminSalonRow>({
      name: 'salon.find-admin-page',
      text: `
        SELECT
          s.id,
          s.owner_id,
          u.name AS owner_name,
          u.email AS owner_email,
          s.name,
          s.address,
          s.city,
          s.district,
          s.photo_url,
          s.is_active,
          s.created_at,
          s.updated_at
        FROM salons s
        INNER JOIN personnel u ON u.id = s.owner_id
        ${whereClause}
        ORDER BY ${this.getAdminSortClause(sort)}
        LIMIT $${paginatedValues.length - 1}
        OFFSET $${paginatedValues.length}
      `,
      values: paginatedValues,
    });

    return {
      items: result.rows.map((row) => this.mapAdminRow(row) as AdminSalonSummary),
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findAdminSummaryById(id: string): Promise<AdminSalonSummary | null> {
    const result = await this.databaseService.query<AdminSalonRow>({
      name: 'salon.find-admin-summary-by-id',
      text: `
        SELECT
          s.id,
          s.owner_id,
          u.name AS owner_name,
          u.email AS owner_email,
          s.name,
          s.address,
          s.city,
          s.district,
          s.photo_url,
          s.is_active,
          s.created_at,
          s.updated_at
        FROM salons s
        INNER JOIN personnel u ON u.id = s.owner_id
        WHERE s.id = $1
        LIMIT 1
      `,
      values: [id],
    });

    return this.mapAdminRow(result.rows[0]);
  }

  async findAdminDetailById(id: string): Promise<AdminSalonDetail | null> {
    const result = await this.databaseService.query<AdminSalonDetailRow>({
      name: 'salon.find-admin-detail-by-id',
      text: `
        SELECT
          s.id,
          s.owner_id,
          u.name AS owner_name,
          u.email AS owner_email,
          s.name,
          s.address,
          s.city,
          s.district,
          s.photo_url,
          s.working_hours,
          s.is_active,
          s.created_at,
          s.updated_at
        FROM salons s
        INNER JOIN personnel u ON u.id = s.owner_id
        WHERE s.id = $1
        LIMIT 1
      `,
      values: [id],
    });

    return this.mapAdminDetailRow(result.rows[0]);
  }

  async deleteById(
    id: string,
    executor: SqlQueryExecutor = this.databaseService,
  ): Promise<boolean> {
    const result = await executor.query<{ id: string }>({
      name: 'salon.delete-by-id',
      text: `
        DELETE FROM salons
        WHERE id = $1
        RETURNING id
      `,
      values: [id],
    });

    return (result.rows?.length ?? 0) > 0;
  }

  /**
   * Super-admin salon silme: once rezervasyonlar (staff FK), sonra personel,
   * abonelikler, owner_applications referansi, en son salon.
   * Tek DELETE salons ... CASCADE bazen staff/rezervasyon sirasinda 23503 uretebilir.
   */
  async deleteSalonWithDependents(
    id: string,
    executor: SqlQueryExecutor = this.databaseService,
  ): Promise<boolean> {
    await executor.query({
      name: 'salon.delete-reservations-for-salon',
      text: `DELETE FROM reservations WHERE salon_id = $1`,
      values: [id],
    });

    await executor.query({
      name: 'salon.delete-staff-for-salon',
      text: `DELETE FROM staff WHERE salon_id = $1`,
      values: [id],
    });

    await executor.query({
      name: 'salon.delete-subscriptions-for-salon',
      text: `DELETE FROM subscriptions WHERE salon_id = $1`,
      values: [id],
    });

    await executor.query({
      name: 'salon.clear-approved-salon-on-applications',
      text: `
        UPDATE owner_applications
        SET approved_salon_id = NULL
        WHERE approved_salon_id = $1
      `,
      values: [id],
    });

    return this.deleteById(id, executor);
  }

  async findAdminDistinctCities(): Promise<string[]> {
    const result = await this.databaseService.query<CityRow>({
      name: 'salon.find-admin-distinct-cities',
      text: `
        SELECT DISTINCT city
        FROM salons
        ORDER BY city ASC
      `,
      values: [],
    });

    return result.rows.map((row) => row.city);
  }

  async getAdminOverview(): Promise<AdminSalonOverview> {
    const result = await this.databaseService.query<AdminSalonOverviewRow>({
      name: 'salon.get-admin-overview',
      text: `
        SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE is_active = TRUE)::int AS active,
          COUNT(*) FILTER (WHERE is_active = FALSE)::int AS inactive,
          COUNT(DISTINCT city)::int AS city_count,
          COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days')::int AS new_last_30_days
        FROM salons
      `,
      values: [],
    });

    const overview = result.rows[0];

    return {
      total: overview?.total ?? 0,
      active: overview?.active ?? 0,
      inactive: overview?.inactive ?? 0,
      cityCount: overview?.city_count ?? 0,
      newLast30Days: overview?.new_last_30_days ?? 0,
    };
  }

  async findDistinctCities(): Promise<string[]> {
    const result = await this.databaseService.query<CityRow>({
      name: 'salon.find-distinct-cities',
      text: `
        SELECT DISTINCT city
        FROM salons
        WHERE is_active = TRUE
        ORDER BY city ASC
      `,
      values: [],
    });

    return result.rows.map((row) => row.city);
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

  private mapAdminRow(row?: AdminSalonRow): AdminSalonSummary | null {
    if (!row) {
      return null;
    }

    return {
      id: row.id,
      ownerId: row.owner_id,
      ownerName: row.owner_name,
      ownerEmail: row.owner_email,
      name: row.name,
      address: row.address,
      city: row.city,
      district: row.district,
      photoUrl: row.photo_url,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private mapAdminDetailRow(row?: AdminSalonDetailRow): AdminSalonDetail | null {
    if (!row) {
      return null;
    }

    const base = this.mapAdminRow(row);
    if (!base) {
      return null;
    }

    return {
      ...base,
      workingHours: row.working_hours,
    };
  }

  private buildFilters(filters: FindSalonsFilters) {
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

    return {
      values,
      whereClause: clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '',
    };
  }

  private buildAdminFilters(
    filters: Omit<FindAdminSalonsFilters, 'page' | 'pageSize' | 'sort'>,
  ) {
    const clauses: string[] = [];
    const values: unknown[] = [];

    if (filters.city) {
      values.push(filters.city);
      clauses.push(`LOWER(s.city) = LOWER($${values.length})`);
    }

    if (filters.status === 'active') {
      clauses.push(`s.is_active = TRUE`);
    } else if (filters.status === 'inactive') {
      clauses.push(`s.is_active = FALSE`);
    }

    if (filters.search) {
      values.push(`%${filters.search}%`);
      clauses.push(
        `(
          s.name ILIKE $${values.length}
          OR s.address ILIKE $${values.length}
          OR s.city ILIKE $${values.length}
          OR COALESCE(s.district, '') ILIKE $${values.length}
          OR u.name ILIKE $${values.length}
          OR u.email ILIKE $${values.length}
        )`,
      );
    }

    return {
      values,
      whereClause: clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '',
    };
  }

  private getAdminSortClause(sort: AdminSalonSort) {
    switch (sort) {
      case 'name_asc':
        return 's.name ASC, s.created_at DESC';
      case 'name_desc':
        return 's.name DESC, s.created_at DESC';
      case 'updated_desc':
        return 's.updated_at DESC, s.created_at DESC';
      case 'newest':
      default:
        return 's.created_at DESC';
    }
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

interface TotalCountRow extends QueryResultRow {
  total_count: number;
}

interface CityRow extends QueryResultRow {
  city: string;
}

interface AdminSalonRow extends QueryResultRow {
  id: string;
  owner_id: string;
  owner_name: string;
  owner_email: string;
  name: string;
  address: string;
  city: string;
  district: string | null;
  photo_url: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

interface AdminSalonDetailRow extends AdminSalonRow {
  working_hours: WorkingHours;
}

interface AdminSalonOverviewRow extends QueryResultRow {
  total: number;
  active: number;
  inactive: number;
  city_count: number;
  new_last_30_days: number;
}

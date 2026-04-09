import { Injectable } from '@nestjs/common';
import { QueryResultRow } from 'pg';
import { Role } from '../../../common/enums/role.enum';
import { DatabaseService } from '../../../database/database.service';
import {
  CreateStaffInput,
  StaffMember,
  UpdateStaffInput,
} from '../interfaces/staff.types';

@Injectable()
export class StaffRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findById(id: string): Promise<StaffMember | null> {
    const result = await this.databaseService.query<StaffRow>({
      name: 'staff.find-by-id',
      text: `
        SELECT
          id,
          user_id,
          salon_id,
          role,
          bio,
          photo_url,
          is_active,
          created_at,
          updated_at
        FROM staff
        WHERE id = $1
        LIMIT 1
      `,
      values: [id],
    });

    return this.mapRow(result.rows[0]);
  }

  async findBySalonId(salonId: string): Promise<StaffMember[]> {
    const result = await this.databaseService.query<StaffRow>({
      name: 'staff.find-by-salon-id',
      text: `
        SELECT
          id,
          user_id,
          salon_id,
          role,
          bio,
          photo_url,
          is_active,
          created_at,
          updated_at
        FROM staff
        WHERE salon_id = $1
        ORDER BY created_at ASC
      `,
      values: [salonId],
    });

    return result.rows.map((row) => this.mapRow(row) as StaffMember);
  }

  async findActiveBySalonId(salonId: string): Promise<StaffMember[]> {
    const result = await this.databaseService.query<StaffRow>({
      name: 'staff.find-active-by-salon-id',
      text: `
        SELECT
          id,
          user_id,
          salon_id,
          role,
          bio,
          photo_url,
          is_active,
          created_at,
          updated_at
        FROM staff
        WHERE salon_id = $1
          AND is_active = TRUE
        ORDER BY created_at ASC
      `,
      values: [salonId],
    });

    return result.rows.map((row) => this.mapRow(row) as StaffMember);
  }

  async findActiveBarbersBySalonId(salonId: string): Promise<StaffMember[]> {
    const result = await this.databaseService.query<StaffRow>({
      name: 'staff.find-active-barbers-by-salon-id',
      text: `
        SELECT
          id,
          user_id,
          salon_id,
          role,
          bio,
          photo_url,
          is_active,
          created_at,
          updated_at
        FROM staff
        WHERE salon_id = $1
          AND role = $2
          AND is_active = TRUE
        ORDER BY created_at ASC
      `,
      values: [salonId, Role.BARBER],
    });

    return result.rows.map((row) => this.mapRow(row) as StaffMember);
  }

  async findActiveByUserIdAndSalon(
    userId: string,
    salonId: string,
  ): Promise<StaffMember | null> {
    const result = await this.databaseService.query<StaffRow>({
      name: 'staff.find-active-by-user-id-and-salon',
      text: `
        SELECT
          id,
          user_id,
          salon_id,
          role,
          bio,
          photo_url,
          is_active,
          created_at,
          updated_at
        FROM staff
        WHERE user_id = $1
          AND salon_id = $2
          AND is_active = TRUE
        LIMIT 1
      `,
      values: [userId, salonId],
    });

    return this.mapRow(result.rows[0]);
  }

  async findByUserIdAndSalon(
    userId: string,
    salonId: string,
  ): Promise<StaffMember | null> {
    const result = await this.databaseService.query<StaffRow>({
      name: 'staff.find-by-user-id-and-salon',
      text: `
        SELECT
          id,
          user_id,
          salon_id,
          role,
          bio,
          photo_url,
          is_active,
          created_at,
          updated_at
        FROM staff
        WHERE user_id = $1
          AND salon_id = $2
        LIMIT 1
      `,
      values: [userId, salonId],
    });

    return this.mapRow(result.rows[0]);
  }

  async create(input: CreateStaffInput): Promise<StaffMember> {
    const result = await this.databaseService.query<StaffRow>({
      name: 'staff.create',
      text: `
        INSERT INTO staff (
          user_id,
          salon_id,
          role,
          bio,
          photo_url,
          is_active
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING
          id,
          user_id,
          salon_id,
          role,
          bio,
          photo_url,
          is_active,
          created_at,
          updated_at
      `,
      values: [
        input.userId,
        input.salonId,
        input.role,
        input.bio ?? null,
        input.photoUrl ?? null,
        input.isActive ?? true,
      ],
    });

    return this.mapRow(result.rows[0]) as StaffMember;
  }

  async update(id: string, input: UpdateStaffInput): Promise<StaffMember | null> {
    const updates: string[] = [];
    const values: unknown[] = [];

    if (input.role !== undefined) {
      values.push(input.role);
      updates.push(`role = $${values.length}`);
    }

    if (input.bio !== undefined) {
      values.push(input.bio);
      updates.push(`bio = $${values.length}`);
    }

    if (input.photoUrl !== undefined) {
      values.push(input.photoUrl);
      updates.push(`photo_url = $${values.length}`);
    }

    if (input.isActive !== undefined) {
      values.push(input.isActive);
      updates.push(`is_active = $${values.length}`);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    const result = await this.databaseService.query<StaffRow>({
      name: 'staff.update',
      text: `
        UPDATE staff
        SET ${updates.join(', ')}
        WHERE id = $${values.length}
        RETURNING
          id,
          user_id,
          salon_id,
          role,
          bio,
          photo_url,
          is_active,
          created_at,
          updated_at
      `,
      values,
    });

    return this.mapRow(result.rows[0]);
  }

  async deactivate(id: string): Promise<StaffMember | null> {
    const result = await this.databaseService.query<StaffRow>({
      name: 'staff.deactivate',
      text: `
        UPDATE staff
        SET is_active = FALSE
        WHERE id = $1
        RETURNING
          id,
          user_id,
          salon_id,
          role,
          bio,
          photo_url,
          is_active,
          created_at,
          updated_at
      `,
      values: [id],
    });

    return this.mapRow(result.rows[0]);
  }

  private mapRow(row?: StaffRow): StaffMember | null {
    if (!row) {
      return null;
    }

    return {
      id: row.id,
      userId: row.user_id,
      salonId: row.salon_id,
      role: row.role,
      bio: row.bio,
      photoUrl: row.photo_url,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

interface StaffRow extends QueryResultRow {
  id: string;
  user_id: string;
  salon_id: string;
  role: Role.BARBER | Role.RECEPTIONIST;
  bio: string | null;
  photo_url: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

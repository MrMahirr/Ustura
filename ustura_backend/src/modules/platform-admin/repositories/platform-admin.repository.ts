import { Injectable } from '@nestjs/common';
import { QueryResultRow } from 'pg';
import { DatabaseService } from '../../../database/database.service';
import type { SqlQueryExecutor } from '../../../database/database.types';
import type {
  ApproveOwnerApplicationInput,
  CreateOwnerApplicationInput,
  OwnerApplicationRecord,
  UpdatePendingOwnerApplicationInput,
} from '../interfaces/platform-admin.types';

@Injectable()
export class PlatformAdminRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(
    input: CreateOwnerApplicationInput,
    executor: SqlQueryExecutor = this.databaseService,
  ): Promise<OwnerApplicationRecord> {
    const result = await executor.query<OwnerApplicationRow>({
      name: 'platform-admin.create-owner-application',
      text: `
        INSERT INTO owner_applications (
          applicant_name,
          applicant_email,
          applicant_phone,
          password_hash,
          salon_name,
          salon_address,
          salon_city,
          salon_district,
          salon_photo_url,
          salon_working_hours,
          notes
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING
          id,
          applicant_name,
          applicant_email,
          applicant_phone,
          password_hash,
          salon_name,
          salon_address,
          salon_city,
          salon_district,
          salon_photo_url,
          salon_working_hours,
          status,
          notes,
          reviewed_at,
          reviewed_by_user_id,
          rejection_reason,
          approved_owner_user_id,
          approved_salon_id,
          created_at,
          updated_at
      `,
      values: [
        input.applicantName,
        input.applicantEmail,
        input.applicantPhone,
        input.passwordHash,
        input.salonName,
        input.salonAddress,
        input.salonCity,
        input.salonDistrict ?? null,
        input.salonPhotoUrl ?? null,
        input.salonWorkingHours,
        input.notes ?? null,
      ],
    });

    return this.mapRow(result.rows[0]) as OwnerApplicationRecord;
  }

  async findPendingByApplicantEmail(
    applicantEmail: string,
    executor: SqlQueryExecutor = this.databaseService,
  ): Promise<OwnerApplicationRecord | null> {
    const result = await executor.query<OwnerApplicationRow>({
      name: 'platform-admin.find-pending-owner-application-by-email',
      text: `
        SELECT
          id,
          applicant_name,
          applicant_email,
          applicant_phone,
          password_hash,
          salon_name,
          salon_address,
          salon_city,
          salon_district,
          salon_photo_url,
          salon_working_hours,
          status,
          notes,
          reviewed_at,
          reviewed_by_user_id,
          rejection_reason,
          approved_owner_user_id,
          approved_salon_id,
          created_at,
          updated_at
        FROM owner_applications
        WHERE LOWER(applicant_email) = LOWER($1)
          AND status = 'pending'
        LIMIT 1
      `,
      values: [applicantEmail],
    });

    return this.mapRow(result.rows[0]);
  }

  async findAll(): Promise<OwnerApplicationRecord[]> {
    const result = await this.databaseService.query<OwnerApplicationRow>({
      name: 'platform-admin.find-all-owner-applications',
      text: `
        SELECT
          id,
          applicant_name,
          applicant_email,
          applicant_phone,
          password_hash,
          salon_name,
          salon_address,
          salon_city,
          salon_district,
          salon_photo_url,
          salon_working_hours,
          status,
          notes,
          reviewed_at,
          reviewed_by_user_id,
          rejection_reason,
          approved_owner_user_id,
          approved_salon_id,
          created_at,
          updated_at
        FROM owner_applications
        ORDER BY
          CASE status
            WHEN 'pending' THEN 0
            WHEN 'approved' THEN 1
            ELSE 2
          END,
          created_at DESC
      `,
    });

    return result.rows.map((row) => this.mapRow(row) as OwnerApplicationRecord);
  }

  async findByIdForUpdate(
    id: string,
    executor: SqlQueryExecutor = this.databaseService,
  ): Promise<OwnerApplicationRecord | null> {
    const result = await executor.query<OwnerApplicationRow>({
      name: 'platform-admin.find-owner-application-by-id-for-update',
      text: `
        SELECT
          id,
          applicant_name,
          applicant_email,
          applicant_phone,
          password_hash,
          salon_name,
          salon_address,
          salon_city,
          salon_district,
          salon_photo_url,
          salon_working_hours,
          status,
          notes,
          reviewed_at,
          reviewed_by_user_id,
          rejection_reason,
          approved_owner_user_id,
          approved_salon_id,
          created_at,
          updated_at
        FROM owner_applications
        WHERE id = $1
        LIMIT 1
        FOR UPDATE
      `,
      values: [id],
    });

    return this.mapRow(result.rows[0]);
  }

  async markApproved(
    id: string,
    input: ApproveOwnerApplicationInput,
    executor: SqlQueryExecutor = this.databaseService,
  ): Promise<OwnerApplicationRecord | null> {
    const result = await executor.query<OwnerApplicationRow>({
      name: 'platform-admin.mark-owner-application-approved',
      text: `
        UPDATE owner_applications
        SET
          status = 'approved',
          reviewed_at = NOW(),
          reviewed_by_user_id = $2,
          approved_owner_user_id = $3,
          approved_salon_id = $4
        WHERE id = $1
        RETURNING
          id,
          applicant_name,
          applicant_email,
          applicant_phone,
          password_hash,
          salon_name,
          salon_address,
          salon_city,
          salon_district,
          salon_photo_url,
          salon_working_hours,
          status,
          notes,
          reviewed_at,
          reviewed_by_user_id,
          rejection_reason,
          approved_owner_user_id,
          approved_salon_id,
          created_at,
          updated_at
      `,
      values: [
        id,
        input.reviewedByUserId,
        input.approvedOwnerUserId,
        input.approvedSalonId,
      ],
    });

    return this.mapRow(result.rows[0]);
  }

  async updatePendingById(
    id: string,
    patch: UpdatePendingOwnerApplicationInput,
    executor: SqlQueryExecutor = this.databaseService,
  ): Promise<OwnerApplicationRecord | null> {
    const result = await executor.query<OwnerApplicationRow>({
      name: 'platform-admin.update-pending-owner-application',
      text: `
        UPDATE owner_applications
        SET
          applicant_name = $2,
          applicant_email = $3,
          applicant_phone = $4,
          salon_name = $5,
          salon_address = $6,
          salon_city = $7,
          salon_district = $8,
          salon_photo_url = $9,
          salon_working_hours = $10,
          notes = $11
        WHERE id = $1
          AND status = 'pending'
        RETURNING
          id,
          applicant_name,
          applicant_email,
          applicant_phone,
          password_hash,
          salon_name,
          salon_address,
          salon_city,
          salon_district,
          salon_photo_url,
          salon_working_hours,
          status,
          notes,
          reviewed_at,
          reviewed_by_user_id,
          rejection_reason,
          approved_owner_user_id,
          approved_salon_id,
          created_at,
          updated_at
      `,
      values: [
        id,
        patch.applicantName,
        patch.applicantEmail,
        patch.applicantPhone,
        patch.salonName,
        patch.salonAddress,
        patch.salonCity,
        patch.salonDistrict,
        patch.salonPhotoUrl,
        patch.salonWorkingHours,
        patch.notes,
      ],
    });

    return this.mapRow(result.rows[0]);
  }

  async markRejected(
    id: string,
    reviewedByUserId: string,
    rejectionReason: string,
    executor: SqlQueryExecutor = this.databaseService,
  ): Promise<OwnerApplicationRecord | null> {
    const result = await executor.query<OwnerApplicationRow>({
      name: 'platform-admin.mark-owner-application-rejected',
      text: `
        UPDATE owner_applications
        SET
          status = 'rejected',
          reviewed_at = NOW(),
          reviewed_by_user_id = $2,
          rejection_reason = $3
        WHERE id = $1
        RETURNING
          id,
          applicant_name,
          applicant_email,
          applicant_phone,
          password_hash,
          salon_name,
          salon_address,
          salon_city,
          salon_district,
          salon_photo_url,
          salon_working_hours,
          status,
          notes,
          reviewed_at,
          reviewed_by_user_id,
          rejection_reason,
          approved_owner_user_id,
          approved_salon_id,
          created_at,
          updated_at
      `,
      values: [id, reviewedByUserId, rejectionReason],
    });

    return this.mapRow(result.rows[0]);
  }

  private mapRow(row?: OwnerApplicationRow): OwnerApplicationRecord | null {
    if (!row) {
      return null;
    }

    return {
      id: row.id,
      applicantName: row.applicant_name,
      applicantEmail: row.applicant_email,
      applicantPhone: row.applicant_phone,
      passwordHash: row.password_hash,
      salonName: row.salon_name,
      salonAddress: row.salon_address,
      salonCity: row.salon_city,
      salonDistrict: row.salon_district,
      salonPhotoUrl: row.salon_photo_url,
      salonWorkingHours: row.salon_working_hours,
      status: row.status,
      notes: row.notes,
      reviewedAt: row.reviewed_at,
      reviewedByUserId: row.reviewed_by_user_id,
      rejectionReason: row.rejection_reason,
      approvedOwnerUserId: row.approved_owner_user_id,
      approvedSalonId: row.approved_salon_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

interface OwnerApplicationRow extends QueryResultRow {
  id: string;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string;
  password_hash: string;
  salon_name: string;
  salon_address: string;
  salon_city: string;
  salon_district: string | null;
  salon_photo_url: string | null;
  salon_working_hours: OwnerApplicationRecord['salonWorkingHours'];
  status: OwnerApplicationRecord['status'];
  notes: string | null;
  reviewed_at: Date | null;
  reviewed_by_user_id: string | null;
  rejection_reason: string | null;
  approved_owner_user_id: string | null;
  approved_salon_id: string | null;
  created_at: Date;
  updated_at: Date;
}

import { Injectable } from '@nestjs/common';
import { QueryResultRow } from 'pg';
import { DatabaseService } from '../../../database/database.service';
import { SqlQueryExecutor } from '../../../database/database.types';
import {
  ReservationStatus,
  type OperationalReservationStatus,
} from '../enums/reservation-status.enum';
import {
  CreateReservationInput,
  ReservationRecord,
} from '../interfaces/reservation.types';

const ACTIVE_RESERVATION_STATUSES = [
  ReservationStatus.PENDING,
  ReservationStatus.CONFIRMED,
] as const;

@Injectable()
export class ReservationRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(
    input: CreateReservationInput,
    executor: SqlQueryExecutor = this.databaseService,
  ): Promise<ReservationRecord> {
    const result = await executor.query<ReservationRow>({
      name: 'reservation.create',
      text: `
        INSERT INTO reservations (
          customer_id,
          salon_id,
          staff_id,
          slot_start,
          slot_end,
          status,
          notes
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING
          id,
          customer_id,
          salon_id,
          staff_id,
          slot_start,
          slot_end,
          status,
          notes,
          cancelled_at,
          cancelled_by_user_id,
          status_changed_at,
          status_changed_by_user_id,
          created_at,
          updated_at
      `,
      values: [
        input.customerId,
        input.salonId,
        input.staffId,
        input.slotStart,
        input.slotEnd,
        input.status ?? ReservationStatus.PENDING,
        input.notes ?? null,
      ],
    });

    return this.mapRow(result.rows[0]) as ReservationRecord;
  }

  async findById(id: string): Promise<ReservationRecord | null> {
    const result = await this.databaseService.query<ReservationRow>({
      name: 'reservation.find-by-id',
      text: `
        SELECT
          id,
          customer_id,
          salon_id,
          staff_id,
          slot_start,
          slot_end,
          status,
          notes,
          cancelled_at,
          cancelled_by_user_id,
          status_changed_at,
          status_changed_by_user_id,
          created_at,
          updated_at
        FROM reservations
        WHERE id = $1
        LIMIT 1
      `,
      values: [id],
    });

    return this.mapRow(result.rows[0]);
  }

  async findByCustomerId(customerId: string): Promise<ReservationRecord[]> {
    const result = await this.databaseService.query<ReservationRow>({
      name: 'reservation.find-by-customer-id',
      text: `
        SELECT
          id,
          customer_id,
          salon_id,
          staff_id,
          slot_start,
          slot_end,
          status,
          notes,
          cancelled_at,
          cancelled_by_user_id,
          status_changed_at,
          status_changed_by_user_id,
          created_at,
          updated_at
        FROM reservations
        WHERE customer_id = $1
        ORDER BY slot_start DESC
      `,
      values: [customerId],
    });

    return result.rows.map((row) => this.mapRow(row) as ReservationRecord);
  }

  async findBySalonId(salonId: string): Promise<ReservationRecord[]> {
    const result = await this.databaseService.query<ReservationRow>({
      name: 'reservation.find-by-salon-id',
      text: `
        SELECT
          id,
          customer_id,
          salon_id,
          staff_id,
          slot_start,
          slot_end,
          status,
          notes,
          cancelled_at,
          cancelled_by_user_id,
          status_changed_at,
          status_changed_by_user_id,
          created_at,
          updated_at
        FROM reservations
        WHERE salon_id = $1
        ORDER BY slot_start ASC
      `,
      values: [salonId],
    });

    return result.rows.map((row) => this.mapRow(row) as ReservationRecord);
  }

  async findActiveByStaffIdsAndRange(
    staffIds: string[],
    rangeStart: Date,
    rangeEnd: Date,
  ): Promise<ReservationRecord[]> {
    if (staffIds.length === 0) {
      return [];
    }

    const result = await this.databaseService.query<ReservationRow>({
      name: 'reservation.find-active-by-staff-ids-and-range',
      text: `
        SELECT
          id,
          customer_id,
          salon_id,
          staff_id,
          slot_start,
          slot_end,
          status,
          notes,
          cancelled_at,
          cancelled_by_user_id,
          status_changed_at,
          status_changed_by_user_id,
          created_at,
          updated_at
        FROM reservations
        WHERE staff_id = ANY($1::uuid[])
          AND slot_start >= $2
          AND slot_start < $3
          AND status = ANY($4::varchar[])
        ORDER BY slot_start ASC
      `,
      values: [staffIds, rangeStart, rangeEnd, ACTIVE_RESERVATION_STATUSES],
    });

    return result.rows.map((row) => this.mapRow(row) as ReservationRecord);
  }

  async cancel(
    id: string,
    actorUserId: string,
    executor: SqlQueryExecutor = this.databaseService,
  ): Promise<ReservationRecord | null> {
    const result = await executor.query<ReservationRow>({
      name: 'reservation.cancel',
      text: `
        UPDATE reservations
        SET
          status = $2,
          cancelled_at = NOW(),
          cancelled_by_user_id = $3,
          status_changed_at = NOW(),
          status_changed_by_user_id = $3
        WHERE id = $1
        RETURNING
          id,
          customer_id,
          salon_id,
          staff_id,
          slot_start,
          slot_end,
          status,
          notes,
          cancelled_at,
          cancelled_by_user_id,
          status_changed_at,
          status_changed_by_user_id,
          created_at,
          updated_at
      `,
      values: [id, ReservationStatus.CANCELLED, actorUserId],
    });

    return this.mapRow(result.rows[0]);
  }

  async updateStatus(
    id: string,
    status: OperationalReservationStatus,
    actorUserId: string,
    executor: SqlQueryExecutor = this.databaseService,
  ): Promise<ReservationRecord | null> {
    const result = await executor.query<ReservationRow>({
      name: 'reservation.update-status',
      text: `
        UPDATE reservations
        SET
          status = $2,
          status_changed_at = NOW(),
          status_changed_by_user_id = $3
        WHERE id = $1
        RETURNING
          id,
          customer_id,
          salon_id,
          staff_id,
          slot_start,
          slot_end,
          status,
          notes,
          cancelled_at,
          cancelled_by_user_id,
          status_changed_at,
          status_changed_by_user_id,
          created_at,
          updated_at
      `,
      values: [id, status, actorUserId],
    });

    return this.mapRow(result.rows[0]);
  }

  private mapRow(row?: ReservationRow): ReservationRecord | null {
    if (!row) {
      return null;
    }

    return {
      id: row.id,
      customerId: row.customer_id,
      salonId: row.salon_id,
      staffId: row.staff_id,
      slotStart: row.slot_start,
      slotEnd: row.slot_end,
      status: row.status,
      notes: row.notes,
      cancelledAt: row.cancelled_at,
      cancelledByUserId: row.cancelled_by_user_id,
      statusChangedAt: row.status_changed_at,
      statusChangedByUserId: row.status_changed_by_user_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

interface ReservationRow extends QueryResultRow {
  id: string;
  customer_id: string;
  salon_id: string;
  staff_id: string;
  slot_start: Date;
  slot_end: Date;
  status: ReservationStatus;
  notes: string | null;
  cancelled_at: Date | null;
  cancelled_by_user_id: string | null;
  status_changed_at: Date | null;
  status_changed_by_user_id: string | null;
  created_at: Date;
  updated_at: Date;
}

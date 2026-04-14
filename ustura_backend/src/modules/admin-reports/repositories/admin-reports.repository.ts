import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';

export interface DateRange {
  from: Date;
  to: Date;
}

@Injectable()
export class AdminReportsRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async getActiveMrr(): Promise<number> {
    const result = await this.databaseService.query<{ sum: string }>({
      name: 'admin-reports.mrr-active',
      text: `
        SELECT COALESCE(SUM(p.price_per_month), 0)::text AS sum
        FROM subscriptions s
        INNER JOIN packages p ON p.id = s.package_id
        WHERE s.status = 'active'
      `,
    });
    return parseFloat(result.rows[0]?.sum ?? '0');
  }

  async getMrrForSubscriptionsCreatedBetween(
    from: Date,
    to: Date,
  ): Promise<number> {
    const result = await this.databaseService.query<{ sum: string }>({
      name: 'admin-reports.mrr-new-subs-range',
      text: `
        SELECT COALESCE(SUM(p.price_per_month), 0)::text AS sum
        FROM subscriptions s
        INNER JOIN packages p ON p.id = s.package_id
        WHERE s.created_at >= $1::timestamptz
          AND s.created_at < $2::timestamptz
          AND s.status IN ('active', 'pending')
      `,
      values: [from, to],
    });
    return parseFloat(result.rows[0]?.sum ?? '0');
  }

  async countActiveSalons(): Promise<number> {
    const result = await this.databaseService.query<{ c: string }>({
      name: 'admin-reports.salons-active',
      text: `SELECT COUNT(*)::text AS c FROM salons WHERE is_active = TRUE`,
    });
    return parseInt(result.rows[0]?.c ?? '0', 10);
  }

  async countSalonsCreatedBetween(from: Date, to: Date): Promise<number> {
    const result = await this.databaseService.query<{ c: string }>({
      name: 'admin-reports.salons-created-range',
      text: `
        SELECT COUNT(*)::text AS c
        FROM salons
        WHERE created_at >= $1::timestamptz AND created_at < $2::timestamptz
      `,
      values: [from, to],
    });
    return parseInt(result.rows[0]?.c ?? '0', 10);
  }

  async countReservationsBetween(
    from: Date,
    to: Date,
    excludeCancelled = true,
  ): Promise<number> {
    const result = await this.databaseService.query<{ c: string }>({
      name: 'admin-reports.reservations-range',
      text: `
        SELECT COUNT(*)::text AS c
        FROM reservations
        WHERE slot_start >= $1::timestamptz
          AND slot_start < $2::timestamptz
          ${excludeCancelled ? `AND status <> 'cancelled'` : ''}
      `,
      values: [from, to],
    });
    return parseInt(result.rows[0]?.c ?? '0', 10);
  }

  async countActivePrincipals(): Promise<number> {
    const result = await this.databaseService.query<{ c: string }>({
      name: 'admin-reports.principals-active',
      text: `
        SELECT (
          (SELECT COUNT(*) FROM personnel WHERE is_active = TRUE)
          + (SELECT COUNT(*) FROM customers WHERE is_active = TRUE)
        )::text AS c
      `,
    });
    return parseInt(result.rows[0]?.c ?? '0', 10);
  }

  async countNewCustomersBetween(from: Date, to: Date): Promise<number> {
    const result = await this.databaseService.query<{ c: string }>({
      name: 'admin-reports.customers-new-range',
      text: `
        SELECT COUNT(*)::text AS c
        FROM customers
        WHERE created_at >= $1::timestamptz AND created_at < $2::timestamptz
      `,
      values: [from, to],
    });
    return parseInt(result.rows[0]?.c ?? '0', 10);
  }

  async getReservationDailyBuckets(
    from: Date,
    to: Date,
  ): Promise<{ day: string; cnt: number }[]> {
    const result = await this.databaseService.query<{ day: Date; cnt: string }>({
      name: 'admin-reports.reservations-daily',
      text: `
        SELECT date_trunc('day', slot_start AT TIME ZONE 'UTC')::date AS day,
               COUNT(*)::text AS cnt
        FROM reservations
        WHERE slot_start >= $1::timestamptz
          AND slot_start < $2::timestamptz
          AND status <> 'cancelled'
        GROUP BY 1
        ORDER BY 1
      `,
      values: [from, to],
    });
    return result.rows.map((r) => ({
      day: r.day.toISOString().slice(0, 10),
      cnt: parseInt(r.cnt, 10),
    }));
  }

  async getPackageShareActive(): Promise<
    { label: string; tier: string; cnt: number }[]
  > {
    const result = await this.databaseService.query<{
      label: string;
      tier: string;
      cnt: string;
    }>({
      // Named prepared statements can stale across deploys; keep this query unnamed.
      text: `
        SELECT p.name AS label,
               p.tier AS tier,
               COUNT(*)::text AS cnt
        FROM subscriptions s
        INNER JOIN packages p ON p.id = s.package_id
        WHERE s.status = 'active'
        GROUP BY p.id, p.name, p.tier
        ORDER BY COUNT(*) DESC
      `,
    });
    return result.rows.map((r) => ({
      label: r.label,
      tier: r.tier,
      cnt: parseInt(r.cnt, 10),
    }));
  }

  async getOwnerApplicationsByMonth(
    months: number,
  ): Promise<{ ym: string; basvuru: number; onay: number }[]> {
    const result = await this.databaseService.query<{
      ym: Date;
      basvuru: string;
      onay: string;
    }>({
      name: 'admin-reports.owner-apps-by-month',
      text: `
        WITH months AS (
          SELECT generate_series(
            date_trunc('month', NOW() AT TIME ZONE 'UTC') - ($1::int - 1) * INTERVAL '1 month',
            date_trunc('month', NOW() AT TIME ZONE 'UTC'),
            INTERVAL '1 month'
          ) AS ym
        )
        SELECT m.ym,
          (
            SELECT COUNT(*)::text
            FROM owner_applications oa
            WHERE date_trunc('month', oa.created_at AT TIME ZONE 'UTC') = m.ym
          ) AS basvuru,
          (
            SELECT COUNT(*)::text
            FROM owner_applications oa
            WHERE oa.status = 'approved'
              AND oa.reviewed_at IS NOT NULL
              AND date_trunc('month', oa.reviewed_at AT TIME ZONE 'UTC') = m.ym
          ) AS onay
        FROM months m
        ORDER BY m.ym
      `,
      values: [months],
    });
    return result.rows.map((r) => ({
      ym: r.ym.toISOString().slice(0, 10),
      basvuru: parseInt(r.basvuru, 10),
      onay: parseInt(r.onay, 10),
    }));
  }

  async getSalonCountsByCity(limit: number): Promise<{ city: string; cnt: number }[]> {
    const safeLimit = Math.min(100, Math.max(1, Math.floor(Number(limit)) || 8));
    const result = await this.databaseService.query<{ city: string; cnt: string }>({
      text: `
        SELECT COALESCE(NULLIF(TRIM(s.city), ''), 'Bilinmiyor') AS city,
               COUNT(*)::text AS cnt
        FROM salons s
        WHERE s.is_active IS TRUE
        GROUP BY COALESCE(NULLIF(TRIM(s.city), ''), 'Bilinmiyor')
        ORDER BY COUNT(*) DESC
        LIMIT $1
      `,
      values: [safeLimit],
    });
    return result.rows.map((r) => ({
      city: r.city,
      cnt: parseInt(r.cnt, 10),
    }));
  }

  async getReservationSlotStartsBetween(
    from: Date,
    to: Date,
  ): Promise<Date[]> {
    const result = await this.databaseService.query<{ slot_start: Date }>({
      name: 'admin-reports.reservation-slots',
      text: `
        SELECT slot_start
        FROM reservations
        WHERE slot_start >= $1::timestamptz
          AND slot_start < $2::timestamptz
          AND status <> 'cancelled'
      `,
      values: [from, to],
    });
    return result.rows.map((r) => new Date(r.slot_start));
  }

  async getTopSalonsByActivity(
    from: Date,
    to: Date,
    limit: number,
  ): Promise<
    {
      salonId: string;
      name: string;
      city: string;
      district: string | null;
      reservationCount: number;
      mrr: number;
      tier: string;
    }[]
  > {
    const result = await this.databaseService.query<{
      salon_id: string;
      name: string;
      city: string;
      district: string | null;
      reservation_count: string;
      mrr: string;
      tier: string;
    }>({
      name: 'admin-reports.top-salons',
      text: `
        SELECT s.id AS salon_id,
               s.name,
               s.city,
               s.district,
               COUNT(r.id)::text AS reservation_count,
               COALESCE(
                 (
                   SELECT p.price_per_month
                   FROM subscriptions s2
                   INNER JOIN packages p ON p.id = s2.package_id
                   WHERE s2.salon_id = s.id
                     AND s2.status = 'active'
                   ORDER BY s2.start_date DESC NULLS LAST
                   LIMIT 1
                 ),
                 0
               )::text AS mrr,
               COALESCE(
                 (
                   SELECT p.tier
                   FROM subscriptions s2
                   INNER JOIN packages p ON p.id = s2.package_id
                   WHERE s2.salon_id = s.id
                     AND s2.status = 'active'
                   ORDER BY s2.start_date DESC NULLS LAST
                   LIMIT 1
                 ),
                 ''
               ) AS tier
        FROM salons s
        LEFT JOIN reservations r
          ON r.salon_id = s.id
         AND r.slot_start >= $1::timestamptz
         AND r.slot_start < $2::timestamptz
         AND r.status <> 'cancelled'
        WHERE s.is_active = TRUE
        GROUP BY s.id, s.name, s.city, s.district
        ORDER BY COUNT(r.id) DESC
        LIMIT $3
      `,
      values: [from, to, limit],
    });
    return result.rows.map((r) => ({
      salonId: r.salon_id,
      name: r.name,
      city: r.city,
      district: r.district,
      reservationCount: parseInt(r.reservation_count, 10),
      mrr: parseFloat(r.mrr),
      tier: r.tier,
    }));
  }

  async getLatestAuditLogs(limit: number): Promise<
    {
      id: string;
      action: string;
      entityType: string;
      metadata: Record<string, unknown>;
      createdAt: Date;
    }[]
  > {
    const result = await this.databaseService.query<{
      id: string;
      action: string;
      entity_type: string;
      metadata: Record<string, unknown> | null;
      created_at: Date;
    }>({
      name: 'admin-reports.audit-feed',
      text: `
        SELECT id::text,
               action,
               entity_type,
               COALESCE(metadata, '{}'::jsonb) AS metadata,
               created_at
        FROM audit_logs
        ORDER BY created_at DESC
        LIMIT $1
      `,
      values: [limit],
    });
    return result.rows.map((r) => ({
      id: r.id,
      action: r.action,
      entityType: r.entity_type,
      metadata: r.metadata ?? {},
      createdAt: r.created_at,
    }));
  }
}

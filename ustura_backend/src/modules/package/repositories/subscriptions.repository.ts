import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
  PackageApproval,
  PackageApprovalRow,
  Subscription,
  SubscriptionRow,
  SubscriptionStatus,
} from '../interfaces/package.types';

@Injectable()
export class SubscriptionsRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAllDetailed(): Promise<Subscription[]> {
    const result = await this.databaseService.query<SubscriptionRow>({
      name: 'subscription.find-all-detailed',
      text: `
        SELECT 
          s.*, 
          sl.name as salon_name, 
          p.name as package_name, 
          p.tier as package_tier
        FROM subscriptions s
        JOIN salons sl ON s.salon_id = sl.id
        JOIN packages p ON s.package_id = p.id
        ORDER BY s.created_at DESC
      `,
    });

    return result.rows.map((row) => this.mapRow(row));
  }

  async findByPackageId(packageId: string): Promise<Subscription[]> {
    const result = await this.databaseService.query<SubscriptionRow>({
      name: 'subscription.find-by-package-id',
      text: `
        SELECT 
          s.*, 
          sl.name as salon_name, 
          p.name as package_name, 
          p.tier as package_tier
        FROM subscriptions s
        JOIN salons sl ON s.salon_id = sl.id
        JOIN packages p ON s.package_id = p.id
        WHERE s.package_id = $1
        ORDER BY s.created_at DESC
      `,
      values: [packageId],
    });

    return result.rows.map((row) => this.mapRow(row));
  }

  async findApprovalQueue(): Promise<PackageApproval[]> {
    const result = await this.databaseService.query<PackageApprovalRow>({
      name: 'subscription.find-approval-queue',
      text: `
        SELECT
          s.id,
          s.salon_id,
          sl.name AS salon_name,
          sl.city AS salon_city,
          sl.photo_url AS salon_photo_url,
          sl.created_at AS salon_created_at,
          u.id AS owner_id,
          u.name AS owner_name,
          u.email AS owner_email,
          p.id AS package_id,
          p.name AS package_name,
          p.tier AS package_tier,
          p.price_per_month AS package_price_per_month,
          s.status AS subscription_status,
          s.start_date AS subscription_start_date,
          s.end_date AS subscription_end_date,
          s.created_at AS submitted_at,
          s.updated_at,
          COALESCE(staff_stats.staff_count, 0)::int AS staff_count,
          COALESCE(reservation_stats.reservation_count, 0)::int AS reservation_count
        FROM subscriptions s
        INNER JOIN salons sl ON sl.id = s.salon_id
        INNER JOIN personnel u ON u.id = sl.owner_id
        INNER JOIN packages p ON p.id = s.package_id
        LEFT JOIN LATERAL (
          SELECT COUNT(*)::int AS staff_count
          FROM staff st
          WHERE st.salon_id = s.salon_id
        ) AS staff_stats ON TRUE
        LEFT JOIN LATERAL (
          SELECT COUNT(*)::int AS reservation_count
          FROM reservations r
          WHERE r.salon_id = s.salon_id
        ) AS reservation_stats ON TRUE
        ORDER BY
          CASE
            WHEN s.status = 'pending' THEN 0
            WHEN s.status = 'active' THEN 1
            ELSE 2
          END,
          s.created_at DESC
      `,
    });

    return result.rows.map((row) => this.mapApprovalRow(row));
  }

  async updateStatus(
    id: string,
    status: SubscriptionStatus,
  ): Promise<Subscription | null> {
    const result = await this.databaseService.query<SubscriptionRow>({
      name: 'subscription.update-status',
      text: `
        UPDATE subscriptions
        SET status = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING
          id,
          salon_id,
          package_id,
          start_date,
          end_date,
          status,
          created_at,
          updated_at
      `,
      values: [status, id],
    });

    return result.rows[0] ? this.mapRow(result.rows[0]) : null;
  }

  private mapRow(row: SubscriptionRow): Subscription {
    return {
      id: row.id,
      salonId: row.salon_id,
      packageId: row.package_id,
      startDate: row.start_date,
      endDate: row.end_date,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      salonName: row.salon_name,
      packageName: row.package_name,
      packageTier: row.package_tier as any,
    };
  }

  private mapApprovalRow(row: PackageApprovalRow): PackageApproval {
    return {
      id: row.id,
      salonId: row.salon_id,
      salonName: row.salon_name,
      salonCity: row.salon_city,
      salonPhotoUrl: row.salon_photo_url,
      salonCreatedAt: row.salon_created_at,
      ownerId: row.owner_id,
      ownerName: row.owner_name,
      ownerEmail: row.owner_email,
      packageId: row.package_id,
      packageName: row.package_name,
      packageTier: row.package_tier as any,
      packagePricePerMonth: Number(row.package_price_per_month),
      subscriptionStatus: row.subscription_status,
      subscriptionStartDate: row.subscription_start_date,
      subscriptionEndDate: row.subscription_end_date,
      submittedAt: row.submitted_at,
      updatedAt: row.updated_at,
      staffCount: Number(row.staff_count),
      reservationCount: Number(row.reservation_count),
    };
  }
}

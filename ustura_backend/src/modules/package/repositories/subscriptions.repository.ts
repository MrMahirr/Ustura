import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { Subscription, SubscriptionRow } from '../interfaces/package.types';

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
}

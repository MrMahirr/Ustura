import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { Package, PackageRow } from '../interfaces/package.types';
import { CreatePackageDto } from '../dto/create-package.dto';
import { UpdatePackageDto } from '../dto/update-package.dto';

@Injectable()
export class PackagesRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<Package[]> {
    const result = await this.databaseService.query<PackageRow>({
      name: 'package.find-all',
      text: `
        SELECT * FROM packages
        WHERE is_active = TRUE
        ORDER BY price_per_month ASC
      `,
    });

    return result.rows.map((row) => this.mapRow(row));
  }

  async findAllAdmin(): Promise<Package[]> {
    const result = await this.databaseService.query<PackageRow>({
      name: 'package.find-all-admin',
      text: `
        SELECT * FROM packages
        ORDER BY is_active DESC, price_per_month ASC, created_at DESC
      `,
    });

    return result.rows.map((row) => this.mapRow(row));
  }

  async findById(id: string): Promise<Package | null> {
    const result = await this.databaseService.query<PackageRow>({
      name: 'package.find-by-id',
      text: `SELECT * FROM packages WHERE id = $1 LIMIT 1`,
      values: [id],
    });

    return result.rows[0] ? this.mapRow(result.rows[0]) : null;
  }

  async create(input: CreatePackageDto): Promise<Package> {
    const result = await this.databaseService.query<PackageRow>({
      name: 'package.create',
      text: `
        INSERT INTO packages (
          name, tier, tier_label, price_per_month, features, is_featured
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `,
      values: [
        input.name,
        input.tier,
        input.tierLabel,
        input.pricePerMonth,
        JSON.stringify(input.features),
        input.isFeatured ?? false,
      ],
    });

    return this.mapRow(result.rows[0]);
  }

  async update(id: string, input: UpdatePackageDto): Promise<Package | null> {
    const updates: string[] = [];
    const values: any[] = [];

    if (input.name !== undefined) {
      values.push(input.name);
      updates.push(`name = $${values.length}`);
    }
    if (input.tier !== undefined) {
      values.push(input.tier);
      updates.push(`tier = $${values.length}`);
    }
    if (input.tierLabel !== undefined) {
      values.push(input.tierLabel);
      updates.push(`tier_label = $${values.length}`);
    }
    if (input.pricePerMonth !== undefined) {
      values.push(input.pricePerMonth);
      updates.push(`price_per_month = $${values.length}`);
    }
    if (input.features !== undefined) {
      values.push(JSON.stringify(input.features));
      updates.push(`features = $${values.length}`);
    }
    if (input.isFeatured !== undefined) {
      values.push(input.isFeatured);
      updates.push(`is_featured = $${values.length}`);
    }
    if (input.isActive !== undefined) {
      values.push(input.isActive);
      updates.push(`is_active = $${values.length}`);
    }

    if (updates.length === 0) return this.findById(id);

    values.push(id);
    const result = await this.databaseService.query<PackageRow>({
      text: `
        UPDATE packages
        SET ${updates.join(', ')}
        WHERE id = $${values.length}
        RETURNING *
      `,
      values,
    });

    return result.rows[0] ? this.mapRow(result.rows[0]) : null;
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.databaseService.query<{ id: string }>({
      name: 'package.delete-by-id',
      text: `DELETE FROM packages WHERE id = $1 RETURNING id`,
      values: [id],
    });

    return result.rows.length > 0;
  }

  private mapRow(row: PackageRow): Package {
    return {
      id: row.id,
      name: row.name,
      tier: row.tier as any,
      tierLabel: row.tier_label,
      pricePerMonth: Number(row.price_per_month),
      features: row.features,
      isFeatured: row.is_featured,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

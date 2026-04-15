import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { PackagesRepository } from './repositories/packages.repository';
import { SubscriptionsRepository } from './repositories/subscriptions.repository';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { UpdateSubscriptionStatusDto } from './dto/update-subscription-status.dto';
import type { SalonSubscriptionDetail } from './interfaces/package.types';

@Injectable()
export class PackageService {
  constructor(
    private readonly packagesRepository: PackagesRepository,
    private readonly subscriptionsRepository: SubscriptionsRepository,
    private readonly databaseService: DatabaseService,
  ) {}

  async getAllPackages() {
    return this.packagesRepository.findAll();
  }

  async getAdminPackages() {
    return this.packagesRepository.findAllAdmin();
  }

  async getPackageById(id: string) {
    const pkg = await this.packagesRepository.findById(id);
    if (!pkg) {
      throw new NotFoundException('Paket bulunamadi.');
    }

    // Include subscribers for the detail view
    const subscribers = await this.subscriptionsRepository.findByPackageId(id);
    return { ...pkg, subscribers };
  }

  async createPackage(input: CreatePackageDto) {
    return this.packagesRepository.create(input);
  }

  async updatePackage(id: string, input: UpdatePackageDto) {
    const pkg = await this.packagesRepository.update(id, input);
    if (!pkg) {
      throw new NotFoundException('Guncellenmek istenen paket bulunamadi.');
    }
    return pkg;
  }

  async deletePackage(id: string): Promise<void> {
    const pkg = await this.packagesRepository.findById(id);
    if (!pkg) {
      throw new NotFoundException('Silinmek istenen paket bulunamadi.');
    }

    const blockingSubscriptions =
      await this.subscriptionsRepository.countByPackageId(id);
    if (blockingSubscriptions > 0) {
      throw new BadRequestException(
        'Bu pakete aktif veya beklemedeki abonelikler bagli oldugu icin paket silinemez. Once abonelikleri sonlandirin veya baska pakete tasiyin; yalnizca iptal veya suresi dolmus kayitlar silmeyi engellemez.',
      );
    }

    const deleted = await this.packagesRepository.deleteById(id);
    if (!deleted) {
      throw new NotFoundException('Silinmek istenen paket bulunamadi.');
    }
  }

  async getAllSubscriptions() {
    return this.subscriptionsRepository.findAllDetailed();
  }

  async getPackageApprovals() {
    return this.subscriptionsRepository.findApprovalQueue();
  }

  async updateSubscriptionStatus(
    id: string,
    input: UpdateSubscriptionStatusDto,
  ) {
    const subscription = await this.subscriptionsRepository.updateStatus(
      id,
      input.status,
    );

    if (!subscription) {
      throw new NotFoundException('Guncellenecek abonelik bulunamadi.');
    }

    return subscription;
  }

  async requestSubscription(userId: string, role: string, packageId: string) {
    const pkg = await this.packagesRepository.findById(packageId);
    if (!pkg) {
      throw new NotFoundException('Secilen paket bulunamadi.');
    }
    if (!pkg.isActive) {
      throw new BadRequestException('Secilen paket artik aktif degil.');
    }

    const salonRow = await this.databaseService.query<{ id: string }>({
      text:
        role === 'owner'
          ? `SELECT id FROM salons WHERE owner_id = $1 LIMIT 1`
          : `SELECT salon_id AS id FROM staff WHERE user_id = $1 AND is_active = TRUE LIMIT 1`,
      values: [userId],
    });

    const salonId = salonRow.rows[0]?.id;
    if (!salonId) {
      throw new BadRequestException('Salona bagli hesap bulunamadi.');
    }

    const hasPending =
      await this.subscriptionsRepository.hasPendingForSalon(salonId);
    if (hasPending) {
      throw new BadRequestException(
        'Zaten beklemede bir paket talebiniz bulunuyor. Lutfen mevcut talebin sonuclanmasini bekleyin.',
      );
    }

    await this.subscriptionsRepository.cancelAllActiveForSalon(salonId);
    const subscription = await this.subscriptionsRepository.createPending(
      salonId,
      packageId,
    );

    return {
      subscriptionId: subscription.id,
      packageId: pkg.id,
      packageName: pkg.name,
      status: subscription.status,
    };
  }

  async getMySalonSubscription(
    userId: string,
    role: string,
  ): Promise<SalonSubscriptionDetail> {
    const salonRow = await this.databaseService.query<{ id: string }>({
      text:
        role === 'owner'
          ? `SELECT id FROM salons WHERE owner_id = $1 LIMIT 1`
          : `SELECT salon_id AS id FROM staff WHERE user_id = $1 AND is_active = TRUE LIMIT 1`,
      values: [userId],
    });

    const salonId = salonRow.rows[0]?.id;
    if (!salonId) {
      return this.emptySalonSubscription();
    }

    const subscription =
      await this.subscriptionsRepository.findActiveBySalonId(salonId);

    const pkg = subscription
      ? await this.packagesRepository.findById(subscription.packageId)
      : null;

    const usageRow = await this.databaseService.query<{
      reservation_count: string;
      staff_count: string;
      salon_count: string;
    }>({
      text: `
        SELECT
          (SELECT COUNT(*)::text FROM reservations WHERE salon_id = $1)  AS reservation_count,
          (SELECT COUNT(*)::text FROM staff WHERE salon_id = $1 AND is_active = TRUE) AS staff_count,
          (SELECT COUNT(*)::text FROM salons WHERE owner_id = (SELECT owner_id FROM salons WHERE id = $1)) AS salon_count
      `,
      values: [salonId],
    });

    const usage = usageRow.rows[0];
    const features = pkg?.features ?? [];

    const reservationLimitFeature = features.find((f) =>
      f.label.toLowerCase().includes('rezervasyon'),
    );
    const staffLimitFeature = features.find((f) =>
      f.label.toLowerCase().includes('personel'),
    );

    const parseLimit = (label: string | undefined): number | null => {
      if (!label) return null;
      const match = label.match(/(\d+)/);
      if (match) return Number(match[1]);
      if (label.toLowerCase().includes('sınırsız')) return null;
      return null;
    };

    return {
      packageId: pkg?.id ?? null,
      packageName: pkg?.name ?? null,
      packageTier: pkg?.tier ?? null,
      pricePerMonth: pkg?.pricePerMonth ?? null,
      status: subscription?.status ?? null,
      startDate: subscription?.startDate ?? null,
      endDate: subscription?.endDate ?? null,
      reservationCount: Number(usage?.reservation_count ?? 0),
      reservationLimit: parseLimit(reservationLimitFeature?.label),
      staffCount: Number(usage?.staff_count ?? 0),
      staffLimit: parseLimit(staffLimitFeature?.label),
      salonCount: Number(usage?.salon_count ?? 0),
      salonLimit: 1,
    };
  }

  private emptySalonSubscription(): SalonSubscriptionDetail {
    return {
      packageId: null,
      packageName: null,
      packageTier: null,
      pricePerMonth: null,
      status: null,
      startDate: null,
      endDate: null,
      reservationCount: 0,
      reservationLimit: null,
      staffCount: 0,
      staffLimit: null,
      salonCount: 0,
      salonLimit: null,
    };
  }

  async getOverviewStats() {
    const packages = await this.packagesRepository.findAllAdmin();
    const subscriptions = await this.subscriptionsRepository.findAllDetailed();

    const activeSubCount = subscriptions.filter(
      (s) => s.status === 'active',
    ).length;
    const monthlyRev = packages.reduce((acc, p) => {
      const pkgSubs = subscriptions.filter(
        (s) => s.packageId === p.id && s.status === 'active',
      );
      return acc + pkgSubs.length * p.pricePerMonth;
    }, 0);

    return {
      totalPackages: packages.length,
      activeSubscriptions: activeSubCount,
      subscriptionGrowthPercent: 0, // Placeholder
      monthlyRevenue: monthlyRev,
      pendingApprovals: subscriptions.filter((s) => s.status === 'pending')
        .length,
    };
  }
}

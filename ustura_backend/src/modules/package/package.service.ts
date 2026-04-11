import { Injectable, NotFoundException } from '@nestjs/common';
import { PackagesRepository } from './repositories/packages.repository';
import { SubscriptionsRepository } from './repositories/subscriptions.repository';
import { CreatePackageInput, UpdatePackageInput } from './interfaces/package.types';

@Injectable()
export class PackageService {
  constructor(
    private readonly packagesRepository: PackagesRepository,
    private readonly subscriptionsRepository: SubscriptionsRepository,
  ) {}

  async getAllPackages() {
    return this.packagesRepository.findAll();
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

  async createPackage(input: CreatePackageInput) {
    return this.packagesRepository.create(input);
  }

  async updatePackage(id: string, input: UpdatePackageInput) {
    const pkg = await this.packagesRepository.update(id, input);
    if (!pkg) {
      throw new NotFoundException('Guncellenmek istenen paket bulunamadi.');
    }
    return pkg;
  }

  async getAllSubscriptions() {
    return this.subscriptionsRepository.findAllDetailed();
  }

  async getOverviewStats() {
    const packages = await this.packagesRepository.findAll();
    const subscriptions = await this.subscriptionsRepository.findAllDetailed();
    
    const activeSubCount = subscriptions.filter(s => s.status === 'active').length;
    const monthlyRev = packages.reduce((acc, p) => {
      const pkgSubs = subscriptions.filter(s => s.packageId === p.id && s.status === 'active');
      return acc + (pkgSubs.length * p.pricePerMonth);
    }, 0);

    return {
      totalPackages: packages.length,
      activeSubscriptions: activeSubCount,
      subscriptionGrowthPercent: 0, // Placeholder
      monthlyRevenue: monthlyRev,
      pendingApprovals: subscriptions.filter(s => s.status === 'pending').length,
    };
  }
}

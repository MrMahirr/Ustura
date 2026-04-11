import { Module } from '@nestjs/common';
import { PackageController } from './package.controller';
import { PackageService } from './package.service';
import { PackagesRepository } from './repositories/packages.repository';
import { SubscriptionsRepository } from './repositories/subscriptions.repository';

@Module({
  controllers: [PackageController],
  providers: [
    PackageService,
    PackagesRepository,
    SubscriptionsRepository,
  ],
  exports: [PackageService],
})
export class PackageModule {}

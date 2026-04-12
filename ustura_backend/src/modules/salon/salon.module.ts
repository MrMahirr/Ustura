import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import {
  SALON_CATALOG_SERVICE,
  SALON_OWNER_PROVISIONING_SERVICE,
} from './interfaces/salon.contracts';
import { SalonController } from './salon.controller';
import { SalonPolicy } from './policies/salon.policy';
import { SalonManagementService } from './salon-management.service';
import { SalonOwnershipService } from './salon-ownership.service';
import { SalonProjectionService } from './salon-projection.service';
import { SalonQueryService } from './salon-query.service';
import { SalonService } from './salon.service';
import { SalonWorkingHoursService } from './salon-working-hours.service';
import { SalonRepository } from './repositories/salon.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [SalonController],
  providers: [
    SalonService,
    SalonQueryService,
    SalonManagementService,
    SalonWorkingHoursService,
    SalonProjectionService,
    SalonOwnershipService,
    SalonRepository,
    SalonPolicy,
    {
      provide: SALON_CATALOG_SERVICE,
      useExisting: SalonQueryService,
    },
    {
      provide: SALON_OWNER_PROVISIONING_SERVICE,
      useExisting: SalonManagementService,
    },
  ],
  exports: [SALON_CATALOG_SERVICE, SALON_OWNER_PROVISIONING_SERVICE, SalonService],
})
export class SalonModule {}

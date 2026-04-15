import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { SalonModule } from '../salon/salon.module';
import {
  SALON_SERVICE_CATALOG_SERVICE,
  SALON_SERVICE_PROVISIONING_SERVICE,
} from './interfaces/salon-service.types';
import { SalonServiceController } from './salon-service.controller';
import { SalonServiceRepository } from './repositories/salon-service.repository';
import { SalonServiceService } from './salon-service.service';

@Module({
  imports: [DatabaseModule, SalonModule],
  controllers: [SalonServiceController],
  providers: [
    SalonServiceRepository,
    SalonServiceService,
    {
      provide: SALON_SERVICE_CATALOG_SERVICE,
      useExisting: SalonServiceService,
    },
    {
      provide: SALON_SERVICE_PROVISIONING_SERVICE,
      useExisting: SalonServiceService,
    },
  ],
  exports: [
    SALON_SERVICE_CATALOG_SERVICE,
    SALON_SERVICE_PROVISIONING_SERVICE,
    SalonServiceService,
  ],
})
export class SalonServiceModule {}

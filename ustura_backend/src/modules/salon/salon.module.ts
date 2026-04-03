import { Module } from '@nestjs/common';
import { SalonController } from './salon.controller';
import { SalonService } from './salon.service';
import { SalonRepository } from './repositories/salon.repository';

@Module({
  controllers: [SalonController],
  providers: [SalonService, SalonRepository],
  exports: [SalonService],
})
export class SalonModule {}

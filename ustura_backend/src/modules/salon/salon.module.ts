import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { SalonController } from './salon.controller';
import { SalonPolicy } from './policies/salon.policy';
import { SalonService } from './salon.service';
import { SalonRepository } from './repositories/salon.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [SalonController],
  providers: [SalonService, SalonRepository, SalonPolicy],
  exports: [SalonService],
})
export class SalonModule {}

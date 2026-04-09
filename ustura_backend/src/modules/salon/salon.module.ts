import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { SalonController } from './salon.controller';
import { SalonService } from './salon.service';
import { SalonRepository } from './repositories/salon.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [SalonController],
  providers: [SalonService, SalonRepository],
  exports: [SalonService, SalonRepository],
})
export class SalonModule {}

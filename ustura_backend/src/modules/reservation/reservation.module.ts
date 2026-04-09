import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { SalonModule } from '../salon/salon.module';
import { StaffModule } from '../staff/staff.module';
import { UserModule } from '../user/user.module';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { ReservationRepository } from './repositories/reservation.repository';
import { SlotService } from './slot/slot.service';
import { SlotController } from './slot/slot.controller';
import { SlotGateway } from './slot/slot.gateway';

@Module({
  imports: [DatabaseModule, UserModule, SalonModule, StaffModule],
  controllers: [ReservationController, SlotController],
  providers: [
    ReservationService,
    ReservationRepository,
    SlotService,
    SlotGateway,
  ],
  exports: [ReservationService],
})
export class ReservationModule {}

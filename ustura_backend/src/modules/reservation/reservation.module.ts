import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { EventsModule } from '../../events/events.module';
import { SalonModule } from '../salon/salon.module';
import { StaffModule } from '../staff/staff.module';
import { UserModule } from '../user/user.module';
import { ReservationPolicy } from './policies/reservation.policy';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { ReservationRepository } from './repositories/reservation.repository';
import { SlotService } from './slot/slot.service';
import { SlotController } from './slot/slot.controller';
import { SlotGateway } from './slot/slot.gateway';

@Module({
  imports: [DatabaseModule, EventsModule, UserModule, SalonModule, StaffModule],
  controllers: [ReservationController, SlotController],
  providers: [
    ReservationService,
    ReservationPolicy,
    ReservationRepository,
    SlotService,
    SlotGateway,
  ],
  exports: [ReservationService],
})
export class ReservationModule {}

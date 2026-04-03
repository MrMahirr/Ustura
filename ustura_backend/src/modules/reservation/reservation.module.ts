import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { ReservationRepository } from './repositories/reservation.repository';
import { SlotService } from './slot/slot.service';
import { SlotController } from './slot/slot.controller';

@Module({
  controllers: [ReservationController, SlotController],
  providers: [ReservationService, ReservationRepository, SlotService],
  exports: [ReservationService],
})
export class ReservationModule {}

import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import {
  OPERATIONAL_RESERVATION_STATUSES,
  type OperationalReservationStatus,
} from '../enums/reservation-status.enum';

export class UpdateReservationStatusDto {
  @ApiProperty({
    enum: OPERATIONAL_RESERVATION_STATUSES,
    description:
      'Operational status updates. Use DELETE /reservations/:id for cancellation.',
  })
  @IsIn(OPERATIONAL_RESERVATION_STATUSES)
  status: OperationalReservationStatus;
}

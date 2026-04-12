import { ApiProperty } from '@nestjs/swagger';
import { ReservationStatus } from '../enums/reservation-status.enum';

export class ReservationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  customerId: string;

  @ApiProperty()
  salonId: string;

  @ApiProperty()
  staffId: string;

  @ApiProperty()
  slotStart: string;

  @ApiProperty()
  slotEnd: string;

  @ApiProperty({ enum: ReservationStatus })
  status: ReservationStatus;

  @ApiProperty({ nullable: true })
  notes: string | null;

  @ApiProperty({ nullable: true })
  cancelledAt: string | null;

  @ApiProperty({ nullable: true })
  cancelledByUserId: string | null;

  @ApiProperty({ nullable: true })
  statusChangedAt: string | null;

  @ApiProperty({ nullable: true })
  statusChangedByUserId: string | null;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

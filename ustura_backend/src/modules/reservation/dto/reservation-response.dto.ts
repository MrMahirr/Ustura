import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({ enum: ['pending', 'confirmed', 'cancelled'] })
  status: 'pending' | 'confirmed' | 'cancelled';

  @ApiProperty({ nullable: true })
  notes: string | null;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

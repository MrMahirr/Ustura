import { ApiProperty } from '@nestjs/swagger';

export class SlotResponseDto {
  @ApiProperty()
  start: string;

  @ApiProperty()
  end: string;

  @ApiProperty()
  available: boolean;

  @ApiProperty({ enum: ['available', 'reserved', 'held'] })
  status: 'available' | 'reserved' | 'held';

  @ApiProperty({ nullable: true })
  heldUntil: string | null;

  @ApiProperty({
    required: false,
    type: [String],
    description: 'Returned when staff_id is not supplied.',
  })
  availableStaffIds?: string[];
}

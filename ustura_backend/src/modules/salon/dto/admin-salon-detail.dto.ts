import { ApiProperty } from '@nestjs/swagger';

export class AdminSalonDetailDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  ownerId: string;

  @ApiProperty()
  ownerName: string;

  @ApiProperty()
  ownerEmail: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  city: string;

  @ApiProperty({ nullable: true })
  district: string | null;

  @ApiProperty({ nullable: true })
  photoUrl: string | null;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty({
    type: 'object',
    additionalProperties: true,
    example: { monday: { open: '09:00', close: '19:00' }, sunday: null },
  })
  workingHours: Record<string, { open: string; close: string } | null>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

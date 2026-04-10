import { ApiProperty } from '@nestjs/swagger';

class WorkingHoursEntryDto {
  @ApiProperty({ example: '09:00' })
  open: string;

  @ApiProperty({ example: '19:00' })
  close: string;
}

export class OwnedSalonResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

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

  @ApiProperty({
    type: 'object',
    additionalProperties: {
      oneOf: [
        {
          $ref: '#/components/schemas/WorkingHoursEntryDto',
        },
        {
          type: 'null',
        },
      ],
    },
  })
  workingHours: Record<string, WorkingHoursEntryDto | null>;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

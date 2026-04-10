import { ApiProperty } from '@nestjs/swagger';
import { PublicSalonSummaryDto } from './public-salon-summary.dto';

class WorkingHoursEntryDto {
  @ApiProperty({ example: '09:00' })
  open: string;

  @ApiProperty({ example: '19:00' })
  close: string;
}

export class PublicSalonDetailDto extends PublicSalonSummaryDto {
  @ApiProperty()
  address: string;

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
}

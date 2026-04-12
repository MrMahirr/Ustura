import { ApiProperty } from '@nestjs/swagger';
import { OwnerApplicationStatus } from '../enums/owner-application-status.enum';

class WorkingHoursEntryDto {
  @ApiProperty({ example: '09:00' })
  open: string;

  @ApiProperty({ example: '19:00' })
  close: string;
}

export class OwnerApplicationResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Jane Owner' })
  applicantName: string;

  @ApiProperty({ example: 'owner@example.com' })
  applicantEmail: string;

  @ApiProperty({ example: '+905551112233' })
  applicantPhone: string;

  @ApiProperty({ example: 'Ustura Premium' })
  salonName: string;

  @ApiProperty({ example: 'Istanbul Street 10' })
  salonAddress: string;

  @ApiProperty({ example: 'Istanbul' })
  salonCity: string;

  @ApiProperty({ nullable: true, example: 'Besiktas' })
  salonDistrict: string | null;

  @ApiProperty({ nullable: true, example: 'https://example.com/salon.jpg' })
  salonPhotoUrl: string | null;

  @ApiProperty({
    type: 'object',
    additionalProperties: {
      oneOf: [
        { $ref: '#/components/schemas/WorkingHoursEntryDto' },
        { type: 'null' },
      ],
    },
  })
  salonWorkingHours: Record<string, WorkingHoursEntryDto | null>;

  @ApiProperty({ enum: OwnerApplicationStatus })
  status: OwnerApplicationStatus;

  @ApiProperty({ nullable: true })
  notes: string | null;

  @ApiProperty({ nullable: true })
  reviewedAt: Date | null;

  @ApiProperty({ nullable: true, format: 'uuid' })
  reviewedByUserId: string | null;

  @ApiProperty({ nullable: true })
  rejectionReason: string | null;

  @ApiProperty({ nullable: true, format: 'uuid' })
  approvedOwnerUserId: string | null;

  @ApiProperty({ nullable: true, format: 'uuid' })
  approvedSalonId: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

import { ApiProperty } from '@nestjs/swagger';

export class PublicSalonSummaryDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  city: string;

  @ApiProperty({ nullable: true })
  district: string | null;

  @ApiProperty({ nullable: true })
  photoUrl: string | null;
}

import { ApiProperty } from '@nestjs/swagger';

export class OwnedSalonSummaryDto {
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

  @ApiProperty({ type: [String] })
  galleryUrls: string[];

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  updatedAt: string;
}

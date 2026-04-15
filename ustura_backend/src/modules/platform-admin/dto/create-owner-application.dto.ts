import {
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateOwnerApplicationDto {
  @IsString()
  @Length(2, 100)
  applicantName: string;

  @IsEmail()
  applicantEmail: string;

  @IsString()
  @Length(8, 20)
  applicantPhone: string;

  @IsString()
  @Length(2, 150)
  salonName: string;

  @IsString()
  @Length(5, 500)
  salonAddress: string;

  @IsString()
  @Length(2, 80)
  salonCity: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  salonDistrict?: string;

  @IsOptional()
  @IsUrl({
    require_protocol: true,
  })
  salonPhotoUrl?: string;

  @IsObject()
  salonWorkingHours: Record<string, unknown>;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}

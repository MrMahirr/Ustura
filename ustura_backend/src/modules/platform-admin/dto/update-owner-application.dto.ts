import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class UpdateOwnerApplicationDto {
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
  @IsString()
  @MaxLength(1000)
  notes?: string;
}

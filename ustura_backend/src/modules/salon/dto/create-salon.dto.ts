import {
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateSalonDto {
  @IsString()
  @Length(2, 150)
  name: string;

  @IsString()
  @Length(5, 500)
  address: string;

  @IsString()
  @Length(2, 80)
  city: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  district?: string;

  @IsOptional()
  @IsUrl({
    require_protocol: true,
  })
  photo_url?: string;

  @IsObject()
  working_hours: Record<string, unknown>;
}

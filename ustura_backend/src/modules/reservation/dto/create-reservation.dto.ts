import {
  IsEmail,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateReservationDto {
  @IsUUID()
  salon_id: string;

  @IsUUID()
  staff_id: string;

  @IsISO8601()
  slot_start: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @IsOptional()
  @IsUUID()
  customer_id?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  customer_name?: string;

  @IsOptional()
  @IsEmail()
  customer_email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  customer_phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(128)
  selection_owner_id?: string;
}

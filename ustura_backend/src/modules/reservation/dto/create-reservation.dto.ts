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
  salonId: string;

  @IsUUID()
  staffId: string;

  @IsISO8601()
  slotStart: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @IsOptional()
  @IsUUID()
  customerId?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  customerName?: string;

  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  customerPhone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(128)
  selectionOwnerId?: string;
}

import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateEmployeeAccountDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(20)
  phone: string;

  /** Bos veya verilmezse sunucu gecici sifre uretir ve e-posta gonderir. */
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() === '' ? undefined : value,
  )
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password?: string;
}

import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PrincipalKind } from '../../../shared/auth/principal-kind.enum';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;

  /** Defaults to customer. Staff and platform admin clients must set this. */
  @IsOptional()
  @IsEnum(PrincipalKind)
  principalKind?: PrincipalKind;
}

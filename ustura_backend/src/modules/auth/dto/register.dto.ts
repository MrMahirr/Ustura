import {
  IsEmail,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @Length(2, 100)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(20)
  phone: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;
}

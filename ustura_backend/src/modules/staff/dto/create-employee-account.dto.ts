import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

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

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;
}

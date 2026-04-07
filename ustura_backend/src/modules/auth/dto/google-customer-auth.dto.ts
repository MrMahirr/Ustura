import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class GoogleCustomerAuthDto {
  @IsString()
  @MinLength(100)
  idToken: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;
}

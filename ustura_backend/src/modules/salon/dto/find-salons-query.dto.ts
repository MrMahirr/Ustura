import { IsOptional, IsString, Length, MaxLength } from 'class-validator';

export class FindSalonsQueryDto {
  @IsOptional()
  @IsString()
  @Length(2, 80)
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  search?: string;
}

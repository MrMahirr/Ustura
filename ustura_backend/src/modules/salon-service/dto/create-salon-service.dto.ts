import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateSalonServiceDto {
  @IsString()
  @Length(2, 120)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(400)
  description?: string;

  @IsInt()
  @Min(5)
  @Max(480)
  durationMinutes: number;

  @IsInt()
  @Min(0)
  @Max(100000)
  priceAmount: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

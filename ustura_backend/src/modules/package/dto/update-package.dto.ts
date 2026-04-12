import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import type { PackageFeature, PackageTier } from '../interfaces/package.types';

export class UpdatePackageDto {
  @ApiPropertyOptional({ example: 'Profil Paketi' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ enum: ['baslangic', 'profesyonel', 'kurumsal'] })
  @IsOptional()
  @IsEnum(['baslangic', 'profesyonel', 'kurumsal'])
  tier?: PackageTier;

  @ApiPropertyOptional({ example: 'Gelişmiş Seviye' })
  @IsOptional()
  @IsString()
  tierLabel?: string;

  @ApiPropertyOptional({ example: 899 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  pricePerMonth?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  features?: PackageFeature[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

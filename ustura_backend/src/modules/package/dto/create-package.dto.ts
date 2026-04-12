import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import type { PackageFeature, PackageTier } from '../interfaces/package.types';

export class CreatePackageDto {
  @ApiProperty({ example: 'Başlangıç Paketi' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: ['baslangic', 'profesyonel', 'kurumsal'] })
  @IsEnum(['baslangic', 'profesyonel', 'kurumsal'])
  tier: PackageTier;

  @ApiProperty({ example: 'Giriş Seviyesi' })
  @IsString()
  @IsNotEmpty()
  tierLabel: string;

  @ApiProperty({ example: 499 })
  @IsNumber()
  @Min(0)
  pricePerMonth: number;

  @ApiProperty({
    example: [
      { label: 'Sınırsız Randevu', included: true },
      { label: 'E-Fatura', included: false },
    ],
  })
  @IsArray()
  features: PackageFeature[];

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}

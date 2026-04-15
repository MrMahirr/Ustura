import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import type {
  AdminSalonSort,
  AdminSalonStatusFilter,
} from '../interfaces/salon.types';

export class FindAdminSalonsQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  search?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  city?: string;

  @IsOptional()
  @IsIn(['active', 'inactive'] satisfies AdminSalonStatusFilter[])
  status?: AdminSalonStatusFilter;

  @IsOptional()
  @IsIn([
    'newest',
    'name_asc',
    'name_desc',
    'updated_desc',
  ] satisfies AdminSalonSort[])
  sort: AdminSalonSort = 'newest';

  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(24)
  pageSize = 6;
}

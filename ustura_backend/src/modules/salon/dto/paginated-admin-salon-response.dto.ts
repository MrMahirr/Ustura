import { ApiProperty } from '@nestjs/swagger';
import { AdminSalonSummaryDto } from './admin-salon-summary.dto';
import { PublicSalonPaginationDto } from './paginated-public-salon-response.dto';

export class AdminSalonOverviewDto {
  @ApiProperty({ example: 42 })
  total: number;

  @ApiProperty({ example: 35 })
  active: number;

  @ApiProperty({ example: 7 })
  inactive: number;

  @ApiProperty({ example: 12 })
  cityCount: number;

  @ApiProperty({ example: 5 })
  newLast30Days: number;
}

export class PaginatedAdminSalonResponseDto {
  @ApiProperty({ type: AdminSalonSummaryDto, isArray: true })
  items: AdminSalonSummaryDto[];

  @ApiProperty({ type: PublicSalonPaginationDto })
  pagination: PublicSalonPaginationDto;

  @ApiProperty({ type: AdminSalonOverviewDto })
  overview: AdminSalonOverviewDto;
}

import { ApiProperty } from '@nestjs/swagger';
import { PublicSalonSummaryDto } from './public-salon-summary.dto';

export class PublicSalonPaginationDto {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 6 })
  pageSize: number;

  @ApiProperty({ example: 18 })
  total: number;

  @ApiProperty({ example: 3 })
  totalPages: number;

  @ApiProperty({ example: true })
  hasNextPage: boolean;

  @ApiProperty({ example: false })
  hasPreviousPage: boolean;
}

export class PaginatedPublicSalonResponseDto {
  @ApiProperty({ type: PublicSalonSummaryDto, isArray: true })
  items: PublicSalonSummaryDto[];

  @ApiProperty({ type: PublicSalonPaginationDto })
  pagination: PublicSalonPaginationDto;
}

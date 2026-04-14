import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export type AdminReportPeriod = 'today' | 'week' | 'month' | 'year';

export class AdminReportsQueryDto {
  @ApiPropertyOptional({
    enum: ['today', 'week', 'month', 'year', 'custom'],
    description: 'Rapor penceresi. custom + customFrom/customTo ileride genisletilebilir.',
  })
  @IsOptional()
  @IsString()
  @IsIn(['today', 'week', 'month', 'year', 'custom'])
  period?: AdminReportPeriod | 'custom' = 'month';
}

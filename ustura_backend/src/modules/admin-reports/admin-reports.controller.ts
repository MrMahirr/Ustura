import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../shared/auth/role.enum';
import { AdminReportsQueryDto } from './dto/admin-reports-query.dto';
import { AdminReportsService } from './admin-reports.service';

@ApiTags('admin-reports')
@Controller('admin/reports')
export class AdminReportsController {
  constructor(private readonly adminReportsService: AdminReportsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Get('dashboard')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Super admin rapor ozeti (KPI, grafik verileri, tablolar)',
  })
  @ApiOkResponse({ description: 'Dashboard payload' })
  async dashboard(@Query() query: AdminReportsQueryDto) {
    const period = query.period ?? 'month';
    return this.adminReportsService.getDashboard(period);
  }
}

import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { HealthModule } from '../health/health.module';
import { AdminReportsController } from './admin-reports.controller';
import { AdminReportsService } from './admin-reports.service';
import { AdminReportsRepository } from './repositories/admin-reports.repository';

@Module({
  imports: [DatabaseModule, HealthModule],
  controllers: [AdminReportsController],
  providers: [AdminReportsService, AdminReportsRepository],
})
export class AdminReportsModule {}

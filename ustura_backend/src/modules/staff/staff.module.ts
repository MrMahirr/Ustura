import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';
import { StaffRepository } from './repositories/staff.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [StaffController],
  providers: [StaffService, StaffRepository],
  exports: [StaffService, StaffRepository],
})
export class StaffModule {}

import { Module } from '@nestjs/common';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';
import { StaffRepository } from './repositories/staff.repository';

@Module({
  controllers: [StaffController],
  providers: [StaffService, StaffRepository],
  exports: [StaffService],
})
export class StaffModule {}

import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { SalonModule } from '../salon/salon.module';
import { UserModule } from '../user/user.module';
import { StaffController } from './staff.controller';
import { StaffPolicy } from './policies/staff.policy';
import { StaffService } from './staff.service';
import { StaffRepository } from './repositories/staff.repository';

@Module({
  imports: [DatabaseModule, AuditLogModule, SalonModule, UserModule],
  controllers: [StaffController],
  providers: [StaffService, StaffRepository, StaffPolicy],
  exports: [StaffService],
})
export class StaffModule {}

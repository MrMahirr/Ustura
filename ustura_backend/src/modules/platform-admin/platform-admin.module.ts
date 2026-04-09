import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { SalonModule } from '../salon/salon.module';
import { UserModule } from '../user/user.module';
import { PlatformAdminController } from './platform-admin.controller';
import { PlatformAdminService } from './platform-admin.service';
import { PlatformAdminPolicy } from './policies/platform-admin.policy';
import { PlatformAdminRepository } from './repositories/platform-admin.repository';

@Module({
  imports: [DatabaseModule, UserModule, SalonModule],
  controllers: [PlatformAdminController],
  providers: [
    PlatformAdminService,
    PlatformAdminPolicy,
    PlatformAdminRepository,
  ],
})
export class PlatformAdminModule {}

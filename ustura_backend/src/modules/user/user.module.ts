import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import {
  USER_PROVISIONING_SERVICE,
  USER_QUERY_SERVICE,
} from './interfaces/user.contracts';
import { UserController } from './user.controller';
import { UserAccountPolicy } from './policies/user-account.policy';
import { UserProfileService } from './user-profile.service';
import { UserService } from './user.service';
import { UserRepository } from './repositories/user.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [
    UserService,
    UserProfileService,
    UserRepository,
    UserAccountPolicy,
    {
      provide: USER_QUERY_SERVICE,
      useExisting: UserService,
    },
    {
      provide: USER_PROVISIONING_SERVICE,
      useExisting: UserService,
    },
  ],
  exports: [USER_QUERY_SERVICE, USER_PROVISIONING_SERVICE],
})
export class UserModule {}

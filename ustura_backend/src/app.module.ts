import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { UserModule } from './modules/user/user.module';
import { SalonModule } from './modules/salon/salon.module';
import { StaffModule } from './modules/staff/staff.module';
import { ReservationModule } from './modules/reservation/reservation.module';
import { StartupValidationService } from './startup/startup-validation.service';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    RedisModule,
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60_000,
        limit: 60,
      },
    ]),
    AuthModule,
    HealthModule,
    UserModule,
    SalonModule,
    StaffModule,
    ReservationModule,
  ],
  controllers: [],
  providers: [
    StartupValidationService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

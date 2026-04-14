import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { EventsModule } from './events/events.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuditLogModule } from './modules/audit-log/audit-log.module';
import { EmailModule } from './modules/email/email.module';
import { HealthModule } from './modules/health/health.module';
import { NotificationModule } from './modules/notification/notification.module';
import { PlatformAdminModule } from './modules/platform-admin/platform-admin.module';
import { UserModule } from './modules/user/user.module';
import { SalonModule } from './modules/salon/salon.module';
import { StaffModule } from './modules/staff/staff.module';
import { ReservationModule } from './modules/reservation/reservation.module';
import { PackageModule } from './modules/package/package.module';
import { AdminReportsModule } from './modules/admin-reports/admin-reports.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { StartupValidationService } from './startup/startup-validation.service';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    EventsModule,
    RedisModule,
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60_000,
        limit: 60,
      },
    ]),
    AuthModule,
    AuditLogModule,
    EmailModule,
    HealthModule,
    NotificationModule,
    PlatformAdminModule,
    UserModule,
    SalonModule,
    StaffModule,
    ReservationModule,
    PackageModule,
    AdminReportsModule,
  ],
  controllers: [],
  providers: [
    StartupValidationService,
    JwtAuthGuard,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

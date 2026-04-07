import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppConfigService } from '../../config/config.service';
import { DatabaseModule } from '../../database/database.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { FirebaseTokenVerifierService } from './firebase-token-verifier.service';
import { AuthService } from './auth.service';
import { AuthRepository } from './repositories/auth.repository';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => ({
        secret: configService.jwt.secret,
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    JwtStrategy,
    FirebaseTokenVerifierService,
  ],
  exports: [AuthService],
})
export class AuthModule {}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AppConfig,
  CorsConfig,
  DatabaseConfig,
  EmailJsConfig,
  EnvironmentVariables,
  FirebaseConfig,
  FrontendConfig,
  GoogleAuthConfig,
  JwtConfig,
  NodeEnvironment,
  ReservationConfig,
  RedisConfig,
} from './config.types';

@Injectable()
export class AppConfigService {
  readonly app: AppConfig;
  readonly database: DatabaseConfig;
  readonly jwt: JwtConfig;
  readonly reservation: ReservationConfig;
  readonly firebase: FirebaseConfig;
  readonly google: GoogleAuthConfig;
  readonly redis: RedisConfig;
  readonly cors: CorsConfig;
  readonly emailJs: EmailJsConfig;
  readonly frontend: FrontendConfig;

  constructor(
    private readonly configService: ConfigService<EnvironmentVariables, true>,
  ) {
    this.app = Object.freeze({
      port: this.getValue<number>('PORT'),
      nodeEnv: this.getValue<NodeEnvironment>('NODE_ENV'),
      apiPrefix: this.getValue<string>('API_PREFIX'),
    });

    this.database = Object.freeze({
      host: this.getValue<string>('DB_HOST'),
      port: this.getValue<number>('DB_PORT'),
      database: this.getValue<string>('DB_NAME'),
      user: this.getValue<string>('DB_USER'),
      password: this.getValue<string>('DB_PASSWORD'),
      poolMin: this.getValue<number>('DB_POOL_MIN'),
      poolMax: this.getValue<number>('DB_POOL_MAX'),
      connectionTimeoutMs: this.getValue<number>('DB_CONNECTION_TIMEOUT_MS'),
      idleTimeoutMs: this.getValue<number>('DB_IDLE_TIMEOUT_MS'),
    });

    this.jwt = Object.freeze({
      secret: this.getValue<string>('JWT_SECRET'),
      accessExpiresIn: this.getValue<string>('JWT_ACCESS_EXPIRATION'),
      refreshExpiresIn: this.getValue<string>('JWT_REFRESH_EXPIRATION'),
    });

    this.reservation = Object.freeze({
      slotDurationMinutes: 30,
      slotSelectionTtlSeconds: 45,
      slotLockTtlSeconds: 5,
      businessUtcOffset: '+03:00',
      businessTimeZone: 'Europe/Istanbul',
    });

    this.firebase = Object.freeze({
      projectId: this.getValue<string>('FIREBASE_PROJECT_ID'),
      certsUrl: this.getValue<string>('FIREBASE_CERTS_URL'),
    });

    this.google = Object.freeze({
      webClientId: this.getValue<string>('GOOGLE_WEB_CLIENT_ID'),
    });

    this.redis = Object.freeze({
      host: this.getValue<string>('REDIS_HOST'),
      port: this.getValue<number>('REDIS_PORT'),
      password: this.getValue<string>('REDIS_PASSWORD'),
    });

    this.cors = Object.freeze({
      origins: this.getValue<string[]>('CORS_ORIGINS'),
      credentials: this.getValue<boolean>('CORS_CREDENTIALS'),
    });

    this.emailJs = Object.freeze({
      serviceId: this.getValue<string>('EMAILJS_SERVICE_ID'),
      templateApproval: this.getValue<string>('EMAILJS_TEMPLATE_APPROVAL'),
      templateStaffWelcome: this.getValue<string>('EMAILJS_TEMPLATE_STAFF_WELCOME'),
      publicKey: this.getValue<string>('EMAILJS_PUBLIC_KEY'),
      privateKey: this.getValue<string>('EMAILJS_PRIVATE_KEY'),
    });

    this.frontend = Object.freeze({
      baseUrl: this.getValue<string>('FRONTEND_BASE_URL'),
    });
  }

  private getValue<T>(key: keyof EnvironmentVariables): T {
    return this.configService.getOrThrow<T>(key);
  }
}

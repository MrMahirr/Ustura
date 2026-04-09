export type NodeEnvironment = 'development' | 'test' | 'production';

export interface AppConfig {
  port: number;
  nodeEnv: NodeEnvironment;
  apiPrefix: string;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  poolMin: number;
  poolMax: number;
  connectionTimeoutMs: number;
  idleTimeoutMs: number;
}

export interface JwtConfig {
  secret: string;
  accessExpiresIn: string;
  refreshExpiresIn: string;
}

export interface ReservationConfig {
  slotDurationMinutes: number;
  slotSelectionTtlSeconds: number;
  slotLockTtlSeconds: number;
  businessUtcOffset: string;
  businessTimeZone: string;
}

export interface FirebaseConfig {
  projectId: string;
  certsUrl: string;
}

export interface GoogleAuthConfig {
  webClientId: string;
}

export interface RedisConfig {
  host: string;
  port: number;
  password: string;
}

export interface CorsConfig {
  origins: string[];
  credentials: boolean;
}

export interface EnvironmentVariables {
  PORT: number;
  NODE_ENV: NodeEnvironment;
  API_PREFIX: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_POOL_MIN: number;
  DB_POOL_MAX: number;
  DB_CONNECTION_TIMEOUT_MS: number;
  DB_IDLE_TIMEOUT_MS: number;
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_PASSWORD: string;
  JWT_SECRET: string;
  JWT_ACCESS_EXPIRATION: string;
  JWT_REFRESH_EXPIRATION: string;
  FIREBASE_PROJECT_ID: string;
  FIREBASE_CERTS_URL: string;
  GOOGLE_WEB_CLIENT_ID: string;
  CORS_ORIGINS: string[];
  CORS_CREDENTIALS: boolean;
}

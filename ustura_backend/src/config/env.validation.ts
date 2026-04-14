import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { EnvironmentVariables, NodeEnvironment } from './config.types';

type Env = NodeJS.ProcessEnv;

const VALID_NODE_ENVS: NodeEnvironment[] = [
  'development',
  'test',
  'production',
];
const DEFAULT_CORS_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:8081',
  'http://localhost:19006',
];
const DEFAULT_NON_PRODUCTION_JWT_SECRET =
  'ustura-development-jwt-secret-change-before-production';
const DEFAULT_FIREBASE_CERTS_URL =
  'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';

function readOptionalString(env: Env, key: string, fallback = ''): string {
  return env[key]?.trim() ?? fallback;
}

function readPositiveInteger(env: Env, key: string, fallback: number): number {
  const rawValue = env[key]?.trim();

  if (!rawValue) {
    return fallback;
  }

  const parsedValue = Number(rawValue);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    throw new Error(`Environment variable ${key} must be a positive integer.`);
  }

  return parsedValue;
}

function readBoolean(env: Env, key: string, fallback: boolean): boolean {
  const rawValue = env[key]?.trim().toLowerCase();

  if (!rawValue) {
    return fallback;
  }

  if (['true', '1', 'yes'].includes(rawValue)) {
    return true;
  }

  if (['false', '0', 'no'].includes(rawValue)) {
    return false;
  }

  throw new Error(`Environment variable ${key} must be a boolean.`);
}

function readNodeEnvironment(env: Env): NodeEnvironment {
  const rawValue = env.NODE_ENV?.trim();

  if (!rawValue) {
    return 'development';
  }

  if (VALID_NODE_ENVS.includes(rawValue as NodeEnvironment)) {
    return rawValue as NodeEnvironment;
  }

  throw new Error(
    `Environment variable NODE_ENV must be one of: ${VALID_NODE_ENVS.join(', ')}.`,
  );
}

function readCorsOrigins(env: Env): string[] {
  const rawValue = env.CORS_ORIGINS?.trim();
  const origins = (rawValue ? rawValue.split(',') : DEFAULT_CORS_ORIGINS)
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (origins.length === 0) {
    throw new Error(
      'Environment variable CORS_ORIGINS must define at least one origin.',
    );
  }

  return [...new Set(origins)];
}

function validateJwtSecret(secret: string, nodeEnv: NodeEnvironment): string {
  if (nodeEnv !== 'production') {
    return secret;
  }

  if (secret.length < 32 || /change[-_ ]?me/i.test(secret)) {
    throw new Error(
      'Environment variable JWT_SECRET must be a strong non-placeholder secret in production.',
    );
  }

  return secret;
}

function resolveJwtSecret(env: Env, nodeEnv: NodeEnvironment): string {
  const configuredSecret = env.JWT_SECRET?.trim();

  if (configuredSecret) {
    return validateJwtSecret(configuredSecret, nodeEnv);
  }

  if (nodeEnv === 'production') {
    throw new Error('Missing required environment variable: JWT_SECRET');
  }

  return DEFAULT_NON_PRODUCTION_JWT_SECRET;
}

export function validateEnvironment(env: Env): EnvironmentVariables {
  const nodeEnv = readNodeEnvironment(env);
  const poolMin = readPositiveInteger(env, 'DB_POOL_MIN', 2);
  const poolMax = readPositiveInteger(env, 'DB_POOL_MAX', 10);

  if (poolMax < poolMin) {
    throw new Error(
      'Environment variable DB_POOL_MAX must be greater than or equal to DB_POOL_MIN.',
    );
  }

  return {
    PORT: readPositiveInteger(env, 'PORT', 3000),
    NODE_ENV: nodeEnv,
    API_PREFIX: readOptionalString(env, 'API_PREFIX', 'api'),
    DB_HOST: readOptionalString(env, 'DB_HOST', 'localhost'),
    DB_PORT: readPositiveInteger(env, 'DB_PORT', 5432),
    DB_NAME: readOptionalString(env, 'DB_NAME', 'ustura'),
    DB_USER: readOptionalString(env, 'DB_USER', 'postgres'),
    DB_PASSWORD: readOptionalString(env, 'DB_PASSWORD'),
    DB_POOL_MIN: poolMin,
    DB_POOL_MAX: poolMax,
    DB_CONNECTION_TIMEOUT_MS: readPositiveInteger(
      env,
      'DB_CONNECTION_TIMEOUT_MS',
      5000,
    ),
    DB_IDLE_TIMEOUT_MS: readPositiveInteger(env, 'DB_IDLE_TIMEOUT_MS', 30000),
    REDIS_HOST: readOptionalString(env, 'REDIS_HOST', 'localhost'),
    REDIS_PORT: readPositiveInteger(env, 'REDIS_PORT', 6379),
    REDIS_PASSWORD: readOptionalString(env, 'REDIS_PASSWORD'),
    JWT_SECRET: resolveJwtSecret(env, nodeEnv),
    JWT_ACCESS_EXPIRATION: readOptionalString(
      env,
      'JWT_ACCESS_EXPIRATION',
      '15m',
    ),
    JWT_REFRESH_EXPIRATION: readOptionalString(
      env,
      'JWT_REFRESH_EXPIRATION',
      '7d',
    ),
    FIREBASE_PROJECT_ID: readOptionalString(env, 'FIREBASE_PROJECT_ID'),
    FIREBASE_CERTS_URL: readOptionalString(
      env,
      'FIREBASE_CERTS_URL',
      DEFAULT_FIREBASE_CERTS_URL,
    ),
    GOOGLE_WEB_CLIENT_ID: readOptionalString(env, 'GOOGLE_WEB_CLIENT_ID'),
    CORS_ORIGINS: readCorsOrigins(env),
    CORS_CREDENTIALS: readBoolean(env, 'CORS_CREDENTIALS', true),
    // EmailJS Node: Account > Security — enable "Allow EmailJS API for non-browser applications"
    // and set Private Key from the same page (see https://dashboard.emailjs.com/admin/account/security).
    EMAILJS_SERVICE_ID: readOptionalString(env, 'EMAILJS_SERVICE_ID'),
    EMAILJS_TEMPLATE_APPROVAL: readOptionalString(
      env,
      'EMAILJS_TEMPLATE_APPROVAL',
    ),
    EMAILJS_TEMPLATE_STAFF_WELCOME: readOptionalString(
      env,
      'EMAILJS_TEMPLATE_STAFF_WELCOME',
    ),
    EMAILJS_PUBLIC_KEY: readOptionalString(env, 'EMAILJS_PUBLIC_KEY'),
    EMAILJS_PRIVATE_KEY: readOptionalString(env, 'EMAILJS_PRIVATE_KEY'),
    FRONTEND_BASE_URL: readOptionalString(
      env,
      'FRONTEND_BASE_URL',
      'http://localhost:8081',
    ),
  };
}

export function resolveEnvFilePaths(cwd = process.cwd()): string[] {
  const candidates = [
    join(cwd, '.env.local'),
    join(cwd, '.env'),
    join(cwd, '..', '.env.local'),
    join(cwd, '..', '.env'),
  ];

  return candidates.filter((path, index, allPaths) => {
    return allPaths.indexOf(path) === index && existsSync(path);
  });
}

function parseEnvValue(rawValue: string): string {
  const trimmedValue = rawValue.trim();

  if (
    (trimmedValue.startsWith('"') && trimmedValue.endsWith('"')) ||
    (trimmedValue.startsWith("'") && trimmedValue.endsWith("'"))
  ) {
    return trimmedValue.slice(1, -1);
  }

  return trimmedValue;
}

export function applyEnvFileOverrides(
  envFilePaths = resolveEnvFilePaths(),
): void {
  for (const envFilePath of [...envFilePaths].reverse()) {
    const fileContents = readFileSync(envFilePath, 'utf8');
    const lines = fileContents.split(/\r?\n/u);

    for (const line of lines) {
      const trimmedLine = line.trim();

      if (!trimmedLine || trimmedLine.startsWith('#')) {
        continue;
      }

      const separatorIndex = trimmedLine.indexOf('=');

      if (separatorIndex <= 0) {
        continue;
      }

      const key = trimmedLine.slice(0, separatorIndex).trim();

      if (!key) {
        continue;
      }

      const rawValue = trimmedLine.slice(separatorIndex + 1);
      process.env[key] = parseEnvValue(rawValue);
    }
  }
}

import { validateEnvironment } from './env.validation';

describe('validateEnvironment', () => {
  const validEnvironment: NodeJS.ProcessEnv = {
    PORT: '3001',
    NODE_ENV: 'development',
    API_PREFIX: 'api',
    DB_HOST: 'localhost',
    DB_PORT: '5432',
    DB_NAME: 'ustura',
    DB_USER: 'postgres',
    DB_PASSWORD: '',
    DB_POOL_MIN: '2',
    DB_POOL_MAX: '10',
    DB_CONNECTION_TIMEOUT_MS: '5000',
    DB_IDLE_TIMEOUT_MS: '30000',
    REDIS_HOST: 'localhost',
    REDIS_PORT: '6379',
    REDIS_PASSWORD: '',
    JWT_SECRET: 'development-only-secret',
    JWT_ACCESS_EXPIRATION: '15m',
    JWT_REFRESH_EXPIRATION: '7d',
    FIREBASE_PROJECT_ID: '',
    FIREBASE_CERTS_URL:
      'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com',
    CORS_ORIGINS: 'http://localhost:3000, http://localhost:8081',
    CORS_CREDENTIALS: 'true',
  };

  it('maps raw env values into typed configuration primitives', () => {
    const result = validateEnvironment(validEnvironment);

    expect(result).toEqual({
      PORT: 3001,
      NODE_ENV: 'development',
      API_PREFIX: 'api',
      DB_HOST: 'localhost',
      DB_PORT: 5432,
      DB_NAME: 'ustura',
      DB_USER: 'postgres',
      DB_PASSWORD: '',
      DB_POOL_MIN: 2,
      DB_POOL_MAX: 10,
      DB_CONNECTION_TIMEOUT_MS: 5000,
      DB_IDLE_TIMEOUT_MS: 30000,
      REDIS_HOST: 'localhost',
      REDIS_PORT: 6379,
      REDIS_PASSWORD: '',
      JWT_SECRET: 'development-only-secret',
      JWT_ACCESS_EXPIRATION: '15m',
      JWT_REFRESH_EXPIRATION: '7d',
      FIREBASE_PROJECT_ID: '',
      FIREBASE_CERTS_URL:
        'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com',
      CORS_ORIGINS: ['http://localhost:3000', 'http://localhost:8081'],
      CORS_CREDENTIALS: true,
    });
  });

  it('rejects inverted database pool bounds', () => {
    expect(() =>
      validateEnvironment({
        ...validEnvironment,
        DB_POOL_MIN: '5',
        DB_POOL_MAX: '4',
      }),
    ).toThrow('DB_POOL_MAX');
  });

  it('rejects placeholder jwt secrets in production', () => {
    expect(() =>
      validateEnvironment({
        ...validEnvironment,
        NODE_ENV: 'production',
        JWT_SECRET: 'change-me-in-production',
      }),
    ).toThrow('JWT_SECRET');
  });
});

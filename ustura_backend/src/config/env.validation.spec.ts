import { validateEnvironment } from './env.validation';

describe('validateEnvironment', () => {
  it('rejects missing JWT_SECRET in production', () => {
    expect(() =>
      validateEnvironment({
        NODE_ENV: 'production',
      }),
    ).toThrow('Missing required environment variable: JWT_SECRET');
  });

  it('allows the development fallback secret outside production', () => {
    const result = validateEnvironment({
      NODE_ENV: 'development',
    });

    expect(result.JWT_SECRET).toBe(
      'ustura-development-jwt-secret-change-before-production',
    );
  });
});

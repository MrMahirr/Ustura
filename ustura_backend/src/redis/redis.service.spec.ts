import type { AppConfigService } from '../config/config.service';
import { RedisService } from './redis.service';

class TestRedisService extends RedisService {
  constructor(
    configService: AppConfigService,
    private readonly connectError?: Error,
  ) {
    super(configService);
  }

  protected createNetworkClient(): any {
    return {
      status: 'wait',
      connect: async () => {
        if (this.connectError) {
          throw this.connectError;
        }
      },
      ping: async () => 'PONG',
      set: async () => 'OK',
      get: async () => null,
      mget: async () => [],
      keys: async () => [],
      eval: async () => 0,
      quit: async () => undefined,
      disconnect: () => undefined,
      on: () => undefined,
    };
  }
}

function createConfigService(
  nodeEnv: 'development' | 'production',
): AppConfigService {
  return {
    app: {
      port: 3000,
      nodeEnv,
      apiPrefix: 'api',
    },
    redis: {
      host: 'localhost',
      port: 6379,
      password: 'secret',
    },
  } as AppConfigService;
}

describe('RedisService', () => {
  it('falls back to the in-memory client when Redis is unavailable in development', async () => {
    const service = new TestRedisService(
      createConfigService('development'),
      new Error('connect ECONNREFUSED'),
    );

    await service.connect();

    expect(service.isUsingMemoryFallback()).toBe(true);
    await expect(service.getClient().ping()).resolves.toBe('PONG');
    await expect(
      service.getClient().set('lock-key', 'token', 'EX', 5, 'NX'),
    ).resolves.toBe('OK');
    await expect(
      service.getClient().set('lock-key', 'other-token', 'EX', 5, 'NX'),
    ).resolves.toBeNull();
    await expect(
      service.getClient().eval(
        `
          if redis.call("GET", KEYS[1]) == ARGV[1] then
            return redis.call("DEL", KEYS[1])
          end
          return 0
        `,
        1,
        'lock-key',
        'token',
      ),
    ).resolves.toBe(1);
  });

  it('keeps Redis mandatory in production', async () => {
    const service = new TestRedisService(
      createConfigService('production'),
      new Error('connect ECONNREFUSED'),
    );

    await expect(service.connect()).rejects.toThrow('connect ECONNREFUSED');
    expect(service.isUsingMemoryFallback()).toBe(false);
  });
});

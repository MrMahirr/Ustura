import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { AppConfigService } from '../config/config.service';

export interface RedisClientLike {
  ping(): Promise<string>;
  set(
    key: string,
    value: string,
    mode?: 'EX',
    durationSeconds?: number,
    condition?: 'NX',
  ): Promise<string | null>;
  get(key: string): Promise<string | null>;
  mget(keys: string[]): Promise<(string | null)[]>;
  keys(pattern: string): Promise<string[]>;
  eval(
    script: string,
    numberOfKeys: number,
    ...args: string[]
  ): Promise<number>;
  quit(): Promise<void>;
}

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private networkClient?: Redis;
  private clientAdapter?: RedisClientLike;
  private memoryFallbackClient?: InMemoryRedisClient;
  private usingMemoryFallback = false;

  constructor(private readonly configService: AppConfigService) {}

  getClient(): RedisClientLike {
    if (this.usingMemoryFallback) {
      return this.getMemoryFallbackClient();
    }

    if (!this.clientAdapter) {
      const client = this.createNetworkClient();
      this.networkClient = client;
      this.clientAdapter = new RedisClientAdapter(client);
    }

    return this.clientAdapter;
  }

  isUsingMemoryFallback(): boolean {
    return this.usingMemoryFallback;
  }

  async connect(): Promise<void> {
    if (this.usingMemoryFallback) {
      return;
    }

    const client = this.getOrCreateNetworkClient();

    try {
      if (client.status === 'wait' || client.status === 'end') {
        await client.connect();
      }
    } catch (error) {
      if (this.configService.app.nodeEnv === 'production') {
        throw error;
      }

      this.activateMemoryFallback(error);
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.networkClient) {
      this.networkClient.disconnect(false);
      this.networkClient = undefined;
      this.clientAdapter = undefined;
    }

    if (this.memoryFallbackClient) {
      await this.memoryFallbackClient.quit();
      this.memoryFallbackClient = undefined;
    }
  }

  protected createNetworkClient(): Redis {
    const client = new Redis({
      host: this.configService.redis.host,
      port: this.configService.redis.port,
      password: this.configService.redis.password || undefined,
      lazyConnect: true,
      maxRetriesPerRequest: 2,
      retryStrategy:
        this.configService.app.nodeEnv === 'production'
          ? undefined
          : () => null,
    });

    client.on('error', (error) => {
      if (this.usingMemoryFallback) {
        return;
      }

      this.logger.error('Unexpected Redis client error.', error.stack);
    });

    return client;
  }

  private getOrCreateNetworkClient(): Redis {
    if (this.networkClient) {
      return this.networkClient;
    }

    const client = this.createNetworkClient();
    this.networkClient = client;
    this.clientAdapter = new RedisClientAdapter(client);

    return client;
  }

  private getMemoryFallbackClient(): InMemoryRedisClient {
    if (!this.memoryFallbackClient) {
      this.memoryFallbackClient = new InMemoryRedisClient();
    }

    return this.memoryFallbackClient;
  }

  private activateMemoryFallback(cause: unknown): void {
    if (this.usingMemoryFallback) {
      return;
    }

    this.usingMemoryFallback = true;

    if (this.networkClient) {
      this.networkClient.disconnect(false);
      this.networkClient = undefined;
      this.clientAdapter = undefined;
    }

    this.logger.warn(
      `Redis is unavailable in ${this.configService.app.nodeEnv}; using in-memory fallback. ${
        cause instanceof Error ? cause.message : String(cause)
      }`,
    );
  }
}

class RedisClientAdapter implements RedisClientLike {
  constructor(private readonly client: Redis) {}

  ping(): Promise<string> {
    return this.client.ping();
  }

  set(
    key: string,
    value: string,
    mode?: 'EX',
    durationSeconds?: number,
    condition?: 'NX',
  ): Promise<string | null> {
    if (mode && durationSeconds !== undefined && condition) {
      return this.client.set(key, value, mode, durationSeconds, condition);
    }

    if (mode && durationSeconds !== undefined) {
      return this.client.set(key, value, mode, durationSeconds);
    }

    return this.client.set(key, value);
  }

  get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  mget(keys: string[]): Promise<(string | null)[]> {
    return this.client.mget(keys);
  }

  keys(pattern: string): Promise<string[]> {
    return this.client.keys(pattern);
  }

  async eval(
    script: string,
    numberOfKeys: number,
    ...args: string[]
  ): Promise<number> {
    const result = await this.client.eval(script, numberOfKeys, ...args);
    return typeof result === 'number' ? result : Number(result);
  }

  async quit(): Promise<void> {
    await this.client.quit();
  }
}

class InMemoryRedisClient implements RedisClientLike {
  private readonly store = new Map<string, InMemoryEntry>();

  async ping(): Promise<string> {
    return 'PONG';
  }

  async set(
    key: string,
    value: string,
    mode?: 'EX',
    durationSeconds?: number,
    condition?: 'NX',
  ): Promise<string | null> {
    this.purgeExpiredKey(key);

    if (condition === 'NX' && this.store.has(key)) {
      return null;
    }

    const expiresAt =
      mode === 'EX' && durationSeconds !== undefined
        ? Date.now() + durationSeconds * 1000
        : null;

    this.store.set(key, {
      value,
      expiresAt,
    });

    return 'OK';
  }

  async get(key: string): Promise<string | null> {
    this.purgeExpiredKey(key);
    return this.store.get(key)?.value ?? null;
  }

  async mget(keys: string[]): Promise<(string | null)[]> {
    return Promise.all(keys.map((key) => this.get(key)));
  }

  async keys(pattern: string): Promise<string[]> {
    this.purgeExpiredEntries();
    const regex = new RegExp(
      `^${pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\*/g, '.*')}$`,
    );

    return [...this.store.keys()].filter((key) => regex.test(key));
  }

  async eval(
    script: string,
    numberOfKeys: number,
    ...args: string[]
  ): Promise<number> {
    const keys = args.slice(0, numberOfKeys);
    const values = args.slice(numberOfKeys);
    const key = keys[0];
    const expectedValue = values[0];

    if (!key || expectedValue === undefined) {
      return 0;
    }

    const currentValue = await this.get(key);

    if (!currentValue) {
      return 0;
    }

    if (script.includes('cjson.decode')) {
      try {
        const parsedValue = JSON.parse(currentValue) as { holderId?: string };

        if (parsedValue.holderId !== expectedValue) {
          return 0;
        }
      } catch {
        return 0;
      }
    } else if (currentValue !== expectedValue) {
      return 0;
    }

    this.store.delete(key);
    return 1;
  }

  async quit(): Promise<void> {
    this.store.clear();
  }

  private purgeExpiredEntries(): void {
    for (const key of this.store.keys()) {
      this.purgeExpiredKey(key);
    }
  }

  private purgeExpiredKey(key: string): void {
    const entry = this.store.get(key);

    if (!entry) {
      return;
    }

    if (entry.expiresAt !== null && entry.expiresAt <= Date.now()) {
      this.store.delete(key);
    }
  }
}

interface InMemoryEntry {
  value: string;
  expiresAt: number | null;
}

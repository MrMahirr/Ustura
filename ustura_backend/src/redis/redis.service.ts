import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { AppConfigService } from '../config/config.service';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client?: Redis;

  constructor(private readonly configService: AppConfigService) {}

  getClient(): Redis {
    if (this.client) {
      return this.client;
    }

    this.client = new Redis({
      host: this.configService.redis.host,
      port: this.configService.redis.port,
      password: this.configService.redis.password || undefined,
      lazyConnect: true,
      maxRetriesPerRequest: 2,
    });

    this.client.on('error', (error) => {
      this.logger.error('Unexpected Redis client error.', error.stack);
    });

    return this.client;
  }

  async connect(): Promise<void> {
    const client = this.getClient();

    if (client.status === 'wait') {
      await client.connect();
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (!this.client) {
      return;
    }

    await this.client.quit();
    this.client = undefined;
  }
}

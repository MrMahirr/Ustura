// TODO: Redis bağlantı konfigürasyonu
export const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT, 10) || 6380,
  password: process.env.REDIS_PASSWORD || '',
};

// TODO: JWT konfigürasyonu
export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'change-me-in-production',
  accessExpiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
};

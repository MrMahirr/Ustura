import { apiRequest } from './api';

export interface PlatformGeneralSettings {
  platformName: string;
  apiPrefix: string;
  nodeEnv: string;
  port: number;
  frontendUrl: string;
  corsOrigins: string[];
  corsCredentials: boolean;
}

export interface PlatformSecuritySettings {
  jwtAccessExpiration: string;
  jwtRefreshExpiration: string;
  rateLimitTtl: number;
  rateLimitMax: number;
}

export interface PlatformEmailSettings {
  serviceId: string | null;
  templateApproval: string | null;
  templateStaffWelcome: string | null;
  hasPublicKey: boolean;
  hasPrivateKey: boolean;
}

export interface PlatformReservationSettings {
  slotDurationMinutes: number;
  slotSelectionTtlSeconds: number;
  slotLockTtlSeconds: number;
  businessTimeZone: string;
  businessUtcOffset: string;
}

export interface PlatformIntegrationSettings {
  firebaseProjectId: string | null;
  googleWebClientId: string | null;
  redisHost: string | null;
  redisPort: number | null;
  databaseHost: string | null;
  databasePort: number | null;
  databaseName: string | null;
}

export interface PlatformSettings {
  general: PlatformGeneralSettings;
  security: PlatformSecuritySettings;
  email: PlatformEmailSettings;
  reservation: PlatformReservationSettings;
  integrations: PlatformIntegrationSettings;
}

export class PlatformSettingsService {
  static async getSettings(): Promise<PlatformSettings> {
    return apiRequest<PlatformSettings>({
      path: '/admin/platform-settings',
      method: 'GET',
      auth: true,
    });
  }
}

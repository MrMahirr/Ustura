import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../../config/config.service';
import type { GoogleWebIdentity } from './interfaces/auth.types';
import {
  googleAccessTokenInvalidError,
  googleVerificationUnavailableError,
  googleWebNotConfiguredError,
} from './errors/auth.errors';

interface GoogleAccessTokenInfo {
  aud?: string;
  audience?: string;
  email?: string;
  email_verified?: boolean | string;
  expires_in?: number | string;
  issued_to?: string;
  scope?: string;
}

interface GoogleUserInfoResponse {
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
  sub?: string;
}

@Injectable()
export class GoogleWebTokenVerifierService {
  constructor(private readonly configService: AppConfigService) {}

  async verifyCustomerAccessToken(
    accessToken: string,
  ): Promise<GoogleWebIdentity> {
    const configuredClientId = this.configService.google.webClientId.trim();

    if (!configuredClientId) {
      throw googleWebNotConfiguredError();
    }

    const tokenInfo = await this.fetchJson<GoogleAccessTokenInfo>(
      `https://oauth2.googleapis.com/tokeninfo?access_token=${encodeURIComponent(accessToken)}`,
    );
    const tokenAudience =
      tokenInfo.audience ?? tokenInfo.aud ?? tokenInfo.issued_to;

    if (tokenAudience !== configuredClientId) {
      throw googleAccessTokenInvalidError();
    }

    const userInfo = await this.fetchJson<GoogleUserInfoResponse>(
      'https://openidconnect.googleapis.com/v1/userinfo',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (
      typeof userInfo.sub !== 'string' ||
      userInfo.sub.trim().length === 0 ||
      typeof userInfo.email !== 'string' ||
      userInfo.email.trim().length === 0 ||
      !userInfo.email_verified
    ) {
      throw googleAccessTokenInvalidError();
    }

    const normalizedEmail = userInfo.email.trim().toLowerCase();
    const normalizedName =
      typeof userInfo.name === 'string' && userInfo.name.trim().length > 0
        ? userInfo.name.trim()
        : normalizedEmail.split('@')[0];

    return {
      googleSubject: userInfo.sub.trim(),
      email: normalizedEmail,
      name: normalizedName,
      ...(typeof userInfo.picture === 'string' && userInfo.picture.trim().length
        ? { pictureUrl: userInfo.picture.trim() }
        : {}),
    };
  }

  private async fetchJson<T>(
    input: string,
    init?: RequestInit,
  ): Promise<T> {
    let response: Response;

    try {
      response = await fetch(input, init);
    } catch {
      throw googleVerificationUnavailableError();
    }

    if (!response.ok) {
      if (response.status === 400 || response.status === 401) {
        throw googleAccessTokenInvalidError();
      }

      throw googleVerificationUnavailableError();
    }

    return (await response.json()) as T;
  }
}

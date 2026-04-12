import { createVerify } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../../config/config.service';
import type { FirebaseGoogleIdentity } from './interfaces/auth.types';
import {
  firebaseCertificatesInvalidError,
  firebaseCertificatesUnavailableError,
  firebaseGoogleNotConfiguredError,
  googleIdentityTokenInvalidError,
} from './errors/auth.errors';

interface FirebaseCertCache {
  certificates: Record<string, string>;
  expiresAt: number;
}

interface JwtHeader {
  alg?: string;
  kid?: string;
}

interface FirebaseJwtPayload {
  aud?: string;
  email?: string;
  email_verified?: boolean;
  exp?: number;
  firebase?: {
    sign_in_provider?: string;
  };
  iat?: number;
  iss?: string;
  name?: string;
  picture?: string;
  sub?: string;
}

@Injectable()
export class FirebaseTokenVerifierService {
  private certificateCache: FirebaseCertCache | null = null;

  constructor(private readonly configService: AppConfigService) {}

  async verifyGoogleCustomerToken(
    idToken: string,
  ): Promise<FirebaseGoogleIdentity> {
    const projectId = this.configService.firebase.projectId;

    if (!projectId) {
      throw firebaseGoogleNotConfiguredError();
    }

    const [encodedHeader, encodedPayload, encodedSignature] =
      idToken.split('.');

    if (!encodedHeader || !encodedPayload || !encodedSignature) {
      throw googleIdentityTokenInvalidError();
    }

    const header = this.parseJwtPart<JwtHeader>(encodedHeader, 'header');
    const payload = this.parseJwtPart<FirebaseJwtPayload>(
      encodedPayload,
      'payload',
    );

    if (header.alg !== 'RS256' || typeof header.kid !== 'string') {
      throw googleIdentityTokenInvalidError();
    }

    const certificates = await this.getCertificates();
    const certificate = certificates[header.kid];

    if (!certificate) {
      throw googleIdentityTokenInvalidError();
    }

    const verifier = createVerify('RSA-SHA256');
    verifier.update(`${encodedHeader}.${encodedPayload}`);
    verifier.end();

    const isSignatureValid = verifier.verify(
      certificate,
      this.decodeBase64Url(encodedSignature),
    );

    if (!isSignatureValid) {
      throw googleIdentityTokenInvalidError();
    }

    const nowInSeconds = Math.floor(Date.now() / 1000);

    if (
      payload.aud !== projectId ||
      payload.iss !== `https://securetoken.google.com/${projectId}` ||
      typeof payload.exp !== 'number' ||
      payload.exp <= nowInSeconds ||
      typeof payload.iat !== 'number' ||
      payload.iat > nowInSeconds + 60 ||
      typeof payload.sub !== 'string' ||
      payload.sub.trim().length === 0 ||
      payload.sub.length > 128 ||
      typeof payload.email !== 'string' ||
      !payload.email_verified ||
      payload.firebase?.sign_in_provider !== 'google.com'
    ) {
      throw googleIdentityTokenInvalidError();
    }

    const normalizedEmail = payload.email.trim().toLowerCase();
    const normalizedName =
      typeof payload.name === 'string' && payload.name.trim().length > 0
        ? payload.name.trim()
        : normalizedEmail.split('@')[0];

    return {
      firebaseUid: payload.sub.trim(),
      email: normalizedEmail,
      name: normalizedName,
      ...(typeof payload.picture === 'string' &&
      payload.picture.trim().length > 0
        ? { pictureUrl: payload.picture.trim() }
        : {}),
    };
  }

  private async getCertificates(): Promise<Record<string, string>> {
    if (this.certificateCache && this.certificateCache.expiresAt > Date.now()) {
      return this.certificateCache.certificates;
    }

    let response: Response;

    try {
      response = await fetch(this.configService.firebase.certsUrl);
    } catch {
      throw firebaseCertificatesUnavailableError();
    }

    if (!response.ok) {
      throw firebaseCertificatesUnavailableError();
    }

    const body = (await response.json()) as unknown;

    if (!this.isCertificateMap(body)) {
      throw firebaseCertificatesInvalidError();
    }

    const maxAge = this.extractMaxAge(response.headers.get('cache-control'));
    this.certificateCache = {
      certificates: body,
      expiresAt: Date.now() + maxAge * 1000,
    };

    return body;
  }

  private parseJwtPart<T>(segment: string, partName: string): T {
    try {
      const decodedText = this.decodeBase64Url(segment).toString('utf8');
      return JSON.parse(decodedText) as T;
    } catch {
      throw googleIdentityTokenInvalidError(
        `Google identity token ${partName} is invalid.`,
      );
    }
  }

  private decodeBase64Url(value: string): Buffer {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const paddingLength = (4 - (normalized.length % 4)) % 4;
    return Buffer.from(`${normalized}${'='.repeat(paddingLength)}`, 'base64');
  }

  private extractMaxAge(cacheControlHeader: string | null): number {
    if (!cacheControlHeader) {
      return 3600;
    }

    const maxAgeDirective = cacheControlHeader
      .split(',')
      .map((segment) => segment.trim())
      .find((segment) => segment.startsWith('max-age='));

    if (!maxAgeDirective) {
      return 3600;
    }

    const parsed = Number(maxAgeDirective.split('=')[1]);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 3600;
  }

  private isCertificateMap(value: unknown): value is Record<string, string> {
    return (
      typeof value === 'object' &&
      value !== null &&
      Object.values(value).every(
        (certificate) => typeof certificate === 'string',
      )
    );
  }
}

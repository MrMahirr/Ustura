import type { JwtPayload } from '../../../shared/auth/jwt-payload.interface';
import type { PrincipalKind } from '../../../shared/auth/principal-kind.enum';
import type { UserProfile } from '../../user/interfaces/user.types';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: string;
  refreshTokenExpiresIn: string;
}

export interface AuthSessionResponse {
  user: UserProfile;
  tokens: AuthTokens;
}

export interface RefreshTokenRecord {
  id: string;
  principalId: string;
  principalKind: PrincipalKind;
  tokenHash: string;
  expiresAt: Date;
  revoked: boolean;
  revokedAt: Date | null;
  userAgent: string | null;
  ipAddress: string | null;
  rotatedFrom: string | null;
  createdAt: Date;
}

export interface SessionClientContext {
  userAgent?: string | null;
  ipAddress?: string | null;
}

export interface VerifiedRefreshToken extends JwtPayload {
  tokenType: 'refresh';
}

export interface FirebaseGoogleIdentity {
  firebaseUid: string;
  email: string;
  name: string;
  pictureUrl?: string;
}

export interface GoogleWebIdentity {
  googleSubject: string;
  email: string;
  name: string;
  pictureUrl?: string;
}

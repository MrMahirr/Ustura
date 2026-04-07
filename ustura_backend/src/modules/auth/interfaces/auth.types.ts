import type { JwtPayload } from '../../../common/interfaces/jwt-payload.interface';
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
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  revoked: boolean;
  createdAt: Date;
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

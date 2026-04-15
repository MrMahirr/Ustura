import { PrincipalKind } from './principal-kind.enum';
import { Role } from './role.enum';

export type JwtTokenType = 'access' | 'refresh';

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
  /** Present on tokens issued after identity split; older tokens may omit it. */
  principalKind?: PrincipalKind;
  /** Personnel: first-login password rotation required until cleared in DB. */
  mustChangePassword?: boolean;
  tokenType: JwtTokenType;
  iat?: number;
  exp?: number;
}

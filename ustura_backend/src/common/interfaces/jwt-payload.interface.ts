import { Role } from '../enums/role.enum';

export type JwtTokenType = 'access' | 'refresh';

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
  tokenType: JwtTokenType;
  iat?: number;
  exp?: number;
}

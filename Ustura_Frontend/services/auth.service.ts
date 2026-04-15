import { apiRequest } from '@/services/api';

/** Backend `PrincipalKind` — login isteğinde hangi kimlik tablosunda aranacağını belirler. */
export type PrincipalKind = 'customer' | 'personnel' | 'platform_admin';

export type SessionRole = 'customer' | 'owner' | 'barber' | 'receptionist' | 'super_admin';

export interface SessionTokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: string;
  refreshTokenExpiresIn: string;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: SessionRole;
  isActive: boolean;
  /** Backend: otomatik personel sifresi sonrasi true. */
  mustChangePassword?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  user: SessionUser;
  tokens: SessionTokens;
}

export type CustomerSession = AuthSession;

interface GoogleCustomerWebConfiguration {
  clientId: string | null;
}

interface RegisterCustomerPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface LoginWithPasswordPayload {
  email: string;
  password: string;
  /** Verilmezse backend müşteri kabul eder; personel ve süper admin için zorunlu. */
  principalKind?: PrincipalKind;
}

interface LoginCustomerWithGoogleWebPayload {
  accessToken: string;
}

interface RefreshSessionPayload {
  refreshToken: string;
}

interface LogoutPayload {
  refreshToken: string;
}

export async function registerCustomer(payload: RegisterCustomerPayload) {
  return apiRequest<AuthSession, RegisterCustomerPayload>({
    path: '/auth/register',
    method: 'POST',
    body: payload,
  });
}

export async function loginWithPassword(payload: LoginWithPasswordPayload) {
  return apiRequest<AuthSession, LoginWithPasswordPayload>({
    path: '/auth/login',
    method: 'POST',
    body: payload,
  });
}

export async function loginCustomer(payload: LoginWithPasswordPayload) {
  return loginWithPassword({
    ...payload,
    principalKind: payload.principalKind ?? 'customer',
  });
}

export async function getGoogleCustomerWebConfiguration() {
  return apiRequest<GoogleCustomerWebConfiguration>({
    path: '/auth/google/customer/web/config',
    method: 'GET',
  });
}

export async function loginCustomerWithGoogleWeb(
  payload: LoginCustomerWithGoogleWebPayload,
) {
  return apiRequest<AuthSession, LoginCustomerWithGoogleWebPayload>({
    path: '/auth/google/customer/web',
    method: 'POST',
    body: payload,
  });
}

export async function refreshSession(refreshToken: string) {
  return apiRequest<AuthSession, RefreshSessionPayload>({
    path: '/auth/refresh',
    method: 'POST',
    body: { refreshToken },
    retryOnUnauthorized: false,
  });
}

export async function refreshCustomerSession(refreshToken: string) {
  return refreshSession(refreshToken);
}

export async function logoutSession(refreshToken: string) {
  return apiRequest<{ success: boolean }, LogoutPayload>({
    path: '/auth/logout',
    method: 'POST',
    body: { refreshToken },
    auth: true,
  });
}

interface ChangeAuthenticatedPasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export async function changeAuthenticatedPassword(
  payload: ChangeAuthenticatedPasswordPayload,
) {
  return apiRequest<AuthSession, ChangeAuthenticatedPasswordPayload>({
    path: '/auth/password/change',
    method: 'POST',
    body: payload,
    auth: true,
  });
}

export async function logoutCustomerSession(refreshToken: string) {
  return logoutSession(refreshToken);
}

import { apiRequest } from '@/services/api';

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
  createdAt: string;
  updatedAt: string;
}

export interface CustomerSession {
  user: SessionUser;
  tokens: SessionTokens;
}

interface GoogleCustomerWebConfiguration {
  clientId: string | null;
}

interface RegisterCustomerPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface LoginCustomerPayload {
  email: string;
  password: string;
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
  return apiRequest<CustomerSession, RegisterCustomerPayload>({
    path: '/auth/register',
    method: 'POST',
    body: payload,
  });
}

export async function loginCustomer(payload: LoginCustomerPayload) {
  return apiRequest<CustomerSession, LoginCustomerPayload>({
    path: '/auth/login',
    method: 'POST',
    body: payload,
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
  return apiRequest<CustomerSession, LoginCustomerWithGoogleWebPayload>({
    path: '/auth/google/customer/web',
    method: 'POST',
    body: payload,
  });
}

export async function refreshCustomerSession(refreshToken: string) {
  return apiRequest<CustomerSession, RefreshSessionPayload>({
    path: '/auth/refresh',
    method: 'POST',
    body: { refreshToken },
    retryOnUnauthorized: false,
  });
}

export async function logoutCustomerSession(refreshToken: string) {
  return apiRequest<{ success: boolean }, LogoutPayload>({
    path: '/auth/logout',
    method: 'POST',
    body: { refreshToken },
    auth: true,
  });
}

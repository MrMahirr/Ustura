import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';

import { configureApiAuth } from '@/services/api';
import {
  getGoogleCustomerWebConfiguration,
  loginCustomer,
  loginCustomerWithGoogleWeb,
  logoutCustomerSession,
  refreshCustomerSession,
  registerCustomer,
  type CustomerSession,
  type SessionTokens,
} from '@/services/auth.service';
import {
  preloadGoogleWebIdentityClient,
  requestGoogleWebAccessToken,
} from '@/services/google-auth.service';

export type AuthUserRole = 'customer';

export interface AuthUser {
  id: string;
  fullName: string;
  initials: string;
  identifier: string;
  email?: string;
  phone?: string;
  role: AuthUserRole;
}

export interface LoginInput {
  identifier: string;
  password: string;
}

export interface RegistrationInput {
  fullName: string;
  phone: string;
  email: string;
  password: string;
}

interface StoredSession {
  user: AuthUser;
  tokens: SessionTokens;
}

interface AuthContextValue {
  user: AuthUser | null;
  role: AuthUserRole | null;
  isAuthenticated: boolean;
  isGoogleLoginLoading: boolean;
  login: (input: LoginInput) => Promise<AuthUser>;
  loginWithGoogle: () => Promise<AuthUser>;
  register: (input: RegistrationInput) => Promise<AuthUser>;
  logout: () => Promise<void>;
}

const STORAGE_KEY = 'ustura-auth-session';

const AuthContext = createContext<AuthContextValue>({
  user: null,
  role: null,
  isAuthenticated: false,
  isGoogleLoginLoading: false,
  login: async () => {
    throw new Error('AuthContext hazir degil.');
  },
  loginWithGoogle: async () => {
    throw new Error('AuthContext hazir degil.');
  },
  register: async () => {
    throw new Error('AuthContext hazir degil.');
  },
  logout: async () => {},
});

let nativeSessionFallback: StoredSession | null = null;

function normalizeWhitespace(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}

function normalizeEmail(value: string) {
  return normalizeWhitespace(value).toLocaleLowerCase('tr-TR');
}

function createInitials(fullName: string) {
  const segments = normalizeWhitespace(fullName).split(' ').filter(Boolean);

  if (segments.length === 0) {
    return 'UM';
  }

  return segments
    .slice(0, 2)
    .map((segment) => segment.charAt(0).toLocaleUpperCase('tr-TR'))
    .join('');
}

function isSessionTokens(value: unknown): value is SessionTokens {
  if (typeof value !== 'object' || value == null) {
    return false;
  }

  const candidate = value as Partial<SessionTokens>;

  return (
    typeof candidate.accessToken === 'string' &&
    typeof candidate.refreshToken === 'string' &&
    typeof candidate.accessTokenExpiresIn === 'string' &&
    typeof candidate.refreshTokenExpiresIn === 'string'
  );
}

function isAuthUser(value: unknown): value is AuthUser {
  if (typeof value !== 'object' || value == null) {
    return false;
  }

  const candidate = value as Partial<AuthUser>;

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.fullName === 'string' &&
    typeof candidate.initials === 'string' &&
    typeof candidate.identifier === 'string' &&
    candidate.role === 'customer'
  );
}

function isStoredSession(value: unknown): value is StoredSession {
  if (typeof value !== 'object' || value == null) {
    return false;
  }

  const candidate = value as Partial<StoredSession>;
  return isAuthUser(candidate.user) && isSessionTokens(candidate.tokens);
}

function readStoredSession() {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    try {
      const storedValue = window.localStorage.getItem(STORAGE_KEY);

      if (!storedValue) {
        return null;
      }

      const parsedValue = JSON.parse(storedValue);
      return isStoredSession(parsedValue) ? parsedValue : null;
    } catch {
      return null;
    }
  }

  return nativeSessionFallback;
}

function writeStoredSession(session: StoredSession | null) {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    if (session == null) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    return;
  }

  nativeSessionFallback = session;
}

function mapCustomerSession(session: CustomerSession): StoredSession {
  const normalizedFullName = normalizeWhitespace(session.user.name) || 'Ustura Musterisi';
  const normalizedEmail = normalizeEmail(session.user.email);
  const normalizedPhone = normalizeWhitespace(session.user.phone ?? '');

  return {
    user: {
      id: session.user.id,
      fullName: normalizedFullName,
      initials: createInitials(normalizedFullName),
      identifier: normalizedEmail,
      email: normalizedEmail,
      phone: normalizedPhone || undefined,
      role: 'customer',
    },
    tokens: session.tokens,
  };
}

function clearCurrentSession(
  setSession: React.Dispatch<React.SetStateAction<StoredSession | null>>,
  sessionRef: React.MutableRefObject<StoredSession | null>,
) {
  sessionRef.current = null;
  writeStoredSession(null);
  setSession(null);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<StoredSession | null>(readStoredSession);
  const [googleWebClientId, setGoogleWebClientId] = useState<string | null>(null);
  const [isGoogleLoginLoading, setIsGoogleLoginLoading] = useState(
    Platform.OS === 'web'
  );
  const sessionRef = useRef<StoredSession | null>(session);

  useEffect(() => {
    sessionRef.current = session;
    writeStoredSession(session);
  }, [session]);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      setIsGoogleLoginLoading(false);
      return;
    }

    let isActive = true;

    setIsGoogleLoginLoading(true);

    void Promise.allSettled([
      getGoogleCustomerWebConfiguration(),
      preloadGoogleWebIdentityClient(),
    ]).then(([configurationResult]) => {
      if (!isActive) {
        return;
      }

      if (configurationResult.status === 'fulfilled') {
        const nextClientId = configurationResult.value.clientId?.trim() ?? '';
        setGoogleWebClientId(nextClientId || null);
      } else {
        setGoogleWebClientId(null);
      }

      setIsGoogleLoginLoading(false);
    });

    return () => {
      isActive = false;
    };
  }, []);

  const refreshSession = React.useCallback(async () => {
    const currentRefreshToken = sessionRef.current?.tokens.refreshToken;

    if (!currentRefreshToken) {
      clearCurrentSession(setSession, sessionRef);
      return false;
    }

    try {
      const nextSession = mapCustomerSession(
        await refreshCustomerSession(currentRefreshToken),
      );
      sessionRef.current = nextSession;
      setSession(nextSession);
      return true;
    } catch {
      clearCurrentSession(setSession, sessionRef);
      return false;
    }
  }, []);

  useEffect(() => {
    configureApiAuth({
      getAccessToken: () => sessionRef.current?.tokens.accessToken ?? null,
      getRefreshToken: () => sessionRef.current?.tokens.refreshToken ?? null,
      refreshSession,
      onUnauthorized: () => {
        clearCurrentSession(setSession, sessionRef);
      },
    });
  }, [refreshSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      role: session?.user.role ?? null,
      isAuthenticated: session != null,
      isGoogleLoginLoading,
      login: async (input) => {
        const nextSession = mapCustomerSession(
          await loginCustomer({
            email: normalizeEmail(input.identifier),
            password: input.password.trim(),
          }),
        );
        setSession(nextSession);
        return nextSession.user;
      },
      loginWithGoogle: async () => {
        if (Platform.OS !== 'web') {
          throw new Error('Google ile giris su an yalnizca web istemcisinde etkin.');
        }

        let clientId = googleWebClientId?.trim() ?? '';

        if (!clientId) {
          const configuration = await getGoogleCustomerWebConfiguration();
          clientId = configuration.clientId?.trim() ?? '';

          if (clientId) {
            setGoogleWebClientId(clientId);
          }
        }

        if (!clientId) {
          throw new Error(
            'Google girisi icin backend GOOGLE_WEB_CLIENT_ID ayari eksik.'
          );
        }

        const googleAccessToken = await requestGoogleWebAccessToken(clientId);
        const nextSession = mapCustomerSession(
          await loginCustomerWithGoogleWeb({
            accessToken: googleAccessToken,
          }),
        );

        setSession(nextSession);
        return nextSession.user;
      },
      register: async (input) => {
        const nextSession = mapCustomerSession(
          await registerCustomer({
            name: normalizeWhitespace(input.fullName),
            phone: normalizeWhitespace(input.phone),
            email: normalizeEmail(input.email),
            password: input.password.trim(),
          }),
        );
        setSession(nextSession);
        return nextSession.user;
      },
      logout: async () => {
        const refreshToken = sessionRef.current?.tokens.refreshToken;

        try {
          if (refreshToken) {
            await logoutCustomerSession(refreshToken);
          }
        } catch {
        } finally {
          clearCurrentSession(setSession, sessionRef);
        }
      },
    }),
    [googleWebClientId, isGoogleLoginLoading, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}

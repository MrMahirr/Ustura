import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';

import { MOCK_CUSTOMER_PROFILE, matchesMockCustomer } from '@/constants/mock-auth';

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

interface AuthContextValue {
  user: AuthUser | null;
  role: AuthUserRole | null;
  isAuthenticated: boolean;
  login: (input: LoginInput) => AuthUser | null;
  register: (input: RegistrationInput) => AuthUser;
  logout: () => void;
}

const STORAGE_KEY = 'ustura-auth-session';

const AuthContext = createContext<AuthContextValue>({
  user: null,
  role: null,
  isAuthenticated: false,
  login: () => {
    throw new Error('AuthContext hazir degil.');
  },
  register: () => {
    throw new Error('AuthContext hazir degil.');
  },
  logout: () => {},
});

function normalizeWhitespace(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}

function formatNameSegment(segment: string) {
  if (!segment) {
    return '';
  }

  return segment.charAt(0).toLocaleUpperCase('tr-TR') + segment.slice(1).toLocaleLowerCase('tr-TR');
}

function createDisplayName(identifier: string) {
  const sanitized = normalizeWhitespace(identifier);

  if (!sanitized) {
    return 'Ustura Musterisi';
  }

  if (sanitized.includes('@')) {
    const localPart = sanitized.split('@')[0] ?? '';
    const segments = localPart.split(/[._-]+/).filter(Boolean);

    if (segments.length > 0) {
      return segments.map(formatNameSegment).join(' ');
    }
  }

  return 'Ustura Musterisi';
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

function createUserFromRegistration({ email, fullName, phone }: RegistrationInput): AuthUser {
  const sanitizedName = normalizeWhitespace(fullName) || 'Ustura Musterisi';
  const sanitizedEmail = normalizeWhitespace(email);
  const sanitizedPhone = normalizeWhitespace(phone);

  return {
    id: `customer-${sanitizedEmail.replace(/\W+/g, '-').toLocaleLowerCase('tr-TR') || Date.now()}`,
    fullName: sanitizedName,
    initials: createInitials(sanitizedName),
    identifier: sanitizedEmail,
    email: sanitizedEmail,
    phone: sanitizedPhone,
    role: 'customer',
  };
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

function readStoredUser() {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return null;
  }

  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);

    if (!storedValue) {
      return null;
    }

    const parsedValue = JSON.parse(storedValue);
    return isAuthUser(parsedValue) ? parsedValue : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readStoredUser);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return;
    }

    if (user == null) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      role: user?.role ?? null,
      isAuthenticated: user != null,
      login: (input) => {
        const sanitizedIdentifier = normalizeWhitespace(input.identifier).toLocaleLowerCase('tr-TR');

        if (!matchesMockCustomer(sanitizedIdentifier, input.password)) {
          return null;
        }

        const nextUser: AuthUser = {
          ...MOCK_CUSTOMER_PROFILE,
          identifier: sanitizedIdentifier,
        };
        setUser(nextUser);
        return nextUser;
      },
      register: (input) => {
        const nextUser = createUserFromRegistration(input);
        setUser(nextUser);
        return nextUser;
      },
      logout: () => {
        setUser(null);
      },
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}

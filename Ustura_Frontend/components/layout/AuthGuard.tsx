import React, { type ReactNode } from 'react';
import { type Href, Redirect } from 'expo-router';

import { useAuth } from '@/hooks/use-auth';

interface AuthGuardProps {
  children: ReactNode;
  loginRedirect?: Href;
  fallback?: ReactNode;
}

export default function AuthGuard({ children, loginRedirect = '/giris', fallback = null }: AuthGuardProps) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href={loginRedirect} />;
  }

  return <>{children}</>;
}

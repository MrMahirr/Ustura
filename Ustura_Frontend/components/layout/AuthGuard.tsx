import React, { type ReactNode } from 'react';
import { useRouter, type Href } from 'expo-router';

import { useAuth } from '@/hooks/use-auth';

interface AuthGuardProps {
  children: ReactNode;
  loginRedirect?: Href;
  fallback?: ReactNode;
}

export default function AuthGuard({ children, loginRedirect = '/giris', fallback = null }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.replace(loginRedirect);
    }
  }, [isAuthenticated, loginRedirect, router]);

  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

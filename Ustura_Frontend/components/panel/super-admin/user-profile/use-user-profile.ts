import React from 'react';

import { mapAdminUserRecord } from '@/components/panel/super-admin/users/mappers';
import { UserService } from '@/services/user.service';

import { buildUserProfile } from './data';

export function useUserProfile(userId?: string) {
  const [profile, setProfile] = React.useState<ReturnType<typeof buildUserProfile> | null>(null);
  const [isLoading, setIsLoading] = React.useState(Boolean(userId));
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!userId) {
      setProfile(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    let isMounted = true;

    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const adminUser = await UserService.getAdminUserById(userId);

        if (!isMounted) {
          return;
        }

        setProfile(buildUserProfile(mapAdminUserRecord(adminUser)));
      } catch (err: any) {
        if (!isMounted) {
          return;
        }

        console.error('Failed to fetch admin user profile:', err);
        setProfile(null);
        setError(err?.message || 'Kullanici profili yuklenemedi.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  return {
    profile,
    isLoading,
    error,
  };
}

import React from 'react';

import type { AdminUserDetailResponse } from '@/services/user.service';
import { UserService } from '@/services/user.service';
import { mapAdminUserRecord } from '@/components/panel/super-admin/users/mappers';

import { buildUserProfile } from './data';
import type { UserProfile } from './data';

export function useUserProfile(userId?: string) {
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [detail, setDetail] = React.useState<AdminUserDetailResponse | null>(null);
  const [isLoading, setIsLoading] = React.useState(Boolean(userId));
  const [error, setError] = React.useState<string | null>(null);
  const [revision, setRevision] = React.useState(0);

  React.useEffect(() => {
    if (!userId) {
      setProfile(null);
      setDetail(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    let isMounted = true;

    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const detailResponse = await UserService.getAdminUserDetail(userId);

        if (!isMounted) {
          return;
        }

        const userRecord = mapAdminUserRecord(detailResponse.user);
        setDetail(detailResponse);
        setProfile(buildUserProfile(userRecord, detailResponse));
      } catch (err: any) {
        if (!isMounted) {
          return;
        }

        console.error('Failed to fetch admin user detail:', err);
        setProfile(null);
        setDetail(null);
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
  }, [userId, revision]);

  const refresh = React.useCallback(() => {
    setRevision((c) => c + 1);
  }, []);

  return {
    profile,
    rawUser: detail?.user ?? null,
    isLoading,
    error,
    refresh,
  };
}

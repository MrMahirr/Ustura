import React from 'react';

import { getUserProfileById } from '@/components/panel/super-admin/user-profile/data';

export function useUserProfile(userId?: string) {
  return React.useMemo(() => getUserProfileById(userId), [userId]);
}

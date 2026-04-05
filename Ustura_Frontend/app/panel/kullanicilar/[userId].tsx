import { useLocalSearchParams } from 'expo-router';

import SuperAdminUserProfile from '@/components/panel/super-admin/SuperAdminUserProfile';

export default function UserDetailPage() {
  const params = useLocalSearchParams<{ userId?: string | string[] }>();
  const userId = Array.isArray(params.userId) ? params.userId[0] : params.userId;

  return <SuperAdminUserProfile userId={userId} />;
}

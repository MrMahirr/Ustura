import { useLocalSearchParams } from 'expo-router';

import SuperAdminPackageProfile from '@/components/panel/super-admin/SuperAdminPackageProfile';

export default function PackageDetailPage() {
  const params = useLocalSearchParams<{ packageId?: string | string[] }>();
  const packageId = Array.isArray(params.packageId) ? params.packageId[0] : params.packageId;

  return <SuperAdminPackageProfile packageId={packageId} />;
}

import { useLocalSearchParams } from 'expo-router';

import SuperAdminSalonProfile from '@/components/panel/super-admin/SuperAdminSalonProfile';

export default function SalonDetailPage() {
  const params = useLocalSearchParams<{ salonId?: string | string[] }>();
  const salonId = Array.isArray(params.salonId) ? params.salonId[0] : params.salonId;

  return <SuperAdminSalonProfile salonId={salonId} />;
}

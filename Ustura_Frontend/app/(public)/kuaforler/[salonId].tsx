import { useLocalSearchParams } from 'expo-router';

import SalonStorefrontPage from '@/components/kuaforler/storefront/SalonStorefrontPage';

export default function PublicSalonDetailPage() {
  const params = useLocalSearchParams<{ salonId?: string | string[] }>();
  const salonId = Array.isArray(params.salonId)
    ? params.salonId[0]
    : params.salonId;

  return <SalonStorefrontPage salonId={salonId} />;
}

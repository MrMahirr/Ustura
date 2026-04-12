import type { SalonListItem } from '@/components/kuaforler/presentation';
import type { SalonRecord } from '@/services/salon.service';

export const DEFAULT_SALON_IMAGE_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD9Du-0fH-CtOES4K9J2gCbufPekyrfYgqnoSqpyBFSICffXD1Hq0yV4ZAXttFWnFbNWs54sw8l1OxVvOIyOHIMgTuUNPUAEM9zsJ2ObgDLjRT34nDBJa4X4GvqawVJAo9-3Exs_vX4AUVghCuqqpV_CyjY2YJcjL6SaFOW9AGkRJhFcBI4ewkS02nE3_K-HnqyxfKjnWQPyoPqcBMEcUWiBjrpKGJ-G01xbC1wbtfE2kTBaxSYk9wtsXnAsmfhae-5iCyPUFjNmYY';

export function mapSalonToListItem(salon: SalonRecord): SalonListItem {
  const location = salon.district ? `${salon.district}, ${salon.city}` : salon.city;

  return {
    id: salon.id,
    name: salon.name,
    location,
    rating: 4.9,
    reviewCount: 0,
    imageUrl: salon.photoUrl ?? DEFAULT_SALON_IMAGE_URI,
    barbers: [],
  };
}

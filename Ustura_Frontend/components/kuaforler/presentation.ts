export interface SalonListItem {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  barbers: string[];
}

export const SALON_LIST: SalonListItem[] = [
  {
    id: '1',
    name: 'Obsidyen Studyo',
    location: 'Besiktas, Istanbul',
    rating: 4.9,
    reviewCount: 124,
    barbers: ['Ahmet Y.', 'Can B.'],
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCseDKZ2RW_yXwKVIbQZkSeyg-6phq9rtZJQejyro2ceP8n2ZqC28t-shv1f2JJsnUBHUc8KxN43KhUy6aB5WWuSzrOuzRBvRcLuvL7nB4HivUnTyMyr73YayqISXOEjTBxhGIeTuk9ottl_lXvqzU-048hmLpPSqyqRmsBlc5aCU-NfWN0UTLJWdjXBW2ipRO8U6JpLIIMiX5QXErtsOeLJPW1UGd8XGZJKAINnONwvdHYckobT5Ayv-X2LO737wbGa41QoPfqBj4',
  },
  {
    id: '2',
    name: 'Miras Bakim Evi',
    location: 'Cankaya, Ankara',
    rating: 4.8,
    reviewCount: 89,
    barbers: ['Murat K.', 'Emre S.', 'Selim D.'],
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA1z2xN3sr_r_S_tS84GUvWVFa6ALsUKMyOFkgSpbC5g3zoY6tNJuF7hxsQkIm9bRsnqhVQzD7rP3t4H2XOhBjD7nH986ZfIUUXdF_UazKi2uwfCaB08Dh3yDgWgJ-HbX6wUvykempM050mVRISevpb618jUmgMSThdqaltRIWEr4bffpbOOgJHMGJVzw4ITtaME0t6g3K4g-Qbgeq8BxjxmLui9odmQGINt4oZUyZCT61amhC_dDy1GnSCDpTP2_7mHcC4mLneOyg',
  },
  {
    id: '3',
    name: 'Keskin ve Ortaklari',
    location: 'Bornova, Izmir',
    rating: 5.0,
    reviewCount: 215,
    barbers: ['Volkan T.', 'Deniz A.'],
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD9Du-0fH-CtOES4K9J2gCbufPekyrfYgqnoSqpyBFSICffXD1Hq0yV4ZAXttFWnFbNWs54sw8l1OxVvOIyOHIMgTuUNPUAEM9zsJ2ObgDLjRT34nDBJa4X4GvqawVJAo9-3Exs_vX4AUVghCuqqpV_CyjY2YJcjL6SaFOW9AGkRJhFcBI4ewkS02nE3_K-HnqyxfKjnWQPyoPqcBMEcUWiBjrpKGJ-G01xbC1wbtfE2kTBaxSYk9wtsXnAsmfhae-5iCyPUFjNmYY',
  },
];

export function getSalonById(salonId?: string) {
  if (!salonId) {
    return SALON_LIST[0];
  }

  return SALON_LIST.find((salon) => salon.id === salonId) ?? SALON_LIST[0];
}

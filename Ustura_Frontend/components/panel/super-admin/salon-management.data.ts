export type SalonStatus = 'Aktif' | 'Beklemede' | 'Askiya Alindi';
export type SalonPlan = 'Basic' | 'Pro' | 'Premium';

export interface SalonRecord {
  id: string;
  reference: string;
  name: string;
  owner: string;
  ownerEmail: string;
  location: string;
  status: SalonStatus;
  plan: SalonPlan;
  monthlyRevenue: number;
  imageUrl: string;
  joinedAt: string;
  mutedImage?: boolean;
}

export const salonStatusOptions = ['Tum Durumlar', 'Aktif', 'Beklemede', 'Askiya Alindi'] as const;
export const salonPlanOptions = ['Tum Paketler', 'Basic', 'Pro', 'Premium'] as const;
export const salonSortOptions = ['En Yeni', 'Isme Gore (A-Z)', 'Ciro (Yuksek)'] as const;

export const salonOverview = {
  totalRecords: 128,
  newSalons: '+24',
  revenueGrowth: 'TRY 42.5K',
};

export const salonRecords: SalonRecord[] = [
  {
    id: 'salon-99281',
    reference: '#99281',
    name: "The Gentleman's Atelier",
    owner: 'Arda Guler',
    ownerEmail: 'arda@gentleman.com',
    location: 'Istanbul, Besiktas',
    status: 'Aktif',
    plan: 'Premium',
    monthlyRevenue: 185000,
    joinedAt: '2026-04-03T10:20:00',
    imageUrl: 'https://picsum.photos/seed/ustura-salon-1/200/200',
  },
  {
    id: 'salon-99245',
    reference: '#99245',
    name: 'Retro Blade Studio',
    owner: 'Sinan Kaya',
    ownerEmail: 'sinan@retroblade.com',
    location: 'Ankara, Cankaya',
    status: 'Beklemede',
    plan: 'Pro',
    monthlyRevenue: 118500,
    joinedAt: '2026-04-02T16:40:00',
    imageUrl: 'https://picsum.photos/seed/ustura-salon-2/200/200',
    mutedImage: true,
  },
  {
    id: 'salon-99102',
    reference: '#99102',
    name: 'Sharp & Clean',
    owner: 'Elif Demir',
    ownerEmail: 'elif@sharpclean.co',
    location: 'Izmir, Alsancak',
    status: 'Askiya Alindi',
    plan: 'Basic',
    monthlyRevenue: 67400,
    joinedAt: '2026-03-28T11:00:00',
    imageUrl: 'https://picsum.photos/seed/ustura-salon-3/200/200',
  },
  {
    id: 'salon-99088',
    reference: '#99088',
    name: 'Elite Cuts Premium',
    owner: 'Murat Yildiz',
    ownerEmail: 'murat@elitecuts.com',
    location: 'Antalya, Muratpasa',
    status: 'Aktif',
    plan: 'Premium',
    monthlyRevenue: 172000,
    joinedAt: '2026-03-27T14:25:00',
    imageUrl: 'https://picsum.photos/seed/ustura-salon-4/200/200',
  },
  {
    id: 'salon-99051',
    reference: '#99051',
    name: 'Noir Barber House',
    owner: 'Berk Ozturk',
    ownerEmail: 'berk@noirbarber.co',
    location: 'Bursa, Nilufer',
    status: 'Beklemede',
    plan: 'Pro',
    monthlyRevenue: 109800,
    joinedAt: '2026-04-04T08:10:00',
    imageUrl: 'https://picsum.photos/seed/ustura-salon-5/200/200',
    mutedImage: true,
  },
  {
    id: 'salon-98972',
    reference: '#98972',
    name: 'Urban Fade Lounge',
    owner: 'Kaan Acar',
    ownerEmail: 'kaan@urbanfade.co',
    location: 'Istanbul, Kadikoy',
    status: 'Aktif',
    plan: 'Pro',
    monthlyRevenue: 132500,
    joinedAt: '2026-04-01T09:30:00',
    imageUrl: 'https://picsum.photos/seed/ustura-salon-6/200/200',
  },
  {
    id: 'salon-98901',
    reference: '#98901',
    name: 'The Cut Society',
    owner: 'Cem Karaca',
    ownerEmail: 'cem@cutsociety.com',
    location: 'Eskisehir, Tepebasi',
    status: 'Aktif',
    plan: 'Premium',
    monthlyRevenue: 149200,
    joinedAt: '2026-03-30T18:00:00',
    imageUrl: 'https://picsum.photos/seed/ustura-salon-7/200/200',
  },
  {
    id: 'salon-98834',
    reference: '#98834',
    name: 'North Blend Club',
    owner: 'Deniz Yaman',
    ownerEmail: 'deniz@northblend.io',
    location: 'Samsun, Atakum',
    status: 'Askiya Alindi',
    plan: 'Basic',
    monthlyRevenue: 58300,
    joinedAt: '2026-03-24T12:50:00',
    imageUrl: 'https://picsum.photos/seed/ustura-salon-8/200/200',
    mutedImage: true,
  },
  {
    id: 'salon-98792',
    reference: '#98792',
    name: 'Monarch Groom Lab',
    owner: 'Omer Savas',
    ownerEmail: 'omer@monarchgroom.com',
    location: 'Adana, Seyhan',
    status: 'Aktif',
    plan: 'Premium',
    monthlyRevenue: 163700,
    joinedAt: '2026-03-29T10:45:00',
    imageUrl: 'https://picsum.photos/seed/ustura-salon-9/200/200',
  },
  {
    id: 'salon-98711',
    reference: '#98711',
    name: 'Legacy Barber Works',
    owner: 'Tolga Ince',
    ownerEmail: 'tolga@legacyworks.co',
    location: 'Konya, Selcuklu',
    status: 'Beklemede',
    plan: 'Pro',
    monthlyRevenue: 95100,
    joinedAt: '2026-03-26T17:30:00',
    imageUrl: 'https://picsum.photos/seed/ustura-salon-10/200/200',
  },
];

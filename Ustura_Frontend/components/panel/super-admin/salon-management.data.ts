export type SalonStatus = 'Aktif' | 'Beklemede' | 'Askiya Alindi';
export type SalonPlan = 'Temel' | 'Gelismis' | 'Ozel';

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
export const salonPlanOptions = ['Tum Paketler', 'Temel', 'Gelismis', 'Ozel'] as const;
export const salonSortOptions = ['En Yeni', 'Isme Gore (A-Z)', 'Ciro (Yuksek)'] as const;

export const salonOverview = {
  totalRecords: 128,
  newSalons: '+24',
  revenueGrowth: '42,5 Bin TL',
};

export const salonRecords: SalonRecord[] = [
  {
    id: 'salon-99281',
    reference: '#99281',
    name: 'Beyefendi Atolyesi',
    owner: 'Arda Guler',
    ownerEmail: 'arda@gentleman.com',
    location: 'Istanbul, Besiktas',
    status: 'Aktif',
    plan: 'Ozel',
    monthlyRevenue: 185000,
    joinedAt: '2026-04-03T10:20:00',
    imageUrl: 'https://picsum.photos/seed/ustura-salon-1/200/200',
  },
  {
    id: 'salon-99245',
    reference: '#99245',
    name: 'Retro Bicak Studyosu',
    owner: 'Sinan Kaya',
    ownerEmail: 'sinan@retroblade.com',
    location: 'Ankara, Cankaya',
    status: 'Beklemede',
    plan: 'Gelismis',
    monthlyRevenue: 118500,
    joinedAt: '2026-04-02T16:40:00',
    imageUrl: 'https://picsum.photos/seed/ustura-salon-2/200/200',
    mutedImage: true,
  },
  {
    id: 'salon-99102',
    reference: '#99102',
    name: 'Keskin ve Temiz',
    owner: 'Elif Demir',
    ownerEmail: 'elif@sharpclean.co',
    location: 'Izmir, Alsancak',
    status: 'Askiya Alindi',
    plan: 'Temel',
    monthlyRevenue: 67400,
    joinedAt: '2026-03-28T11:00:00',
    imageUrl: 'https://picsum.photos/seed/ustura-salon-3/200/200',
  },
  {
    id: 'salon-99088',
    reference: '#99088',
    name: 'Elite Kesim Evi',
    owner: 'Murat Yildiz',
    ownerEmail: 'murat@elitecuts.com',
    location: 'Antalya, Muratpasa',
    status: 'Aktif',
    plan: 'Ozel',
    monthlyRevenue: 172000,
    joinedAt: '2026-03-27T14:25:00',
    imageUrl: 'https://picsum.photos/seed/ustura-salon-4/200/200',
  },
  {
    id: 'salon-99051',
    reference: '#99051',
    name: 'Noir Berber Evi',
    owner: 'Berk Ozturk',
    ownerEmail: 'berk@noirbarber.co',
    location: 'Bursa, Nilufer',
    status: 'Beklemede',
    plan: 'Gelismis',
    monthlyRevenue: 109800,
    joinedAt: '2026-04-04T08:10:00',
    imageUrl: 'https://picsum.photos/seed/ustura-salon-5/200/200',
    mutedImage: true,
  },
  {
    id: 'salon-98972',
    reference: '#98972',
    name: 'Sehir Fade Salonu',
    owner: 'Kaan Acar',
    ownerEmail: 'kaan@urbanfade.co',
    location: 'Istanbul, Kadikoy',
    status: 'Aktif',
    plan: 'Gelismis',
    monthlyRevenue: 132500,
    joinedAt: '2026-04-01T09:30:00',
    imageUrl: 'https://picsum.photos/seed/ustura-salon-6/200/200',
  },
  {
    id: 'salon-98901',
    reference: '#98901',
    name: 'Kesim Kulubu',
    owner: 'Cem Karaca',
    ownerEmail: 'cem@cutsociety.com',
    location: 'Eskisehir, Tepebasi',
    status: 'Aktif',
    plan: 'Ozel',
    monthlyRevenue: 149200,
    joinedAt: '2026-03-30T18:00:00',
    imageUrl: 'https://picsum.photos/seed/ustura-salon-7/200/200',
  },
  {
    id: 'salon-98834',
    reference: '#98834',
    name: 'Kuzey Harman Kulubu',
    owner: 'Deniz Yaman',
    ownerEmail: 'deniz@northblend.io',
    location: 'Samsun, Atakum',
    status: 'Askiya Alindi',
    plan: 'Temel',
    monthlyRevenue: 58300,
    joinedAt: '2026-03-24T12:50:00',
    imageUrl: 'https://picsum.photos/seed/ustura-salon-8/200/200',
    mutedImage: true,
  },
  {
    id: 'salon-98792',
    reference: '#98792',
    name: 'Monark Bakim Laboratuvari',
    owner: 'Omer Savas',
    ownerEmail: 'omer@monarchgroom.com',
    location: 'Adana, Seyhan',
    status: 'Aktif',
    plan: 'Ozel',
    monthlyRevenue: 163700,
    joinedAt: '2026-03-29T10:45:00',
    imageUrl: 'https://picsum.photos/seed/ustura-salon-9/200/200',
  },
  {
    id: 'salon-98711',
    reference: '#98711',
    name: 'Miras Berber Atolyesi',
    owner: 'Tolga Ince',
    ownerEmail: 'tolga@legacyworks.co',
    location: 'Konya, Selcuklu',
    status: 'Beklemede',
    plan: 'Gelismis',
    monthlyRevenue: 95100,
    joinedAt: '2026-03-26T17:30:00',
    imageUrl: 'https://picsum.photos/seed/ustura-salon-10/200/200',
  },
];

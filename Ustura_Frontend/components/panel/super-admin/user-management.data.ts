import type { SalonPlan, SalonStatus } from '@/components/panel/super-admin/salon-management.data';

export type UserRole = 'Yonetici' | 'Sahip' | 'Calisan';
export type UserStatus = 'Aktif' | 'Mesgul' | 'Pasif' | 'Askida';
export type UserViewMode = 'all' | 'salons';

export interface DailyCapacity {
  booked: number;
  total: number;
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  specialties: string[];
  salonId?: string;
  salonName: string;
  salonLocation: string;
  city: string;
  status: UserStatus;
  dailyCapacity?: DailyCapacity;
  avatarUrl: string;
  mutedImage?: boolean;
  joinedAt: string;
}

export interface UserOverview {
  totalUsers: number;
  activeToday: number;
  newRegistrations: string;
  conversion: string;
}

export interface GroupedSalonRecord {
  id: string;
  salonId?: string;
  salonName: string;
  salonLocation: string;
  city: string;
  plan?: SalonPlan;
  salonStatus?: SalonStatus;
  totalUsers: number;
  activeUsers: number;
  ownerCount: number;
  adminCount: number;
  employeeCount: number;
  occupancyRate?: number;
  capacityCount: number;
  users: UserRecord[];
}

export const userRoleOptions = ['Tum Roller', 'Yonetici', 'Sahip', 'Calisan'] as const;
export const userStatusOptions = ['Tum Durumlar', 'Aktif', 'Mesgul', 'Pasif', 'Askida'] as const;
export const userSalonOptions = [
  'Tum Salonlar',
  'Beyefendi Atolyesi',
  'Noir Berber Evi',
  'Kesim Kulubu',
  'Kuzey Harman Kulubu',
] as const;
export const userCityOptions = ['Tum Sehirler', 'Istanbul', 'Bursa', 'Eskisehir', 'Samsun'] as const;

export const userOverview: UserOverview = {
  totalUsers: 1284,
  activeToday: 412,
  newRegistrations: '+42',
  conversion: '6.8%',
};

export const userRecords: UserRecord[] = [
  {
    id: 'user-901',
    name: 'Can Berkant',
    email: 'can.berkant@ustura.com',
    role: 'Sahip',
    title: 'Usta Berber',
    specialties: ['Sac Kesimi', 'Sakal Tasarimi'],
    salonId: 'salon-99281',
    salonName: 'Beyefendi Atolyesi',
    salonLocation: 'Istanbul, Besiktas',
    city: 'Istanbul',
    status: 'Aktif',
    dailyCapacity: { booked: 12, total: 15 },
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCBIVQLGuwP1QwmbhxTJT_u6I11ag2C8W2SQIRcwClIt2wbFCyeLvbFG-VZAV5GkoVX22E5cW9p9FV3uNxkcz8WAxRW8cm9UZJXROJb3vtTtFzvA5P6tzdIiHTidbz4p-wuHXtwnVQ0ii3oJnImZ9oS28kjhaY5USZSa3s2QGk8zbtkBDVsjXCFjdMlNzvKiaScSU_9FJfw4KwLToGm5Do3t0CwJO34BRFHzLKAJMyGRVKbL1lbvol3tMhSQCRttKsZKscNN-ZowTU',
    joinedAt: '2026-04-03T10:25:00',
  },
  {
    id: 'user-902',
    name: 'Selin Aksoy',
    email: 'selin@noirstudio.co',
    role: 'Calisan',
    title: 'Kidemli Stilist',
    specialties: ['Stil Verme', 'Bakim'],
    salonId: 'salon-99051',
    salonName: 'Noir Berber Evi',
    salonLocation: 'Bursa, Nilufer',
    city: 'Bursa',
    status: 'Aktif',
    dailyCapacity: { booked: 8, total: 8 },
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA5sSrJdOKbaCItN-CoUeX7iXUpPoI9PAxOlO9vyLSiwOonIFEPRTlRJJEjLV2JcBWcNVJ63N1g--VIZqA0zysiAuAnlw2x0qrE3_VT190tP3xlUpQihwXMayrfm9PJskCdV2sLOPaJROxmAz7VtY5ZzizxGnjCf-gpIeSzPTjLogslFP6egg3S157BIjasi3mxyIkmffMSIOhSrPqVnvjKmFsA6bip48lTW9HyCfgMxj71am6C6RajCrGguz5NYKN4kYg7ITshsgE',
    joinedAt: '2026-04-03T09:10:00',
  },
  {
    id: 'user-903',
    name: 'Murat Demir',
    email: 'murat.demir@bladebrush.com',
    role: 'Calisan',
    title: 'Fade Ustasi',
    specialties: ['Fade', 'Tiras'],
    salonId: 'salon-98901',
    salonName: 'Kesim Kulubu',
    salonLocation: 'Eskisehir, Tepebasi',
    city: 'Eskisehir',
    status: 'Mesgul',
    dailyCapacity: { booked: 4, total: 10 },
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDj7DeB_k6BAfBuqPUdrb1bnjMqs23hXyH-29QWlGlFSEU_JMvgtRw3JWsPMUXxWCHg8Qm4ejYqGy5H7CnAnXVGEvSpmsnJ5or3mKqRyzzUJ5k-1YipuWQqWwJF8BieE1FQ7CV0znQ2gPIaogNd2Nd6z4brA3_RL8ImikIjJPpEqAZuhhReJdPzabqOZI2uId5_I_cMChBgIM_8P11mz8DUwJwuyJlHPPHjZIMiVSrBkYh63Km3LtA4WPGIKTf4U7kD5CN7LJ3AFk8',
    joinedAt: '2026-04-02T13:45:00',
  },
  {
    id: 'user-904',
    name: 'Ece Yildiz',
    email: 'ece.yildiz@ustura.com',
    role: 'Yonetici',
    title: 'Operasyon Sorumlusu',
    specialties: ['Yonetim', 'Analitik'],
    salonId: 'salon-98834',
    salonName: 'Kuzey Harman Kulubu',
    salonLocation: 'Samsun, Atakum',
    city: 'Samsun',
    status: 'Askida',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBbBKrR0tgUvMSZmf8o_EDlSMpd6HkU8m9JAM-pjk6bsYgG2e6tIYkfYMUF2YIJpvWWs0mQkdTI4KTVEr-_CKXVp2nGk2KOFiGjfzdakzicgGN_inQ8bwN6Pz3sbQ1sWFB3DlAonROTy-YcwJrhfiG1Kt6cCq9d0-4XtQT1AFuuoffmZZtb639wmGpVD7uye6IoOLLdSE2fznP187jU_uep0sn2t3hkEshH5Hy6UrC20dT6rxqeIvlKpkc0paljnIwYmqrGTZUadRg',
    joinedAt: '2026-04-02T09:20:00',
  },
  {
    id: 'user-905',
    name: 'Derya Ates',
    email: 'derya@noirstudio.co',
    role: 'Sahip',
    title: 'Yaratici Yonetmen',
    specialties: ['Boyama', 'Stil Verme'],
    salonId: 'salon-99051',
    salonName: 'Noir Berber Evi',
    salonLocation: 'Bursa, Nilufer',
    city: 'Bursa',
    status: 'Aktif',
    dailyCapacity: { booked: 14, total: 16 },
    avatarUrl: 'https://picsum.photos/seed/ustura-user-5/200/200',
    joinedAt: '2026-04-04T08:10:00',
  },
  {
    id: 'user-906',
    name: 'Emir Taskin',
    email: 'emir@gentlemanbarber.co',
    role: 'Calisan',
    title: 'Kidemli Stilist',
    specialties: ['Stil Verme', 'Fade'],
    salonId: 'salon-99281',
    salonName: 'Beyefendi Atolyesi',
    salonLocation: 'Istanbul, Besiktas',
    city: 'Istanbul',
    status: 'Pasif',
    dailyCapacity: { booked: 0, total: 10 },
    avatarUrl: 'https://picsum.photos/seed/ustura-user-6/200/200',
    mutedImage: true,
    joinedAt: '2026-04-01T16:55:00',
  },
  {
    id: 'user-907',
    name: 'Baris Onder',
    email: 'baris@bladebrush.com',
    role: 'Sahip',
    title: 'Magaza Yoneticisi',
    specialties: ['Yonetim', 'Sac Kesimi'],
    salonId: 'salon-98901',
    salonName: 'Kesim Kulubu',
    salonLocation: 'Eskisehir, Tepebasi',
    city: 'Eskisehir',
    status: 'Aktif',
    dailyCapacity: { booked: 9, total: 12 },
    avatarUrl: 'https://picsum.photos/seed/ustura-user-7/200/200',
    joinedAt: '2026-03-31T12:30:00',
  },
  {
    id: 'user-908',
    name: 'Gokce Erdem',
    email: 'gokce@ustura.com',
    role: 'Yonetici',
    title: 'Destek Yoneticisi',
    specialties: ['Planlama', 'Destek'],
    salonId: 'salon-98834',
    salonName: 'Kuzey Harman Kulubu',
    salonLocation: 'Samsun, Atakum',
    city: 'Samsun',
    status: 'Askida',
    avatarUrl: 'https://picsum.photos/seed/ustura-user-8/200/200',
    mutedImage: true,
    joinedAt: '2026-03-30T18:05:00',
  },
  {
    id: 'user-909',
    name: 'Ekin Su',
    email: 'ekin.su@gentlemansatelier.co',
    role: 'Calisan',
    title: 'Renk Uzm.',
    specialties: ['Boyama', 'Stil Verme'],
    salonId: 'salon-99281',
    salonName: 'Beyefendi Atolyesi',
    salonLocation: 'Istanbul, Besiktas',
    city: 'Istanbul',
    status: 'Aktif',
    dailyCapacity: { booked: 7, total: 9 },
    avatarUrl: 'https://picsum.photos/seed/ustura-user-9/200/200',
    joinedAt: '2026-04-04T11:05:00',
  },
  {
    id: 'user-910',
    name: 'Ozan Mete',
    email: 'ozan.mete@ustura.com',
    role: 'Yonetici',
    title: 'Bolge Yoneticisi',
    specialties: ['Operasyon', 'Yonetim'],
    salonId: 'salon-99281',
    salonName: 'Beyefendi Atolyesi',
    salonLocation: 'Istanbul, Besiktas',
    city: 'Istanbul',
    status: 'Aktif',
    avatarUrl: 'https://picsum.photos/seed/ustura-user-10/200/200',
    joinedAt: '2026-04-01T08:15:00',
  },
  {
    id: 'user-911',
    name: 'Kerem Unal',
    email: 'kerem@noirbarber.co',
    role: 'Calisan',
    title: 'Bakim Uzmani',
    specialties: ['Sakal', 'Cilt Bakimi'],
    salonId: 'salon-99051',
    salonName: 'Noir Berber Evi',
    salonLocation: 'Bursa, Nilufer',
    city: 'Bursa',
    status: 'Mesgul',
    dailyCapacity: { booked: 6, total: 8 },
    avatarUrl: 'https://picsum.photos/seed/ustura-user-11/200/200',
    joinedAt: '2026-04-04T09:30:00',
  },
  {
    id: 'user-912',
    name: 'Elif Karan',
    email: 'elif.karan@cutsociety.com',
    role: 'Calisan',
    title: 'Genc Berber',
    specialties: ['Sac Kesimi'],
    salonId: 'salon-98901',
    salonName: 'Kesim Kulubu',
    salonLocation: 'Eskisehir, Tepebasi',
    city: 'Eskisehir',
    status: 'Aktif',
    dailyCapacity: { booked: 5, total: 9 },
    avatarUrl: 'https://picsum.photos/seed/ustura-user-12/200/200',
    joinedAt: '2026-04-03T15:40:00',
  },
];

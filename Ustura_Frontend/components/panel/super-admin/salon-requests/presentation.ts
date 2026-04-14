import { Platform } from 'react-native';

export const salonRequestClassNames = {
  page: 'relative flex-1 overflow-hidden',
  content: 'w-full max-w-[1600px] self-center gap-8',
  headerSection: 'justify-between gap-5',
  headerCopy: 'max-w-[720px] flex-1 gap-2.5',
  eyebrow: 'font-label text-xs uppercase tracking-[4px]',
  title: 'font-headline text-[38px] tracking-[-0.8px]',
  description: 'max-w-[620px] font-body text-base',
  statsGrid: 'flex-row flex-wrap gap-6',
  statCard: 'flex-1 min-w-[160px] p-6',
  statLabel: 'font-label text-[10px] font-bold uppercase tracking-[2.4px]',
  statValue: 'font-headline text-3xl font-bold',
  filterBar: 'flex-row flex-wrap items-center justify-between gap-4 p-4',
  filterChip: 'px-4 py-2 font-label text-xs font-bold',
  tableShell: 'overflow-hidden border',
  headerText: 'font-label text-[10px] font-bold uppercase tracking-[2.4px]',
  drawerWidth: 520,
} as const;

export const SALON_REQUEST_COPY = {
  eyebrow: 'Yonetim Paneli',
  title: 'Salon Kayit Istekleri',
  description: 'Platforma katilmak isteyen yeni salon basvurularini yonetin.',
  totalLabel: 'Toplam Basvuru',
  pendingLabel: 'Bekleyenler',
  todayLabel: 'Bugun Gelen',
  approvedWeekLabel: 'Bu Hafta Onaylanan',
  rejectedLabel: 'Reddedilenler',
  filterAll: 'Tumu',
  filterPending: 'Bekleyenler',
  filterApproved: 'Onaylananlar',
  filterRejected: 'Reddedilenler',
  colSalon: 'Salon',
  colApplicant: 'Basvuru Sahibi',
  colCity: 'Sehir',
  colDate: 'Basvuru Tarihi',
  colStatus: 'Durum',
  colActions: 'Islemler',
  statusPending: 'Beklemede',
  statusApproved: 'Onaylandi',
  statusRejected: 'Reddedildi',
  drawerTitle: 'Basvuru Detaylari',
  drawerActionRequired: 'Aksiyon Gerekli',
  ownerInfoTitle: 'Yetkili Bilgileri',
  ownerName: 'Ad Soyad',
  ownerPhone: 'GSM',
  ownerEmail: 'E-Posta',
  tabGeneral: 'Genel Bilgiler',
  tabDocuments: 'Belgeler',
  tabNotes: 'Notlar',
  tabHistory: 'Gecmis',
  editInfo: 'Bilgi Duzenle',
  editInfoModalTitle: 'Basvuru Bilgilerini Duzenle',
  editInfoSave: 'Kaydet',
  editInfoCancel: 'Iptal',
  editInfoSalonSection: 'Salon Bilgileri',
  districtLabel: 'Ilce',
  reject: 'Reddet',
  approveAndAssign: 'Onayla & Tanimla',
  noRequests: 'Henuz basvuru bulunmuyor.',
  loading: 'Yukleniyor...',
  errorTitle: 'Bir hata olustu',
  retry: 'Tekrar Dene',
  citySelect: 'Sehir Secin',
  dateSelect: 'Tarih',
  rejectReasonPlaceholder: 'Reddetme sebebini yazin...',
  rejectConfirm: 'Reddet',
  rejectCancel: 'Iptal',
  salonAddress: 'Adres',
  applicationNotes: 'Basvuru Notlari',
  noNotes: 'Not bulunmuyor.',
} as const;

export function getSalonRequestPanelShadow(theme: 'light' | 'dark') {
  return Platform.OS === 'web'
    ? ({
        boxShadow:
          theme === 'dark'
            ? '0 26px 60px rgba(0, 0, 0, 0.34)'
            : '0 24px 54px rgba(27, 27, 32, 0.08)',
      } as const)
    : {
        shadowColor: '#000000',
        shadowOpacity: theme === 'dark' ? 0.22 : 0.08,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 12 },
        elevation: 8,
      };
}

export interface BarberNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  tone: 'success' | 'warning' | 'error' | 'primary';
  unread?: boolean;
}

export const barberNotifications: BarberNotification[] = [
  {
    id: 'notif-1',
    title: 'Yeni randevu talebi',
    description: 'Caner Yildiz, yarin 14:00 icin sac kesimi randevusu talep etti.',
    time: '5 dk once',
    tone: 'primary',
    unread: true,
  },
  {
    id: 'notif-2',
    title: 'Randevu iptal edildi',
    description: 'Selin Demir, bugunki 11:00 randevusunu iptal etti.',
    time: '12 dk once',
    tone: 'error',
    unread: true,
  },
  {
    id: 'notif-3',
    title: 'Personel moladan dondu',
    description: 'Veli Soylu aktif duruma gecti, musait randevu alabilir.',
    time: '28 dk once',
    tone: 'success',
    unread: false,
  },
  {
    id: 'notif-4',
    title: 'Yogun saat uyarisi',
    description: '14:00 - 16:00 arasi tum berberler dolu, ek kapasite gerekebilir.',
    time: '1 sa once',
    tone: 'warning',
    unread: false,
  },
  {
    id: 'notif-5',
    title: 'Gunluk rapor hazir',
    description: 'Dunku performans raporu incelemeniz icin hazir.',
    time: '2 sa once',
    tone: 'primary',
    unread: false,
  },
];

export type BarberMetricTone = 'positive' | 'neutral' | 'attention';

export interface BarberDashboardMetric {
  id: string;
  label: string;
  value: string;
  deltaLabel: string;
  tone: BarberMetricTone;
  icon: 'event-available' | 'calendar-view-week' | 'groups' | 'pending-actions';
}

export type BarberAppointmentStatus = 'approved' | 'pending' | 'cancelled';

export interface BarberAppointmentRecord {
  id: string;
  time: string;
  durationLabel: string;
  customerName: string;
  serviceLabel: string;
  serviceIcon: 'content-cut' | 'face' | 'brush';
  barberName: string;
  status: BarberAppointmentStatus;
  imageUrl: string;
  isDimmed?: boolean;
}

export type BarberStaffState = 'available' | 'busy' | 'break';

export interface BarberStaffRecord {
  id: string;
  name: string;
  title: string;
  state: BarberStaffState;
  imageUrl: string;
  nextAppointmentLabel?: string;
}

export interface BarberDashboardSnapshot {
  heroLabel: string;
  title: string;
  subtitle: string;
  dateLabel: string;
  metrics: BarberDashboardMetric[];
  appointments: BarberAppointmentRecord[];
  staff: BarberStaffRecord[];
}

export const barberDashboardSnapshot: BarberDashboardSnapshot = {
  heroLabel: 'Yonetim Paneli',
  title: 'Hos Geldiniz, Kemal.',
  subtitle:
    'Gunluk randevu akislarini, aktif personel durumunu ve acil operasyon sinyallerini tek panelde yonetin.',
  dateLabel: '24 MAYIS 2024, CUMA',
  metrics: [
    {
      id: 'appointments-today',
      label: 'Bugunun Randevulari',
      value: '12',
      deltaLabel: '+20%',
      tone: 'positive',
      icon: 'event-available',
    },
    {
      id: 'appointments-week',
      label: 'Bu Haftaki Randevular',
      value: '84',
      deltaLabel: '+5%',
      tone: 'positive',
      icon: 'calendar-view-week',
    },
    {
      id: 'staff-total',
      label: 'Toplam Personel',
      value: '06',
      deltaLabel: 'Sabit',
      tone: 'neutral',
      icon: 'groups',
    },
    {
      id: 'approvals',
      label: 'Bekleyen Onaylar',
      value: '03',
      deltaLabel: 'Acil',
      tone: 'attention',
      icon: 'pending-actions',
    },
  ],
  appointments: [
    {
      id: 'apt-1',
      time: '09:30',
      durationLabel: '45 DK',
      customerName: 'Caner Yildiz',
      serviceLabel: 'Sac Kesimi & Yikama',
      serviceIcon: 'content-cut',
      barberName: 'Ahmet Y.',
      status: 'approved',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDnWSvakxP_tK8mXEJwX529HjTHRNYLPgL24Qa0TUzRXRZjne3WRRQLsYvFlLoLhKzQoXRSFEApenT61OduEMSLJky2mfgHB97IyyK5n8qNQeq8Zrse5xYz3mKSyQIz1X_6e7AeSRNedn11CAFOgzwYBs_9XoRci9Ti-Z4nZfR0Keoang5rLgTLXukL7r9JFzCTu8PIvX7mqmiyzcsbMUv2AGwdaoi8XykhW_Om78tD7UsJc-hmDQw0fhN4fnLDVucmQmfzozknfYs',
    },
    {
      id: 'apt-2',
      time: '10:15',
      durationLabel: '30 DK',
      customerName: 'Murat Kaya',
      serviceLabel: 'Sakal Tirasi',
      serviceIcon: 'face',
      barberName: 'Mehmet B.',
      status: 'pending',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAbWxYpnDDa7kGRIlt7KC6kDHPkf5MFC0035QDSf3B0apE4La3oivdC8yS_-RX_KPGgtZdE-MmZSUOdV8j2Cy-ETHjcyNb7KuCKYZ-lN8IMSDTbLEiCdt-GcH_QEPZr4ix-i4n9SZo1Swl5UaT4cxZxD8MgknzimiCyBvGtLXM4IbxLvwzfxxqbyblzaTBAKL-E4S7kF76BH2a79ur7FLVH8ZHS1OwhKsMubGL_nWZRX0FC1qofZ87sCyGYnSBI2dyMLP19Pq1S0X0',
    },
    {
      id: 'apt-3',
      time: '11:00',
      durationLabel: '60 DK',
      customerName: 'Selin Demir',
      serviceLabel: 'Komple Bakim',
      serviceIcon: 'brush',
      barberName: 'Veli S.',
      status: 'cancelled',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCynyhYenLrmhfWKki95oEt4WfEhtJ2IQFLFtts45H4nDOKobiDsGYfWkz0XorzHx878JPmBgQVpFlyb6EB2oE6QSf-GHYoa76PKn9YTRjNPIsJWRxYA5U9fCt_tJZ8G__BLi-Q1wQND1Q7W2u8NJhfg7JBxzo1eSG0prs4vqn0A4TEyVWQnLVRWL40AELw8EY78D_nfbRQN9ABpuJN49VUTwepOEWmy100GyWfU71-dB_9LYhNNbRyiWP5VC64Hy42aiBZRj8SV64',
      isDimmed: true,
    },
    {
      id: 'apt-4',
      time: '12:30',
      durationLabel: '45 DK',
      customerName: 'Efe Tekin',
      serviceLabel: 'Sac & Sakal Kombin',
      serviceIcon: 'content-cut',
      barberName: 'Ahmet Y.',
      status: 'approved',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA1hq9OZWL5-3Af-0huLyXAOealNCTuQFO4TpvkqdDSnqRg0bVQ26g_lrL0h_VB_qBDJ_EWzEtH8-tXXmgvieGVcFbPz9BAO1p39F-eIb40pAvpEbNcJQfL4--IPB_A9gDLQwiI8JZiPF7-rKyDXmNU-GutTC6b917wqkLK2pkztfmqHjP3wizv1iHPcL17hEaPjEElFn6QXhG06kaHv6fVnElBjPGjrD5CrX0VHyDmB0NhXSa08jyGY-e0gDqxjYtOIzY94Yt7jR0',
    },
  ],
  staff: [
    {
      id: 'staff-1',
      name: 'Ahmet Yilmaz',
      title: 'Usta Berber',
      state: 'busy',
      nextAppointmentLabel: '12:30 - Efe Tekin',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD5TG1SCRsdanIRb29jkidKaCYRyWNOCPhs0Z83ZEdB9dog7982BcNVqcyEtQxmsgtZbq61oBZegP-cGFcGHX0ytY_xwvK_kl9fziX43ZK6_VZ46u9QogUpHG0U0LT2ymLfOsynMqL4bvrkpM2lxPVl7N_FT-B3BWSELFJsgveHIjzcubvx10MszyLIdHQIPMUqktpZQZkgHzdvd6_xJHMabI3klMyEQwEuVZ3GcWZ7SA98oio9SgLAU8yjqw8OCnLYwwhbXmRK3Co',
    },
    {
      id: 'staff-2',
      name: 'Mehmet Bal',
      title: 'Kidemli Berber',
      state: 'available',
      nextAppointmentLabel: '14:00 - Omer G.',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBV1E_ghIUxwTw3oQ-BG1ym1YKqxGDFESD5yNT4V5Rm3cErLwVrDBo38GOKMBL7PzUpUbeyJTKKl4y_aWCmqNoWtxkMfHU9qlG7MEkjXiiJjiXlztwnvqgcAgg51T7FpDGBdcCnalAV_YH0hZxgAq2pDKAS2g2WYa3cx9ZSZDpqDMPtgxff4sG80L9Fs4pH1FzWE5QDfuL1Pg_hjYeswFn1p20UFCndT_3IMrGVBZ9ZIvfxEy3oIA3sZssCTEw8boBq3hS_V5Kj2sQ',
    },
    {
      id: 'staff-3',
      name: 'Veli Soylu',
      title: 'Mola Veriyor',
      state: 'break',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDT86t558JQ0U0nigqCFHsPhvSs8MbgcVCabI8_4wQ40ct_H6mT__VXpnyufzAK_u8seZs5LP0psORbIaxcF4F8VHncY8e4UPqVm3jcGaOnFRV99gkkR0lXiVNxUhEoFgEJ_mWxWDI6YbO4CbXVhKyUW923vrPO8U-FT8-8e1K6SvRxN5NqOcrkqJZ4zjgVbp29Pe2PpsgjsOch56r0RGe1FoSjdE5n3bdf5P7y68XuvmtYU4BRMrTtVdCcmoSi0xqBLo8OJLMsALc',
    },
  ],
};

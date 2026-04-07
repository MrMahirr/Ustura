export interface BookingProgressStep {
  id: 'service' | 'staff' | 'time';
  label: string;
  number: number;
}

export interface BookingStaffProfile {
  id: string;
  salonId: string;
  name: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  imageUri: string;
}

export const BOOKING_COPY = {
  pageTitle: 'Berberinizi secin',
  pageDescription: 'Size en uygun uzmani secin veya rastgele bir secimle devam edin.',
  anyBarberTitle: 'Herhangi Bir Berber',
  anyBarberDescription: 'Siradaki ilk musait uzmanla eslesin',
  footerBrand: 'THE OBSIDIAN ATELIER',
  backLabel: 'Geri',
  continueLabel: 'Devam Et',
  timeStepTitle: 'Zaman secim adimi hazirlaniyor.',
  timeStepDescription:
    'Berber secimi tamamlandi. Slot ve takvim servisi baglandiginda bu adim ayni akisin devaminda acilacak.',
  returnToStaffLabel: 'Berber Secimine Don',
} as const;

export const BOOKING_PROGRESS_STEPS: BookingProgressStep[] = [
  { id: 'service', label: 'Hizmet', number: 1 },
  { id: 'staff', label: 'Berber', number: 2 },
  { id: 'time', label: 'Zaman', number: 3 },
];

const BOOKING_STAFF: BookingStaffProfile[] = [
  {
    id: '1-melih',
    salonId: '1',
    name: 'Melih C.',
    specialty: 'Fade Uzmani',
    rating: 4.9,
    reviewCount: 128,
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBvT3Tp4XtBeP08HES0PeRjJbN0-R62FkJLOvQ_pn5GeYUYW8nZjUnMoQDgI3_cwpt9Tc7swi5_FSfHmYak7fleTPSFCTeKkEqOI-dsSGlZg_uTUUudTlDBWci91-Ezqe-Pvl9eMbfr2_YTp9caSDDRLRs0TgO1msqfItzb1t2dC__AwfYieSix0KYGySy2NQn-5b5MEXYIDc4_2YevGwMCJ_vltTIExHMdbPti4aP0EISoK_DC-PLxXdBmPZpf3VFKo2pDcRhtemc',
  },
  {
    id: '1-ahmet',
    salonId: '1',
    name: 'Ahmet Y.',
    specialty: 'Sakal Bakimi',
    rating: 4.8,
    reviewCount: 94,
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBUxWqvDxR5Y2o5EKDVeSqqVX_ttTKqC_XddmcWpYOS8NEGfdILMapR8ZCOod0MjKhlG_VMWUoPijy_O6pyXVTFEPToXCKb1ccYz8pC9xtNSDkA_tEYiNJuHoMIJayqfj0lh6bX3z4DUVixEGL5g35KCqD-89Np4-M74sJa7okapIbuVIerH88VMTp0pYCmelySUMfRE_tB5Jxywuda4g4wXnr_-rrFLImCBE_iaA-0gaHXpg86MtNYkcplhgQ7dJP8msXtQBOB81o',
  },
  {
    id: '1-canberk',
    salonId: '1',
    name: 'Canberk K.',
    specialty: 'Klasik Kesim',
    rating: 5.0,
    reviewCount: 56,
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBS66F6uPmWcEZIWrcJgkYvIiq9AZZ3bOBZHT6U0I1LzSrym9zcDuV9gmZrfkYOwmlzwB06yM5RyiOk-c4Ve6zt-Xd6RH2oGQC4cr3ieQbdwyQ243AFchtR263eIKjof7DJXoj2zCDRk2k33Ow7FHW0sUxYB2VeCqUxSXLzAdOvHcM3k2gRpDhIb_JEMMvmtiGlRLxFe85RMicpaMspx-84XOe_Adcm73n9I4klC0j0CJhdGHjvEEq4V5z7-4Kf_QsJ57RHVdGDUeM',
  },
  {
    id: '1-selim',
    salonId: '1',
    name: 'Selim E.',
    specialty: 'Modern Stil',
    rating: 4.7,
    reviewCount: 210,
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAHJmE4CubQlHqYrdaLsX-cV_VOu5Im_xFT4z3EEht2wn5V29zIeZTMd4Jj6aWW89umNvOzewsdjMDp_jagRjb5KK9bcOvThlWX_xsEHWbdj35DxkRcqChCFZyu8CnD3E4xUvZU9VBqKNeZvRinYd_Xrjb8ZPFmRvsWCR9NUwr121aOllzEQK1kn4RRBikJ4l0ql5AOjQYxs1_h5nQylsRzCGrjJqox9_Iul4iII3r-AhUTbWQc_1puRYmyoSSZ0Qh1JYZLdFDEOXU',
  },
  {
    id: '2-murat',
    salonId: '2',
    name: 'Murat K.',
    specialty: 'Premium Fade',
    rating: 4.9,
    reviewCount: 162,
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBvT3Tp4XtBeP08HES0PeRjJbN0-R62FkJLOvQ_pn5GeYUYW8nZjUnMoQDgI3_cwpt9Tc7swi5_FSfHmYak7fleTPSFCTeKkEqOI-dsSGlZg_uTUUudTlDBWci91-Ezqe-Pvl9eMbfr2_YTp9caSDDRLRs0TgO1msqfItzb1t2dC__AwfYieSix0KYGySy2NQn-5b5MEXYIDc4_2YevGwMCJ_vltTIExHMdbPti4aP0EISoK_DC-PLxXdBmPZpf3VFKo2pDcRhtemc',
  },
  {
    id: '2-emre',
    salonId: '2',
    name: 'Emre S.',
    specialty: 'Cizgi Sakal',
    rating: 4.8,
    reviewCount: 104,
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBUxWqvDxR5Y2o5EKDVeSqqVX_ttTKqC_XddmcWpYOS8NEGfdILMapR8ZCOod0MjKhlG_VMWUoPijy_O6pyXVTFEPToXCKb1ccYz8pC9xtNSDkA_tEYiNJuHoMIJayqfj0lh6bX3z4DUVixEGL5g35KCqD-89Np4-M74sJa7okapIbuVIerH88VMTp0pYCmelySUMfRE_tB5Jxywuda4g4wXnr_-rrFLImCBE_iaA-0gaHXpg86MtNYkcplhgQ7dJP8msXtQBOB81o',
  },
  {
    id: '2-arda',
    salonId: '2',
    name: 'Arda D.',
    specialty: 'Klasik Kesim',
    rating: 4.9,
    reviewCount: 81,
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBS66F6uPmWcEZIWrcJgkYvIiq9AZZ3bOBZHT6U0I1LzSrym9zcDuV9gmZrfkYOwmlzwB06yM5RyiOk-c4Ve6zt-Xd6RH2oGQC4cr3ieQbdwyQ243AFchtR263eIKjof7DJXoj2zCDRk2k33Ow7FHW0sUxYB2VeCqUxSXLzAdOvHcM3k2gRpDhIb_JEMMvmtiGlRLxFe85RMicpaMspx-84XOe_Adcm73n9I4klC0j0CJhdGHjvEEq4V5z7-4Kf_QsJ57RHVdGDUeM',
  },
  {
    id: '2-kerem',
    salonId: '2',
    name: 'Kerem T.',
    specialty: 'Modern Stil',
    rating: 4.7,
    reviewCount: 143,
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAHJmE4CubQlHqYrdaLsX-cV_VOu5Im_xFT4z3EEht2wn5V29zIeZTMd4Jj6aWW89umNvOzewsdjMDp_jagRjb5KK9bcOvThlWX_xsEHWbdj35DxkRcqChCFZyu8CnD3E4xUvZU9VBqKNeZvRinYd_Xrjb8ZPFmRvsWCR9NUwr121aOllzEQK1kn4RRBikJ4l0ql5AOjQYxs1_h5nQylsRzCGrjJqox9_Iul4iII3r-AhUTbWQc_1puRYmyoSSZ0Qh1JYZLdFDEOXU',
  },
  {
    id: '3-volkan',
    salonId: '3',
    name: 'Volkan T.',
    specialty: 'Master Fade',
    rating: 5.0,
    reviewCount: 192,
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBvT3Tp4XtBeP08HES0PeRjJbN0-R62FkJLOvQ_pn5GeYUYW8nZjUnMoQDgI3_cwpt9Tc7swi5_FSfHmYak7fleTPSFCTeKkEqOI-dsSGlZg_uTUUudTlDBWci91-Ezqe-Pvl9eMbfr2_YTp9caSDDRLRs0TgO1msqfItzb1t2dC__AwfYieSix0KYGySy2NQn-5b5MEXYIDc4_2YevGwMCJ_vltTIExHMdbPti4aP0EISoK_DC-PLxXdBmPZpf3VFKo2pDcRhtemc',
  },
  {
    id: '3-deniz',
    salonId: '3',
    name: 'Deniz A.',
    specialty: 'Sakal Kontur',
    rating: 4.9,
    reviewCount: 115,
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBUxWqvDxR5Y2o5EKDVeSqqVX_ttTKqC_XddmcWpYOS8NEGfdILMapR8ZCOod0MjKhlG_VMWUoPijy_O6pyXVTFEPToXCKb1ccYz8pC9xtNSDkA_tEYiNJuHoMIJayqfj0lh6bX3z4DUVixEGL5g35KCqD-89Np4-M74sJa7okapIbuVIerH88VMTp0pYCmelySUMfRE_tB5Jxywuda4g4wXnr_-rrFLImCBE_iaA-0gaHXpg86MtNYkcplhgQ7dJP8msXtQBOB81o',
  },
  {
    id: '3-ozan',
    salonId: '3',
    name: 'Ozan K.',
    specialty: 'Klasik Tiras',
    rating: 4.8,
    reviewCount: 88,
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBS66F6uPmWcEZIWrcJgkYvIiq9AZZ3bOBZHT6U0I1LzSrym9zcDuV9gmZrfkYOwmlzwB06Y2M5RyiOk-c4Ve6zt-Xd6RH2oGQC4cr3ieQbdwyQ243AFchtR263eIKjof7DJXoj2zCDRk2k33Ow7FHW0sUxYB2VeCqUxSXLzAdOvHcM3k2gRpDhIb_JEMMvmtiGlRLxFe85RMicpaMspx-84XOe_Adcm73n9I4klC0j0CJhdGHjvEEq4V5z7-4Kf_QsJ57RHVdGDUeM',
  },
  {
    id: '3-berk',
    salonId: '3',
    name: 'Berk A.',
    specialty: 'Modern Doku',
    rating: 4.7,
    reviewCount: 130,
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAHJmE4CubQlHqYrdaLsX-cV_VOu5Im_xFT4z3EEht2wn5V29zIeZTMd4Jj6aWW89umNvOzewsdjMDp_jagRjb5KK9bcOvThlWX_xsEHWbdj35DxkRcqChCFZyu8CnD3E4xUvZU9VBqKNeZvRinYd_Xrjb8ZPFmRvsWCR9NUwr121aOllzEQK1kn4RRBikJ4l0ql5AOjQYxs1_h5nQylsRzCGrjJqox9_Iul4iII3r-AhUTbWQc_1puRYmyoSSZ0Qh1JYZLdFDEOXU',
  },
];

export function getStaffBySalonId(salonId?: string) {
  const filtered = BOOKING_STAFF.filter((member) => member.salonId === salonId);

  if (filtered.length > 0) {
    return filtered;
  }

  return BOOKING_STAFF.filter((member) => member.salonId === '1');
}

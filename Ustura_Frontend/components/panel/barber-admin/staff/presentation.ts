import type { ComponentProps } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

import type { StaffRole } from '@/services/staff.service';

type IconName = ComponentProps<typeof MaterialIcons>['name'];

export const staffClassNames = {
  page: 'relative flex-1 overflow-hidden',
  content: 'w-full max-w-[1600px] self-center gap-6',
} as const;

export const STAFF_ROLE_LABELS: Record<StaffRole, string> = {
  barber: 'Berber',
  receptionist: 'Resepsiyon',
};

export const STAFF_ROLE_DESCRIPTIONS: Record<StaffRole, string> = {
  barber: 'Takvim ve servis akisini ustlenen aktif koltuk personeli.',
  receptionist: 'Karsilama, yonlendirme ve operasyon akisini yoneten ekip uyesi.',
};

export const STAFF_ROLE_ICONS: Record<StaffRole, IconName> = {
  barber: 'content-cut',
  receptionist: 'support-agent',
};

export const STAFF_ROLE_ACTION_LABELS: Record<StaffRole, string> = {
  barber: 'Kesim yetkisi',
  receptionist: 'Operasyon yetkisi',
};

export const STAFF_PERMISSION_HIGHLIGHTS: Record<StaffRole, string[]> = {
  barber: ['Randevu akisini gorur', 'Servis notlariyla calisir', 'Gunluk plan bloklarina dahil olur'],
  receptionist: ['Randevu organize eder', 'Musteri karsilama akisini yonetir', 'Oncelik ve yogunluk takibi yapar'],
};

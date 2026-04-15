import type { AuthUserRole } from '@/hooks/use-auth';

/** Panel copy for account subtitle (no UI here — single responsibility). */
export function authRoleLabel(role: AuthUserRole | null | undefined): string {
  switch (role) {
    case 'super_admin':
      return 'Sistem Yoneticisi';
    case 'owner':
      return 'Salon Sahibi';
    case 'barber':
      return 'Berber';
    case 'receptionist':
      return 'Resepsiyon';
    case 'customer':
      return 'Musteri';
    default:
      return 'Kullanici';
  }
}

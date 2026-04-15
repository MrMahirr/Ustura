import type { AuditLogAction, AuditLogEntityType, AuditLogRecord } from '@/services/audit-log.service';

import type { LogFilterOption, LogListItem, LogOverview, LogSeverity } from './types';

const ACTION_MAP: Record<AuditLogAction, { label: string; icon: string; severity: LogSeverity }> = {
  'auth.registered': { label: 'Kayıt Olundu', icon: 'person-add', severity: 'success' },
  'auth.logged_in': { label: 'Giriş Yapıldı', icon: 'login', severity: 'info' },
  'auth.google_customer_authenticated': { label: 'Google Girişi', icon: 'login', severity: 'info' },
  'auth.google_web_customer_authenticated': { label: 'Google Web Girişi', icon: 'login', severity: 'info' },
  'auth.refreshed': { label: 'Oturum Yenilendi', icon: 'refresh', severity: 'info' },
  'auth.logged_out': { label: 'Çıkış Yapıldı', icon: 'logout', severity: 'warning' },
  'staff.created': { label: 'Personel Eklendi', icon: 'person-add', severity: 'success' },
  'staff.updated': { label: 'Personel Güncellendi', icon: 'edit', severity: 'info' },
  'staff.deactivated': { label: 'Personel Devre Dışı', icon: 'person-off', severity: 'error' },
  'reservation.created': { label: 'Randevu Oluşturuldu', icon: 'event', severity: 'success' },
  'reservation.cancelled': { label: 'Randevu İptal Edildi', icon: 'event-busy', severity: 'error' },
  'reservation.status_updated': { label: 'Randevu Durumu Güncellendi', icon: 'update', severity: 'info' },
};

const ENTITY_TYPE_MAP: Record<AuditLogEntityType, string> = {
  user: 'Kullanıcı',
  staff: 'Personel',
  reservation: 'Randevu',
};

const ROLE_MAP: Record<string, string> = {
  super_admin: 'Super Admin',
  owner: 'Salon Sahibi',
  barber: 'Berber',
  receptionist: 'Resepsiyonist',
  customer: 'Müşteri',
};

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return 'Az önce';
  if (minutes < 60) return `${minutes} dk önce`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} saat önce`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} gün önce`;
  return formatTimestamp(iso);
}

function buildDetail(record: AuditLogRecord): string {
  const meta = record.metadata;
  const parts: string[] = [];

  if (meta.salonName) parts.push(`Salon: ${meta.salonName}`);
  if (meta.staffName) parts.push(`Personel: ${meta.staffName}`);
  if (meta.email) parts.push(`E-posta: ${meta.email}`);
  if (meta.reason) parts.push(`Sebep: ${meta.reason}`);
  if (meta.newStatus) parts.push(`Yeni Durum: ${meta.newStatus}`);

  return parts.length > 0 ? parts.join(' · ') : '';
}

export function mapAuditLogToListItem(record: AuditLogRecord): LogListItem {
  const actionInfo = ACTION_MAP[record.action] ?? {
    label: record.action,
    icon: 'info',
    severity: 'info' as LogSeverity,
  };

  return {
    id: record.id,
    actionLabel: actionInfo.label,
    actionIcon: actionInfo.icon,
    severity: actionInfo.severity,
    actorName: record.actorName ?? 'Sistem',
    actorRole: record.actorRole ? (ROLE_MAP[record.actorRole] ?? record.actorRole) : 'Bilinmiyor',
    entityTypeLabel: ENTITY_TYPE_MAP[record.entityType] ?? record.entityType,
    entityId: record.entityId,
    detail: buildDetail(record),
    timestamp: formatTimestamp(record.createdAt),
    relativeTime: formatRelativeTime(record.createdAt),
    rawAction: record.action,
    rawEntityType: record.entityType,
    metadata: record.metadata,
  };
}

export function buildOverview(items: AuditLogRecord[], total: number): LogOverview {
  const now = new Date();
  const todayStr = now.toDateString();

  return {
    total,
    todayCount: items.filter((i) => new Date(i.createdAt).toDateString() === todayStr).length,
    authCount: items.filter((i) => i.action.startsWith('auth.')).length,
    staffCount: items.filter((i) => i.action.startsWith('staff.')).length,
    reservationCount: items.filter((i) => i.action.startsWith('reservation.')).length,
  };
}

export const ACTION_FILTER_OPTIONS: LogFilterOption[] = [
  { label: 'Tümü', value: undefined },
  { label: 'Giriş Yapıldı', value: 'auth.logged_in' },
  { label: 'Kayıt Olundu', value: 'auth.registered' },
  { label: 'Çıkış Yapıldı', value: 'auth.logged_out' },
  { label: 'Personel Eklendi', value: 'staff.created' },
  { label: 'Personel Güncellendi', value: 'staff.updated' },
  { label: 'Personel Devre Dışı', value: 'staff.deactivated' },
  { label: 'Randevu Oluşturuldu', value: 'reservation.created' },
  { label: 'Randevu İptal Edildi', value: 'reservation.cancelled' },
  { label: 'Randevu Güncellendi', value: 'reservation.status_updated' },
];

export const ENTITY_FILTER_OPTIONS: LogFilterOption[] = [
  { label: 'Tümü', value: undefined },
  { label: 'Kullanıcı', value: 'user' },
  { label: 'Personel', value: 'staff' },
  { label: 'Randevu', value: 'reservation' },
];

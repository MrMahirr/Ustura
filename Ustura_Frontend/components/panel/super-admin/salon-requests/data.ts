import type { OwnerApplicationRecord } from '@/services/platform-admin.service';

import type {
  ApplicationStatusFilter,
  SalonRequestListItem,
  SalonRequestStats,
} from './types';

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

function formatAppliedDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return `Bugun, ${date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`;
  }
  if (diffDays === 1) {
    return `Dun, ${date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`;
  }
  if (diffDays < 7) {
    return `${diffDays} gun once`;
  }
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function mapApplicationToListItem(
  app: OwnerApplicationRecord,
): SalonRequestListItem {
  return {
    id: app.id,
    salonName: app.salonName,
    salonSlug: slugify(app.salonName),
    salonInitials: getInitials(app.salonName),
    applicantName: app.applicantName,
    applicantEmail: app.applicantEmail,
    applicantPhone: app.applicantPhone,
    city: app.salonCity,
    district: app.salonDistrict,
    appliedAtLabel: formatAppliedDate(app.createdAt),
    status: app.status,
    salonPhotoUrl: app.salonPhotoUrl,
    salonAddress: app.salonAddress,
    notes: app.notes,
  };
}

export function computeStats(
  applications: OwnerApplicationRecord[],
): SalonRequestStats {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);

  let pending = 0;
  let todayCount = 0;
  let approvedThisWeek = 0;
  let rejected = 0;

  for (const app of applications) {
    if (app.status === 'pending') pending++;
    if (app.status === 'rejected') rejected++;
    const created = new Date(app.createdAt);
    if (created >= todayStart) todayCount++;
    if (app.status === 'approved' && app.reviewedAt) {
      const reviewed = new Date(app.reviewedAt);
      if (reviewed >= weekAgo) approvedThisWeek++;
    }
  }

  return {
    total: applications.length,
    pending,
    todayCount,
    approvedThisWeek,
    rejected,
  };
}

export function filterApplications(
  items: SalonRequestListItem[],
  statusFilter: ApplicationStatusFilter,
  cityFilter: string | null,
  query: string,
): SalonRequestListItem[] {
  let result = items;

  if (statusFilter !== 'all') {
    result = result.filter((item) => item.status === statusFilter);
  }

  if (cityFilter) {
    result = result.filter((item) => item.city === cityFilter);
  }

  if (query.trim()) {
    const q = query.trim().toLowerCase();
    result = result.filter(
      (item) =>
        item.salonName.toLowerCase().includes(q) ||
        item.applicantName.toLowerCase().includes(q) ||
        item.applicantEmail.toLowerCase().includes(q),
    );
  }

  return result;
}

export function extractCities(items: SalonRequestListItem[]): string[] {
  const citySet = new Set<string>();
  for (const item of items) {
    citySet.add(item.city);
  }
  return Array.from(citySet).sort((a, b) => a.localeCompare(b, 'tr'));
}

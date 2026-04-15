import type { AuditLogAction, AuditLogEntityType } from '@/services/audit-log.service';

export type LogSeverity = 'info' | 'success' | 'warning' | 'error';

export interface LogListItem {
  id: string;
  actionLabel: string;
  actionIcon: string;
  severity: LogSeverity;
  actorName: string;
  actorRole: string;
  entityTypeLabel: string;
  entityId: string | null;
  detail: string;
  timestamp: string;
  relativeTime: string;
  rawAction: AuditLogAction;
  rawEntityType: AuditLogEntityType;
  metadata: Record<string, unknown>;
}

export interface LogFilterOption {
  label: string;
  value: string | undefined;
}

export interface LogOverview {
  total: number;
  todayCount: number;
  authCount: number;
  staffCount: number;
  reservationCount: number;
}

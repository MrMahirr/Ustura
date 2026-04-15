import { apiRequest } from './api';

export type AuditLogAction =
  | 'auth.registered'
  | 'auth.logged_in'
  | 'auth.google_customer_authenticated'
  | 'auth.google_web_customer_authenticated'
  | 'auth.refreshed'
  | 'auth.logged_out'
  | 'staff.created'
  | 'staff.updated'
  | 'staff.deactivated'
  | 'reservation.created'
  | 'reservation.cancelled'
  | 'reservation.status_updated';

export type AuditLogEntityType = 'user' | 'staff' | 'reservation';

export interface AuditLogRecord {
  id: string;
  actorUserId: string | null;
  actorRole: string | null;
  actorName: string | null;
  action: AuditLogAction;
  entityType: AuditLogEntityType;
  entityId: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface AuditLogListResponse {
  items: AuditLogRecord[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AuditLogQueryParams {
  page?: number;
  limit?: number;
  action?: AuditLogAction;
  entityType?: AuditLogEntityType;
  actorUserId?: string;
  entityId?: string;
}

export class AuditLogService {
  static async list(params: AuditLogQueryParams = {}): Promise<AuditLogListResponse> {
    const query: Record<string, string | number | undefined> = {};
    if (params.page) query.page = params.page;
    if (params.limit) query.limit = params.limit;
    if (params.action) query.action = params.action;
    if (params.entityType) query.entityType = params.entityType;
    if (params.actorUserId) query.actorUserId = params.actorUserId;
    if (params.entityId) query.entityId = params.entityId;

    return apiRequest<AuditLogListResponse>({
      path: '/admin/audit-logs',
      method: 'GET',
      query,
      auth: true,
    });
  }
}

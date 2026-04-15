import React from 'react';

import {
  AuditLogService,
  type AuditLogAction,
  type AuditLogEntityType,
  type AuditLogRecord,
} from '@/services/audit-log.service';

import {
  ACTION_FILTER_OPTIONS,
  ENTITY_FILTER_OPTIONS,
  buildOverview,
  mapAuditLogToListItem,
} from './data';
import type { LogFilterOption, LogListItem, LogOverview } from './types';

const PAGE_SIZE = 30;

export function useLogManagement() {
  const [query, setQuery] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [actionFilter, setActionFilter] = React.useState<AuditLogAction | undefined>(undefined);
  const [entityFilter, setEntityFilter] = React.useState<AuditLogEntityType | undefined>(undefined);

  const [rawItems, setRawItems] = React.useState<AuditLogRecord[]>([]);
  const [total, setTotal] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchLogs = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await AuditLogService.list({
        page,
        limit: PAGE_SIZE,
        action: actionFilter,
        entityType: entityFilter,
      });

      setRawItems(response.items);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (err: any) {
      const message = err instanceof Error ? err.message : 'Loglar yüklenemedi.';
      setError(message);
      setRawItems([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  }, [page, actionFilter, entityFilter]);

  React.useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const logItems: LogListItem[] = React.useMemo(() => {
    let items = rawItems.map(mapAuditLogToListItem);

    if (query.trim()) {
      const q = query.toLowerCase();
      items = items.filter(
        (item) =>
          item.actionLabel.toLowerCase().includes(q) ||
          item.actorName.toLowerCase().includes(q) ||
          item.actorRole.toLowerCase().includes(q) ||
          item.entityTypeLabel.toLowerCase().includes(q) ||
          item.detail.toLowerCase().includes(q),
      );
    }

    return items;
  }, [rawItems, query]);

  const overview: LogOverview = React.useMemo(
    () => buildOverview(rawItems, total),
    [rawItems, total],
  );

  const startRow = (page - 1) * PAGE_SIZE + 1;
  const endRow = Math.min(page * PAGE_SIZE, total);

  const handleActionFilterChange = React.useCallback((value: string | undefined) => {
    setActionFilter(value as AuditLogAction | undefined);
    setPage(1);
  }, []);

  const handleEntityFilterChange = React.useCallback((value: string | undefined) => {
    setEntityFilter(value as AuditLogEntityType | undefined);
    setPage(1);
  }, []);

  const resetFilters = React.useCallback(() => {
    setActionFilter(undefined);
    setEntityFilter(undefined);
    setQuery('');
    setPage(1);
  }, []);

  const selectedActionLabel = React.useMemo(() => {
    const option = ACTION_FILTER_OPTIONS.find((o) => o.value === actionFilter);
    return option?.label ?? 'Tümü';
  }, [actionFilter]);

  const selectedEntityLabel = React.useMemo(() => {
    const option = ENTITY_FILTER_OPTIONS.find((o) => o.value === entityFilter);
    return option?.label ?? 'Tümü';
  }, [entityFilter]);

  return {
    query,
    setQuery,
    page,
    setPage,
    totalPages,
    total,
    startRow,
    endRow,
    logItems,
    overview,
    isLoading,
    error,
    actionFilter,
    entityFilter,
    selectedActionLabel,
    selectedEntityLabel,
    actionFilterOptions: ACTION_FILTER_OPTIONS as LogFilterOption[],
    entityFilterOptions: ENTITY_FILTER_OPTIONS as LogFilterOption[],
    onActionFilterChange: handleActionFilterChange,
    onEntityFilterChange: handleEntityFilterChange,
    resetFilters,
    refresh: fetchLogs,
  };
}

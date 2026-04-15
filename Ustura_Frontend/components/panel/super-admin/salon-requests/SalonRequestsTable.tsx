import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import SalonRequestRow from './SalonRequestRow';
import {
  SALON_REQUEST_COPY,
  salonRequestClassNames,
} from './presentation';
import type { SalonRequestListItem } from './types';

interface SalonRequestsTableProps {
  items: SalonRequestListItem[];
  selectedId: string | null;
  isLoading: boolean;
  errorMessage: string | null;
  onSelect: (id: string) => void;
  onRetry: () => void;
}

function TableHeader() {
  const t = useSuperAdminTheme();

  const headers = [
    { label: SALON_REQUEST_COPY.colSalon, flex: 2 },
    { label: SALON_REQUEST_COPY.colApplicant, flex: 1.5 },
    { label: SALON_REQUEST_COPY.colCity, flex: 1 },
    { label: SALON_REQUEST_COPY.colDate, flex: 1 },
    { label: SALON_REQUEST_COPY.colStatus, flex: 1 },
    { label: SALON_REQUEST_COPY.colActions, flex: 0, width: 48, align: 'right' as const },
  ];

  return (
    <View
      className="flex-row"
      style={{
        borderBottomWidth: 1,
        borderBottomColor: hexToRgba(t.onSurface, 0.1),
        paddingVertical: 12,
        paddingHorizontal: 16,
      }}>
      {headers.map((h) => (
        <View
          key={h.label}
          style={{
            flex: h.flex || undefined,
            width: h.width,
            alignItems: h.align === 'right' ? 'flex-end' : undefined,
          }}>
          <Text
            className={salonRequestClassNames.headerText}
            style={{ color: t.onSurfaceVariant }}>
            {h.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

function EmptyState({ message }: { message: string }) {
  const t = useSuperAdminTheme();

  return (
    <View className="items-center justify-center py-20">
      <Text
        style={{
          color: t.onSurfaceVariant,
          fontSize: 14,
          fontWeight: '500',
        }}>
        {message}
      </Text>
    </View>
  );
}

export default function SalonRequestsTable({
  items,
  selectedId,
  isLoading,
  errorMessage,
  onSelect,
  onRetry,
}: SalonRequestsTableProps) {
  const t = useSuperAdminTheme();

  return (
    <View
      className={salonRequestClassNames.tableShell}
      style={{
        backgroundColor: t.pageBackgroundAccent,
        borderColor: hexToRgba(t.onSurface, 0.06),
      }}>
      <TableHeader />

      {isLoading ? (
        <View className="items-center justify-center py-20">
          <ActivityIndicator size="small" color={t.primary} />
          <Text style={{ color: t.onSurfaceVariant, marginTop: 8, fontSize: 12 }}>
            {SALON_REQUEST_COPY.loading}
          </Text>
        </View>
      ) : errorMessage ? (
        <View className="items-center justify-center py-20 gap-3">
          <Text style={{ color: t.error, fontSize: 14, fontWeight: '600' }}>
            {SALON_REQUEST_COPY.errorTitle}
          </Text>
          <Text style={{ color: t.onSurfaceVariant, fontSize: 12 }}>
            {errorMessage}
          </Text>
        </View>
      ) : items.length === 0 ? (
        <EmptyState message={SALON_REQUEST_COPY.noRequests} />
      ) : (
        items.map((item) => (
          <SalonRequestRow
            key={item.id}
            item={item}
            isSelected={selectedId === item.id}
            onSelect={() => onSelect(item.id)}
          />
        ))
      )}
    </View>
  );
}

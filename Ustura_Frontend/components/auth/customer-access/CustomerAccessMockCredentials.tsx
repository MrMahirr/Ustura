import React from 'react';
import { Text, View } from 'react-native';

import { CUSTOMER_ACCESS_COPY } from '@/components/auth/customer-access/presentation';
import { useAuthAccessTheme } from '@/components/auth/shared/use-auth-access-theme';
import { hexToRgba } from '@/utils/color';

function CredentialRow({ label, value }: { label: string; value: string }) {
  const theme = useAuthAccessTheme();

  return (
    <View
      className="rounded-lg border px-4 py-3"
      style={{
        gap: 4,
        backgroundColor: hexToRgba(theme.onSurfaceVariant, 0.04),
        borderColor: hexToRgba(theme.outlineVariant, 0.18),
      }}>
      <Text className="font-label text-[10px] font-bold uppercase tracking-[2px]" style={{ color: hexToRgba(theme.onSurfaceVariant, 0.7) }}>
        {label}
      </Text>
      <Text className="font-body text-sm font-bold" selectable style={{ color: theme.onSurface }}>
        {value}
      </Text>
    </View>
  );
}

export default function CustomerAccessMockCredentials() {
  const theme = useAuthAccessTheme();

  return (
    <View
      className="rounded-xl border px-4 py-4"
      style={{
        gap: 12,
        backgroundColor: hexToRgba(theme.primary, 0.07),
        borderColor: hexToRgba(theme.primary, 0.22),
      }}>
      <View style={{ gap: 4 }}>
        <Text className="font-label text-[11px] font-bold uppercase tracking-[2.4px]" style={{ color: theme.primary }}>
          {CUSTOMER_ACCESS_COPY.mockAccountTitle}
        </Text>
        <Text className="font-body text-sm" style={{ color: hexToRgba(theme.onSurfaceVariant, 0.86) }}>
          {CUSTOMER_ACCESS_COPY.mockAccountDescription}
        </Text>
      </View>

      <CredentialRow
        label={CUSTOMER_ACCESS_COPY.mockAccountIdentifierLabel}
        value={CUSTOMER_ACCESS_COPY.mockAccountIdentifierValue}
      />
      <CredentialRow
        label={CUSTOMER_ACCESS_COPY.mockAccountPasswordLabel}
        value={CUSTOMER_ACCESS_COPY.mockAccountPasswordValue}
      />

      <Text className="font-body text-xs" style={{ color: hexToRgba(theme.onSurfaceVariant, 0.72) }}>
        {CUSTOMER_ACCESS_COPY.mockAccountFootnote}
      </Text>
    </View>
  );
}

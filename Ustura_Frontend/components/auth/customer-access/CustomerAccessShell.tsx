import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  useWindowDimensions,
} from 'react-native';

import CustomerAccessBrandPanel from '@/components/auth/customer-access/CustomerAccessBrandPanel';
import { useAuthAccessTheme } from '@/components/auth/shared/use-auth-access-theme';
import { hexToRgba } from '@/utils/color';

interface CustomerAccessShellProps {
  children: React.ReactNode;
}

export default function CustomerAccessShell({
  children,
}: CustomerAccessShellProps) {
  const theme = useAuthAccessTheme();
  const { width } = useWindowDimensions();

  const isDesktop = width >= 960;
  const isCompact = width < 480;
  const formHorizontalPadding = isCompact ? 20 : width < 768 ? 28 : isDesktop ? 48 : 36;

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View className="flex-1" style={{ backgroundColor: theme.pageBackground }}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View
            style={[
              Platform.OS === 'web' ? ({ minHeight: '100vh' } as any) : null,
              {
                flexGrow: 1,
                flexDirection: isDesktop ? 'row' : 'column',
              },
            ]}>
            <CustomerAccessBrandPanel compact={isCompact} isDesktop={isDesktop} />

            <View
              className="items-center justify-center"
              style={{
                flex: 1,
                backgroundColor: theme.pageBackground,
                paddingHorizontal: formHorizontalPadding,
                paddingVertical: isDesktop ? 56 : isCompact ? 24 : 32,
              }}>
              {children}
            </View>
          </View>
        </ScrollView>

        <View
          pointerEvents="none"
          className="absolute inset-0"
          style={{
            borderWidth: isDesktop ? 20 : 12,
            borderColor: hexToRgba(
              theme.surfaceContainerLow,
              theme.theme === 'dark' ? 0.18 : 0.08
            ),
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import CustomerAccessField from '@/components/auth/customer-access/CustomerAccessField';
import CustomerAccessGoogleButton from '@/components/auth/customer-access/CustomerAccessGoogleButton';
import CustomerAccessMockCredentials from '@/components/auth/customer-access/CustomerAccessMockCredentials';
import CustomerAccessNoticeStrip from '@/components/auth/customer-access/CustomerAccessNoticeStrip';
import {
  CUSTOMER_ACCESS_COPY,
  type CustomerAccessState,
  type CustomerAuthNotice,
} from '@/components/auth/customer-access/presentation';
import { useAuthAccessTheme } from '@/components/auth/shared/use-auth-access-theme';
import Button from '@/components/ui/Button';
import ThemeToggleButton from '@/components/ui/ThemeToggleButton';
import { hexToRgba } from '@/utils/color';

interface CustomerAccessFormCardProps {
  compact: boolean;
  state: CustomerAccessState;
  notice: CustomerAuthNotice;
  identifier: string;
  password: string;
  rememberMe: boolean;
  identifierError?: string;
  passwordError?: string;
  onIdentifierChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onToggleRememberMe: () => void;
  onForgotPassword: () => void;
  onSubmit: () => void;
  onGoogleAccess: () => void;
  onRegisterPress: () => void;
}

export default function CustomerAccessFormCard({
  compact,
  state,
  notice,
  identifier,
  password,
  rememberMe,
  identifierError,
  passwordError,
  onIdentifierChange,
  onPasswordChange,
  onToggleRememberMe,
  onForgotPassword,
  onSubmit,
  onGoogleAccess,
  onRegisterPress,
}: CustomerAccessFormCardProps) {
  const theme = useAuthAccessTheme();
  const showNotice = state !== 'idle';

  return (
    <View
      className="relative w-full overflow-hidden rounded-xl border"
      style={{
        maxWidth: 500,
        paddingHorizontal: compact ? 24 : 36,
        paddingVertical: compact ? 28 : 40,
        backgroundColor: theme.surface,
        borderColor: hexToRgba(theme.outlineVariant, 0.15),
        ...(compact
          ? {}
          : {
              shadowColor: theme.theme === 'dark' ? '#000000' : theme.primary,
              shadowOpacity: theme.theme === 'dark' ? 0.24 : 0.12,
              shadowRadius: 28,
              shadowOffset: { width: 0, height: 18 },
              elevation: 12,
            }),
        ...(typeof document !== 'undefined'
          ? ({
              boxShadow:
                theme.theme === 'dark'
                  ? '0 26px 60px rgba(0, 0, 0, 0.34)'
                  : `0 26px 60px ${hexToRgba(theme.primary, 0.12)}`,
            } as any)
          : {}),
      }}>
      <View
        pointerEvents="none"
        className="absolute right-0 top-0"
        style={{
          width: compact ? 120 : 160,
          height: compact ? 120 : 160,
          backgroundColor: hexToRgba(theme.primary, 0.06),
          ...(typeof document !== 'undefined' ? ({ filter: 'blur(72px)' } as any) : {}),
        }}
      />

      <View className="relative z-10" style={{ gap: 28 }}>
        <View className="flex-row items-start justify-between" style={{ gap: 16 }}>
          <View style={{ flex: 1, gap: 8 }}>
            <Text className="font-headline text-3xl font-bold" style={{ color: theme.onSurface }}>
              {CUSTOMER_ACCESS_COPY.formTitle}
            </Text>
            <Text className="font-body text-sm font-light" style={{ color: hexToRgba(theme.secondary, 0.62) }}>
              {CUSTOMER_ACCESS_COPY.formDescription}
            </Text>
          </View>

          <ThemeToggleButton size="compact" />
        </View>

        <View style={{ gap: 18 }}>
          <CustomerAccessField
            label={CUSTOMER_ACCESS_COPY.identifierLabel}
            value={identifier}
            onChangeText={onIdentifierChange}
            placeholder={CUSTOMER_ACCESS_COPY.identifierPlaceholder}
            error={identifierError}
            keyboardType="email-address"
            textContentType="username"
            autoComplete="email"
          />

          <CustomerAccessField
            label={CUSTOMER_ACCESS_COPY.passwordLabel}
            value={password}
            onChangeText={onPasswordChange}
            placeholder={CUSTOMER_ACCESS_COPY.passwordPlaceholder}
            error={passwordError}
            secureTextEntry
            canToggleSecureEntry
            textContentType="password"
            autoComplete="current-password"
            actionLabel={CUSTOMER_ACCESS_COPY.forgotPasswordLabel}
            onActionPress={onForgotPassword}
          />
        </View>

        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: rememberMe }}
          className="flex-row items-center self-start"
          style={{ gap: 10 }}
          onPress={onToggleRememberMe}>
          {({ hovered, pressed }) => (
            <>
              <MaterialIcons
                name={rememberMe ? 'check-box' : 'check-box-outline-blank'}
                size={18}
                color={hovered || pressed || rememberMe ? theme.primary : hexToRgba(theme.onSurfaceVariant, 0.58)}
              />
              <Text className="font-body text-sm" style={{ color: hexToRgba(theme.onSurfaceVariant, 0.86) }}>
                {CUSTOMER_ACCESS_COPY.rememberMeLabel}
              </Text>
            </>
          )}
        </Pressable>

        <Button
          title={CUSTOMER_ACCESS_COPY.submitLabel}
          onPress={onSubmit}
          interactionPreset="cta"
          style={{ width: '100%' }}
        />

        <CustomerAccessMockCredentials />

        {showNotice ? <CustomerAccessNoticeStrip notice={notice} /> : null}

        <View className="relative items-center justify-center" style={{ marginVertical: 4 }}>
          <View
            className="absolute left-0 right-0 border-t"
            style={{ borderTopColor: hexToRgba(theme.outlineVariant, 0.2) }}
          />
          <View
            className="rounded-full px-4 py-1"
            style={{ backgroundColor: theme.surface }}>
            <Text
              className="font-label text-[10px] uppercase tracking-[2px]"
              style={{ color: hexToRgba(theme.onSurfaceVariant, 0.42) }}>
              {CUSTOMER_ACCESS_COPY.dividerLabel}
            </Text>
          </View>
        </View>

        <CustomerAccessGoogleButton
          label={CUSTOMER_ACCESS_COPY.googleLabel}
          onPress={onGoogleAccess}
        />

        <View className="items-center" style={{ gap: 6 }}>
          <Text className="font-body text-sm font-light" style={{ color: hexToRgba(theme.secondary, 0.54) }}>
            {CUSTOMER_ACCESS_COPY.registerPromptLabel}
          </Text>
          <Pressable accessibilityRole="button" onPress={onRegisterPress}>
            {({ hovered, pressed }) => (
              <Text
                className="font-body text-sm font-bold"
                style={{
                  color: hovered || pressed ? theme.primaryContainer : theme.primary,
                  textDecorationLine: hovered || pressed ? 'underline' : 'none',
                  textDecorationColor: hovered || pressed ? theme.primary : 'transparent',
                }}>
                {CUSTOMER_ACCESS_COPY.registerPromptAction}
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

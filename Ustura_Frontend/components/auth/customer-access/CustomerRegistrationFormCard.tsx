import React from 'react';
import { Pressable, Text, View } from 'react-native';

import CustomerAccessField from '@/components/auth/customer-access/CustomerAccessField';
import CustomerAccessNoticeStrip from '@/components/auth/customer-access/CustomerAccessNoticeStrip';
import CustomerAccessSelectField from '@/components/auth/customer-access/CustomerAccessSelectField';
import { CUSTOMER_REGISTRATION_COPY } from '@/components/auth/customer-access/presentation';
import type { CustomerAuthNotice } from '@/components/auth/customer-access/presentation';
import { useAuthAccessTheme } from '@/components/auth/shared/use-auth-access-theme';
import Button from '@/components/ui/Button';
import ThemeToggleButton from '@/components/ui/ThemeToggleButton';
import { hexToRgba } from '@/utils/color';

interface CustomerRegistrationFormCardProps {
  compact: boolean;
  showNotice: boolean;
  notice: CustomerAuthNotice;
  fullName: string;
  phone: string;
  email: string;
  password: string;
  selectedRoleLabel: string;
  submitLabel: string;
  submitDisabled?: boolean;
  fullNameError?: string;
  phoneError?: string;
  emailError?: string;
  passwordError?: string;
  roleError?: string;
  onFullNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onOpenRoleModal: () => void;
  onSubmit: () => void;
  onSignInPress: () => void;
}

export default function CustomerRegistrationFormCard({
  compact,
  showNotice,
  notice,
  fullName,
  phone,
  email,
  password,
  selectedRoleLabel,
  submitLabel,
  submitDisabled = false,
  fullNameError,
  phoneError,
  emailError,
  passwordError,
  roleError,
  onFullNameChange,
  onPhoneChange,
  onEmailChange,
  onPasswordChange,
  onOpenRoleModal,
  onSubmit,
  onSignInPress,
}: CustomerRegistrationFormCardProps) {
  const theme = useAuthAccessTheme();

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

      <View className="relative z-10" style={{ gap: 24 }}>
        <View className="flex-row items-start justify-between" style={{ gap: 16 }}>
          <View style={{ flex: 1, gap: 8 }}>
            <Text className="font-headline text-3xl font-bold" style={{ color: theme.onSurface }}>
              {CUSTOMER_REGISTRATION_COPY.formTitle}
            </Text>
            <Text className="font-body text-sm font-light" style={{ color: hexToRgba(theme.secondary, 0.62) }}>
              {CUSTOMER_REGISTRATION_COPY.formDescription}
            </Text>
          </View>

          <ThemeToggleButton size="compact" />
        </View>

        <View style={{ gap: 16 }}>
          <CustomerAccessField
            label={CUSTOMER_REGISTRATION_COPY.fullNameLabel}
            value={fullName}
            onChangeText={onFullNameChange}
            placeholder={CUSTOMER_REGISTRATION_COPY.fullNamePlaceholder}
            error={fullNameError}
            autoCapitalize="words"
            textContentType="name"
            autoComplete="name"
          />

          <CustomerAccessField
            label={CUSTOMER_REGISTRATION_COPY.phoneLabel}
            value={phone}
            onChangeText={onPhoneChange}
            placeholder={CUSTOMER_REGISTRATION_COPY.phonePlaceholder}
            error={phoneError}
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
            autoComplete="tel"
          />

          <CustomerAccessField
            label={CUSTOMER_REGISTRATION_COPY.emailLabel}
            value={email}
            onChangeText={onEmailChange}
            placeholder={CUSTOMER_REGISTRATION_COPY.emailPlaceholder}
            error={emailError}
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
          />

          <CustomerAccessField
            label={CUSTOMER_REGISTRATION_COPY.passwordLabel}
            value={password}
            onChangeText={onPasswordChange}
            placeholder={CUSTOMER_REGISTRATION_COPY.passwordPlaceholder}
            error={passwordError}
            secureTextEntry
            canToggleSecureEntry
            textContentType="newPassword"
            autoComplete="new-password"
          />

          <CustomerAccessSelectField
            label={CUSTOMER_REGISTRATION_COPY.roleLabel}
            value={selectedRoleLabel}
            placeholder={CUSTOMER_REGISTRATION_COPY.rolePlaceholder}
            error={roleError}
            onPress={onOpenRoleModal}
          />
        </View>

        <Button
          title={submitLabel}
          onPress={onSubmit}
          interactionPreset="cta"
          disabled={submitDisabled}
          style={{ width: '100%' }}
        />

        {showNotice ? <CustomerAccessNoticeStrip notice={notice} /> : null}

        <View className="items-center" style={{ gap: 6 }}>
          <Text className="font-body text-sm font-light" style={{ color: hexToRgba(theme.secondary, 0.54) }}>
            {CUSTOMER_REGISTRATION_COPY.signInPromptLabel}
          </Text>
          <Pressable accessibilityRole="button" onPress={onSignInPress}>
            {({ hovered, pressed }) => (
              <Text
                className="font-body text-sm font-bold"
                style={{
                  color: hovered || pressed ? theme.primaryContainer : theme.primary,
                  textDecorationLine: hovered || pressed ? 'underline' : 'none',
                  textDecorationColor: hovered || pressed ? theme.primary : 'transparent',
                }}>
                {CUSTOMER_REGISTRATION_COPY.signInPromptAction}
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, Pressable, Text, View } from 'react-native';

import {
  STAFF_ACCESS_COPY,
  type StaffAccessNotice,
  type StaffSalonOption,
} from '@/components/auth/staff-access/presentation';
import StaffAccessSalonModal from '@/components/auth/staff-access/StaffAccessSalonModal';
import AuthCredentialField from '@/components/auth/shared/AuthCredentialField';
import AuthSelectField from '@/components/auth/shared/AuthSelectField';
import AuthStatusNotice from '@/components/auth/shared/AuthStatusNotice';
import { useAuthAccessTheme } from '@/components/auth/shared/use-auth-access-theme';
import Button from '@/components/ui/Button';
import ThemeToggleButton from '@/components/ui/ThemeToggleButton';
import { hexToRgba } from '@/utils/color';

interface StaffAccessCardProps {
  compact: boolean;
  identifier: string;
  password: string;
  rememberMe: boolean;
  selectedSalonLabel: string;
  selectedSalonId: string;
  salonOptions: StaffSalonOption[];
  isSalonModalOpen: boolean;
  notice: StaffAccessNotice;
  identifierError?: string;
  passwordError?: string;
  onIdentifierChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onToggleRememberMe: () => void;
  onOpenSalonModal: () => void;
  onCloseSalonModal: () => void;
  onSalonSelect: (salonId: string) => void;
  onForgotPassword: () => void;
  onSubmit: () => void;
}

export default function StaffAccessCard({
  compact,
  identifier,
  password,
  rememberMe,
  selectedSalonLabel,
  selectedSalonId,
  salonOptions,
  isSalonModalOpen,
  notice,
  identifierError,
  passwordError,
  onIdentifierChange,
  onPasswordChange,
  onToggleRememberMe,
  onOpenSalonModal,
  onCloseSalonModal,
  onSalonSelect,
  onForgotPassword,
  onSubmit,
}: StaffAccessCardProps) {
  const theme = useAuthAccessTheme();
  const cardPadding = compact ? 24 : 32;
  const isDark = theme.theme === 'dark';
  const cardBackground = isDark ? '#13131C' : hexToRgba(theme.surfaceContainerLowest, 0.96);
  const cardBorderColor = isDark ? 'transparent' : hexToRgba(theme.onSurfaceVariant, 0.12);
  const barDarkStripe = isDark ? '#13131C' : theme.surfaceContainerLow;
  const barberPoleStyle =
    Platform.OS === 'web'
      ? ({
          backgroundImage:
            `repeating-linear-gradient(45deg, #C9A84C, #C9A84C 10px, ${barDarkStripe} 10px, ${barDarkStripe} 20px, #E6C364 20px, #E6C364 30px, ${barDarkStripe} 30px, ${barDarkStripe} 40px)`,
          opacity: isDark ? 0.3 : 0.42,
        } as any)
      : ({
          backgroundColor: hexToRgba(theme.primary, 0.28),
          opacity: isDark ? 0.5 : 0.3,
        } as const);

  return (
    <>
      <View
        className="relative overflow-hidden rounded-xl border"
        style={[
          {
            backgroundColor: cardBackground,
            borderColor: cardBorderColor,
          },
          Platform.OS === 'web'
            ? ({
                boxShadow: isDark
                  ? '0 26px 70px rgba(0, 0, 0, 0.38)'
                  : `0 24px 56px ${hexToRgba(theme.primary, 0.12)}`,
              } as any)
            : {
                shadowColor: isDark ? '#000000' : theme.primary,
                shadowOpacity: isDark ? 0.32 : 0.12,
                shadowRadius: isDark ? 26 : 18,
                shadowOffset: { width: 0, height: isDark ? 18 : 10 },
                elevation: isDark ? 12 : 7,
              },
        ]}>
        <LinearGradient
          colors={[hexToRgba(theme.primary, isDark ? 0.14 : 0.08), 'rgba(0,0,0,0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
        />

        <View className="h-0.5 w-full" style={barberPoleStyle} />

        <View style={{ paddingHorizontal: cardPadding, paddingVertical: compact ? 24 : 32 }}>
          <View className="mb-6 items-end">
            <ThemeToggleButton size="compact" />
          </View>

          <View style={{ gap: 24 }}>
            <AuthCredentialField
              label={STAFF_ACCESS_COPY.identifierLabel}
              value={identifier}
              onChangeText={onIdentifierChange}
              placeholder={STAFF_ACCESS_COPY.identifierPlaceholder}
              icon="person-outline"
              error={identifierError}
              autoComplete="email"
              textContentType="username"
            />

            <AuthCredentialField
              label={STAFF_ACCESS_COPY.passwordLabel}
              value={password}
              onChangeText={onPasswordChange}
              placeholder={STAFF_ACCESS_COPY.passwordPlaceholder}
              icon="lock-outline"
              error={passwordError}
              secureTextEntry
              canToggleSecureEntry
              textContentType="password"
              autoComplete="password"
              actionLabel={STAFF_ACCESS_COPY.forgotPasswordLabel}
              onActionPress={onForgotPassword}
            />

            <AuthSelectField
              label={STAFF_ACCESS_COPY.salonLabel}
              value={selectedSalonLabel}
              icon="storefront"
              onPress={onOpenSalonModal}
            />

            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: rememberMe }}
              className="flex-row items-center"
              style={{ gap: 10 }}
              onPress={onToggleRememberMe}>
              <MaterialIcons
                name={rememberMe ? 'check-box' : 'check-box-outline-blank'}
                size={18}
                color={rememberMe ? theme.primary : hexToRgba(theme.onSurfaceVariant, 0.54)}
              />
              <Text className="font-body text-sm font-medium" style={{ color: theme.onSurfaceVariant }}>
                {STAFF_ACCESS_COPY.rememberLabel}
              </Text>
            </Pressable>

            <AuthStatusNotice
              badge={notice.badge}
              title={notice.title}
              description={notice.description}
              tone={notice.tone}
            />

            <Button title={STAFF_ACCESS_COPY.submitLabel} onPress={onSubmit} interactionPreset="cta" style={{ width: '100%' }} />
          </View>
        </View>

        <View
          className="border-t px-4 py-4"
          style={{
            backgroundColor: hexToRgba(theme.surfaceContainerLowest, 0.5),
            borderTopColor: hexToRgba(theme.onSurfaceVariant, 0.08),
          }}>
          <View className="flex-row items-center justify-center" style={{ gap: 8 }}>
            <MaterialIcons name="gpp-maybe" size={16} color={hexToRgba(theme.error, 0.82)} />
            <Text
              className="font-label text-[10px] font-bold uppercase tracking-[2px]"
              style={{ color: hexToRgba(theme.error, 0.82) }}>
              {STAFF_ACCESS_COPY.restrictedAreaLabel}
            </Text>
          </View>
        </View>
      </View>

      <StaffAccessSalonModal
        visible={isSalonModalOpen}
        options={salonOptions}
        selectedSalonId={selectedSalonId}
        onClose={onCloseSalonModal}
        onSelect={onSalonSelect}
      />
    </>
  );
}

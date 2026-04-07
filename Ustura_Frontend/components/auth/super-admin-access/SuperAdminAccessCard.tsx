import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, Pressable, Text, View } from 'react-native';

import SuperAdminAccessConsole from '@/components/auth/super-admin-access/SuperAdminAccessConsole';
import SuperAdminAccessField from '@/components/auth/super-admin-access/SuperAdminAccessField';
import {
  SUPER_ADMIN_ACCESS_COPY,
  type SuperAdminAccessMessage,
} from '@/components/auth/super-admin-access/presentation';
import Button from '@/components/ui/Button';
import ThemeToggleButton from '@/components/ui/ThemeToggleButton';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

interface SuperAdminAccessCardProps {
  email: string;
  password: string;
  trustedDevice: boolean;
  message: SuperAdminAccessMessage;
  emailError?: string;
  passwordError?: string;
  compact: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onToggleTrustedDevice: () => void;
  onForgotPassword: () => void;
  onSubmit: () => void;
}

function getMessageAccentColor(message: SuperAdminAccessMessage, colors: ReturnType<typeof useSuperAdminTheme>) {
  switch (message.tone) {
    case 'error':
      return colors.error;
    case 'success':
      return colors.primary;
    case 'warning':
      return colors.primaryContainer;
    case 'neutral':
    default:
      return colors.tertiary;
  }
}

export default function SuperAdminAccessCard({
  email,
  password,
  trustedDevice,
  message,
  emailError,
  passwordError,
  compact,
  onEmailChange,
  onPasswordChange,
  onToggleTrustedDevice,
  onForgotPassword,
  onSubmit,
}: SuperAdminAccessCardProps) {
  const adminTheme = useSuperAdminTheme();
  const messageAccent = getMessageAccentColor(message, adminTheme);
  const cardPadding = compact ? 24 : 40;

  return (
    <View
      className="relative overflow-hidden rounded-lg border"
      style={[
        {
          paddingHorizontal: cardPadding,
          paddingTop: 14,
          paddingBottom: cardPadding,
          backgroundColor: hexToRgba(adminTheme.surface, 0.84),
          borderColor: hexToRgba(adminTheme.onSurfaceVariant, 0.1),
        },
        Platform.OS === 'web'
          ? ({
              backdropFilter: 'blur(14px)',
              boxShadow: '0 24px 64px rgba(0, 0, 0, 0.34)',
            } as any)
          : {
              shadowColor: '#000000',
              shadowOpacity: 0.26,
              shadowRadius: 26,
              shadowOffset: { width: 0, height: 16 },
              elevation: 10,
            },
      ]}>
      <LinearGradient
        colors={[hexToRgba(adminTheme.primary, 0.14), 'rgba(0, 0, 0, 0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
      />

      <View
        className="absolute left-0 right-0 top-0 flex-row items-center justify-between px-4 py-1.5"
        style={{ backgroundColor: adminTheme.surfaceContainerLow }}>
        <View className="flex-row items-center" style={{ gap: 6 }}>
          <View className="h-2 w-2 rounded-full" style={{ backgroundColor: hexToRgba(adminTheme.error, 0.4) }} />
          <View className="h-2 w-2 rounded-full" style={{ backgroundColor: hexToRgba(adminTheme.primary, 0.4) }} />
          <View className="h-2 w-2 rounded-full" style={{ backgroundColor: hexToRgba(adminTheme.tertiary, 0.4) }} />
        </View>

        <Text className="font-body text-[9px]" style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.42), fontFamily: adminTheme.monoFont }}>
          {SUPER_ADMIN_ACCESS_COPY.shellVersion}
        </Text>
      </View>

      <View className="mt-6" style={{ gap: 24 }}>
        <View className="items-end">
          <ThemeToggleButton size="compact" />
        </View>

        <View style={{ gap: 20 }}>
          <SuperAdminAccessField
            label={SUPER_ADMIN_ACCESS_COPY.emailLabel}
            value={email}
            onChangeText={onEmailChange}
            placeholder={SUPER_ADMIN_ACCESS_COPY.emailPlaceholder}
            error={emailError}
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
          />

          <SuperAdminAccessField
            label={SUPER_ADMIN_ACCESS_COPY.passwordLabel}
            value={password}
            onChangeText={onPasswordChange}
            placeholder={SUPER_ADMIN_ACCESS_COPY.passwordPlaceholder}
            error={passwordError}
            secureTextEntry
            canToggleSecureEntry
            textContentType="password"
            autoComplete="password"
            actionLabel={SUPER_ADMIN_ACCESS_COPY.forgotPasswordLabel}
            onActionPress={onForgotPassword}
          />
        </View>

        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: trustedDevice }}
          className="flex-row items-center"
          style={{ gap: 10 }}
          onPress={onToggleTrustedDevice}>
          <MaterialIcons
            name={trustedDevice ? 'check-box' : 'check-box-outline-blank'}
            size={18}
            color={trustedDevice ? adminTheme.primary : hexToRgba(adminTheme.onSurfaceVariant, 0.5)}
          />
          <Text className="font-body text-[11px]" style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.72) }}>
            {SUPER_ADMIN_ACCESS_COPY.trustedDeviceLabel}
          </Text>
        </Pressable>

        <View
          className="rounded-md border px-4 py-3"
          style={{
            backgroundColor: hexToRgba(messageAccent, 0.08),
            borderColor: hexToRgba(messageAccent, 0.24),
          }}>
          <View style={{ gap: 6 }}>
            <Text className="font-label text-[10px] uppercase tracking-[2px]" style={{ color: messageAccent }}>
              {message.badge}
            </Text>
            <Text className="font-body text-sm font-semibold" style={{ color: adminTheme.onSurface }}>
              {message.title}
            </Text>
            <Text className="font-body text-[12px] leading-5" style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.84) }}>
              {message.description}
            </Text>
          </View>
        </View>

        <Button title={SUPER_ADMIN_ACCESS_COPY.submitLabel} onPress={onSubmit} interactionPreset="cta" style={{ width: '100%' }} />
      </View>

      <SuperAdminAccessConsole entries={message.consoleEntries} />
    </View>
  );
}

import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, Text, View } from 'react-native';

import CustomerAccessAvatarStack from '@/components/auth/customer-access/CustomerAccessAvatarStack';
import {
  CUSTOMER_ACCESS_BARBER_PROFILES,
  CUSTOMER_ACCESS_COPY,
} from '@/components/auth/customer-access/presentation';
import { useAuthAccessTheme } from '@/components/auth/shared/use-auth-access-theme';
import { hexToRgba } from '@/utils/color';

interface CustomerAccessBrandPanelProps {
  compact: boolean;
  isDesktop: boolean;
}

export default function CustomerAccessBrandPanel({
  compact,
  isDesktop,
}: CustomerAccessBrandPanelProps) {
  const theme = useAuthAccessTheme();
  const horizontalPadding = compact ? 24 : isDesktop ? 72 : 40;
  const panelBackground =
    theme.theme === 'dark' ? theme.surfaceContainerLowest : theme.surfaceContainerLow;
  const bladePatternStyle =
    Platform.OS === 'web'
      ? ({
          backgroundImage:
            `linear-gradient(30deg, ${theme.surfaceContainerLow} 12%, transparent 12.5%, transparent 87%, ${theme.surfaceContainerLow} 87.5%, ${theme.surfaceContainerLow}), ` +
            `linear-gradient(150deg, ${theme.surfaceContainerLow} 12%, transparent 12.5%, transparent 87%, ${theme.surfaceContainerLow} 87.5%, ${theme.surfaceContainerLow}), ` +
            `linear-gradient(60deg, ${theme.surfaceContainerLow} 25%, transparent 25.5%, transparent 75%, ${theme.surfaceContainerLow} 75%, ${theme.surfaceContainerLow})`,
          backgroundSize: '80px 140px',
          opacity: theme.theme === 'dark' ? 0.15 : 0.08,
        } as any)
      : ({
          backgroundColor: hexToRgba(theme.surfaceContainerLow, theme.theme === 'dark' ? 0.32 : 0.16),
          opacity: 0.32,
        } as const);

  return (
    <View
      className="relative overflow-hidden"
      style={{
        flex: isDesktop ? 1 : undefined,
        minHeight: isDesktop ? undefined : compact ? 360 : 440,
        justifyContent: 'center',
        paddingHorizontal: horizontalPadding,
        paddingVertical: compact ? 36 : isDesktop ? 56 : 48,
        backgroundColor: panelBackground,
      }}>
      <View className="absolute inset-0" style={bladePatternStyle} />
      <LinearGradient
        colors={[
          hexToRgba(theme.pageBackground, theme.theme === 'dark' ? 0.92 : 0.28),
          'rgba(0,0,0,0)',
          hexToRgba(theme.primary, theme.theme === 'dark' ? 0.08 : 0.06),
        ]}
        start={{ x: 0, y: 0.3 }}
        end={{ x: 1, y: 0.7 }}
        style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
      />
      <View
        className="absolute -bottom-20 -left-20 rounded-full"
        style={{
          width: compact ? 220 : 320,
          height: compact ? 220 : 320,
          backgroundColor: hexToRgba(theme.primary, theme.theme === 'dark' ? 0.1 : 0.08),
          opacity: 1,
          ...(Platform.OS === 'web' ? ({ filter: 'blur(120px)' } as any) : {}),
        }}
      />

      <View className="relative z-10" style={{ maxWidth: 560, gap: compact ? 24 : 32 }}>
        <View className="flex-row items-center" style={{ gap: 14 }}>
          <MaterialIcons name="content-cut" size={compact ? 32 : 40} color={theme.primary} />
          <Text
            className="font-label text-[11px] uppercase tracking-[3px]"
            style={{ color: hexToRgba(theme.onSurfaceVariant, 0.62) }}>
            {CUSTOMER_ACCESS_COPY.eyebrow}
          </Text>
        </View>

        <View style={{ gap: 12 }}>
          <Text
            className="font-headline font-bold tracking-[-2px]"
            style={{
              color: theme.primary,
              fontSize: compact ? 54 : isDesktop ? 96 : 78,
              lineHeight: compact ? 58 : isDesktop ? 98 : 82,
            }}>
            {CUSTOMER_ACCESS_COPY.brandTitle}
          </Text>
          <Text
            className="font-headline italic"
            style={{
              color: hexToRgba(theme.onSurfaceVariant, theme.theme === 'dark' ? 0.92 : 0.82),
              fontSize: compact ? 24 : 32,
              lineHeight: compact ? 30 : 40,
            }}>
            {CUSTOMER_ACCESS_COPY.brandTagline}
          </Text>
        </View>

        <LinearGradient
          colors={[theme.primary, 'rgba(0,0,0,0)']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ width: compact ? 72 : 96, height: 4, borderRadius: 999 }}
        />

        <Text
          className="font-body font-light"
          style={{
            maxWidth: 360,
            color: hexToRgba(theme.secondary, 0.76),
            fontSize: compact ? 16 : 18,
            lineHeight: compact ? 24 : 30,
            letterSpacing: 0.2,
          }}>
          {CUSTOMER_ACCESS_COPY.brandDescription}
        </Text>

        <CustomerAccessAvatarStack
          label={CUSTOMER_ACCESS_COPY.brandRosterLabel}
          profiles={CUSTOMER_ACCESS_BARBER_PROFILES}
          compact={compact}
        />
      </View>

      <View
        style={
          isDesktop
            ? {
                position: 'absolute',
                bottom: 32,
                left: horizontalPadding,
              }
            : { marginTop: compact ? 28 : 36 }
        }>
        <Text
          className="font-label text-[10px] uppercase tracking-[2.2px]"
          style={{ color: hexToRgba(theme.onSurfaceVariant, 0.42) }}>
          {CUSTOMER_ACCESS_COPY.footerNote}
        </Text>
      </View>
    </View>
  );
}

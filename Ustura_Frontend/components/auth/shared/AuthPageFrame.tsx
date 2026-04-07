import { Link, type Href } from 'expo-router';
import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import {
  AUTH_FRAME_COPY,
  AUTH_LEGAL_LINKS,
  type AuthFrameLink,
} from '@/components/auth/shared/presentation';
import { useAuthAccessTheme } from '@/components/auth/shared/use-auth-access-theme';
import { hexToRgba } from '@/utils/color';

interface AuthPageFrameProps {
  children: React.ReactNode;
  topBarRight?: React.ReactNode;
  footerLinks?: AuthFrameLink[];
  footerNote: string;
  contentMaxWidth?: number;
}

interface FooterLinkProps {
  label: string;
  href?: Href;
  onPress?: () => void;
}

function FooterLink({ label, href, onPress }: FooterLinkProps) {
  const theme = useAuthAccessTheme();

  const content = (
    <Pressable accessibilityRole="button" onPress={onPress}>
      {({ hovered, pressed }) => (
        <Text
          className="font-label text-[10px] uppercase tracking-[1.6px]"
          style={{
            color: hovered || pressed ? theme.primary : hexToRgba(theme.onSurfaceVariant, 0.66),
          }}>
          {label}
        </Text>
      )}
    </Pressable>
  );

  if (!href) {
    return content;
  }

  return (
    <Link href={href} asChild>
      {content}
    </Link>
  );
}

export default function AuthPageFrame({
  children,
  topBarRight,
  footerLinks = AUTH_LEGAL_LINKS,
  footerNote,
  contentMaxWidth = 460,
}: AuthPageFrameProps) {
  const theme = useAuthAccessTheme();
  const { width } = useWindowDimensions();
  const horizontalPadding = width < 768 ? 24 : 32;
  const pageBackground = theme.theme === 'dark' ? '#0A0A0F' : theme.pageBackground;
  const topGlowColor = hexToRgba(theme.primary, theme.theme === 'dark' ? 0.06 : 0.1);
  const bottomGlowColor = hexToRgba(theme.surfaceContainerHighest, theme.theme === 'dark' ? 0.22 : 0.68);

  return (
    <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View className="flex-1" style={{ backgroundColor: pageBackground }}>
        <View
          className="absolute -right-[6%] -top-[10%] h-[280px] w-[280px] rounded-full"
          style={[
            { backgroundColor: topGlowColor },
            Platform.OS === 'web' ? ({ filter: 'blur(120px)' } as any) : null,
          ]}
        />
        <View
          className="absolute -bottom-[10%] -left-[6%] h-[300px] w-[300px] rounded-full"
          style={[
            { backgroundColor: bottomGlowColor },
            Platform.OS === 'web' ? ({ filter: 'blur(120px)' } as any) : null,
          ]}
        />

        <View
          className="absolute left-0 right-0 top-0 z-20 border-b"
          style={[
            {
              backgroundColor: hexToRgba(theme.surface, 0.82),
              borderBottomColor: hexToRgba(theme.onSurfaceVariant, 0.08),
            },
            Platform.OS === 'web' ? ({ backdropFilter: 'blur(16px)' } as any) : null,
          ]}>
          <View className="flex-row items-center justify-between px-6 py-4">
            <Text className="font-headline text-xl font-bold tracking-[-0.6px]" style={{ color: theme.primary }}>
              {AUTH_FRAME_COPY.brand}
            </Text>
            {topBarRight ?? <View />}
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'space-between',
            paddingTop: 88,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View className="flex-1 items-center justify-center" style={{ paddingHorizontal: horizontalPadding, paddingVertical: 48 }}>
            <View className="w-full" style={{ maxWidth: contentMaxWidth }}>
              {children}
            </View>
          </View>

          <View
            className="w-full px-8 py-6"
            style={{
              backgroundColor: theme.surface,
              borderTopWidth: 1,
              borderTopColor: hexToRgba(theme.onSurfaceVariant, 0.08),
              opacity: 0.82,
            }}>
            <View className="flex-col items-center justify-between gap-4 md:flex-row">
              <Text
                className="text-center font-label text-[10px] uppercase tracking-[1.6px] md:text-left"
                style={{ color: hexToRgba(theme.onSurfaceVariant, 0.8) }}>
                {footerNote}
              </Text>

              <View className="flex-row flex-wrap items-center justify-center" style={{ gap: 24 }}>
                {footerLinks.map((link) => (
                  <FooterLink key={link.label} label={link.label} href={link.href} onPress={link.onPress} />
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

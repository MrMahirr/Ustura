import { LinearGradient } from 'expo-linear-gradient';
import { Redirect, useRouter } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View, useWindowDimensions } from 'react-native';

import SuperAdminAccessCard from '@/components/auth/super-admin-access/SuperAdminAccessCard';
import SuperAdminAccessHeader from '@/components/auth/super-admin-access/SuperAdminAccessHeader';
import SuperAdminAccessIndicators from '@/components/auth/super-admin-access/SuperAdminAccessIndicators';
import SuperAdminAccessLegalFooter from '@/components/auth/super-admin-access/SuperAdminAccessLegalFooter';
import { SUPER_ADMIN_ACCESS_COPY } from '@/components/auth/super-admin-access/presentation';
import { useSuperAdminAccess } from '@/components/auth/super-admin-access/use-super-admin-access';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { useAuth } from '@/hooks/use-auth';
import { hexToRgba } from '@/utils/color';

export default function SuperAdminAccessScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const adminTheme = useSuperAdminTheme();
  const { isAuthenticated, role, loginSuperAdmin } = useAuth();
  const access = useSuperAdminAccess({
    onSubmitSuccess: async ({ email, password }) => {
      await loginSuperAdmin({ identifier: email, password });
      router.replace('/panel');
      return true;
    },
  });

  const isCompact = width < 480;
  const isDesktop = width >= 960;
  const horizontalPadding = width < 480 ? 20 : width < 768 ? 24 : 32;
  const footerPaddingBottom = isDesktop ? 32 : 20;

  if (isAuthenticated && role === 'super_admin') {
    return <Redirect href="/panel" />;
  }

  const gridOverlayStyle =
    Platform.OS === 'web'
      ? ({
          backgroundImage: `radial-gradient(circle at 2px 2px, ${hexToRgba(adminTheme.onSurface, 0.08)} 1px, transparent 0)`,
          backgroundSize: '40px 40px',
          opacity: 1,
          pointerEvents: 'none',
        } as any)
      : ({
          opacity: 0,
          pointerEvents: 'none',
        } as const);

  return (
    <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View className="flex-1" style={{ backgroundColor: adminTheme.pageBackground }}>
        <View className="absolute inset-0" style={gridOverlayStyle} />

        <LinearGradient
          colors={[hexToRgba(adminTheme.primary, 0.12), 'rgba(0, 0, 0, 0)']}
          start={{ x: 0.12, y: 0 }}
          end={{ x: 0.88, y: 0.82 }}
          style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
        />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'space-between',
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View
            className="flex-1 items-center justify-center"
            style={{
              paddingHorizontal: horizontalPadding,
              paddingTop: width < 768 ? 48 : 64,
              paddingBottom: isDesktop ? 128 : 56,
            }}>
            <View className="w-full max-w-[420px]" style={{ gap: 35 }}>
              <SuperAdminAccessHeader />

              <SuperAdminAccessCard
                compact={isCompact}
                email={access.email}
                password={access.password}
                trustedDevice={access.trustedDevice}
                message={access.message}
                submitLabel={
                  access.isSubmitting
                    ? 'Giris Yapiliyor'
                    : SUPER_ADMIN_ACCESS_COPY.submitLabel
                }
                submitDisabled={access.isSubmitting}
                emailError={access.fieldErrors.email}
                passwordError={access.fieldErrors.password}
                onEmailChange={access.handleEmailChange}
                onPasswordChange={access.handlePasswordChange}
                onToggleTrustedDevice={access.toggleTrustedDevice}
                onForgotPassword={access.handleForgotPassword}
                onSubmit={() => {
                  void access.handleSubmit();
                }}
              />

              <SuperAdminAccessIndicators />
            </View>
          </View>

          <View style={{ paddingBottom: footerPaddingBottom }}>
            <SuperAdminAccessLegalFooter onSystemStatusPress={access.handleSystemStatusPress} />
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

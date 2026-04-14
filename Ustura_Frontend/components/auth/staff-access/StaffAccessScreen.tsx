import { Link, Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';

import {
  STAFF_ACCESS_COPY,
  STAFF_ACCESS_SUPPORT_LINKS,
} from '@/components/auth/staff-access/presentation';
import StaffAccessCard from '@/components/auth/staff-access/StaffAccessCard';
import StaffAccessIdentity from '@/components/auth/staff-access/StaffAccessIdentity';
import { useStaffAccess } from '@/components/auth/staff-access/use-staff-access';
import AuthPageFrame from '@/components/auth/shared/AuthPageFrame';
import { useAuthAccessTheme } from '@/components/auth/shared/use-auth-access-theme';
import { useAuth } from '@/hooks/use-auth';
import { hexToRgba } from '@/utils/color';

const STAFF_ROLES = ['owner', 'barber', 'receptionist'] as const;

function decodeLoginToken(token: string | undefined): string | undefined {
  if (!token || typeof token !== 'string') return undefined;
  try {
    const base64 = token.replace(/-/g, '+').replace(/_/g, '/');
    const json = JSON.parse(atob(base64));
    return typeof json.email === 'string' ? json.email : undefined;
  } catch {
    return undefined;
  }
}

export default function StaffAccessScreen() {
  const { width } = useWindowDimensions();
  const theme = useAuthAccessTheme();
  const router = useRouter();
  const { isAuthenticated, role, loginStaff, mustChangePassword } = useAuth();
  const params = useLocalSearchParams<{ token?: string }>();

  const emailFromToken = React.useMemo(
    () => decodeLoginToken(params.token),
    [params.token],
  );

  const access = useStaffAccess({
    initialIdentifier: emailFromToken,
    onSubmitSuccess: async ({ identifier, password }) => {
      const profile = await loginStaff({ identifier, password });
      router.replace(
        profile.mustChangePassword ? '/personel/sifre-degistir' : '/berber',
      );
      return true;
    },
  });

  const isCompact = width < 480;

  if (isAuthenticated && role && STAFF_ROLES.includes(role as (typeof STAFF_ROLES)[number])) {
    if (mustChangePassword) {
      return <Redirect href="/personel/sifre-degistir" />;
    }
    return <Redirect href="/berber" />;
  }

  return (
    <AuthPageFrame
      footerLinks={STAFF_ACCESS_SUPPORT_LINKS}
      footerNote={STAFF_ACCESS_COPY.footerNote}
      contentMaxWidth={480}>
      <View style={{ gap: 32 }}>
        <StaffAccessIdentity />

        {emailFromToken ? (
          <View
            style={{
              backgroundColor: hexToRgba(theme.primary, 0.08),
              borderWidth: 1,
              borderColor: hexToRgba(theme.primary, 0.2),
              borderRadius: 8,
              padding: 16,
            }}>
            <Text
              className="font-body text-sm"
              style={{ color: theme.primary, fontWeight: '600', marginBottom: 4 }}>
              Hesabiniz onaylandi
            </Text>
            <Text
              className="font-body text-xs"
              style={{ color: theme.onSurfaceVariant }}>
              Gecici sifreniz e-posta adresinize gonderildi. Lutfen sifrenizi girerek giris yapin.
            </Text>
          </View>
        ) : null}

        <StaffAccessCard
          compact={isCompact}
          identifier={access.identifier}
          password={access.password}
          rememberMe={access.rememberMe}
          notice={access.notice}
          identifierError={access.fieldErrors.identifier}
          passwordError={access.fieldErrors.password}
          submitLabel={
            access.isSubmitting
              ? STAFF_ACCESS_COPY.submittingLabel
              : STAFF_ACCESS_COPY.submitLabel
          }
          submitDisabled={access.isSubmitting}
          onIdentifierChange={access.handleIdentifierChange}
          onPasswordChange={access.handlePasswordChange}
          onToggleRememberMe={access.toggleRememberMe}
          onForgotPassword={access.handleForgotPassword}
          onSubmit={() => {
            void access.handleSubmit();
          }}
        />

        <View className="items-center">
          <Link href="/giris" asChild>
            <Pressable accessibilityRole="button" className="flex-row items-center" style={{ gap: 8 }}>
              {({ hovered, pressed }) => (
                <>
                  <Text
                    className="font-body text-sm"
                    style={{ color: hexToRgba(theme.onSurfaceVariant, hovered || pressed ? 0.96 : 0.8) }}>
                    {STAFF_ACCESS_COPY.customerPromptLabel}
                  </Text>
                  <Text
                    className="border-b pb-0.5 font-body text-sm font-bold"
                    style={{
                      color: hovered || pressed ? theme.primaryContainer : theme.primary,
                      borderBottomColor: hovered || pressed ? theme.primaryContainer : hexToRgba(theme.primary, 0.3),
                    }}>
                    {STAFF_ACCESS_COPY.customerPromptAction}
                  </Text>
                </>
              )}
            </Pressable>
          </Link>
        </View>
      </View>
    </AuthPageFrame>
  );
}

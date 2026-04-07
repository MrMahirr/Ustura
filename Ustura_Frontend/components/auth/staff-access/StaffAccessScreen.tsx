import { Link } from 'expo-router';
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
import { hexToRgba } from '@/utils/color';

export default function StaffAccessScreen() {
  const { width } = useWindowDimensions();
  const theme = useAuthAccessTheme();
  const access = useStaffAccess();
  const isCompact = width < 480;

  return (
    <AuthPageFrame
      footerLinks={STAFF_ACCESS_SUPPORT_LINKS}
      footerNote={STAFF_ACCESS_COPY.footerNote}
      contentMaxWidth={480}>
      <View style={{ gap: 32 }}>
        <StaffAccessIdentity />

        <StaffAccessCard
          compact={isCompact}
          identifier={access.identifier}
          password={access.password}
          rememberMe={access.rememberMe}
          selectedSalonLabel={access.selectedSalon?.label ?? ''}
          selectedSalonId={access.selectedSalon?.id ?? ''}
          salonOptions={access.salonOptions}
          isSalonModalOpen={access.isSalonModalOpen}
          notice={access.notice}
          identifierError={access.fieldErrors.identifier}
          passwordError={access.fieldErrors.password}
          onIdentifierChange={access.handleIdentifierChange}
          onPasswordChange={access.handlePasswordChange}
          onToggleRememberMe={access.toggleRememberMe}
          onOpenSalonModal={access.openSalonModal}
          onCloseSalonModal={access.closeSalonModal}
          onSalonSelect={access.handleSalonSelect}
          onForgotPassword={access.handleForgotPassword}
          onSubmit={access.handleSubmit}
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

import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, Pressable, Text, View } from 'react-native';

import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';
import { showErrorFlash } from '@/utils/flash';
import { getPackagePanelShadow } from './presentation';

function showSaveError(message: string) {
  showErrorFlash('Kayit', message);
}

export default function PackageProfileFooter({
  onSave,
  saveDisabled,
}: {
  onSave: () => Promise<{ ok: true } | { ok: false; message: string }>;
  saveDisabled?: boolean;
}) {
  const adminTheme = useSuperAdminTheme();
  const [isSaving, setIsSaving] = React.useState(false);
  const saveBlocked = Boolean(saveDisabled) || isSaving;

  const handleSavePress = () => {
    void (async () => {
      if (saveDisabled) {
        return;
      }
      setIsSaving(true);
      try {
        const result = await onSave();
        if (!result.ok) {
          showSaveError(result.message);
        }
      } finally {
        setIsSaving(false);
      }
    })();
  };

  return (
    <View
      className="mt-8 flex-row flex-wrap items-center justify-between gap-4 rounded-[10px] border px-6 py-5"
      style={[
        {
          backgroundColor: adminTheme.cardBackground,
          borderColor: adminTheme.borderSubtle,
        },
        getPackagePanelShadow(adminTheme.theme),
      ]}>
      <View className="flex-row items-center gap-4">
        <Pressable
          className="flex-row items-center gap-2 rounded-md border px-4 py-3"
          style={({ hovered }) => [
            {
              backgroundColor: hovered ? hexToRgba(adminTheme.error, 0.05) : 'transparent',
              borderColor: hovered ? adminTheme.error : hexToRgba(adminTheme.outlineVariant, 0.3),
            },
            Platform.OS === 'web' ? ({ transition: 'all 150ms ease', cursor: 'pointer' } as any) : null,
          ]}>
          {({ hovered }) => (
            <>
              <MaterialIcons
                name="block"
                size={16}
                color={hovered ? adminTheme.error : hexToRgba(adminTheme.onSurfaceVariant, 0.8)}
              />
              <Text
                className="font-label text-[10px] uppercase tracking-widest"
                style={{
                  color: hovered ? adminTheme.error : adminTheme.onSurface,
                  fontFamily: 'Manrope-Bold',
                }}>
                Paketi Askiya Al
              </Text>
            </>
          )}
        </Pressable>
      </View>

      <Pressable
        onPress={handleSavePress}
        disabled={saveBlocked}
        className="rounded-md"
        style={({ pressed, hovered }) => [
          {
            opacity: saveBlocked ? 0.55 : 1,
            transform: [{ scale: pressed ? 0.985 : hovered ? 1.015 : 1 }],
          },
          Platform.OS === 'web'
            ? ({
                transition: 'transform 180ms ease, box-shadow 220ms ease',
                boxShadow: hovered
                  ? `0 18px 36px ${hexToRgba(adminTheme.primary, 0.22)}`
                  : `0 10px 24px ${hexToRgba(adminTheme.primary, 0.14)}`,
              } as any)
            : null,
        ]}>
        <LinearGradient
          colors={adminTheme.goldGradient as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            minHeight: 48,
            borderRadius: 6,
            paddingHorizontal: 32,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}>
          <MaterialIcons name="save" size={18} color={adminTheme.onPrimary} />
          <Text
            className="font-label text-xs uppercase tracking-widest"
            style={{ color: adminTheme.onPrimary, fontFamily: 'Manrope-Bold' }}>
            {isSaving ? 'Kaydediliyor...' : 'Degisiklikleri Kaydet'}
          </Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

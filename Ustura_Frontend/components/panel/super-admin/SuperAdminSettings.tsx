import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import { hexToRgba } from '@/utils/color';

import PanelTopBar from './PanelTopBar';
import SettingsTabBar from './settings/SettingsTabBar';
import { settingsClassNames } from './settings/presentation';
import EmailTab from './settings/tabs/EmailTab';
import GeneralTab from './settings/tabs/GeneralTab';
import ReservationTab from './settings/tabs/ReservationTab';
import SecurityTab from './settings/tabs/SecurityTab';
import SystemTab from './settings/tabs/SystemTab';
import { useSuperAdminTheme } from './theme';
import { SETTINGS_TABS, useSettings } from './settings/use-settings';

export default function SuperAdminSettings() {
  const { width } = useWindowDimensions();
  const adminTheme = useSuperAdminTheme();
  const state = useSettings();
  const [query, setQuery] = React.useState('');

  const paddingH = width < 768 ? 16 : 32;

  const overlayStyle =
    Platform.OS === 'web'
      ? ({
          backgroundImage: `radial-gradient(circle at 1px 1px, ${adminTheme.gridDot} 1px, transparent 0)`,
          backgroundSize: '40px 40px',
          opacity: 1,
          pointerEvents: 'none',
        } as any)
      : ({ opacity: 0, pointerEvents: 'none' } as const);

  if (state.loading) {
    return (
      <View
        className={settingsClassNames.page}
        style={{ backgroundColor: adminTheme.pageBackground }}>
        <PanelTopBar query={query} onQueryChange={setQuery} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={adminTheme.primary} />
        </View>
      </View>
    );
  }

  if (state.error || !state.settings) {
    return (
      <View
        className={settingsClassNames.page}
        style={{ backgroundColor: adminTheme.pageBackground }}>
        <PanelTopBar query={query} onQueryChange={setQuery} />
        <View className="flex-1 items-center justify-center gap-4 px-6">
          <MaterialIcons name="error-outline" size={48} color={adminTheme.error} />
          <Text
            className="text-center font-bold"
            style={{ color: adminTheme.error, fontSize: 16 }}>
            {state.error ?? 'Ayarlar yüklenemedi.'}
          </Text>
          <Pressable
            onPress={state.refresh}
            className="rounded-md px-6 py-3"
            style={{ backgroundColor: adminTheme.primary }}>
            <Text style={{ color: adminTheme.onPrimary, fontFamily: 'Manrope-Bold', fontSize: 13 }}>
              Tekrar Dene
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View
      className={settingsClassNames.page}
      style={{ backgroundColor: adminTheme.pageBackground }}>
      <View className="absolute inset-0" style={overlayStyle} />
      <PanelTopBar query={query} onQueryChange={setQuery} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: paddingH,
          paddingTop: 24,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}>
        <View className={settingsClassNames.content}>
          <SettingsHeader onRefresh={state.refresh} />

          <SettingsTabBar
            tabs={SETTINGS_TABS}
            activeTab={state.activeTab}
            onTabChange={state.setActiveTab}
          />

          <View style={{ minHeight: 300 }}>
            {state.activeTab === 'general' && (
              <GeneralTab settings={state.settings.general} />
            )}
            {state.activeTab === 'security' && (
              <SecurityTab settings={state.settings.security} />
            )}
            {state.activeTab === 'email' && (
              <EmailTab settings={state.settings.email} />
            )}
            {state.activeTab === 'reservation' && (
              <ReservationTab settings={state.settings.reservation} />
            )}
            {state.activeTab === 'system' && (
              <SystemTab settings={state.settings.integrations} />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function SettingsHeader({ onRefresh }: { onRefresh: () => void }) {
  const { width } = useWindowDimensions();
  const theme = useSuperAdminTheme();
  const isMobile = width < 768;

  return (
    <View
      style={{
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'flex-start' : 'center',
        gap: isMobile ? 12 : 0,
      }}>
      <View className="gap-1">
        <Text
          style={{
            color: theme.onSurface,
            fontFamily: 'Manrope-Bold',
            fontSize: isMobile ? 24 : 28,
            letterSpacing: -0.3,
          }}>
          Sistem Ayarları
        </Text>
        <Text
          style={{
            color: hexToRgba(theme.onSurfaceVariant, 0.65),
            fontSize: 14,
          }}>
          Platform yapılandırmasını ve entegrasyon durumlarını görüntüleyin.
        </Text>
      </View>

      <Pressable
        onPress={onRefresh}
        className="flex-row items-center gap-2 rounded-md border px-4 py-2.5"
        style={({ hovered }) => [
          {
            borderColor: hexToRgba(theme.onSurfaceVariant, 0.15),
          },
          Platform.OS === 'web' && hovered
            ? ({
                borderColor: hexToRgba(theme.primary, 0.4),
                backgroundColor: hexToRgba(theme.primary, 0.04),
                transition: 'border-color 180ms ease, background-color 180ms ease',
                cursor: 'pointer',
              } as any)
            : Platform.OS === 'web'
              ? ({ transition: 'border-color 180ms ease, background-color 180ms ease', cursor: 'pointer' } as any)
              : null,
        ]}>
        <MaterialIcons name="refresh" size={16} color={theme.primary} />
        <Text
          style={{
            color: theme.primary,
            fontFamily: 'Manrope-Bold',
            fontSize: 12,
            letterSpacing: 0.5,
          }}>
          Yenile
        </Text>
      </Pressable>
    </View>
  );
}

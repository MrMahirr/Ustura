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

import BarberTopBar from './BarberTopBar';
import BarberSettingsTabBar from './settings/BarberSettingsTabBar';
import { barberSettingsClassNames } from './settings/presentation';
import AccountTab from './settings/tabs/AccountTab';
import NotificationTab from './settings/tabs/NotificationTab';
import SalonInfoTab from './settings/tabs/SalonInfoTab';
import StorefrontTab from './settings/tabs/StorefrontTab';
import WorkingHoursTab from './settings/tabs/WorkingHoursTab';
import { useBarberAdminTheme } from './theme';
import { BARBER_SETTINGS_TABS, useBarberSettings } from './settings/use-barber-settings';

export default function BarberAdminSettings() {
  const { width } = useWindowDimensions();
  const theme = useBarberAdminTheme();
  const state = useBarberSettings();
  const [query, setQuery] = React.useState('');

  const paddingH = width < 768 ? 16 : 32;

  const overlayStyle =
    Platform.OS === 'web'
      ? ({
          backgroundImage: `radial-gradient(circle at 1px 1px, ${theme.dotOverlay} 1px, transparent 0)`,
          backgroundSize: '40px 40px',
          opacity: 1,
          pointerEvents: 'none',
        } as any)
      : ({ opacity: 0, pointerEvents: 'none' } as const);

  if (state.loading) {
    return (
      <View
        className={barberSettingsClassNames.page}
        style={{ backgroundColor: theme.pageBackground }}>
        <BarberTopBar query={query} onQueryChange={setQuery} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </View>
    );
  }

  if (state.error || !state.salon) {
    return (
      <View
        className={barberSettingsClassNames.page}
        style={{ backgroundColor: theme.pageBackground }}>
        <BarberTopBar query={query} onQueryChange={setQuery} />
        <View className="flex-1 items-center justify-center gap-4 px-6">
          <MaterialIcons name="error-outline" size={48} color={theme.error} />
          <Text
            className="text-center font-bold"
            style={{ color: theme.error, fontSize: 16 }}>
            {state.error ?? 'Salon bilgileri yüklenemedi.'}
          </Text>
          <Pressable
            onPress={state.refresh}
            className="rounded-md px-6 py-3"
            style={{ backgroundColor: theme.primary }}>
            <Text style={{ color: theme.onPrimary, fontFamily: 'Manrope-Bold', fontSize: 13 }}>
              Tekrar Dene
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View
      className={barberSettingsClassNames.page}
      style={{ backgroundColor: theme.pageBackground }}>
      <View className="absolute inset-0" style={overlayStyle} />
      <BarberTopBar query={query} onQueryChange={setQuery} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: paddingH,
          paddingTop: 24,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}>
        <View className={barberSettingsClassNames.content}>
          <SettingsPageHeader
            salonName={state.salon.name}
            onRefresh={state.refresh}
          />

          <BarberSettingsTabBar
            tabs={BARBER_SETTINGS_TABS}
            activeTab={state.activeTab}
            onTabChange={state.setActiveTab}
          />

          <View style={{ minHeight: 300 }}>
            {state.activeTab === 'salon-info' && (
              <SalonInfoTab
                salon={state.salon}
                saving={state.saving}
                saveSuccess={state.saveSuccess}
                saveError={state.saveError}
                onSave={state.updateSalonInfo}
              />
            )}
            {state.activeTab === 'storefront' && (
              <StorefrontTab
                salon={state.salon}
                saving={state.saving}
                saveSuccess={state.saveSuccess}
                saveError={state.saveError}
                onSavePhoto={state.updatePhotoUrl}
                onUploadPhoto={state.uploadPhotoFile}
                onRemovePhoto={state.removePhoto}
              />
            )}
            {state.activeTab === 'working-hours' && (
              <WorkingHoursTab
                salon={state.salon}
                saving={state.saving}
                saveSuccess={state.saveSuccess}
                saveError={state.saveError}
                onSave={state.updateWorkingHours}
              />
            )}
            {state.activeTab === 'notifications' && <NotificationTab />}
            {state.activeTab === 'account' && <AccountTab />}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function SettingsPageHeader({
  salonName,
  onRefresh,
}: {
  salonName: string;
  onRefresh: () => void;
}) {
  const { width } = useWindowDimensions();
  const theme = useBarberAdminTheme();
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
          Salon Ayarları
        </Text>
        <Text
          style={{
            color: hexToRgba(theme.onSurfaceVariant, 0.65),
            fontSize: 14,
          }}>
          {salonName} — bilgileri, vitrin görünümü ve çalışma saatlerini yönetin.
        </Text>
      </View>

      <Pressable
        onPress={onRefresh}
        className="flex-row items-center gap-2 rounded-md border px-4 py-2.5"
        style={({ hovered }) => [
          { borderColor: hexToRgba(theme.onSurfaceVariant, 0.15) },
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

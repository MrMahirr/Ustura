import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  Switch,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';

import { hexToRgba } from '@/utils/color';
import type { SalonRecord, WorkingHoursEntry } from '@/services/salon.service';

import { useBarberAdminTheme } from '../../theme';
import SettingsSection from '../SettingsSection';
import {
  getBarberInputStyle,
  getBarberInputWebStyle,
} from '../presentation';
import { DAY_LABELS, DAY_ORDER, type DayKey } from '../types';

interface WorkingHoursTabProps {
  salon: SalonRecord;
  saving: boolean;
  saveSuccess: boolean;
  saveError: string | null;
  onSave: (hours: Record<string, WorkingHoursEntry | null>) => Promise<void>;
}

type LocalSchedule = Record<DayKey, { isOpen: boolean; open: string; close: string }>;

function initLocalSchedule(wh: Record<string, WorkingHoursEntry | null>): LocalSchedule {
  const schedule = {} as LocalSchedule;
  for (const day of DAY_ORDER) {
    const entry = wh[day];
    schedule[day] = entry
      ? { isOpen: true, open: entry.open, close: entry.close }
      : { isOpen: false, open: '09:00', close: '18:00' };
  }
  return schedule;
}

function localToPayload(local: LocalSchedule): Record<string, WorkingHoursEntry | null> {
  const result: Record<string, WorkingHoursEntry | null> = {};
  for (const day of DAY_ORDER) {
    const entry = local[day];
    result[day] = entry.isOpen ? { open: entry.open, close: entry.close } : null;
  }
  return result;
}

function hasScheduleChanges(
  local: LocalSchedule,
  original: Record<string, WorkingHoursEntry | null>,
): boolean {
  for (const day of DAY_ORDER) {
    const loc = local[day];
    const orig = original[day];
    if (!loc.isOpen && !orig) continue;
    if (loc.isOpen !== !!orig) return true;
    if (orig && (loc.open !== orig.open || loc.close !== orig.close)) return true;
  }
  return false;
}

export default function WorkingHoursTab({
  salon,
  saving,
  saveSuccess,
  saveError,
  onSave,
}: WorkingHoursTabProps) {
  const { width } = useWindowDimensions();
  const theme = useBarberAdminTheme();
  const isMobile = width < 640;

  const [schedule, setSchedule] = React.useState<LocalSchedule>(() =>
    initLocalSchedule(salon.workingHours),
  );

  React.useEffect(() => {
    setSchedule(initLocalSchedule(salon.workingHours));
  }, [salon.workingHours]);

  const toggleDay = (day: DayKey) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], isOpen: !prev[day].isOpen },
    }));
  };

  const updateTime = (day: DayKey, field: 'open' | 'close', value: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const hasChanges = hasScheduleChanges(schedule, salon.workingHours);
  const inputStyle = getBarberInputStyle(theme);
  const webStyle = getBarberInputWebStyle();

  const handleSave = () => {
    void onSave(localToPayload(schedule));
  };

  return (
    <View className="gap-5">
      <SettingsSection
        title="Haftalık Program"
        icon="date-range"
        description="Her gün için açılış ve kapanış saatlerini ayarlayın.">
        <View className="gap-3">
          {DAY_ORDER.map((day) => {
            const entry = schedule[day];
            return (
              <View
                key={day}
                className="rounded-lg border p-4"
                style={{
                  borderColor: entry.isOpen
                    ? hexToRgba(theme.primary, 0.15)
                    : theme.borderSubtle,
                  backgroundColor: entry.isOpen
                    ? hexToRgba(theme.primary, 0.02)
                    : 'transparent',
                }}>
                <View
                  style={{
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    justifyContent: 'space-between',
                    gap: isMobile ? 12 : 16,
                  }}>
                  <View className="flex-row items-center gap-3" style={{ minWidth: 140 }}>
                    <Switch
                      value={entry.isOpen}
                      onValueChange={() => toggleDay(day)}
                      trackColor={{
                        false: hexToRgba(theme.onSurfaceVariant, 0.15),
                        true: hexToRgba(theme.primary, 0.4),
                      }}
                      thumbColor={entry.isOpen ? theme.primary : hexToRgba(theme.onSurfaceVariant, 0.4)}
                    />
                    <Text
                      style={{
                        color: entry.isOpen ? theme.onSurface : hexToRgba(theme.onSurfaceVariant, 0.5),
                        fontFamily: 'Manrope-Bold',
                        fontSize: 14,
                        minWidth: 90,
                      }}>
                      {DAY_LABELS[day]}
                    </Text>
                  </View>

                  {entry.isOpen ? (
                    <View className="flex-row items-center gap-3">
                      <TimeInput
                        value={entry.open}
                        onChange={(v) => updateTime(day, 'open', v)}
                        style={inputStyle}
                        webStyle={webStyle}
                        theme={theme}
                      />
                      <Text style={{ color: hexToRgba(theme.onSurfaceVariant, 0.4), fontSize: 14 }}>
                        —
                      </Text>
                      <TimeInput
                        value={entry.close}
                        onChange={(v) => updateTime(day, 'close', v)}
                        style={inputStyle}
                        webStyle={webStyle}
                        theme={theme}
                      />
                    </View>
                  ) : (
                    <Text
                      style={{
                        color: hexToRgba(theme.onSurfaceVariant, 0.35),
                        fontSize: 13,
                        fontStyle: 'italic',
                      }}>
                      Kapalı
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </SettingsSection>

      {(hasChanges || saveError || saveSuccess) && (
        <View className="flex-row items-center justify-between gap-3">
          <View className="flex-1">
            {saveError && (
              <Text style={{ color: theme.error, fontSize: 12, fontFamily: 'Manrope-Bold' }}>
                {saveError}
              </Text>
            )}
            {saveSuccess && (
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="check-circle" size={16} color={theme.success} />
                <Text style={{ color: theme.success, fontSize: 12, fontFamily: 'Manrope-Bold' }}>
                  Çalışma saatleri güncellendi.
                </Text>
              </View>
            )}
          </View>

          {hasChanges && (
            <Pressable
              onPress={handleSave}
              disabled={saving}
              className="flex-row items-center gap-2 rounded-lg px-6 py-3"
              style={{ backgroundColor: theme.primary, opacity: saving ? 0.6 : 1 }}>
              {saving ? (
                <ActivityIndicator size="small" color={theme.onPrimary} />
              ) : (
                <MaterialIcons name="save" size={16} color={theme.onPrimary} />
              )}
              <Text style={{ color: theme.onPrimary, fontFamily: 'Manrope-Bold', fontSize: 13 }}>
                Kaydet
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

function TimeInput({
  value,
  onChange,
  style,
  webStyle,
  theme,
}: {
  value: string;
  onChange: (v: string) => void;
  style: any;
  webStyle: any;
  theme: ReturnType<typeof useBarberAdminTheme>;
}) {
  return (
    <TextInput
      value={value}
      onChangeText={onChange}
      placeholder="HH:MM"
      placeholderTextColor={hexToRgba(theme.onSurfaceVariant, 0.4)}
      maxLength={5}
      style={[
        style,
        webStyle,
        {
          width: 80,
          textAlign: 'center' as const,
          fontFamily: Platform.select({
            web: 'ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
            default: 'monospace',
          }),
        },
      ]}
    />
  );
}

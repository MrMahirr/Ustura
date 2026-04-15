import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Modal, Platform, Pressable, ScrollView, Text, View } from 'react-native';

import { hexToRgba } from '@/utils/color';

import { useSuperAdminTheme } from '../theme';
import { getSeverityPalette } from './presentation';
import type { LogListItem } from './types';

interface LogDetailModalProps {
  log: LogListItem | null;
  visible: boolean;
  onClose: () => void;
}

export default function LogDetailModal({ log, visible, onClose }: LogDetailModalProps) {
  const adminTheme = useSuperAdminTheme();

  if (!log) return null;

  const severity = getSeverityPalette(log.severity, adminTheme);
  const metadataEntries = Object.entries(log.metadata).filter(
    ([, v]) => v != null && v !== '',
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <Pressable
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        onPress={onClose}>
        <Pressable
          className="m-4 w-full max-w-[560px] overflow-hidden rounded-xl"
          style={[
            { backgroundColor: adminTheme.cardBackground },
            Platform.OS === 'web'
              ? ({ boxShadow: '0 32px 72px rgba(0,0,0,0.4)' } as any)
              : { elevation: 16 },
          ]}
          onPress={() => {}}>
          <View
            className="flex-row items-center justify-between border-b px-6 py-5"
            style={{ borderBottomColor: adminTheme.borderSubtle }}>
            <View className="flex-row items-center gap-3">
              <View
                className="h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: severity.backgroundColor }}>
                <MaterialIcons
                  name={log.actionIcon as any}
                  size={20}
                  color={severity.color}
                />
              </View>
              <View className="gap-1">
                <Text
                  className="font-body text-base"
                  style={{ color: adminTheme.onSurface, fontFamily: 'Manrope-Bold' }}>
                  {log.actionLabel}
                </Text>
                <Text
                  className="font-body text-xs"
                  style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.72) }}>
                  {log.timestamp}
                </Text>
              </View>
            </View>
            <Pressable
              onPress={onClose}
              className="h-8 w-8 items-center justify-center rounded-md"
              style={({ hovered }) => [
                {
                  backgroundColor: hovered
                    ? hexToRgba(adminTheme.onSurface, 0.08)
                    : 'transparent',
                },
                Platform.OS === 'web'
                  ? ({
                      transition: 'background-color 160ms ease',
                      cursor: 'pointer',
                    } as any)
                  : null,
              ]}>
              <MaterialIcons name="close" size={20} color={adminTheme.onSurfaceVariant} />
            </Pressable>
          </View>

          <ScrollView
            className="max-h-[400px]"
            contentContainerStyle={{ padding: 24, gap: 20 }}
            showsVerticalScrollIndicator={false}>
            <DetailRow label="Kullanıcı" value={`${log.actorName} (${log.actorRole})`} />
            <DetailRow label="Varlık Tipi" value={log.entityTypeLabel} />
            {log.entityId && <DetailRow label="Varlık ID" value={log.entityId} mono />}
            {log.detail && <DetailRow label="Detay" value={log.detail} />}
            <DetailRow label="Önem Derecesi">
              <View
                className="self-start rounded-full border px-2.5 py-1"
                style={{
                  backgroundColor: severity.backgroundColor,
                  borderColor: severity.borderColor,
                }}>
                <Text
                  className="font-label text-[9px] uppercase tracking-[1px]"
                  style={{ color: severity.color, fontFamily: 'Manrope-Bold' }}>
                  {log.severity === 'info'
                    ? 'BİLGİ'
                    : log.severity === 'success'
                      ? 'BAŞARILI'
                      : log.severity === 'warning'
                        ? 'UYARI'
                        : 'KRİTİK'}
                </Text>
              </View>
            </DetailRow>

            {metadataEntries.length > 0 && (
              <View className="gap-3">
                <Text
                  className="font-label text-[10px] uppercase tracking-[2px]"
                  style={{
                    color: hexToRgba(adminTheme.onSurfaceVariant, 0.65),
                    fontFamily: 'Manrope-Bold',
                  }}>
                  Metadata
                </Text>
                <View
                  className="rounded-lg border p-4"
                  style={{
                    backgroundColor: adminTheme.cardBackgroundMuted,
                    borderColor: adminTheme.borderSubtle,
                  }}>
                  {metadataEntries.map(([key, value]) => (
                    <View key={key} className="flex-row justify-between py-1.5">
                      <Text
                        className="font-body text-xs"
                        style={{
                          color: hexToRgba(adminTheme.onSurfaceVariant, 0.72),
                          fontFamily: adminTheme.monoFont,
                        }}>
                        {key}
                      </Text>
                      <Text
                        className="max-w-[60%] text-right font-body text-xs"
                        style={{
                          color: adminTheme.onSurface,
                          fontFamily: adminTheme.monoFont,
                        }}
                        numberOfLines={2}>
                        {String(value)}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function DetailRow({
  label,
  value,
  mono,
  children,
}: {
  label: string;
  value?: string;
  mono?: boolean;
  children?: React.ReactNode;
}) {
  const adminTheme = useSuperAdminTheme();

  return (
    <View className="gap-1.5">
      <Text
        className="font-label text-[10px] uppercase tracking-[2px]"
        style={{
          color: hexToRgba(adminTheme.onSurfaceVariant, 0.65),
          fontFamily: 'Manrope-Bold',
        }}>
        {label}
      </Text>
      {children ?? (
        <Text
          className="font-body text-sm"
          style={{
            color: adminTheme.onSurface,
            fontFamily: mono ? adminTheme.monoFont : 'Manrope-Regular',
          }}>
          {value}
        </Text>
      )}
    </View>
  );
}

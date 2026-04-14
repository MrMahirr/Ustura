import React, { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import { SALON_REQUEST_COPY, salonRequestClassNames } from './presentation';
import type { DrawerTab, SalonRequestListItem } from './types';

interface SalonRequestDrawerProps {
  item: SalonRequestListItem;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string, reason?: string) => void;
  onOpenEditInfo: () => void;
  mutating: boolean;
}

const TABS: { key: DrawerTab; label: string }[] = [
  { key: 'general', label: SALON_REQUEST_COPY.tabGeneral },
  { key: 'documents', label: SALON_REQUEST_COPY.tabDocuments },
  { key: 'notes', label: SALON_REQUEST_COPY.tabNotes },
  { key: 'history', label: SALON_REQUEST_COPY.tabHistory },
];

function DrawerHeader({
  item,
  onClose,
}: {
  item: SalonRequestListItem;
  onClose: () => void;
}) {
  const t = useSuperAdminTheme();

  return (
    <View
      className="flex-row items-center justify-between"
      style={{
        padding: 24,
        borderBottomWidth: 1,
        borderBottomColor: hexToRgba(t.onSurface, 0.06),
      }}>
      <View className="flex-row items-center gap-4">
        <Pressable onPress={onClose} accessibilityRole="button">
          <MaterialIcons name="close" size={22} color={t.onSurface} />
        </Pressable>
        <Text
          style={{
            fontSize: 20,
            color: t.onSurface,
            fontFamily: Platform.select({
              web: 'Noto Serif, serif',
              default: 'serif',
            }),
            fontWeight: 'bold',
          }}>
          {SALON_REQUEST_COPY.drawerTitle}
        </Text>
      </View>

      {item.status === 'pending' ? (
        <View
          style={{
            paddingHorizontal: 12,
            paddingVertical: 4,
            backgroundColor: hexToRgba(t.warning, 0.1),
            borderWidth: 1,
            borderColor: hexToRgba(t.warning, 0.2),
            borderRadius: 999,
          }}>
          <Text
            style={{
              fontSize: 10,
              fontFamily: 'Manrope-Bold',
              color: t.warning,
              textTransform: 'uppercase',
              letterSpacing: -0.3,
            }}>
            {SALON_REQUEST_COPY.drawerActionRequired}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

function SalonSummary({ item }: { item: SalonRequestListItem }) {
  const t = useSuperAdminTheme();

  return (
    <View
      style={{
        padding: 32,
        backgroundColor: hexToRgba(t.surfaceContainerLow, 0.3),
        marginBottom: 16,
      }}>
      <View className="flex-row items-start gap-5" style={{ marginBottom: 24 }}>
        {item.salonPhotoUrl ? (
          <Image
            source={{ uri: item.salonPhotoUrl }}
            style={{
              width: 64,
              height: 64,
              borderRadius: 2,
              borderWidth: 1,
              borderColor: hexToRgba(t.primary, 0.2),
            }}
          />
        ) : (
          <View
            style={{
              width: 64,
              height: 64,
              backgroundColor: t.surfaceContainerHighest,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 2,
            }}>
            <Text
              style={{
                color: t.primary,
                fontFamily: 'Manrope-Bold',
                fontSize: 22,
              }}>
              {item.salonInitials}
            </Text>
          </View>
        )}
        <View className="flex-1">
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: t.onSurface,
              fontFamily: Platform.select({
                web: 'Noto Serif, serif',
                default: 'serif',
              }),
            }}>
            {item.salonName}
          </Text>
          <View className="flex-row items-center gap-2" style={{ marginTop: 4 }}>
            <MaterialIcons
              name="location-on"
              size={14}
              color={t.onSurfaceVariant}
            />
            <Text style={{ fontSize: 12, color: t.onSurfaceVariant }}>
              {item.salonAddress}
              {item.district ? `, ${item.district}` : ''}, {item.city}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function DrawerTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: DrawerTab;
  onTabChange: (tab: DrawerTab) => void;
}) {
  const t = useSuperAdminTheme();

  return (
    <View
      className="flex-row"
      style={{
        borderBottomWidth: 1,
        borderBottomColor: hexToRgba(t.onSurface, 0.1),
        paddingHorizontal: 32,
      }}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onTabChange(tab.key)}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderBottomWidth: 2,
              borderBottomColor: isActive ? t.primary : 'transparent',
            }}>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Manrope-Bold',
                color: isActive ? t.primary : t.onSurfaceVariant,
              }}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function OwnerInfoSection({ item }: { item: SalonRequestListItem }) {
  const t = useSuperAdminTheme();

  const fields = [
    { label: SALON_REQUEST_COPY.ownerName, value: item.applicantName, span: 1 },
    { label: SALON_REQUEST_COPY.ownerPhone, value: item.applicantPhone, span: 1 },
    {
      label: SALON_REQUEST_COPY.ownerEmail,
      value: item.applicantEmail,
      span: 2,
      underline: true,
    },
  ];

  return (
    <View>
      <Text
        style={{
          fontSize: 10,
          fontFamily: 'Manrope-Bold',
          color: t.primary,
          textTransform: 'uppercase',
          letterSpacing: 3,
          marginBottom: 16,
        }}>
        {SALON_REQUEST_COPY.ownerInfoTitle}
      </Text>
      <View
        style={{
          backgroundColor: t.surfaceContainerLow,
          padding: 20,
          borderRadius: 2,
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 24,
        }}>
        {fields.map((f) => (
          <View
            key={f.label}
            style={{ flexBasis: f.span === 2 ? '100%' : '45%' }}>
            <Text
              style={{
                fontSize: 10,
                fontFamily: 'Manrope-Bold',
                color: t.onSurfaceVariant,
                textTransform: 'uppercase',
                marginBottom: 4,
              }}>
              {f.label}
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '500',
                color: t.onSurface,
                textDecorationLine: f.underline ? 'underline' : 'none',
                textDecorationColor: hexToRgba(t.primary, 0.3),
              }}>
              {f.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function AddressSection({ item }: { item: SalonRequestListItem }) {
  const t = useSuperAdminTheme();

  return (
    <View>
      <Text
        style={{
          fontSize: 10,
          fontFamily: 'Manrope-Bold',
          color: t.primary,
          textTransform: 'uppercase',
          letterSpacing: 3,
          marginBottom: 16,
        }}>
        {SALON_REQUEST_COPY.salonAddress}
      </Text>
      <View
        style={{
          backgroundColor: t.surfaceContainerLow,
          padding: 20,
          borderRadius: 2,
        }}>
        <Text style={{ fontSize: 14, fontWeight: '500', color: t.onSurface }}>
          {item.salonAddress}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: t.onSurfaceVariant,
            marginTop: 4,
          }}>
          {item.district ? `${item.district}, ` : ''}
          {item.city}
        </Text>
      </View>
    </View>
  );
}

function NotesTab({ notes }: { notes: string | null }) {
  const t = useSuperAdminTheme();

  return (
    <View style={{ padding: 32 }}>
      <Text
        style={{
          fontSize: 10,
          fontFamily: 'Manrope-Bold',
          color: t.primary,
          textTransform: 'uppercase',
          letterSpacing: 3,
          marginBottom: 16,
        }}>
        {SALON_REQUEST_COPY.applicationNotes}
      </Text>
      {notes ? (
        <View
          style={{
            backgroundColor: t.surfaceContainerLow,
            padding: 20,
            borderRadius: 2,
          }}>
          <Text style={{ fontSize: 14, color: t.onSurface, lineHeight: 22 }}>
            {notes}
          </Text>
        </View>
      ) : (
        <Text style={{ fontSize: 14, color: t.onSurfaceVariant }}>
          {SALON_REQUEST_COPY.noNotes}
        </Text>
      )}
    </View>
  );
}

function DrawerFooter({
  item,
  onApprove,
  onReject,
  onOpenEditInfo,
  mutating,
}: {
  item: SalonRequestListItem;
  onApprove: () => void;
  onReject: (reason?: string) => void;
  onOpenEditInfo: () => void;
  mutating: boolean;
}) {
  const t = useSuperAdminTheme();
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  if (item.status !== 'pending') return null;

  if (showRejectInput) {
    return (
      <View
        style={{
          padding: 24,
          backgroundColor: t.surfaceContainerLow,
          borderTopWidth: 1,
          borderTopColor: hexToRgba(t.onSurface, 0.1),
          gap: 12,
        }}>
        <TextInput
          value={rejectReason}
          onChangeText={setRejectReason}
          placeholder={SALON_REQUEST_COPY.rejectReasonPlaceholder}
          placeholderTextColor={t.onSurfaceVariant}
          multiline
          style={{
            backgroundColor: t.surfaceContainerLowest,
            color: t.onSurface,
            padding: 12,
            fontSize: 13,
            minHeight: 80,
            borderRadius: 2,
            borderWidth: 1,
            borderColor: hexToRgba(t.error, 0.3),
            textAlignVertical: 'top',
          }}
        />
        <View className="flex-row gap-4">
          <Pressable
            onPress={() => setShowRejectInput(false)}
            style={{
              flex: 1,
              paddingVertical: 12,
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Manrope-Bold',
                color: t.onSurfaceVariant,
              }}>
              {SALON_REQUEST_COPY.rejectCancel}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => onReject(rejectReason.trim() || undefined)}
            disabled={mutating}
            style={{
              flex: 1,
              paddingVertical: 12,
              alignItems: 'center',
              backgroundColor: hexToRgba(t.error, 0.1),
              borderWidth: 1,
              borderColor: hexToRgba(t.error, 0.2),
              opacity: mutating ? 0.6 : 1,
            }}>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Manrope-Bold',
                color: t.error,
              }}>
              {SALON_REQUEST_COPY.rejectConfirm}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View
      className="flex-row gap-4"
      style={{
        padding: 24,
        backgroundColor: t.surfaceContainerLow,
        borderTopWidth: 1,
        borderTopColor: hexToRgba(t.onSurface, 0.1),
      }}>
      <Pressable
        onPress={onOpenEditInfo}
        disabled={mutating}
        style={{
          flex: 1,
          paddingVertical: 12,
          alignItems: 'center',
          opacity: mutating ? 0.5 : 1,
        }}>
        <Text
          style={{
            fontSize: 12,
            fontFamily: 'Manrope-Bold',
            color: t.onSurfaceVariant,
          }}>
          {SALON_REQUEST_COPY.editInfo}
        </Text>
      </Pressable>
      <Pressable
        onPress={() => setShowRejectInput(true)}
        style={{
          flex: 1,
          paddingVertical: 12,
          alignItems: 'center',
          borderWidth: 1,
          borderColor: hexToRgba(t.error, 0.2),
        }}>
        <Text
          style={{
            fontSize: 12,
            fontFamily: 'Manrope-Bold',
            color: t.error,
          }}>
          {SALON_REQUEST_COPY.reject}
        </Text>
      </Pressable>
      <Pressable
        onPress={onApprove}
        disabled={mutating}
        style={({ hovered }) => [
          {
            flex: 2,
            paddingVertical: 12,
            alignItems: 'center',
            backgroundColor: t.primary,
            opacity: mutating ? 0.6 : 1,
          },
          Platform.OS === 'web' && hovered
            ? ({ transform: [{ scale: 1.02 }] } as any)
            : null,
        ]}>
        <Text
          style={{
            fontSize: 12,
            fontFamily: 'Manrope-Bold',
            color: t.onPrimary,
          }}>
          {SALON_REQUEST_COPY.approveAndAssign}
        </Text>
      </Pressable>
    </View>
  );
}

export default function SalonRequestDrawer({
  item,
  onClose,
  onApprove,
  onReject,
  onOpenEditInfo,
  mutating,
}: SalonRequestDrawerProps) {
  const t = useSuperAdminTheme();
  const [activeTab, setActiveTab] = useState<DrawerTab>('general');

  return (
    <View
      style={[
        {
          position: 'absolute' as const,
          top: 0,
          right: 0,
          bottom: 0,
          width: salonRequestClassNames.drawerWidth,
          backgroundColor: t.surface,
          borderLeftWidth: 1,
          borderLeftColor: hexToRgba(t.onSurface, 0.1),
          zIndex: 60,
          flexDirection: 'column',
        },
        Platform.OS === 'web'
          ? ({
              boxShadow: '0 0 50px rgba(0,0,0,0.5)',
              transition: 'transform 300ms ease',
            } as any)
          : null,
      ]}>
      <DrawerHeader item={item} onClose={onClose} />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <SalonSummary item={item} />
        <DrawerTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'general' ? (
          <View style={{ padding: 32, gap: 32 }}>
            <OwnerInfoSection item={item} />
            <AddressSection item={item} />
          </View>
        ) : activeTab === 'notes' ? (
          <NotesTab notes={item.notes} />
        ) : activeTab === 'documents' ? (
          <View style={{ padding: 32 }}>
            <Text style={{ color: t.onSurfaceVariant, fontSize: 14 }}>
              Belge yonetimi yaklasimda...
            </Text>
          </View>
        ) : (
          <View style={{ padding: 32 }}>
            <Text style={{ color: t.onSurfaceVariant, fontSize: 14 }}>
              Gecmis kayitlari yaklasimda...
            </Text>
          </View>
        )}
      </ScrollView>

      <DrawerFooter
        item={item}
        onApprove={() => onApprove(item.id)}
        onReject={(reason) => onReject(item.id, reason)}
        onOpenEditInfo={onOpenEditInfo}
        mutating={mutating}
      />
    </View>
  );
}

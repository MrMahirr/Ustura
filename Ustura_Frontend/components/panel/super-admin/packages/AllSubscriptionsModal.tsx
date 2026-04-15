import React, { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';

import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { hexToRgba } from '@/utils/color';

import { packageClassNames } from './presentation';
import SubscriptionMobileCard from './SubscriptionMobileCard';
import SubscriptionRow from './SubscriptionRow';
import type { SubscriptionRecord } from './types';

interface AllSubscriptionsModalProps {
  visible: boolean;
  onClose: () => void;
  subscriptions: SubscriptionRecord[];
  onCancelSubscription?: (subscription: SubscriptionRecord) => void;
  cancelSubscriptionDisabled?: boolean;
}

export default function AllSubscriptionsModal({
  visible,
  onClose,
  subscriptions,
  onCancelSubscription,
  cancelSubscriptionDisabled,
}: AllSubscriptionsModalProps) {
  const adminTheme = useSuperAdminTheme();
  const { width } = useWindowDimensions();
  const useDesktopTable = width >= 980; // slightly lower breakpoint for modal table
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSubscriptions = React.useMemo(() => {
    if (!searchQuery.trim()) return subscriptions;
    const lowerQuery = searchQuery.toLocaleLowerCase('tr-TR');
    return subscriptions.filter(
      (sub) =>
        sub.salonName.toLocaleLowerCase('tr-TR').includes(lowerQuery) ||
        sub.packageName.toLocaleLowerCase('tr-TR').includes(lowerQuery),
    );
  }, [subscriptions, searchQuery]);

  return (
    <Modal visible={visible} onClose={onClose}>
      {/* Header */}
      <View
        className="flex-row items-center justify-between border-b px-6 py-5"
        style={{ borderBottomColor: adminTheme.borderSubtle }}>
        <View>
           <Text
             className="font-headline text-xl"
             style={{ color: adminTheme.onSurface }}>
             Abonelik Hareketleri
           </Text>
           <Text className="font-body text-xs mt-1" style={{color: hexToRgba(adminTheme.onSurfaceVariant, 0.7)}}>
             Platformdaki tum paket aboneliklerini inceleyin.
           </Text>
        </View>
        <Pressable
          onPress={onClose}
          className="h-8 w-8 items-center justify-center rounded-full"
          style={({ hovered }) => [
            {
              backgroundColor: hovered
                ? hexToRgba(adminTheme.onSurfaceVariant, 0.1)
                : 'transparent',
            },
            Platform.OS === 'web'
              ? ({ transition: 'background-color 150ms ease' } as any)
              : null,
          ]}>
          <MaterialIcons name="close" size={20} color={adminTheme.onSurface} />
        </Pressable>
      </View>
      
      {/* Search Bar - Fixed above scroll */}
      <View className="px-6 py-4 border-b" style={{ borderBottomColor: adminTheme.borderSubtle, backgroundColor: adminTheme.cardBackground }}>
          <Input 
            placeholder="Salon adi veya paket ara..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            iconLeft="search"
            containerStyle={{ marginTop: 0, borderBottomWidth: 0, backgroundColor: adminTheme.cardBackgroundMuted, borderRadius: 8 }}
            style={{ paddingVertical: 10 }}
          />
      </View>

      {/* Body */}
      <ScrollView
        style={
          Platform.OS === 'web'
            ? ({ maxHeight: '65vh' } as any)
            : { maxHeight: 500 }
        }
        contentContainerStyle={{ padding: 24 }}>
          
        {filteredSubscriptions.length === 0 ? (
           <View
              className="m-5 min-h-[150px] items-center justify-center gap-3 rounded-[10px] border px-6"
              style={{
                backgroundColor: adminTheme.cardBackgroundMuted,
                borderColor: adminTheme.borderSubtle,
              }}>
              <MaterialIcons
                name="search-off"
                size={32}
                color={hexToRgba(adminTheme.onSurfaceVariant, 0.8)}
              />
              <Text
                className={packageClassNames.emptyTitle}
                style={{ color: adminTheme.onSurface, fontFamily: 'Manrope-Bold' }}>
                Sonuc bulunamadi
              </Text>
            </View>
        ) : useDesktopTable ? (
           <View className="rounded-[10px] border overflow-hidden" style={{ borderColor: adminTheme.borderSubtle }}>
              {/* Table header */}
              <View
                className="min-h-[52px] flex-row items-center border-b px-5"
                style={{
                  backgroundColor: adminTheme.tableHeaderBackground,
                  borderBottomColor: adminTheme.borderSubtle,
                }}>
                <Text
                  className={packageClassNames.headerText}
                  style={{ flex: 2, color: hexToRgba(adminTheme.onSurfaceVariant, 0.7), fontFamily: 'Manrope-Bold' }}>
                  Salon Adi
                </Text>
                <Text
                  className={packageClassNames.headerText}
                  style={{ flex: 1.2, color: hexToRgba(adminTheme.onSurfaceVariant, 0.7), fontFamily: 'Manrope-Bold' }}>
                  Paket
                </Text>
                <Text
                  className={packageClassNames.headerText}
                  style={{ flex: 1, color: hexToRgba(adminTheme.onSurfaceVariant, 0.7), fontFamily: 'Manrope-Bold' }}>
                  Baslangic
                </Text>
                <Text
                  className={packageClassNames.headerText}
                  style={{ flex: 1, color: hexToRgba(adminTheme.onSurfaceVariant, 0.7), fontFamily: 'Manrope-Bold' }}>
                  Bitis
                </Text>
                <Text
                  className={packageClassNames.headerText}
                  style={{ flex: 1, color: hexToRgba(adminTheme.onSurfaceVariant, 0.7), fontFamily: 'Manrope-Bold' }}>
                  Durum
                </Text>
                <Text
                  className={packageClassNames.headerText}
                  style={{
                    flex: 1,
                    minWidth: 108,
                    color: hexToRgba(adminTheme.onSurfaceVariant, 0.7),
                    textAlign: 'right',
                    fontFamily: 'Manrope-Bold',
                  }}>
                  Islem
                </Text>
              </View>

              {/* Rows */}
              <View>
                {filteredSubscriptions.map((sub, index) => (
                  <View
                    key={sub.id}
                    style={
                      index < filteredSubscriptions.length - 1
                        ? { borderBottomColor: adminTheme.borderSubtle, borderBottomWidth: 1 }
                        : undefined
                    }>
                    <SubscriptionRow
                      subscription={sub}
                      onCancelSubscription={
                        onCancelSubscription ? () => onCancelSubscription(sub) : undefined
                      }
                      cancelDisabled={cancelSubscriptionDisabled}
                    />
                  </View>
                ))}
              </View>
           </View>
        ) : (
           <View className="gap-3">
              {filteredSubscriptions.map((sub) => (
                <SubscriptionMobileCard
                  key={sub.id}
                  subscription={sub}
                  onCancelSubscription={
                    onCancelSubscription ? () => onCancelSubscription(sub) : undefined
                  }
                  cancelDisabled={cancelSubscriptionDisabled}
                />
              ))}
           </View>
        )}
      </ScrollView>
    </Modal>
  );
}

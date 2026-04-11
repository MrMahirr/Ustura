import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Pressable, Switch, Text, View } from 'react-native';

import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import Input from '@/components/ui/Input';
import { hexToRgba } from '@/utils/color';

import { getPackagePanelShadow } from './presentation';

export default function PackageFeaturesSection({ formState }: { formState: any }) {
  const adminTheme = useSuperAdminTheme();

  return (
    <View
      className="gap-6 rounded-[10px] border p-[26px]"
      style={[
        {
          backgroundColor: adminTheme.cardBackground,
          borderColor: adminTheme.borderSubtle,
        },
        getPackagePanelShadow(adminTheme.theme),
      ]}>
      <View className="flex-row items-center justify-between">
        <View className="flex-1 mr-4">
          <Text
            className="mb-1 font-headline text-2xl tracking-[-0.4px]"
            style={{ color: adminTheme.onSurface }}>
            Servisler ve Ozellikler
          </Text>
          <Text
            className="font-body text-sm"
            style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.7) }}>
            Salona saglanacak platform ayricaliklari.
          </Text>
        </View>
        <Pressable
          onPress={formState.addFeature}
          className="flex-row items-center gap-1.5 rounded-md px-3 py-2 border"
          style={({ hovered }) => [
            {
              backgroundColor: hovered ? hexToRgba(adminTheme.primary, 0.1) : 'transparent',
              borderColor: hovered ? adminTheme.primary : adminTheme.outlineVariant,
            },
            Platform.OS === 'web' ? ({ transition: 'background-color 150ms ease, border-color 150ms ease', cursor: 'pointer' } as any) : null,
          ]}
        >
          <MaterialIcons name="add" size={16} color={adminTheme.primary} />
          <Text className="font-label text-[10px] uppercase tracking-widest" style={{ color: adminTheme.primary, fontFamily: 'Manrope-Bold' }}>
            Yeni Ekle
          </Text>
        </Pressable>
      </View>

      <View className="gap-3">
        {formState.features.map((feature: any, index: number) => (
          <View
            key={`feature-${index}`}
            className="flex-row items-center justify-between rounded-md border"
            style={{
              backgroundColor: adminTheme.cardBackgroundMuted,
              borderColor: feature.included ? hexToRgba(adminTheme.primary, 0.3) : adminTheme.borderSubtle,
            }}>
             <View className="flex-1 flex-row items-center pl-4 pr-2 py-1">
               <View className="flex-1 mr-3 relative -top-1.5">
                  <Input 
                    value={feature.label}
                    onChangeText={(text) => formState.handleFeatureLabelChange(text, index)}
                    containerStyle={{ borderBottomWidth: 0, marginTop: 0 }}
                    style={{ paddingVertical: 8, fontSize: 13 }}
                  />
               </View>
               <Switch
                 value={feature.included}
                 onValueChange={() => formState.handleToggleFeature(index)}
                 trackColor={{ false: adminTheme.cardBackgroundStrong, true: hexToRgba(adminTheme.primary, 0.5) }}
                 thumbColor={feature.included ? adminTheme.primary : hexToRgba(adminTheme.onSurfaceVariant, 0.4)}
                 ios_backgroundColor={adminTheme.cardBackgroundStrong}
               />
             </View>
             
             <Pressable 
                onPress={() => formState.removeFeature(index)}
                className="h-full px-3 items-center justify-center border-l"
                style={({ hovered }) => [
                  { 
                    borderLeftColor: adminTheme.borderSubtle,
                    backgroundColor: hovered ? hexToRgba(adminTheme.error, 0.1) : 'transparent' 
                  },
                  Platform.OS === 'web' ? ({ transition: 'background-color 150ms ease', cursor: 'pointer' } as any) : null
                ]}>
                {({ hovered }) => (
                   <MaterialIcons name="delete-outline" size={18} color={hovered ? adminTheme.error : hexToRgba(adminTheme.onSurfaceVariant, 0.6)} />
                )}
             </Pressable>
          </View>
        ))}
        {formState.features.length === 0 && (
          <Text className="text-center font-body text-sm py-6" style={{color: hexToRgba(adminTheme.onSurfaceVariant, 0.6)}}>
            Henuz hic bir ozellik eklenmemis. Yeni Ekle butonu ile pakete can verebilirsiniz.
          </Text>
        )}
      </View>
    </View>
  );
}

import React from 'react';
import { Switch, Text, View } from 'react-native';

import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import Input from '@/components/ui/Input';
import { hexToRgba } from '@/utils/color';

import { getPackagePanelShadow } from './presentation';

export default function PackageIdentityCard({ formState }: { formState: any }) {
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
      <View>
        <Text
          className="mb-1 font-headline text-2xl tracking-[-0.4px]"
          style={{ color: adminTheme.onSurface }}>
          Temel Bilgiler
        </Text>
        <Text
          className="font-body text-sm"
          style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.7) }}>
          Paket isimlendirmesi ve fiyatlandirma tabani.
        </Text>
      </View>

      <View className="gap-5">
        <Input
          label="Paket Adi (ornegin: Baslangic)"
          value={formState.name}
          onChangeText={formState.setName}
          iconLeft="title"
        />
        <Input
          label="Tier Etiketi (ornegin: Standard Access)"
          value={formState.tierLabel}
          onChangeText={formState.setTierLabel}
          iconLeft="label"
        />
        <Input
          label="Aylik Fiyat (TL)"
          value={formState.pricePerMonth}
          onChangeText={formState.setPricePerMonth}
          iconLeft="payments"
          keyboardType="decimal-pad"
        />
      </View>

      <View
        className="my-3 h-px w-full"
        style={{ backgroundColor: adminTheme.borderSubtle }}
      />

      <View>
        <Text
          className="mb-1 font-headline text-xl tracking-[-0.3px]"
          style={{ color: adminTheme.onSurface }}>
          Vitrin Yonetimi
        </Text>
        <Text
          className="mb-4 font-body text-sm"
          style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.7) }}>
          Bu paketi platformda nasil sergilemek istediginizi yapilandirin.
        </Text>
        
        <View className="flex-row items-center justify-between rounded-md border px-4 py-4"
              style={{
                backgroundColor: formState.isFeatured ? hexToRgba(adminTheme.primary, 0.05) : adminTheme.cardBackgroundMuted,
                borderColor: formState.isFeatured ? adminTheme.primary : adminTheme.borderSubtle,
              }}>
           <View className="flex-1 mr-4">
             <Text className="font-body font-bold mb-1" style={{color: adminTheme.onSurface}}>En Populer Paket Olarak Isaretle</Text>
             <Text className="font-body text-xs leading-5" style={{color: adminTheme.onSurfaceVariant}}>
                Bu secenek aktif edildiginde, fiyatlandirma sayfasinin merkezinde konumlanir ve ayirt edici altin detaylara sahip olur.
             </Text>
           </View>
           <Switch
                value={formState.isFeatured}
                onValueChange={formState.setIsFeatured}
                trackColor={{ false: adminTheme.cardBackgroundStrong, true: hexToRgba(adminTheme.primary, 0.5) }}
                thumbColor={formState.isFeatured ? adminTheme.primary : hexToRgba(adminTheme.onSurfaceVariant, 0.4)}
                ios_backgroundColor={adminTheme.cardBackgroundStrong}
            />
        </View>
      </View>
    </View>
  );
}

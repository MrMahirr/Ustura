import React, { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, Pressable, ScrollView, Switch, Text, View } from 'react-native';

import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { hexToRgba } from '@/utils/color';

interface PackageCreateModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const DEFAULT_FEATURES = [
  { label: 'Maks Berber Hesabi Belirle', included: true },
  { label: 'Online Randevu Takvimi', included: true },
  { label: 'Musteri Veritabani', included: false },
  { label: 'SMS Hatirlaticilar', included: false },
  { label: 'Gelismis Raporlama', included: false },
];

export default function PackageCreateModal({
  visible,
  onClose,
  onSubmit,
}: PackageCreateModalProps) {
  const adminTheme = useSuperAdminTheme();

  const [name, setName] = useState('');
  const [tierLabel, setTierLabel] = useState('');
  const [pricePerMonth, setPricePerMonth] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [features, setFeatures] = useState(DEFAULT_FEATURES);

  // Reset state when closing/opening could go here

  const handleToggleFeature = (index: number) => {
    setFeatures((prev) =>
      prev.map((f, i) => (i === index ? { ...f, included: !f.included } : f)),
    );
  };

  const handleFeatureLabelChange = (text: string, index: number) => {
    setFeatures((prev) =>
      prev.map((f, i) => (i === index ? { ...f, label: text } : f)),
    );
  };

  const submit = () => {
    const data = {
      name,
      tierLabel,
      pricePerMonth: parseFloat(pricePerMonth) || 0,
      isFeatured,
      features,
    };
    onSubmit(data);
  };

  return (
    <Modal visible={visible} onClose={onClose}>
      {/* Header */}
      <View
        className="flex-row items-center justify-between border-b px-6 py-5"
        style={{ borderBottomColor: adminTheme.borderSubtle }}>
        <Text
          className="font-headline text-2xl"
          style={{ color: adminTheme.onSurface }}>
          Yeni Paket Olustur
        </Text>
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

      {/* Body */}
      <ScrollView
        style={{ maxHeight: Platform.OS === 'web' ? '70vh' : 500 }}
        contentContainerStyle={{ padding: 24 }}>
        <Text
          className="mb-4 font-label text-[10px] uppercase tracking-widest"
          style={{ color: adminTheme.primary, fontFamily: 'Manrope-Bold' }}>
          TEMEL BILGILER
        </Text>
        <View className="gap-5">
          <Input
            label="Paket Adi (ornegin: Baslangic)"
            value={name}
            onChangeText={setName}
            iconLeft="title"
          />
          <Input
            label="Tier Etiketi (ornegin: Standard Access)"
            value={tierLabel}
            onChangeText={setTierLabel}
            iconLeft="label"
          />
          <Input
            label="Aylik Fiyat (TL)"
            value={pricePerMonth}
            onChangeText={setPricePerMonth}
            iconLeft="payments"
            keyboardType="decimal-pad"
          />
        </View>

        <View
          className="my-8 h-px w-full"
          style={{ backgroundColor: adminTheme.borderSubtle }}
        />

        <Text
          className="mb-4 font-label text-[10px] uppercase tracking-widest"
          style={{ color: adminTheme.primary, fontFamily: 'Manrope-Bold' }}>
          OZELLIKLER & SERVISLER
        </Text>
        <View className="gap-4">
          <Text
            className="mb-2 font-body text-sm"
            style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.8) }}>
            Bu pakete dahil olan ozellikleri secin. Yanindaki switch ile aktif / pasif durumunu ayarlayabilirsiniz. Etiketi de degistirebilirsiniz.
          </Text>
          {features.map((feature, index) => (
            <View
              key={index}
              className="flex-row items-center justify-between rounded-md border px-4 py-3"
              style={{
                backgroundColor: adminTheme.cardBackgroundMuted,
                borderColor: feature.included ? hexToRgba(adminTheme.primary, 0.3) : adminTheme.borderSubtle,
              }}>
               <View className="flex-1 mr-4">
                 <Input 
                   value={feature.label}
                   onChangeText={(text) => handleFeatureLabelChange(text, index)}
                   containerStyle={{ marginTop: 0, borderBottomWidth: 0 }}
                   className="text-sm py-1 font-body bg-transparent"
                 />
               </View>
              <Switch
                value={feature.included}
                onValueChange={() => handleToggleFeature(index)}
                trackColor={{ false: adminTheme.cardBackgroundStrong, true: hexToRgba(adminTheme.primary, 0.5) }}
                thumbColor={feature.included ? adminTheme.primary : hexToRgba(adminTheme.onSurfaceVariant, 0.4)}
                ios_backgroundColor={adminTheme.cardBackgroundStrong}
              />
            </View>
          ))}
        </View>

        <View
          className="my-8 h-px w-full"
          style={{ backgroundColor: adminTheme.borderSubtle }}
        />

        <Text
          className="mb-4 font-label text-[10px] uppercase tracking-widest"
          style={{ color: adminTheme.primary, fontFamily: 'Manrope-Bold' }}>
          VITRIN AYARLARI
        </Text>
        
        <View className="flex-row items-center justify-between rounded-md border px-4 py-4"
              style={{
                backgroundColor: isFeatured ? hexToRgba(adminTheme.primary, 0.05) : adminTheme.cardBackgroundMuted,
                borderColor: isFeatured ? adminTheme.primary : adminTheme.borderSubtle,
              }}>
           <View className="flex-1 mr-4">
             <Text className="font-body font-bold mb-1" style={{color: adminTheme.onSurface}}>En Populer Paket Olarak Isaretle</Text>
             <Text className="font-body text-xs leading-5" style={{color: adminTheme.onSurfaceVariant}}>
                Bu secenek aktif edildiginde paket listesinin ortasinda altin detaylarla daha vurgulu gosterilir.
             </Text>
           </View>
           <Switch
                value={isFeatured}
                onValueChange={setIsFeatured}
                trackColor={{ false: adminTheme.cardBackgroundStrong, true: hexToRgba(adminTheme.primary, 0.5) }}
                thumbColor={isFeatured ? adminTheme.primary : hexToRgba(adminTheme.onSurfaceVariant, 0.4)}
                ios_backgroundColor={adminTheme.cardBackgroundStrong}
            />
        </View>
      </ScrollView>

      {/* Footer */}
      <View
        className="flex-row items-center justify-end gap-3 border-t px-6 py-5"
        style={{
          borderTopColor: adminTheme.borderSubtle,
          backgroundColor: adminTheme.cardBackgroundMuted,
        }}>
        <Pressable
          onPress={onClose}
          className="min-h-[44px] items-center justify-center rounded-md px-6"
          style={({ hovered }) => [
            {
              backgroundColor: hovered
                ? hexToRgba(adminTheme.onSurfaceVariant, 0.08)
                : 'transparent',
            },
            Platform.OS === 'web'
              ? ({ transition: 'background-color 150ms ease' } as any)
              : null,
          ]}>
          <Text
            className="font-label text-xs uppercase tracking-widest"
            style={{ color: adminTheme.onSurface, fontFamily: 'Manrope-Bold' }}>
            Iptal
          </Text>
        </Pressable>
        <Pressable
          onPress={submit}
          className="overflow-hidden rounded-md"
          style={({ pressed, hovered }) => [
            { transform: [{ scale: pressed ? 0.98 : 1 }] },
            Platform.OS === 'web'
              ? ({
                  transition: 'transform 150ms ease, box-shadow 150ms ease',
                  boxShadow: hovered
                    ? `0 12px 24px ${hexToRgba(adminTheme.primary, 0.25)}`
                    : 'none',
                } as any)
              : null,
          ]}>
          <LinearGradient
            colors={adminTheme.goldGradient as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              minHeight: 44,
              paddingHorizontal: 28,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              className="font-label text-xs uppercase tracking-widest"
              style={{ color: adminTheme.onPrimary, fontFamily: 'Manrope-Bold' }}>
              Kaydet
            </Text>
          </LinearGradient>
        </Pressable>
      </View>
    </Modal>
  );
}

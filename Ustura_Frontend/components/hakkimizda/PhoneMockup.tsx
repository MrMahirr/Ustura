import React from 'react';
import { Image, Platform, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

import { useAppTheme } from '@/contexts/ThemeContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { hexToRgba } from '@/utils/color';

export default function PhoneMockup() {
  const { theme } = useAppTheme();
  const surfaceContainerLowest = useThemeColor({}, 'surfaceContainerLowest');
  const surfaceContainerHighest = useThemeColor({}, 'surfaceContainerHighest');
  const surfaceContainerHigh = useThemeColor({}, 'surfaceContainerHigh');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const surface = useThemeColor({}, 'surface');
  const primary = useThemeColor({}, 'primary');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const onPrimary = useThemeColor({}, 'onPrimary');

  return (
    <View className="relative h-[700px] items-center justify-center">
      <View
        className="absolute h-[500px] w-[500px] rounded-full"
        style={[
          {
            backgroundColor: primary,
            opacity: theme === 'light' ? 0.09 : 0.05,
          },
          Platform.OS === 'web' ? ({ filter: 'blur(120px)' } as any) : null,
        ]}
      />

      <View className="absolute right-0 top-[25%] h-px w-full opacity-30" style={{ backgroundColor: primary, transform: [{ rotate: '-12deg' }] }} />
      <View className="absolute bottom-[33%] right-0 h-px w-2/3 opacity-20" style={{ backgroundColor: primary, transform: [{ rotate: '35deg' }] }} />

      <View
        className="z-10 h-[600px] w-[300px] overflow-hidden rounded-[48px] border-[8px]"
        style={[
          {
            backgroundColor: surfaceContainerLowest,
            borderColor: surfaceContainerHighest,
          },
          Platform.OS === 'web'
            ? ({
                boxShadow:
                  theme === 'light'
                    ? `0 0 80px -20px ${hexToRgba(primary, 0.18)}`
                    : '0 0 80px -20px rgba(230, 195, 100, 0.15)',
              } as any)
            : null,
        ]}>
        <View
          className="flex-1"
          style={[
            { backgroundColor: theme === 'light' ? surface : '#0A0A0F' },
            Platform.OS === 'web' ? ({ transition: 'background-color 360ms ease, color 360ms ease' } as any) : null,
          ]}>
          <View className="flex-row items-center justify-between px-8 pt-6">
            <Text className="font-body text-[10px] font-bold" style={{ color: onSurface }}>
              9:41
            </Text>
            <View className="flex-row items-center gap-1.5">
              <View className="h-3 w-3 rounded-full border" style={{ borderColor: `${onSurface}4D` }} />
              <View className="h-3 w-4 rounded-sm" style={{ backgroundColor: `${onSurface}CC` }} />
            </View>
          </View>

          <View className="px-6 pb-6 pt-10">
            <Text className="mb-1 font-body text-[10px] font-bold uppercase tracking-[3px]" style={{ color: primary }}>
              USTURA
            </Text>
            <Text className="font-headline text-xl font-bold" style={{ color: onSurface }}>
              Hos Geldin, Selim
            </Text>
          </View>

          <View className="mx-6 mb-4 gap-3 rounded-md p-4" style={{ backgroundColor: surfaceContainerLow }}>
            <View className="flex-row items-center justify-between">
              <Text className="font-body text-[10px] uppercase tracking-[1px]" style={{ color: onSurfaceVariant }}>
                Bugun 14:30
              </Text>
              <Text className="font-body text-[10px] font-bold uppercase" style={{ color: primary }}>
                Aktif Randevu
              </Text>
            </View>
            <View className="flex-row items-center gap-3">
              <Image
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvAohro_1BtsnRN0LFcA4Cf-kD3H8lEQaVXoDDKqEH4YsaK0FlRKXrcdWDGb92DNysbFKeOQSQ9ih9QieMqqXL0VFZMPtDwL5cU1g03ntgU0ibUt4D2YnUpX0VxvU-bgygz3LSHpfu1JbGq5epNbhQv7e2k4TWveQ9uNDkQisAKXimiBR2ZnMtce9hhl_kN0VIyFGuN1M9u2QeEbHdDjUG3ExqmyNRtBflPVNT2euoP0V6VCvne9mOnyCZytIlypakeRzX8NePjbg' }}
                className="h-10 w-10 rounded-full"
              />
              <View>
                <Text className="font-body text-xs font-bold" style={{ color: onSurface }}>
                  Caner Yilmaz
                </Text>
                <Text className="font-body text-[10px]" style={{ color: onSurfaceVariant }}>
                  Klasik Kesim & Sakal
                </Text>
              </View>
            </View>
          </View>

          <View className="gap-4 px-6">
            <Text className="font-body text-[10px] uppercase tracking-[1.5px]" style={{ color: onSurfaceVariant }}>
              Berberini Sec
            </Text>
            <View className="flex-row gap-3">
              {(['Ahmet', 'Murat', 'Kerem'] as const).map((name, index) => (
                <View
                  key={name}
                  className="h-16 w-16 items-center justify-center rounded-md"
                  style={[
                    { backgroundColor: surfaceContainerHigh },
                    index === 0 ? { borderColor: `${primary}66`, borderWidth: 1 } : null,
                    index > 0 ? { opacity: 0.4 } : null,
                  ]}>
                  <Image
                    source={{
                      uri:
                        index === 0
                          ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPKm3KIOyf4JpfZAc584yszQ0euMqk-dFlcXk652aXJSlM7LwD6k5cIJ1JVvdOOSjU4Ed-rnx8SFAJBk5Im4MEYt0a1730FQjfNWl7SMXKrRRALexPb7QMplKyJo5VyOH61jk8tTbN0WBTqaW-ptXELTGTlkX-ZRDtuISEm3cNdw_pn-E5DUIurM5gOm4wKAiwz5WOjuETTzkNP9mfisTl-xyQm2i6QN3LbKjMXviQpldbDBWPhfwA42aQORcs3efyCqQQALM3ytk'
                          : index === 1
                            ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuCajfiCIhJc3bABWr87OFWDJw4HFUDt02C20582eoPUC1LLJYm4jznlAiJLR_p44XyiODaYVumIpvGKGnEpafgL45ha56N4i9szjNXsXm0Y4z8FCmyjjqSvsbMuu7KLnteWzpjvMBuO8iM1tLO1Bx46KWwL79Tnie93s5CFL9UEb3tc79Yo7FW0nr-VYn4xvOAlwXGR7QF0koBlpuW1hnvSdEZkyI4bk9vYuzLNz6zD0ydeojFo5vfL-q-nkHeiFjx32NyOf0O502s'
                            : 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMDsSXO10so6IeCYVVcoOua7_XmZ62SjUNzOWXjzyJ918CYzWV_Ivm3kWb6T9lGHl0CvqTftcDlgKfSZ665mLoHRVuGr3haFiACuXyWLE3bONvajr9fzRrbFLlLGiwyjWGf1R-fA3Q4a1_z6kTW8V8sqlaqp6vcOoXCYNpuUGJpgbnwlmrXKbaIgMHaWJHBpt9IaNKV8_lRbt_uZoaRu--cbny1uDKDDVtzx3RIyC_Clm_9qpaaeHOEvS-iRiyfFHm36wULE0ustA',
                    }}
                    className="mb-1 h-8 w-8 rounded-full"
                  />
                  <Text className="font-body text-[8px] font-bold" style={{ color: onSurface }}>
                    {name}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View className="mt-auto p-6" style={{ backgroundColor: surfaceContainerLowest }}>
            <LinearGradient
              colors={[primary, '#c9a84c']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ width: '100%', paddingVertical: 12, borderRadius: 2, alignItems: 'center', justifyContent: 'center' }}>
              <Text className="font-body text-[10px] font-bold uppercase tracking-[2px]" style={{ color: onPrimary }}>
                RANDEVU AL
              </Text>
            </LinearGradient>
          </View>
        </View>
      </View>

      <View
        className="absolute bottom-20 left-2.5 z-20 flex-row items-center gap-4 rounded-md border p-6"
        style={[
          {
            backgroundColor:
              theme === 'light'
                ? Platform.OS === 'web'
                  ? 'rgba(255, 255, 255, 0.92)'
                  : surfaceContainerLowest
                : Platform.OS === 'web'
                  ? 'rgba(53, 52, 58, 0.8)'
                  : surfaceContainerHighest,
            borderColor: `${primary}33`,
          },
          Platform.OS === 'web'
            ? ({
                backdropFilter: 'blur(12px)',
                transition: 'background-color 360ms ease, border-color 360ms ease, box-shadow 360ms ease',
                boxShadow:
                  theme === 'light'
                    ? '0 20px 40px rgba(27, 27, 32, 0.12)'
                    : '0 25px 50px rgba(0, 0, 0, 0.5)',
              } as any)
            : null,
        ]}>
        <View className="h-12 w-12 items-center justify-center rounded-full" style={{ backgroundColor: `${primary}33` }}>
          <MaterialIcons name="verified" size={24} color={primary} />
        </View>
        <View>
          <Text className="font-body text-2xl font-bold leading-7" style={{ color: onSurface }}>
            500+
          </Text>
          <Text className="font-body text-[10px] font-bold uppercase tracking-[2px]" style={{ color: onSurfaceVariant }}>
            AKTIF SALON
          </Text>
        </View>
      </View>
    </View>
  );
}

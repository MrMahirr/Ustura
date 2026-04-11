import React from 'react';
import { Text, useWindowDimensions, View } from 'react-native';
import { useRouter } from 'expo-router';

import PaginationBar from '@/components/kuaforler/PaginationBar';
import SalonCard from '@/components/kuaforler/SalonCard';
import { mapSalonToListItem } from '@/components/kuaforler/salon-listing';
import { getLandingLayout } from '@/components/landing/layout';
import Button from '@/components/ui/Button';
import { useBookingEntry } from '@/hooks/use-booking-entry';
import { useSalons } from '@/hooks/use-salons';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function SalonsSection() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const layout = getLandingLayout(width);
  const { openBooking } = useBookingEntry();
  const [page, setPage] = React.useState(1);

  const surfaceContainerLowest = useThemeColor({}, 'surfaceContainerLowest');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const primary = useThemeColor({}, 'primary');
  const outlineVariant = useThemeColor({}, 'outlineVariant');

  const { salons, pagination, isLoading, error, reload } = useSalons({
    page,
    pageSize: 6,
  });

  const isDesktop = width >= 1180;
  const isTablet = width >= 768 && width < 1180;
  const salonCards = React.useMemo(() => salons.map(mapSalonToListItem), [salons]);

  return (
    <View
      style={{
        backgroundColor: surfaceContainerLowest,
        paddingVertical: layout.sectionPaddingVertical,
        paddingHorizontal: layout.horizontalPadding,
      }}>
      <View className="w-full self-center" style={{ maxWidth: layout.contentMaxWidth }}>
        <View
          className="mb-10 justify-between gap-6"
          style={{ flexDirection: isTablet || isDesktop ? 'row' : 'column', alignItems: isTablet || isDesktop ? 'flex-end' : 'flex-start' }}>
          <View style={{ maxWidth: 760 }}>
            <Text className="mb-3 font-label text-base uppercase tracking-[3px]" style={{ color: primary }}>
              Kesfet
            </Text>
            <Text className="font-headline text-5xl font-bold" style={{ color: onSurface, lineHeight: 56 }}>
              Sehirdeki aktif kuaforleri incele.
            </Text>
            <Text className="mt-5 font-body text-lg" style={{ color: onSurfaceVariant, lineHeight: 30 }}>
              Landing uzerinden dogrudan salonlari gez, sayfa sayfa ilerle ve uygun oldugunda rezervasyon akisini baslat.
            </Text>
          </View>

          <Button
            title="Tum Salonlar"
            variant="outline"
            interactionPreset="outlineCta"
            onPress={() => router.push('/(public)/kuaforler')}
          />
        </View>

        {isLoading ? (
          <View
            className="rounded-[24px] border px-6 py-10"
            style={{ borderColor: outlineVariant, backgroundColor: surfaceContainerLow }}>
            <Text className="font-headline text-3xl font-bold" style={{ color: onSurface }}>
              Salonlar yukleniyor
            </Text>
            <Text className="mt-3 font-body text-base" style={{ color: onSurfaceVariant }}>
              Aktif salonlar landing bolumu icin backend uzerinden sayfali getiriliyor.
            </Text>
          </View>
        ) : error ? (
          <View
            className="rounded-[24px] border px-6 py-10"
            style={{ borderColor: outlineVariant, backgroundColor: surfaceContainerLow }}>
            <Text className="font-headline text-3xl font-bold" style={{ color: onSurface }}>
              Salonlar alinmadi
            </Text>
            <Text className="mt-3 max-w-[620px] font-body text-base" style={{ color: onSurfaceVariant }}>
              {error}
            </Text>
            <Button
              title="Tekrar Dene"
              variant="outline"
              interactionPreset="outlineCta"
              onPress={() => {
                void reload();
              }}
              style={{ marginTop: 20, width: 220 }}
            />
          </View>
        ) : salonCards.length > 0 ? (
          <>
            <View className="flex-wrap justify-start gap-8" style={{ flexDirection: isDesktop || isTablet ? 'row' : 'column' }}>
              {salonCards.map((salon) => (
                <View
                  key={salon.id}
                  style={[
                    isDesktop ? { width: '31.33%' } : null,
                    isTablet ? { width: '48%' } : null,
                    !isDesktop && !isTablet ? { width: '100%' } : null,
                  ]}>
                  <SalonCard {...salon} onBookPress={() => openBooking(salon)} />
                </View>
              ))}
            </View>

            <PaginationBar
              page={pagination.page}
              pageSize={pagination.pageSize}
              total={pagination.total}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          </>
        ) : (
          <View
            className="rounded-[24px] border px-6 py-10"
            style={{ borderColor: outlineVariant, backgroundColor: surfaceContainerLow }}>
            <Text className="font-headline text-3xl font-bold" style={{ color: onSurface }}>
              Henuz aktif salon yok
            </Text>
            <Text className="mt-3 font-body text-base" style={{ color: onSurfaceVariant }}>
              Kisa sure sonra yeni salonlar burada listelenecek.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

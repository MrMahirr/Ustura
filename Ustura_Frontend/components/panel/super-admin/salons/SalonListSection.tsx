import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Pressable, Text, View } from 'react-native';

import type { SalonRecord } from '@/components/panel/super-admin/salon-management.data';
import { getSalonPanelShadow, salonClassNames } from '@/components/panel/super-admin/salons/presentation';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import SalonMobileCard from './SalonMobileCard';
import SalonRow from './SalonRow';

interface SalonListSectionProps {
  salons: SalonRecord[];
  filteredSalonsCount: number;
  page: number;
  totalPages: number;
  startRow: number;
  endRow: number;
  useDesktopTable: boolean;
  onPageChange: (page: number) => void;
  onOpenSalon: (salonId: string) => void;
}

function EmptyState() {
  const adminTheme = useSuperAdminTheme();

  return (
    <View className="m-5 min-h-[260px] items-center justify-center gap-3 rounded-[10px] border px-6" style={{ backgroundColor: adminTheme.cardBackgroundMuted, borderColor: adminTheme.borderSubtle }}>
      <MaterialIcons name="search-off" size={32} color={hexToRgba(adminTheme.onSurfaceVariant, 0.8)} />
      <Text className={salonClassNames.emptyTitle} style={{ color: adminTheme.onSurface, fontFamily: 'Manrope-Bold' }}>
        Filtrelere gore salon bulunamadi
      </Text>
      <Text className={salonClassNames.emptyDescription} style={{ color: adminTheme.onSurfaceVariant }}>
        Arama kelimesini veya filtre secimlerini degistirerek listeyi genisletebilirsiniz.
      </Text>
    </View>
  );
}

function DesktopTable({ salons, onOpenSalon }: { salons: SalonRecord[]; onOpenSalon: (salonId: string) => void }) {
  const adminTheme = useSuperAdminTheme();

  return (
    <>
      <View className="min-h-[58px] flex-row items-center border-b px-6" style={{ backgroundColor: adminTheme.tableHeaderBackground, borderBottomColor: adminTheme.borderSubtle }}>
        <Text className={salonClassNames.headerText} style={{ flex: 2.4, color: hexToRgba(adminTheme.onSurfaceVariant, 0.7), fontFamily: 'Manrope-Bold' }}>
          Salon Bilgisi
        </Text>
        <Text className={salonClassNames.headerText} style={{ flex: 1.6, color: hexToRgba(adminTheme.onSurfaceVariant, 0.7), fontFamily: 'Manrope-Bold' }}>
          Isletmeci
        </Text>
        <Text className={salonClassNames.headerText} style={{ flex: 1.45, color: hexToRgba(adminTheme.onSurfaceVariant, 0.7), fontFamily: 'Manrope-Bold' }}>
          Konum
        </Text>
        <Text className={salonClassNames.headerText} style={{ flex: 1.05, color: hexToRgba(adminTheme.onSurfaceVariant, 0.7), fontFamily: 'Manrope-Bold' }}>
          Durum
        </Text>
        <Text className={salonClassNames.headerText} style={{ flex: 0.95, color: hexToRgba(adminTheme.onSurfaceVariant, 0.7), fontFamily: 'Manrope-Bold' }}>
          Paket
        </Text>
        <Text className={salonClassNames.headerText} style={{ flex: 1.1, color: hexToRgba(adminTheme.onSurfaceVariant, 0.7), textAlign: 'right', fontFamily: 'Manrope-Bold' }}>
          Islemler
        </Text>
      </View>
      <View>
        {salons.map((salon, index) => (
          <View key={salon.id} style={index < salons.length - 1 ? { borderBottomColor: adminTheme.borderSubtle, borderBottomWidth: 1 } : undefined}>
            <SalonRow salon={salon} onPress={() => onOpenSalon(salon.id)} />
          </View>
        ))}
      </View>
    </>
  );
}

function Pagination({
  filteredSalonsCount,
  page,
  totalPages,
  startRow,
  endRow,
  onPageChange,
}: Omit<SalonListSectionProps, 'salons' | 'useDesktopTable' | 'onOpenSalon'>) {
  const adminTheme = useSuperAdminTheme();

  return (
    <View
      className="min-h-[68px] flex-row flex-wrap items-center justify-between gap-3 border-t px-5 py-[14px]"
      style={{ backgroundColor: hexToRgba(adminTheme.tableHeaderBackground, 0.6), borderTopColor: adminTheme.borderSubtle }}>
      <Text className="font-label text-[10px] uppercase tracking-[1.8px]" style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.78), fontFamily: 'Manrope-Bold' }}>
        {filteredSalonsCount === 0
          ? 'Kayit bulunamadi'
          : `${new Intl.NumberFormat('tr-TR').format(filteredSalonsCount)} kayittan ${startRow}-${endRow} gosteriliyor`}
      </Text>

      <View className="flex-row items-center gap-1.5">
        <Pressable
          onPress={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="h-[34px] w-[34px] items-center justify-center rounded-md"
          style={({ hovered }) => [
            {
              opacity: page === 1 ? 0.38 : 1,
              backgroundColor: hovered && page !== 1 ? adminTheme.cardBackgroundStrong : 'transparent',
            },
            Platform.OS === 'web'
              ? ({ transition: 'background-color 160ms ease, border-color 160ms ease, opacity 160ms ease, transform 160ms ease', cursor: 'pointer' } as any)
              : null,
          ]}>
          <MaterialIcons name="chevron-left" size={18} color={hexToRgba(adminTheme.onSurfaceVariant, 0.88)} />
        </Pressable>

        {Array.from({ length: totalPages }).map((_, index) => {
          const targetPage = index + 1;
          const isActive = targetPage === page;

          return (
            <Pressable
              key={`page-${targetPage}`}
              onPress={() => onPageChange(targetPage)}
              className="h-[34px] min-w-[34px] items-center justify-center rounded-md border px-2.5"
              style={({ hovered }) => [
                {
                  backgroundColor: isActive ? adminTheme.primary : hovered ? adminTheme.cardBackgroundStrong : 'transparent',
                  borderColor: isActive ? adminTheme.primary : adminTheme.borderSubtle,
                },
                Platform.OS === 'web'
                  ? ({ transition: 'background-color 160ms ease, border-color 160ms ease, opacity 160ms ease, transform 160ms ease', cursor: 'pointer' } as any)
                  : null,
              ]}>
              <Text className="font-body text-xs" style={{ color: isActive ? adminTheme.onPrimary : adminTheme.onSurface, fontFamily: 'Manrope-Bold' }}>
                {targetPage}
              </Text>
            </Pressable>
          );
        })}

        <Pressable
          onPress={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="h-[34px] w-[34px] items-center justify-center rounded-md"
          style={({ hovered }) => [
            {
              opacity: page === totalPages ? 0.38 : 1,
              backgroundColor: hovered && page !== totalPages ? adminTheme.cardBackgroundStrong : 'transparent',
            },
            Platform.OS === 'web'
              ? ({ transition: 'background-color 160ms ease, border-color 160ms ease, opacity 160ms ease, transform 160ms ease', cursor: 'pointer' } as any)
              : null,
          ]}>
          <MaterialIcons name="chevron-right" size={18} color={hexToRgba(adminTheme.onSurfaceVariant, 0.88)} />
        </Pressable>
      </View>
    </View>
  );
}

export default function SalonListSection({
  salons,
  filteredSalonsCount,
  page,
  totalPages,
  startRow,
  endRow,
  useDesktopTable,
  onPageChange,
  onOpenSalon,
}: SalonListSectionProps) {
  const adminTheme = useSuperAdminTheme();

  return (
    <View
      className={salonClassNames.tableShell}
      style={[
        {
          backgroundColor: adminTheme.cardBackground,
          borderColor: adminTheme.borderSubtle,
        },
        getSalonPanelShadow(adminTheme.theme),
      ]}>
      {salons.length === 0 ? (
        <EmptyState />
      ) : useDesktopTable ? (
        <DesktopTable salons={salons} onOpenSalon={onOpenSalon} />
      ) : (
        <View className="gap-[14px] p-4">
          {salons.map((salon) => (
            <SalonMobileCard key={salon.id} salon={salon} onPress={() => onOpenSalon(salon.id)} />
          ))}
        </View>
      )}

      <Pagination
        filteredSalonsCount={filteredSalonsCount}
        page={page}
        totalPages={totalPages}
        startRow={startRow}
        endRow={endRow}
        onPageChange={onPageChange}
      />
    </View>
  );
}

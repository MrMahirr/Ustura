import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Pressable, Text, View } from 'react-native';

import type { SalonRecord } from '@/components/panel/super-admin/salon-management.data';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import SalonMobileCard from './SalonMobileCard';
import SalonRow from './SalonRow';
import { styles } from './styles';

interface SalonListSectionProps {
  salons: SalonRecord[];
  filteredSalonsCount: number;
  page: number;
  totalPages: number;
  startRow: number;
  endRow: number;
  useDesktopTable: boolean;
  onPageChange: (page: number) => void;
}

function EmptyState() {
  const adminTheme = useSuperAdminTheme();

  return (
    <View
      style={[
        styles.emptyState,
        { backgroundColor: adminTheme.cardBackgroundMuted, borderColor: adminTheme.borderSubtle },
      ]}>
      <MaterialIcons name="search-off" size={32} color={hexToRgba(adminTheme.onSurfaceVariant, 0.8)} />
      <Text style={[styles.emptyTitle, { color: adminTheme.onSurface }]}>Filtrelere gore salon bulunamadi</Text>
      <Text style={[styles.emptyDescription, { color: adminTheme.onSurfaceVariant }]}>
        Arama kelimesini veya filtre secimlerini degistirerek listeyi genisletebilirsiniz.
      </Text>
    </View>
  );
}

function DesktopTable({ salons }: { salons: SalonRecord[] }) {
  const adminTheme = useSuperAdminTheme();

  return (
    <>
      <View
        style={[
          styles.headerRow,
          {
            backgroundColor: adminTheme.tableHeaderBackground,
            borderBottomColor: adminTheme.borderSubtle,
          },
        ]}>
        <Text style={[styles.headerText, styles.cellSalon, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.7) }]}>
          Salon Bilgisi
        </Text>
        <Text style={[styles.headerText, styles.cellOwner, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.7) }]}>
          Isletmeci
        </Text>
        <Text
          style={[styles.headerText, styles.cellLocation, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.7) }]}>
          Konum
        </Text>
        <Text style={[styles.headerText, styles.cellStatus, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.7) }]}>
          Durum
        </Text>
        <Text style={[styles.headerText, styles.cellPlan, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.7) }]}>
          Paket
        </Text>
        <Text
          style={[
            styles.headerText,
            styles.cellActions,
            { color: hexToRgba(adminTheme.onSurfaceVariant, 0.7), textAlign: 'right' },
          ]}>
          Islemler
        </Text>
      </View>
      <View>
        {salons.map((salon, index) => (
          <View
            key={salon.id}
            style={index < salons.length - 1 ? { borderBottomColor: adminTheme.borderSubtle, borderBottomWidth: 1 } : null}>
            <SalonRow salon={salon} />
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
}: Omit<SalonListSectionProps, 'salons' | 'useDesktopTable'>) {
  const adminTheme = useSuperAdminTheme();

  return (
    <View
      style={[
        styles.paginationBar,
        {
          backgroundColor: hexToRgba(adminTheme.tableHeaderBackground, 0.6),
          borderTopColor: adminTheme.borderSubtle,
        },
      ]}>
      <Text style={[styles.paginationText, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.78) }]}>
        {filteredSalonsCount === 0
          ? 'Kayit bulunamadi'
          : `${new Intl.NumberFormat('tr-TR').format(filteredSalonsCount)} kayittan ${startRow}-${endRow} gosteriliyor`}
      </Text>

      <View style={styles.paginationControls}>
        <Pressable
          onPress={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          style={({ hovered }) => [
            styles.paginationButton,
            {
              opacity: page === 1 ? 0.38 : 1,
              backgroundColor: hovered && page !== 1 ? adminTheme.cardBackgroundStrong : 'transparent',
            },
            Platform.OS === 'web' ? styles.webInteractiveButton : null,
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
              style={({ hovered }) => [
                styles.pageButton,
                {
                  backgroundColor: isActive ? adminTheme.primary : hovered ? adminTheme.cardBackgroundStrong : 'transparent',
                  borderColor: isActive ? adminTheme.primary : adminTheme.borderSubtle,
                },
                Platform.OS === 'web' ? styles.webInteractiveButton : null,
              ]}>
              <Text style={[styles.pageButtonText, { color: isActive ? adminTheme.onPrimary : adminTheme.onSurface }]}>
                {targetPage}
              </Text>
            </Pressable>
          );
        })}

        <Pressable
          onPress={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          style={({ hovered }) => [
            styles.paginationButton,
            {
              opacity: page === totalPages ? 0.38 : 1,
              backgroundColor: hovered && page !== totalPages ? adminTheme.cardBackgroundStrong : 'transparent',
            },
            Platform.OS === 'web' ? styles.webInteractiveButton : null,
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
}: SalonListSectionProps) {
  const adminTheme = useSuperAdminTheme();

  return (
    <View
      style={[
        styles.tableShell,
        {
          backgroundColor: adminTheme.cardBackground,
          borderColor: adminTheme.borderSubtle,
          ...(Platform.OS === 'web'
            ? ({
                boxShadow:
                  adminTheme.theme === 'dark'
                    ? '0 26px 60px rgba(0, 0, 0, 0.34)'
                    : '0 24px 54px rgba(27, 27, 32, 0.08)',
              } as any)
            : {
                shadowColor: '#000000',
                shadowOpacity: adminTheme.theme === 'dark' ? 0.22 : 0.08,
                shadowRadius: 20,
                shadowOffset: { width: 0, height: 12 },
                elevation: 8,
              }),
        },
      ]}>
      {salons.length === 0 ? (
        <EmptyState />
      ) : useDesktopTable ? (
        <DesktopTable salons={salons} />
      ) : (
        <View style={styles.mobileList}>
          {salons.map((salon) => (
            <SalonMobileCard key={salon.id} salon={salon} />
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

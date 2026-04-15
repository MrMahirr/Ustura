import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Pressable, Text, View } from 'react-native';

import { useBarberAdminTheme } from '@/components/panel/barber-admin/theme';
import { hexToRgba } from '@/utils/color';

import ReservationMobileCard from './ReservationMobileCard';
import ReservationRow from './ReservationRow';
import { getReservationPanelShadow, reservationClassNames } from './presentation';
import type { ReservationListItem } from './types';

interface Props {
  reservations: ReservationListItem[];
  filteredCount: number;
  page: number;
  totalPages: number;
  startRow: number;
  endRow: number;
  useDesktopTable: boolean;
  isLoading: boolean;
  errorMessage: string | null;
  onPageChange: (p: number) => void;
  onRetry: () => void;
  onSelectReservation: (item: ReservationListItem) => void;
}

function EmptyState() {
  const theme = useBarberAdminTheme();
  return (
    <View
      className="m-5 min-h-[220px] items-center justify-center gap-3 rounded-[10px] border px-6"
      style={{ backgroundColor: theme.cardBackgroundMuted, borderColor: theme.borderSubtle }}>
      <MaterialIcons name="event-busy" size={32} color={hexToRgba(theme.onSurfaceVariant, 0.7)} />
      <Text
        className={reservationClassNames.emptyTitle}
        style={{ color: theme.onSurface, fontFamily: 'Manrope-Bold' }}>
        Randevu bulunamadı
      </Text>
      <Text
        className={reservationClassNames.emptyDescription}
        style={{ color: theme.onSurfaceVariant }}>
        Seçili filtrelere uygun randevu kaydı bulunmuyor.
      </Text>
    </View>
  );
}

function LoadingState() {
  const theme = useBarberAdminTheme();
  return (
    <View
      className="m-5 min-h-[220px] items-center justify-center gap-3 rounded-[10px] border px-6"
      style={{ backgroundColor: theme.cardBackgroundMuted, borderColor: theme.borderSubtle }}>
      <MaterialIcons name="hourglass-empty" size={30} color={hexToRgba(theme.onSurfaceVariant, 0.7)} />
      <Text
        className={reservationClassNames.emptyTitle}
        style={{ color: theme.onSurface, fontFamily: 'Manrope-Bold' }}>
        Randevular yükleniyor
      </Text>
    </View>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  const theme = useBarberAdminTheme();
  return (
    <View
      className="m-5 min-h-[220px] items-center justify-center gap-4 rounded-[10px] border px-6"
      style={{ backgroundColor: theme.cardBackgroundMuted, borderColor: theme.borderSubtle }}>
      <MaterialIcons name="error-outline" size={32} color={hexToRgba(theme.error, 0.9)} />
      <Text
        className={reservationClassNames.emptyTitle}
        style={{ color: theme.onSurface, fontFamily: 'Manrope-Bold' }}>
        {message}
      </Text>
      <Pressable
        onPress={onRetry}
        className="rounded-md border px-4 py-2.5"
        style={({ hovered }) => [
          {
            borderColor: hexToRgba(theme.primary, hovered ? 0.32 : 0.2),
            backgroundColor: hovered ? hexToRgba(theme.primary, 0.08) : 'transparent',
          },
          Platform.OS === 'web'
            ? ({ transition: 'all 160ms ease', cursor: 'pointer' } as any)
            : null,
        ]}>
        <Text
          style={{
            color: theme.primary,
            fontFamily: 'Manrope-Bold',
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: 2,
          }}>
          Tekrar Dene
        </Text>
      </Pressable>
    </View>
  );
}

function DesktopTable({
  reservations,
  onSelectReservation,
}: {
  reservations: ReservationListItem[];
  onSelectReservation: (item: ReservationListItem) => void;
}) {
  const theme = useBarberAdminTheme();

  return (
    <>
      <View
        className="min-h-[52px] flex-row items-center border-b px-6"
        style={{
          backgroundColor: hexToRgba(theme.cardBackgroundMuted, 0.6),
          borderBottomColor: theme.borderSubtle,
        }}>
        <Text className={reservationClassNames.headerText} style={{ flex: 2.2, color: hexToRgba(theme.onSurfaceVariant, 0.7), fontFamily: 'Manrope-Bold' }}>
          Müşteri / Personel
        </Text>
        <Text className={reservationClassNames.headerText} style={{ flex: 1.5, color: hexToRgba(theme.onSurfaceVariant, 0.7), fontFamily: 'Manrope-Bold' }}>
          Tarih
        </Text>
        <Text className={reservationClassNames.headerText} style={{ flex: 1.2, color: hexToRgba(theme.onSurfaceVariant, 0.7), fontFamily: 'Manrope-Bold' }}>
          Saat
        </Text>
        <Text className={reservationClassNames.headerText} style={{ flex: 1, color: hexToRgba(theme.onSurfaceVariant, 0.7), fontFamily: 'Manrope-Bold' }}>
          Durum
        </Text>
        <Text className={reservationClassNames.headerText} style={{ flex: 0.5, color: hexToRgba(theme.onSurfaceVariant, 0.7), fontFamily: 'Manrope-Bold', textAlign: 'right' }}>
          Detay
        </Text>
      </View>
      <View>
        {reservations.map((r, index) => (
          <View
            key={r.id}
            style={
              index < reservations.length - 1
                ? { borderBottomColor: theme.borderSubtle, borderBottomWidth: 1 }
                : undefined
            }>
            <ReservationRow reservation={r} onPress={() => onSelectReservation(r)} />
          </View>
        ))}
      </View>
    </>
  );
}

function Pagination({
  filteredCount,
  page,
  totalPages,
  startRow,
  endRow,
  onPageChange,
}: {
  filteredCount: number;
  page: number;
  totalPages: number;
  startRow: number;
  endRow: number;
  onPageChange: (p: number) => void;
}) {
  const theme = useBarberAdminTheme();

  const pageNumbers = Array.from({ length: totalPages })
    .map((_, i) => i + 1)
    .filter((p) => Math.abs(p - page) <= 1 || p === 1 || p === totalPages)
    .filter((p, i, a) => a.indexOf(p) === i);

  return (
    <View
      className="min-h-[60px] flex-row flex-wrap items-center justify-between gap-3 border-t px-5 py-3"
      style={{
        backgroundColor: hexToRgba(theme.cardBackgroundMuted, 0.6),
        borderTopColor: theme.borderSubtle,
      }}>
      <Text
        style={{
          color: hexToRgba(theme.onSurfaceVariant, 0.78),
          fontFamily: 'Manrope-Bold',
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: 1.8,
        }}>
        {filteredCount === 0
          ? 'Kayıt bulunamadı'
          : `${filteredCount} kayıttan ${startRow}–${endRow} gösteriliyor`}
      </Text>

      <View className="flex-row items-center gap-1.5">
        <Pressable
          onPress={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="h-[32px] w-[32px] items-center justify-center rounded-md"
          style={{ opacity: page === 1 ? 0.38 : 1 }}>
          <MaterialIcons name="chevron-left" size={18} color={hexToRgba(theme.onSurfaceVariant, 0.88)} />
        </Pressable>

        {pageNumbers.map((p) => {
          const isActive = p === page;
          return (
            <Pressable
              key={`page-${p}`}
              onPress={() => onPageChange(p)}
              className="h-[32px] min-w-[32px] items-center justify-center rounded-md border px-2"
              style={({ hovered }) => [
                {
                  backgroundColor: isActive ? theme.primary : hovered ? theme.cardBackgroundStrong : 'transparent',
                  borderColor: isActive ? theme.primary : theme.borderSubtle,
                },
                Platform.OS === 'web' ? ({ transition: 'all 160ms ease', cursor: 'pointer' } as any) : null,
              ]}>
              <Text
                style={{
                  color: isActive ? theme.onPrimary : theme.onSurface,
                  fontFamily: 'Manrope-Bold',
                  fontSize: 12,
                }}>
                {p}
              </Text>
            </Pressable>
          );
        })}

        <Pressable
          onPress={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="h-[32px] w-[32px] items-center justify-center rounded-md"
          style={{ opacity: page === totalPages ? 0.38 : 1 }}>
          <MaterialIcons name="chevron-right" size={18} color={hexToRgba(theme.onSurfaceVariant, 0.88)} />
        </Pressable>
      </View>
    </View>
  );
}

export default function ReservationListSection({
  reservations,
  filteredCount,
  page,
  totalPages,
  startRow,
  endRow,
  useDesktopTable,
  isLoading,
  errorMessage,
  onPageChange,
  onRetry,
  onSelectReservation,
}: Props) {
  const theme = useBarberAdminTheme();

  return (
    <View
      className={reservationClassNames.tableShell}
      style={[
        {
          backgroundColor: theme.cardBackground,
          borderColor: theme.borderSubtle,
        },
        getReservationPanelShadow(theme.theme),
      ]}>
      {isLoading ? (
        <LoadingState />
      ) : errorMessage ? (
        <ErrorState message={errorMessage} onRetry={onRetry} />
      ) : reservations.length === 0 ? (
        <EmptyState />
      ) : useDesktopTable ? (
        <DesktopTable reservations={reservations} onSelectReservation={onSelectReservation} />
      ) : (
        <View className="gap-3 p-4">
          {reservations.map((r) => (
            <ReservationMobileCard
              key={r.id}
              reservation={r}
              onPress={() => onSelectReservation(r)}
            />
          ))}
        </View>
      )}

      <Pagination
        filteredCount={filteredCount}
        page={page}
        totalPages={totalPages}
        startRow={startRow}
        endRow={endRow}
        onPageChange={onPageChange}
      />
    </View>
  );
}

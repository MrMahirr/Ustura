import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Pressable, Text, View } from 'react-native';

import { hexToRgba } from '@/utils/color';

import { useSuperAdminTheme } from '../theme';
import LogMobileCard from './LogMobileCard';
import LogRow from './LogRow';
import { getLogPanelShadow, logClassNames } from './presentation';
import type { LogListItem } from './types';

interface LogListSectionProps {
  logs: LogListItem[];
  filteredLogsCount: number;
  page: number;
  totalPages: number;
  startRow: number;
  endRow: number;
  useDesktopTable: boolean;
  isLoading: boolean;
  error: string | null;
  onPageChange: (page: number) => void;
  onRetry: () => void;
  onLogPress?: (log: LogListItem) => void;
}

export default function LogListSection({
  logs,
  filteredLogsCount,
  page,
  totalPages,
  startRow,
  endRow,
  useDesktopTable,
  isLoading,
  error,
  onPageChange,
  onRetry,
  onLogPress,
}: LogListSectionProps) {
  const adminTheme = useSuperAdminTheme();
  const panelShadow = getLogPanelShadow(adminTheme.theme);

  return (
    <View
      className={logClassNames.tableShell}
      style={[
        { backgroundColor: adminTheme.cardBackground, borderColor: adminTheme.borderSubtle },
        panelShadow,
      ]}>
      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState errorMessage={error} onRetry={onRetry} />
      ) : logs.length === 0 ? (
        <EmptyState />
      ) : useDesktopTable ? (
        <DesktopTable logs={logs} onLogPress={onLogPress} />
      ) : (
        <MobileList logs={logs} onLogPress={onLogPress} />
      )}

      {!isLoading && !error && logs.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          startRow={startRow}
          endRow={endRow}
          filteredCount={filteredLogsCount}
          onPageChange={onPageChange}
        />
      )}
    </View>
  );
}

function EmptyState() {
  const adminTheme = useSuperAdminTheme();

  return (
    <View
      className="m-5 min-h-[260px] items-center justify-center gap-3 rounded-[10px] border px-6"
      style={{
        backgroundColor: adminTheme.cardBackgroundMuted,
        borderColor: adminTheme.borderSubtle,
      }}>
      <MaterialIcons name="search-off" size={32} color={hexToRgba(adminTheme.onSurfaceVariant, 0.8)} />
      <Text
        className={logClassNames.emptyTitle}
        style={{ color: adminTheme.onSurface, fontFamily: 'Manrope-Bold' }}>
        Filtrelere göre log bulunamadı
      </Text>
      <Text
        className={logClassNames.emptyDescription}
        style={{ color: adminTheme.onSurfaceVariant }}>
        Filtre seçimlerini değiştirerek listeyi genişletebilirsiniz.
      </Text>
    </View>
  );
}

function LoadingState() {
  const adminTheme = useSuperAdminTheme();

  return (
    <View
      className="m-5 min-h-[260px] items-center justify-center gap-3 rounded-[10px] border px-6"
      style={{
        backgroundColor: adminTheme.cardBackgroundMuted,
        borderColor: adminTheme.borderSubtle,
      }}>
      <MaterialIcons
        name="hourglass-empty"
        size={30}
        color={hexToRgba(adminTheme.onSurfaceVariant, 0.8)}
      />
      <Text
        className={logClassNames.emptyTitle}
        style={{ color: adminTheme.onSurface, fontFamily: 'Manrope-Bold' }}>
        Loglar yükleniyor
      </Text>
      <Text
        className={logClassNames.emptyDescription}
        style={{ color: adminTheme.onSurfaceVariant }}>
        Güncel log listesi backend üzerinden alınıyor.
      </Text>
    </View>
  );
}

function ErrorState({
  errorMessage,
  onRetry,
}: {
  errorMessage: string;
  onRetry: () => void;
}) {
  const adminTheme = useSuperAdminTheme();

  return (
    <View
      className="m-5 min-h-[260px] items-center justify-center gap-4 rounded-[10px] border px-6"
      style={{
        backgroundColor: adminTheme.cardBackgroundMuted,
        borderColor: adminTheme.borderSubtle,
      }}>
      <MaterialIcons name="error-outline" size={32} color={hexToRgba(adminTheme.error, 0.9)} />
      <View className="items-center gap-2">
        <Text
          className={logClassNames.emptyTitle}
          style={{ color: adminTheme.onSurface, fontFamily: 'Manrope-Bold' }}>
          Log listesi yüklenemedi
        </Text>
        <Text
          className={logClassNames.emptyDescription}
          style={{ color: adminTheme.onSurfaceVariant }}>
          {errorMessage}
        </Text>
      </View>
      <Pressable
        onPress={onRetry}
        className="rounded-md border px-4 py-2.5"
        style={({ hovered }) => [
          {
            borderColor: hexToRgba(adminTheme.primary, hovered ? 0.32 : 0.2),
            backgroundColor: hovered ? hexToRgba(adminTheme.primary, 0.08) : 'transparent',
          },
          Platform.OS === 'web'
            ? ({
                transition: 'background-color 160ms ease, border-color 160ms ease',
                cursor: 'pointer',
              } as any)
            : null,
        ]}>
        <Text
          className="font-label text-[10px] uppercase tracking-[2px]"
          style={{ color: adminTheme.primary, fontFamily: 'Manrope-Bold' }}>
          Tekrar Dene
        </Text>
      </Pressable>
    </View>
  );
}

function DesktopTable({
  logs,
  onLogPress,
}: {
  logs: LogListItem[];
  onLogPress?: (log: LogListItem) => void;
}) {
  const adminTheme = useSuperAdminTheme();

  return (
    <>
      <View
        className="min-h-[52px] flex-row items-center border-b px-6"
        style={{
          backgroundColor: adminTheme.tableHeaderBackground,
          borderBottomColor: adminTheme.borderSubtle,
        }}>
        <Text
          className={logClassNames.headerText}
          style={{
            flex: 2.6,
            color: hexToRgba(adminTheme.onSurfaceVariant, 0.7),
            fontFamily: 'Manrope-Bold',
          }}>
          İşlem
        </Text>
        <Text
          className={logClassNames.headerText}
          style={{
            flex: 1.6,
            color: hexToRgba(adminTheme.onSurfaceVariant, 0.7),
            fontFamily: 'Manrope-Bold',
          }}>
          Kullanıcı
        </Text>
        <Text
          className={logClassNames.headerText}
          style={{
            flex: 1.2,
            color: hexToRgba(adminTheme.onSurfaceVariant, 0.7),
            fontFamily: 'Manrope-Bold',
          }}>
          Varlık
        </Text>
        <Text
          className={logClassNames.headerText}
          style={{
            flex: 2.2,
            color: hexToRgba(adminTheme.onSurfaceVariant, 0.7),
            fontFamily: 'Manrope-Bold',
          }}>
          Detay
        </Text>
        <Text
          className={logClassNames.headerText}
          style={{
            flex: 1.4,
            color: hexToRgba(adminTheme.onSurfaceVariant, 0.7),
            fontFamily: 'Manrope-Bold',
            textAlign: 'right',
          }}>
          Zaman
        </Text>
      </View>

      {logs.map((log, idx) => (
        <View
          key={log.id}
          className="border-b"
          style={{
            borderBottomColor:
              idx < logs.length - 1
                ? hexToRgba(adminTheme.onSurfaceVariant, 0.06)
                : 'transparent',
          }}>
          <LogRow log={log} onPress={onLogPress ? () => onLogPress(log) : undefined} />
        </View>
      ))}
    </>
  );
}

function MobileList({
  logs,
  onLogPress,
}: {
  logs: LogListItem[];
  onLogPress?: (log: LogListItem) => void;
}) {
  return (
    <View className="gap-3 p-4">
      {logs.map((log) => (
        <LogMobileCard
          key={log.id}
          log={log}
          onPress={onLogPress ? () => onLogPress(log) : undefined}
        />
      ))}
    </View>
  );
}

function Pagination({
  page,
  totalPages,
  startRow,
  endRow,
  filteredCount,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  startRow: number;
  endRow: number;
  filteredCount: number;
  onPageChange: (page: number) => void;
}) {
  const adminTheme = useSuperAdminTheme();

  return (
    <View
      className="min-h-[56px] flex-row items-center justify-between border-t px-6 py-3"
      style={{ borderTopColor: adminTheme.borderSubtle }}>
      <Text
        className="font-body text-xs"
        style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.72) }}>
        {startRow}–{endRow} / {filteredCount} kayıt
      </Text>

      <View className="flex-row items-center gap-2">
        <PaginationButton
          icon="chevron-left"
          disabled={page <= 1}
          onPress={() => onPageChange(page - 1)}
        />
        <Text
          className="font-body text-xs min-w-[60px] text-center"
          style={{ color: adminTheme.onSurface, fontFamily: 'Manrope-SemiBold' }}>
          {page} / {totalPages}
        </Text>
        <PaginationButton
          icon="chevron-right"
          disabled={page >= totalPages}
          onPress={() => onPageChange(page + 1)}
        />
      </View>
    </View>
  );
}

function PaginationButton({
  icon,
  disabled,
  onPress,
}: {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  disabled: boolean;
  onPress: () => void;
}) {
  const adminTheme = useSuperAdminTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className="h-8 w-8 items-center justify-center rounded-md border"
      style={({ hovered }) => [
        {
          opacity: disabled ? 0.35 : 1,
          borderColor: hovered && !disabled
            ? hexToRgba(adminTheme.primary, 0.3)
            : adminTheme.borderSubtle,
          backgroundColor: hovered && !disabled
            ? hexToRgba(adminTheme.primary, 0.06)
            : 'transparent',
        },
        Platform.OS === 'web'
          ? ({
              transition: 'background-color 160ms ease, border-color 160ms ease',
              cursor: disabled ? 'not-allowed' : 'pointer',
            } as any)
          : null,
      ]}>
      <MaterialIcons
        name={icon}
        size={18}
        color={disabled ? adminTheme.onSurfaceVariant : adminTheme.primary}
      />
    </Pressable>
  );
}

import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Pressable, Text, View } from 'react-native';

import type { GroupedSalonRecord, UserRecord, UserViewMode } from '@/components/panel/super-admin/user-management.data';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import { getUserPanelShadow, userClassNames } from './presentation';
import UserMobileCard from './UserMobileCard';
import UserRow from './UserRow';
import UserSalonGroupedView from './UserSalonGroupedView';

interface UserListSectionProps {
  users: UserRecord[];
  groupedSalons: GroupedSalonRecord[];
  filteredUsersCount: number;
  viewMode: UserViewMode;
  isLoading?: boolean;
  error?: string | null;
  page: number;
  totalPages: number;
  startRow: number;
  endRow: number;
  useDesktopTable: boolean;
  onPageChange: (page: number) => void;
  onOpenSalon?: (salonId: string) => void;
  onOpenUser?: (userId: string) => void;
  onAddUser?: (salonId?: string) => void;
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const adminTheme = useSuperAdminTheme();

  return (
    <View className={userClassNames.emptyState} style={{ backgroundColor: adminTheme.cardBackgroundMuted, borderColor: adminTheme.borderSubtle }}>
      <MaterialIcons name="search-off" size={32} color={hexToRgba(adminTheme.onSurfaceVariant, 0.8)} />
      <Text className={userClassNames.emptyTitle} style={{ color: adminTheme.onSurface }}>
        {title}
      </Text>
      <Text className={userClassNames.emptyDescription} style={{ color: adminTheme.onSurfaceVariant }}>
        {description}
      </Text>
    </View>
  );
}

function DesktopTable({
  users,
  onOpenUser,
}: {
  users: UserRecord[];
  onOpenUser?: (userId: string) => void;
}) {
  const adminTheme = useSuperAdminTheme();

  return (
    <>
      <View className={userClassNames.headerRow} style={{ backgroundColor: adminTheme.tableHeaderBackground, borderBottomColor: adminTheme.borderSubtle }}>
        <Text className={userClassNames.headerText} style={{ flex: 2.55, color: hexToRgba(adminTheme.onSurfaceVariant, 0.7) }}>
          Kullanici
        </Text>
        <Text className={userClassNames.headerText} style={{ flex: 1.05, color: hexToRgba(adminTheme.onSurfaceVariant, 0.7) }}>
          Rol
        </Text>
        <Text className={userClassNames.headerText} style={{ flex: 1.65, color: hexToRgba(adminTheme.onSurfaceVariant, 0.7) }}>
          Bagli Salon
        </Text>
        <Text className={userClassNames.headerText} style={{ flex: 1, color: hexToRgba(adminTheme.onSurfaceVariant, 0.7) }}>
          Durum
        </Text>
        <Text className={userClassNames.headerText} style={{ flex: 1.25, color: hexToRgba(adminTheme.onSurfaceVariant, 0.7) }}>
          Gunluk Randevu
        </Text>
        <Text className={userClassNames.headerText} style={{ flex: 1.05, color: hexToRgba(adminTheme.onSurfaceVariant, 0.7), textAlign: 'right' }}>
          Islemler
        </Text>
      </View>

      <View>
        {users.map((user, index) => (
          <View key={user.id} style={index < users.length - 1 ? { borderBottomColor: adminTheme.borderSubtle, borderBottomWidth: 1 } : null}>
            <UserRow user={user} onPress={() => onOpenUser?.(user.id)} />
          </View>
        ))}
      </View>
    </>
  );
}

function Pagination({
  filteredUsersCount,
  page,
  totalPages,
  startRow,
  endRow,
  onPageChange,
}: Omit<UserListSectionProps, 'users' | 'groupedSalons' | 'viewMode' | 'useDesktopTable'>) {
  const adminTheme = useSuperAdminTheme();

  return (
    <View className={userClassNames.paginationBar} style={{ backgroundColor: hexToRgba(adminTheme.tableHeaderBackground, 0.6), borderTopColor: adminTheme.borderSubtle }}>
      <Text className={userClassNames.paginationText} style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.78) }}>
        {filteredUsersCount === 0
          ? 'Kayit bulunamadi'
          : `${filteredUsersCount} kayittan ${startRow}-${endRow} arasi gosteriliyor`}
      </Text>

      <View className={userClassNames.paginationControls}>
        <Pressable
          onPress={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className={userClassNames.paginationButton}
          style={({ hovered }) => [
            {
              opacity: page === 1 ? 0.38 : 1,
              backgroundColor: hovered && page !== 1 ? adminTheme.cardBackgroundStrong : 'transparent',
            },
            Platform.OS === 'web'
              ? ({
                  transition: 'background-color 160ms ease, border-color 160ms ease, opacity 160ms ease, transform 160ms ease',
                  cursor: 'pointer',
                } as any)
              : null,
          ]}>
          <MaterialIcons name="chevron-left" size={18} color={hexToRgba(adminTheme.onSurfaceVariant, 0.88)} />
        </Pressable>

        {Array.from({ length: totalPages }).map((_, index) => {
          const targetPage = index + 1;
          const isActive = targetPage === page;

          return (
            <Pressable
              key={`user-page-${targetPage}`}
              onPress={() => onPageChange(targetPage)}
              className={userClassNames.pageButton}
              style={({ hovered }) => [
                {
                  backgroundColor: isActive ? adminTheme.primary : hovered ? adminTheme.cardBackgroundStrong : 'transparent',
                  borderColor: isActive ? adminTheme.primary : adminTheme.borderSubtle,
                },
                Platform.OS === 'web'
                  ? ({
                      transition: 'background-color 160ms ease, border-color 160ms ease, opacity 160ms ease, transform 160ms ease',
                      cursor: 'pointer',
                    } as any)
                  : null,
              ]}>
              <Text className={userClassNames.pageButtonText} style={{ color: isActive ? adminTheme.onPrimary : adminTheme.onSurface }}>
                {targetPage}
              </Text>
            </Pressable>
          );
        })}

        <Pressable
          onPress={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className={userClassNames.paginationButton}
          style={({ hovered }) => [
            {
              opacity: page === totalPages ? 0.38 : 1,
              backgroundColor: hovered && page !== totalPages ? adminTheme.cardBackgroundStrong : 'transparent',
            },
            Platform.OS === 'web'
              ? ({
                  transition: 'background-color 160ms ease, border-color 160ms ease, opacity 160ms ease, transform 160ms ease',
                  cursor: 'pointer',
                } as any)
              : null,
          ]}>
          <MaterialIcons name="chevron-right" size={18} color={hexToRgba(adminTheme.onSurfaceVariant, 0.88)} />
        </Pressable>
      </View>
    </View>
  );
}

export default function UserListSection({
  users,
  groupedSalons,
  filteredUsersCount,
  viewMode,
  isLoading,
  error,
  page,
  totalPages,
  startRow,
  endRow,
  useDesktopTable,
  onPageChange,
  onOpenSalon,
  onOpenUser,
  onAddUser,
}: UserListSectionProps) {
  const adminTheme = useSuperAdminTheme();

  if (error) {
    return (
      <EmptyState
        title="Kullanici verileri yuklenemedi"
        description={error}
      />
    );
  }

  if (viewMode === 'salons') {
    return isLoading ? (
      <EmptyState
        title="Kullanici verileri yukleniyor"
        description="Salon gruplari hazirlaniyor."
      />
    ) : groupedSalons.length === 0 ? (
      <EmptyState
        title="Salon eslesmesi bulunamadi"
        description="Filtrelere gore gosterilecek kullanici grubu olusmadi."
      />
    ) : (
      <UserSalonGroupedView
        groupedSalons={groupedSalons}
        onOpenSalon={onOpenSalon}
        onOpenUser={onOpenUser}
        onAddUser={onAddUser}
      />
    );
  }

  return (
    <View className={userClassNames.tableShell} style={{ backgroundColor: adminTheme.cardBackground, borderColor: adminTheme.borderSubtle, ...getUserPanelShadow(adminTheme.theme) }}>
      {isLoading ? (
        <EmptyState
          title="Kullanici verileri yukleniyor"
          description="Super admin kullanici listesi getiriliyor."
        />
      ) : users.length === 0 ? (
        <EmptyState
          title="Filtrelere gore kullanici bulunamadi"
          description="Arama terimini veya secili filtreleri degistirerek listeyi genisletebilirsiniz."
        />
      ) : useDesktopTable ? (
        <DesktopTable users={users} onOpenUser={onOpenUser} />
      ) : (
        <View className={userClassNames.mobileList}>
          {users.map((user) => (
            <UserMobileCard key={user.id} user={user} onPress={() => onOpenUser?.(user.id)} />
          ))}
        </View>
      )}

      {viewMode === 'all' ? (
        <Pagination
          filteredUsersCount={filteredUsersCount}
          page={page}
          totalPages={totalPages}
          startRow={startRow}
          endRow={endRow}
          onPageChange={onPageChange}
        />
      ) : null}
    </View>
  );
}

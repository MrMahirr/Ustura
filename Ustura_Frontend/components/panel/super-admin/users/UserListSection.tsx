import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Pressable, Text, View } from 'react-native';

import type { GroupedSalonRecord, UserRecord, UserViewMode } from '@/components/panel/super-admin/user-management.data';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import { styles } from './styles';
import UserMobileCard from './UserMobileCard';
import UserRow from './UserRow';
import UserSalonGroupedView from './UserSalonGroupedView';

interface UserListSectionProps {
  users: UserRecord[];
  groupedSalons: GroupedSalonRecord[];
  filteredUsersCount: number;
  viewMode: UserViewMode;
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
    <View
      style={[
        styles.emptyState,
        { backgroundColor: adminTheme.cardBackgroundMuted, borderColor: adminTheme.borderSubtle },
      ]}>
      <MaterialIcons name="search-off" size={32} color={hexToRgba(adminTheme.onSurfaceVariant, 0.8)} />
      <Text style={[styles.emptyTitle, { color: adminTheme.onSurface }]}>{title}</Text>
      <Text style={[styles.emptyDescription, { color: adminTheme.onSurfaceVariant }]}>{description}</Text>
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
      <View
        style={[
          styles.headerRow,
          {
            backgroundColor: adminTheme.tableHeaderBackground,
            borderBottomColor: adminTheme.borderSubtle,
          },
        ]}>
        <Text style={[styles.headerText, styles.cellUser, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.7) }]}>
          Kullanici
        </Text>
        <Text style={[styles.headerText, styles.cellRole, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.7) }]}>
          Rol
        </Text>
        <Text style={[styles.headerText, styles.cellSalon, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.7) }]}>
          Bagli Salon
        </Text>
        <Text style={[styles.headerText, styles.cellStatus, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.7) }]}>
          Durum
        </Text>
        <Text style={[styles.headerText, styles.cellCapacity, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.7) }]}>
          Gunluk Randevu
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
    <View
      style={[
        styles.paginationBar,
        {
          backgroundColor: hexToRgba(adminTheme.tableHeaderBackground, 0.6),
          borderTopColor: adminTheme.borderSubtle,
        },
      ]}>
      <Text style={[styles.paginationText, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.78) }]}>
        {filteredUsersCount === 0
          ? 'Kayit bulunamadi'
          : `${filteredUsersCount} kayittan ${startRow}-${endRow} arasi gosteriliyor`}
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
              key={`user-page-${targetPage}`}
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

export default function UserListSection({
  users,
  groupedSalons,
  filteredUsersCount,
  viewMode,
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

  if (viewMode === 'salons') {
    return groupedSalons.length === 0 ? (
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
      {users.length === 0 ? (
        <EmptyState
          title="Filtrelere gore kullanici bulunamadi"
          description="Arama terimini veya secili filtreleri degistirerek listeyi genisletebilirsiniz."
        />
      ) : useDesktopTable ? (
        <DesktopTable users={users} onOpenUser={onOpenUser} />
      ) : (
        <View style={styles.mobileList}>
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

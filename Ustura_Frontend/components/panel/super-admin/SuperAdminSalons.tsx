import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import PanelTopBar from '@/components/panel/super-admin/PanelTopBar';
import { Typography } from '@/constants/typography';
import { hexToRgba } from '@/utils/color';
import { matchesQuery } from '@/utils/matches-query';

import {
  salonOverview,
  salonPlanOptions,
  salonRecords,
  salonSortOptions,
  salonStatusOptions,
  type SalonPlan,
  type SalonRecord,
  type SalonStatus,
} from './salon-management.data';
import { useSuperAdminTheme } from './theme';

const PAGE_SIZE = 4;

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(amount);
}

function getStatusPalette(status: SalonStatus, success: string, warning: string, error: string) {
  if (status === 'Aktif') {
    return {
      color: success,
      backgroundColor: hexToRgba(success, 0.12),
      borderColor: hexToRgba(success, 0.24),
    };
  }

  if (status === 'Beklemede') {
    return {
      color: warning,
      backgroundColor: hexToRgba(warning, 0.14),
      borderColor: hexToRgba(warning, 0.24),
    };
  }

  return {
    color: error,
    backgroundColor: hexToRgba(error, 0.12),
    borderColor: hexToRgba(error, 0.24),
  };
}

function getPlanPalette(plan: SalonPlan, primary: string, onSurface: string, onSurfaceVariant: string) {
  if (plan === 'Premium') {
    return {
      dot: primary,
      text: onSurface,
      glow: hexToRgba(primary, 0.48),
    };
  }

  if (plan === 'Pro') {
    return {
      dot: hexToRgba(onSurfaceVariant, 0.58),
      text: onSurface,
      glow: 'transparent',
    };
  }

  return {
    dot: hexToRgba(onSurfaceVariant, 0.34),
    text: hexToRgba(onSurfaceVariant, 0.9),
    glow: 'transparent',
  };
}

function getRowActions(status: SalonStatus, primary: string, success: string, error: string, onSurfaceVariant: string) {
  if (status === 'Beklemede') {
    return [
      { icon: 'check-circle' as const, label: 'Onayla', color: success },
      { icon: 'cancel' as const, label: 'Reddet', color: error },
      { icon: 'more-vert' as const, label: 'Diger islemler', color: onSurfaceVariant },
    ];
  }

  if (status === 'Askiya Alindi') {
    return [
      { icon: 'restore' as const, label: 'Yeniden aktiflestir', color: success },
      { icon: 'visibility' as const, label: 'Detaylari gor', color: primary },
      { icon: 'more-vert' as const, label: 'Diger islemler', color: onSurfaceVariant },
    ];
  }

  return [
    { icon: 'visibility' as const, label: 'Detaylari gor', color: primary },
    { icon: 'block' as const, label: 'Askiya al', color: error },
    { icon: 'more-vert' as const, label: 'Diger islemler', color: onSurfaceVariant },
  ];
}

function FilterCard({
  label,
  value,
  icon,
  onPress,
}: {
  label: string;
  value: string;
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  onPress: () => void;
}) {
  const adminTheme = useSuperAdminTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ hovered, pressed }) => [
        styles.filterCard,
        {
          backgroundColor: hovered ? adminTheme.cardBackgroundStrong : adminTheme.cardBackground,
          borderColor: hovered ? adminTheme.borderStrong : adminTheme.borderSubtle,
          transform: [{ translateY: pressed ? 1 : hovered ? -2 : 0 }],
        },
        Platform.OS === 'web' ? styles.webInteractiveCard : null,
      ]}>
      <View style={styles.filterLabelRow}>
        <Text style={[styles.filterLabel, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.72) }]}>{label}</Text>
        <MaterialIcons name={icon} size={16} color={hexToRgba(adminTheme.onSurfaceVariant, 0.68)} />
      </View>

      <View style={styles.filterValueRow}>
        <Text style={[styles.filterValue, { color: adminTheme.onSurface }]} numberOfLines={1}>
          {value}
        </Text>
        <MaterialIcons name="expand-more" size={16} color={adminTheme.primary} />
      </View>
    </Pressable>
  );
}

function IconAction({
  icon,
  label,
  color,
}: {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  label: string;
  color: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ hovered, pressed }) => [
        styles.iconAction,
        {
          backgroundColor: hovered ? hexToRgba(color, 0.12) : 'transparent',
          transform: [{ scale: pressed ? 0.94 : 1 }],
        },
        Platform.OS === 'web' ? styles.webInteractiveButton : null,
      ]}>
      {({ hovered }) => <MaterialIcons name={icon} size={18} color={hovered ? color : hexToRgba(color, 0.96)} />}
    </Pressable>
  );
}

function HeaderCta() {
  const adminTheme = useSuperAdminTheme();

  return (
    <Pressable
      accessibilityRole="button"
      style={({ hovered, pressed }) => [
        styles.ctaWrap,
        { transform: [{ scale: pressed ? 0.985 : hovered ? 1.015 : 1 }] },
        Platform.OS === 'web'
          ? ({
              transition: 'transform 180ms ease, box-shadow 220ms ease',
              boxShadow: hovered
                ? `0 18px 36px ${hexToRgba(adminTheme.primary, 0.22)}`
                : `0 10px 24px ${hexToRgba(adminTheme.primary, 0.14)}`,
            } as any)
          : null,
      ]}>
      <LinearGradient colors={adminTheme.goldGradient as [string, string]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cta}>
        <MaterialIcons name="add-business" size={18} color={adminTheme.onPrimary} />
        <Text style={[styles.ctaText, { color: adminTheme.onPrimary }]}>Yeni Salon Ekle</Text>
      </LinearGradient>
    </Pressable>
  );
}

function EmptyState() {
  const adminTheme = useSuperAdminTheme();

  return (
    <View style={[styles.emptyState, { backgroundColor: adminTheme.cardBackgroundMuted, borderColor: adminTheme.borderSubtle }]}>
      <MaterialIcons name="search-off" size={32} color={hexToRgba(adminTheme.onSurfaceVariant, 0.8)} />
      <Text style={[styles.emptyTitle, { color: adminTheme.onSurface }]}>Filtrelere gore salon bulunamadi</Text>
      <Text style={[styles.emptyDescription, { color: adminTheme.onSurfaceVariant }]}>
        Arama kelimesini veya filtre secimlerini degistirerek listeyi genisletebilirsiniz.
      </Text>
    </View>
  );
}

function SalonRow({ salon, useHoverReveal }: { salon: SalonRecord; useHoverReveal: boolean }) {
  const adminTheme = useSuperAdminTheme();
  const statusPalette = getStatusPalette(salon.status, adminTheme.success, adminTheme.warning, adminTheme.error);
  const planPalette = getPlanPalette(salon.plan, adminTheme.primary, adminTheme.onSurface, adminTheme.onSurfaceVariant);
  const actions = getRowActions(
    salon.status,
    adminTheme.primary,
    adminTheme.success,
    adminTheme.error,
    hexToRgba(adminTheme.onSurfaceVariant, 0.78)
  );

  return (
    <Pressable
      style={({ hovered }) => [
        styles.row,
        { backgroundColor: hovered ? adminTheme.cardBackgroundStrong : 'transparent' },
        Platform.OS === 'web' ? styles.webRowTransition : null,
      ]}>
      {({ hovered }) => (
        <>
          <View style={[styles.cell, styles.cellSalon]}>
            <View style={styles.salonInfo}>
              <View style={[styles.salonThumbFrame, { borderColor: adminTheme.borderSubtle, backgroundColor: adminTheme.cardBackgroundStrong }]}>
                <Image
                  source={{ uri: salon.imageUrl }}
                  style={[styles.salonThumb, Platform.OS === 'web' && salon.mutedImage ? ({ filter: 'grayscale(1)' } as any) : null]}
                  contentFit="cover"
                />
              </View>
              <View style={styles.salonCopy}>
                <Text style={[styles.salonName, { color: adminTheme.onSurface }]} numberOfLines={1}>
                  {salon.name}
                </Text>
                <Text style={[styles.salonId, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.82) }]}>ID: {salon.reference}</Text>
              </View>
            </View>
          </View>

          <View style={[styles.cell, styles.cellOwner]}>
            <Text style={[styles.ownerName, { color: adminTheme.onSurface }]} numberOfLines={1}>
              {salon.owner}
            </Text>
            <Text style={[styles.ownerEmail, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.8) }]} numberOfLines={1}>
              {salon.ownerEmail}
            </Text>
          </View>

          <View style={[styles.cell, styles.cellLocation]}>
            <View style={styles.locationRow}>
              <MaterialIcons name="location-on" size={16} color={hexToRgba(adminTheme.onSurfaceVariant, 0.74)} />
              <Text style={[styles.locationText, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.92) }]} numberOfLines={1}>
                {salon.location}
              </Text>
            </View>
          </View>

          <View style={[styles.cell, styles.cellStatus]}>
            <View style={[styles.statusBadge, { backgroundColor: statusPalette.backgroundColor, borderColor: statusPalette.borderColor }]}>
              <Text style={[styles.statusText, { color: statusPalette.color }]}>{salon.status}</Text>
            </View>
          </View>

          <View style={[styles.cell, styles.cellPlan]}>
            <View style={styles.planRow}>
              <View
                style={[
                  styles.planDot,
                  {
                    backgroundColor: planPalette.dot,
                    ...(Platform.OS === 'web' && planPalette.glow !== 'transparent'
                      ? ({ boxShadow: `0 0 12px ${planPalette.glow}` } as any)
                      : null),
                  },
                ]}
              />
              <Text style={[styles.planText, { color: planPalette.text }]}>{salon.plan}</Text>
            </View>
          </View>

          <View style={[styles.cell, styles.cellActions]}>
            <View style={[styles.actionsRow, useHoverReveal ? { opacity: hovered ? 1 : 0.18 } : null]}>
              {actions.map((action) => (
                <IconAction key={`${salon.id}-${action.icon}`} icon={action.icon} label={action.label} color={action.color} />
              ))}
            </View>
          </View>
        </>
      )}
    </Pressable>
  );
}

function MobileCard({ salon }: { salon: SalonRecord }) {
  const adminTheme = useSuperAdminTheme();
  const statusPalette = getStatusPalette(salon.status, adminTheme.success, adminTheme.warning, adminTheme.error);
  const planPalette = getPlanPalette(salon.plan, adminTheme.primary, adminTheme.onSurface, adminTheme.onSurfaceVariant);
  const actions = getRowActions(
    salon.status,
    adminTheme.primary,
    adminTheme.success,
    adminTheme.error,
    hexToRgba(adminTheme.onSurfaceVariant, 0.78)
  );

  return (
    <View style={[styles.mobileCard, { backgroundColor: adminTheme.cardBackground, borderColor: adminTheme.borderSubtle }]}>
      <View style={styles.mobileCardTop}>
        <View style={styles.salonInfo}>
          <View style={[styles.salonThumbFrame, { borderColor: adminTheme.borderSubtle, backgroundColor: adminTheme.cardBackgroundStrong }]}>
            <Image
              source={{ uri: salon.imageUrl }}
              style={[styles.salonThumb, Platform.OS === 'web' && salon.mutedImage ? ({ filter: 'grayscale(1)' } as any) : null]}
              contentFit="cover"
            />
          </View>
          <View style={styles.salonCopy}>
            <Text style={[styles.salonName, { color: adminTheme.onSurface }]} numberOfLines={1}>
              {salon.name}
            </Text>
            <Text style={[styles.salonId, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.82) }]}>ID: {salon.reference}</Text>
          </View>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: statusPalette.backgroundColor, borderColor: statusPalette.borderColor }]}>
          <Text style={[styles.statusText, { color: statusPalette.color }]}>{salon.status}</Text>
        </View>
      </View>

      <View style={styles.mobileMetaGrid}>
        <View style={styles.mobileMetaItem}>
          <Text style={[styles.mobileMetaLabel, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.72) }]}>Isletmeci</Text>
          <Text style={[styles.mobileMetaValue, { color: adminTheme.onSurface }]}>{salon.owner}</Text>
          <Text style={[styles.mobileMetaSubValue, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.82) }]}>{salon.ownerEmail}</Text>
        </View>
        <View style={styles.mobileMetaItem}>
          <Text style={[styles.mobileMetaLabel, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.72) }]}>Konum</Text>
          <Text style={[styles.mobileMetaValue, { color: adminTheme.onSurface }]}>{salon.location}</Text>
        </View>
        <View style={styles.mobileMetaItem}>
          <Text style={[styles.mobileMetaLabel, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.72) }]}>Paket</Text>
          <View style={styles.planRow}>
            <View
              style={[
                styles.planDot,
                {
                  backgroundColor: planPalette.dot,
                  ...(Platform.OS === 'web' && planPalette.glow !== 'transparent'
                    ? ({ boxShadow: `0 0 12px ${planPalette.glow}` } as any)
                    : null),
                },
              ]}
            />
            <Text style={[styles.planText, { color: planPalette.text }]}>{salon.plan}</Text>
          </View>
        </View>
        <View style={styles.mobileMetaItem}>
          <Text style={[styles.mobileMetaLabel, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.72) }]}>Aylik Ciro</Text>
          <Text style={[styles.mobileMetaValue, { color: adminTheme.primary }]}>{formatCurrency(salon.monthlyRevenue)}</Text>
        </View>
      </View>

      <View style={styles.mobileActions}>
        {actions.map((action) => (
          <IconAction key={`${salon.id}-${action.icon}`} icon={action.icon} label={action.label} color={action.color} />
        ))}
      </View>
    </View>
  );
}

export default function SuperAdminSalons() {
  const { width } = useWindowDimensions();
  const [query, setQuery] = React.useState('');
  const [statusIndex, setStatusIndex] = React.useState(0);
  const [planIndex, setPlanIndex] = React.useState(0);
  const [sortIndex, setSortIndex] = React.useState(0);
  const [page, setPage] = React.useState(1);

  const adminTheme = useSuperAdminTheme();
  const isTablet = width >= 768;
  const isWide = width >= 1100;
  const useDesktopTable = width >= 1180;
  const paddingH = width < 768 ? 16 : 32;
  const filterBasis = width >= 1320 ? '23.6%' : width >= 860 ? '48.5%' : '100%';

  React.useEffect(() => {
    setPage(1);
  }, [query, statusIndex, planIndex, sortIndex]);

  const filteredSalons = salonRecords
    .filter((salon) => {
      const status = salonStatusOptions[statusIndex];
      const plan = salonPlanOptions[planIndex];

      return (
        (status === 'Tum Durumlar' || salon.status === status) &&
        (plan === 'Tum Paketler' || salon.plan === plan) &&
        matchesQuery(query, [salon.name, salon.reference, salon.owner, salon.ownerEmail, salon.location, salon.status, salon.plan])
      );
    })
    .sort((left, right) => {
      const sort = salonSortOptions[sortIndex];

      if (sort === 'Isme Gore (A-Z)') {
        return left.name.localeCompare(right.name, 'tr');
      }

      if (sort === 'Ciro (Yuksek)') {
        return right.monthlyRevenue - left.monthlyRevenue;
      }

      return new Date(right.joinedAt).getTime() - new Date(left.joinedAt).getTime();
    });

  const totalPages = Math.max(1, Math.ceil(filteredSalons.length / PAGE_SIZE));

  React.useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const visibleSalons = filteredSalons.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const startRow = filteredSalons.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const endRow = Math.min(page * PAGE_SIZE, filteredSalons.length);

  return (
    <View style={[styles.page, { backgroundColor: adminTheme.pageBackground }]}>
      <View
        style={[
          styles.gridOverlay,
          Platform.OS === 'web'
            ? ({ backgroundImage: `radial-gradient(circle at 1px 1px, ${adminTheme.gridDot} 1px, transparent 0)` } as any)
            : null,
        ]}
      />

      <PanelTopBar query={query} onQueryChange={setQuery} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: paddingH, paddingTop: 24, paddingBottom: 40 }]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={[styles.headerSection, { flexDirection: isWide ? 'row' : 'column', alignItems: isWide ? 'flex-end' : 'flex-start' }]}>
            <View style={styles.headerCopy}>
              <Text style={[styles.eyebrow, { color: adminTheme.primary }]}>Yonetim Paneli</Text>
              <Text style={[styles.title, { color: adminTheme.onSurface }]}>Salon Yonetimi</Text>
              <Text style={[styles.description, { color: adminTheme.onSurfaceVariant }]}>
                Aktif salonlar, onay bekleyen basvurular ve paket segmentleri tek content yapisinda toplandi.
              </Text>
            </View>
            <HeaderCta />
          </View>

          <View style={styles.filtersGrid}>
            <View style={[styles.filterItem, { width: filterBasis as any }]}>
              <FilterCard label="Durum Filtresi" value={salonStatusOptions[statusIndex]} icon="tune" onPress={() => setStatusIndex((current) => (current + 1) % salonStatusOptions.length)} />
            </View>
            <View style={[styles.filterItem, { width: filterBasis as any }]}>
              <FilterCard label="Abonelik Plani" value={salonPlanOptions[planIndex]} icon="inventory-2" onPress={() => setPlanIndex((current) => (current + 1) % salonPlanOptions.length)} />
            </View>
            <View style={[styles.filterItem, { width: filterBasis as any }]}>
              <FilterCard label="Siralama" value={salonSortOptions[sortIndex]} icon="swap-vert" onPress={() => setSortIndex((current) => (current + 1) % salonSortOptions.length)} />
            </View>
            <View style={[styles.filterItem, { width: filterBasis as any }]}>
              <View style={[styles.totalCard, { backgroundColor: adminTheme.cardBackground, borderColor: adminTheme.borderSubtle }]}>
                <View>
                  <Text style={[styles.filterLabel, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.72) }]}>Toplam Kayit</Text>
                  <Text style={[styles.totalValue, { color: adminTheme.primary }]}>
                    {new Intl.NumberFormat('tr-TR').format(salonOverview.totalRecords)}
                  </Text>
                </View>
                <MaterialIcons name="analytics" size={30} color={hexToRgba(adminTheme.onSurfaceVariant, 0.28)} />
              </View>
            </View>
          </View>

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
            {visibleSalons.length === 0 ? (
              <EmptyState />
            ) : useDesktopTable ? (
              <>
                <View style={[styles.headerRow, { backgroundColor: adminTheme.tableHeaderBackground, borderBottomColor: adminTheme.borderSubtle }]}>
                  <Text style={[styles.headerText, styles.cellSalon, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.7) }]}>Salon Bilgisi</Text>
                  <Text style={[styles.headerText, styles.cellOwner, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.7) }]}>Isletmeci</Text>
                  <Text style={[styles.headerText, styles.cellLocation, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.7) }]}>Konum</Text>
                  <Text style={[styles.headerText, styles.cellStatus, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.7) }]}>Durum</Text>
                  <Text style={[styles.headerText, styles.cellPlan, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.7) }]}>Paket</Text>
                  <Text style={[styles.headerText, styles.cellActions, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.7), textAlign: 'right' }]}>
                    Islemler
                  </Text>
                </View>
                <View>
                  {visibleSalons.map((salon, index) => (
                    <View key={salon.id} style={index < visibleSalons.length - 1 ? { borderBottomColor: adminTheme.borderSubtle, borderBottomWidth: 1 } : null}>
                      <SalonRow salon={salon} useHoverReveal />
                    </View>
                  ))}
                </View>
              </>
            ) : (
              <View style={styles.mobileList}>
                {visibleSalons.map((salon) => (
                  <MobileCard key={salon.id} salon={salon} />
                ))}
              </View>
            )}

            <View style={[styles.paginationBar, { backgroundColor: hexToRgba(adminTheme.tableHeaderBackground, 0.6), borderTopColor: adminTheme.borderSubtle }]}>
              <Text style={[styles.paginationText, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.78) }]}>
                {filteredSalons.length === 0
                  ? 'Kayit bulunamadi'
                  : `${new Intl.NumberFormat('tr-TR').format(filteredSalons.length)} kayittan ${startRow}-${endRow} gosteriliyor`}
              </Text>

              <View style={styles.paginationControls}>
                <Pressable
                  onPress={() => setPage((current) => Math.max(1, current - 1))}
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
                  const active = targetPage === page;

                  return (
                    <Pressable
                      key={`page-${targetPage}`}
                      onPress={() => setPage(targetPage)}
                      style={({ hovered }) => [
                        styles.pageButton,
                        {
                          backgroundColor: active ? adminTheme.primary : hovered ? adminTheme.cardBackgroundStrong : 'transparent',
                          borderColor: active ? adminTheme.primary : adminTheme.borderSubtle,
                        },
                        Platform.OS === 'web' ? styles.webInteractiveButton : null,
                      ]}>
                      <Text style={[styles.pageButtonText, { color: active ? adminTheme.onPrimary : adminTheme.onSurface }]}>{targetPage}</Text>
                    </Pressable>
                  );
                })}

                <Pressable
                  onPress={() => setPage((current) => Math.min(totalPages, current + 1))}
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
          </View>

          <View style={[styles.insightsGrid, { flexDirection: isTablet ? 'row' : 'column' }]}>
            <LinearGradient
              colors={[
                hexToRgba(adminTheme.primary, adminTheme.theme === 'dark' ? 0.1 : 0.12),
                hexToRgba(adminTheme.primaryContainer, adminTheme.theme === 'dark' ? 0.03 : 0.18),
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.growthCard, { borderColor: adminTheme.borderSubtle }]}>
              <View style={styles.growthCopy}>
                <Text style={[styles.growthTitle, { color: adminTheme.onSurface }]}>Aylik Buyume Analizi</Text>
                <Text style={[styles.growthDescription, { color: adminTheme.onSurfaceVariant }]}>
                  Yeni salon kayitlari gecen aya gore %18 artis gosterdi. Premium paket donusum orani en yuksek seviyesine cikti.
                </Text>
                <View style={styles.growthMetrics}>
                  <View>
                    <Text style={[styles.growthLabel, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.72) }]}>Yeni Salonlar</Text>
                    <Text style={[styles.growthValue, { color: adminTheme.success }]}>{salonOverview.newSalons}</Text>
                  </View>
                  <View>
                    <Text style={[styles.growthLabel, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.72) }]}>Ciro Artisi</Text>
                    <Text style={[styles.growthValue, { color: adminTheme.primary }]}>{salonOverview.revenueGrowth}</Text>
                  </View>
                </View>
              </View>
              <View pointerEvents="none" style={styles.growthIcon}>
                <MaterialIcons name="trending-up" size={190} color={hexToRgba(adminTheme.primary, adminTheme.theme === 'dark' ? 0.12 : 0.16)} />
              </View>
            </LinearGradient>

            <View
              style={[
                styles.systemCard,
                {
                  backgroundColor: hexToRgba(adminTheme.primary, adminTheme.theme === 'dark' ? 0.06 : 0.07),
                  borderColor: hexToRgba(adminTheme.primary, 0.14),
                },
              ]}>
              <View>
                <Text style={[styles.systemTitle, { color: adminTheme.primary }]}>Sistem Durumu</Text>
                <View style={styles.systemStatusRow}>
                  <View style={[styles.systemPulse, { backgroundColor: adminTheme.success }]} />
                  <Text style={[styles.systemStatusText, { color: adminTheme.success }]}>Tum Sistemler Aktif</Text>
                </View>
                <Text style={[styles.systemDescription, { color: adminTheme.onSurfaceVariant }]}>
                  Onay siralari, bildirim akisleri ve odeme servisleri normal seviyede calisiyor.
                </Text>
              </View>

              <Pressable
                accessibilityRole="button"
                style={({ hovered }) => [
                  styles.systemButton,
                  {
                    borderColor: hexToRgba(adminTheme.primary, hovered ? 0.32 : 0.2),
                    backgroundColor: hovered ? hexToRgba(adminTheme.primary, 0.08) : 'transparent',
                  },
                  Platform.OS === 'web' ? styles.webInteractiveButton : null,
                ]}>
                <Text style={[styles.systemButtonText, { color: adminTheme.primary }]}>Sistem Gunlugunu Goruntule</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, position: 'relative', overflow: 'hidden' },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: Platform.OS === 'web' ? 1 : 0,
    backgroundSize: '40px 40px',
    pointerEvents: 'none',
  } as any,
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  content: { width: '100%', maxWidth: 1600, alignSelf: 'center', gap: 32 },
  headerSection: { justifyContent: 'space-between', gap: 20 },
  headerCopy: { flex: 1, maxWidth: 720, gap: 10 },
  eyebrow: { ...Typography.labelMd, fontFamily: 'Manrope-Bold', letterSpacing: 4 },
  title: { fontFamily: 'NotoSerif-Bold', fontSize: 38, letterSpacing: -0.8 },
  description: { ...Typography.bodyLg, fontWeight: '300', maxWidth: 620 },
  ctaWrap: { borderRadius: 8 },
  cta: { minHeight: 54, borderRadius: 8, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', gap: 10 },
  ctaText: { ...Typography.labelMd, fontFamily: 'Manrope-Bold', letterSpacing: 2.2 },
  filtersGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  filterItem: { minWidth: 190 },
  filterCard: {
    minHeight: 82,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 7,
    borderWidth: 1,
    justifyContent: 'space-between',
  },
  filterLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  filterLabel: { ...Typography.labelSm, fontFamily: 'Manrope-Bold', fontSize: 9, letterSpacing: 1.8 },
  filterValueRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  filterValue: { ...Typography.bodyMd, fontFamily: 'Manrope-Bold', fontSize: 13, lineHeight: 18, flex: 1 },
  totalCard: {
    minHeight: 82,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 7,
    borderWidth: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalValue: { fontFamily: 'NotoSerif-Bold', fontSize: 28, letterSpacing: -0.6, marginTop: 6 },
  tableShell: { borderRadius: 10, borderWidth: 1, overflow: 'hidden' },
  headerRow: { minHeight: 58, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, paddingHorizontal: 24 },
  headerText: { ...Typography.labelSm, fontFamily: 'Manrope-Bold', fontSize: 10, letterSpacing: 2.4 },
  row: { minHeight: 88, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24 },
  cell: { justifyContent: 'center', minWidth: 0, paddingVertical: 18 },
  cellSalon: { flex: 2.4 },
  cellOwner: { flex: 1.6, paddingRight: 20 },
  cellLocation: { flex: 1.45, paddingRight: 16 },
  cellStatus: { flex: 1.05, paddingRight: 16 },
  cellPlan: { flex: 0.95, paddingRight: 16 },
  cellActions: { flex: 1.1, alignItems: 'flex-end' },
  salonInfo: { flexDirection: 'row', alignItems: 'center', gap: 14, minWidth: 0 },
  salonThumbFrame: { width: 52, height: 52, borderRadius: 8, overflow: 'hidden', borderWidth: 1, flexShrink: 0 },
  salonThumb: { width: '100%', height: '100%' },
  salonCopy: { minWidth: 0, flex: 1, gap: 4 },
  salonName: { ...Typography.bodyMd, fontFamily: 'Manrope-Bold', fontSize: 14 },
  salonId: { ...Typography.bodyMd, fontSize: 12, lineHeight: 18 },
  ownerName: { ...Typography.bodyMd, fontFamily: 'Manrope-SemiBold', fontSize: 14 },
  ownerEmail: { ...Typography.bodyMd, fontSize: 11, lineHeight: 18, marginTop: 2 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { ...Typography.bodyMd, fontSize: 12, lineHeight: 18, flexShrink: 1 },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1 },
  statusText: { ...Typography.labelSm, fontFamily: 'Manrope-Bold', fontSize: 10, letterSpacing: 1.6 },
  planRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  planDot: { width: 8, height: 8, borderRadius: 999 },
  planText: { ...Typography.bodyMd, fontFamily: 'Manrope-Bold', fontSize: 12 },
  actionsRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  iconAction: { width: 34, height: 34, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  emptyState: {
    minHeight: 260,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 12,
    borderWidth: 1,
    borderRadius: 10,
    margin: 20,
  },
  emptyTitle: { ...Typography.titleMd, fontFamily: 'Manrope-Bold' },
  emptyDescription: { ...Typography.bodyMd, textAlign: 'center', maxWidth: 420 },
  mobileList: { padding: 16, gap: 14 },
  mobileCard: { borderWidth: 1, borderRadius: 10, padding: 16, gap: 16 },
  mobileCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  mobileMetaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  mobileMetaItem: { minWidth: 150, flex: 1, gap: 4 },
  mobileMetaLabel: { ...Typography.labelSm, fontFamily: 'Manrope-Bold', fontSize: 10, letterSpacing: 2 },
  mobileMetaValue: { ...Typography.bodyMd, fontFamily: 'Manrope-SemiBold', fontSize: 13 },
  mobileMetaSubValue: { ...Typography.bodyMd, fontSize: 11, lineHeight: 16 },
  mobileActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 6 },
  paginationBar: {
    minHeight: 68,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  paginationText: { ...Typography.labelSm, fontFamily: 'Manrope-Bold', fontSize: 10, letterSpacing: 1.8 },
  paginationControls: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  paginationButton: { width: 34, height: 34, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  pageButton: { minWidth: 34, height: 34, borderRadius: 8, borderWidth: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 },
  pageButtonText: { ...Typography.bodyMd, fontFamily: 'Manrope-Bold', fontSize: 12 },
  insightsGrid: { gap: 20 },
  growthCard: {
    flex: 1.9,
    minHeight: 280,
    borderRadius: 10,
    borderWidth: 1,
    padding: 28,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  growthCopy: { gap: 14, maxWidth: 520, zIndex: 1 },
  growthTitle: { fontFamily: 'NotoSerif-Bold', fontSize: 28, letterSpacing: -0.5 },
  growthDescription: { ...Typography.bodyMd, fontSize: 14, lineHeight: 24 },
  growthMetrics: { flexDirection: 'row', flexWrap: 'wrap', gap: 32, marginTop: 8 },
  growthLabel: { ...Typography.labelSm, fontFamily: 'Manrope-Bold', fontSize: 10, letterSpacing: 2, marginBottom: 6 },
  growthValue: { fontFamily: 'NotoSerif-Bold', fontSize: 32, letterSpacing: -0.6 },
  growthIcon: { position: 'absolute', right: -12, bottom: -18 },
  systemCard: {
    flex: 1,
    minHeight: 280,
    borderRadius: 10,
    borderWidth: 1,
    padding: 24,
    justifyContent: 'space-between',
    gap: 18,
  },
  systemTitle: { fontFamily: 'NotoSerif-Bold', fontSize: 24, letterSpacing: -0.4, marginBottom: 12 },
  systemStatusRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  systemPulse: { width: 10, height: 10, borderRadius: 999 },
  systemStatusText: { ...Typography.labelSm, fontFamily: 'Manrope-Bold', fontSize: 10, letterSpacing: 2.2 },
  systemDescription: { ...Typography.bodyMd, lineHeight: 22, maxWidth: 320 },
  systemButton: { minHeight: 48, borderRadius: 8, borderWidth: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 },
  systemButtonText: { ...Typography.labelSm, fontFamily: 'Manrope-Bold', fontSize: 10, letterSpacing: 2.1, textAlign: 'center' },
  webInteractiveCard: { transition: 'transform 180ms ease, background-color 180ms ease, border-color 180ms ease' } as any,
  webInteractiveButton: {
    transition: 'background-color 160ms ease, border-color 160ms ease, opacity 160ms ease, transform 160ms ease',
    cursor: 'pointer',
  } as any,
  webRowTransition: { transition: 'background-color 180ms ease' } as any,
});

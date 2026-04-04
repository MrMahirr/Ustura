import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import { adminNotifications, type AdminNotification } from '@/components/panel/super-admin/data';
import { Typography } from '@/constants/typography';
import { hexToRgba } from '@/utils/color';

import { useSuperAdminTheme } from './theme';

function NotificationRow({ item }: { item: AdminNotification }) {
  const adminTheme = useSuperAdminTheme();

  const toneColor =
    item.tone === 'success'
      ? adminTheme.success
      : item.tone === 'warning'
        ? adminTheme.warning
        : item.tone === 'error'
          ? adminTheme.error
          : adminTheme.primary;

  const toneIcon =
    item.tone === 'success'
      ? 'verified'
      : item.tone === 'warning'
        ? 'schedule'
        : item.tone === 'error'
          ? 'priority-high'
          : 'campaign';

  return (
    <Pressable
      style={({ hovered }) => [
        styles.notificationRow,
        {
          backgroundColor: hovered ? adminTheme.cardBackgroundMuted : 'transparent',
          borderColor: item.unread ? hexToRgba(toneColor, 0.16) : 'transparent',
        },
      ]}>
      <View style={[styles.notificationIconWrap, { backgroundColor: hexToRgba(toneColor, 0.12) }]}>
        <MaterialIcons name={toneIcon} size={18} color={toneColor} />
      </View>

      <View style={styles.notificationCopy}>
        <View style={styles.notificationHeader}>
          <Text numberOfLines={1} style={[styles.notificationTitle, { color: adminTheme.onSurface }]}>
            {item.title}
          </Text>
          <Text style={[styles.notificationTime, { color: adminTheme.onSurfaceVariant }]}>{item.time}</Text>
        </View>

        <Text numberOfLines={2} style={[styles.notificationDescription, { color: adminTheme.onSurfaceVariant }]}>
          {item.description}
        </Text>
      </View>

      {item.unread ? <View style={[styles.unreadDot, { backgroundColor: toneColor }]} /> : null}
    </Pressable>
  );
}

export default function NotificationsMenu() {
  const { width } = useWindowDimensions();
  const adminTheme = useSuperAdminTheme();
  const [open, setOpen] = React.useState(false);

  const unreadCount = adminNotifications.filter((item) => item.unread).length;
  const menuWidth = width < 520 ? Math.max(280, width - 32) : 360;

  return (
    <View style={styles.anchor}>
      {open && Platform.OS === 'web' ? <Pressable style={styles.backdrop as any} onPress={() => setOpen(false)} /> : null}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Bildirim menusu"
        onPress={() => setOpen((prev) => !prev)}
        style={({ hovered, pressed }) => [
          styles.trigger,
          {
            backgroundColor: hovered || open ? adminTheme.cardBackgroundMuted : 'transparent',
            borderColor: open ? adminTheme.borderStrong : 'transparent',
            transform: [{ scale: pressed ? 0.96 : 1 }],
          },
        ]}>
        {({ hovered }) => (
          <>
            <MaterialIcons
              name="notifications"
              size={22}
              color={hovered || open ? adminTheme.primary : hexToRgba(adminTheme.onSurfaceVariant, 0.75)}
            />
            {unreadCount > 0 ? (
              <View style={[styles.countBadge, { backgroundColor: adminTheme.primary, borderColor: adminTheme.surface }]}>
                <Text style={[styles.countBadgeText, { color: adminTheme.onPrimary }]}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Text>
              </View>
            ) : null}
          </>
        )}
      </Pressable>

      {open ? (
        <View
          style={[
            styles.menu,
            {
              width: menuWidth,
              backgroundColor: adminTheme.cardBackground,
              borderColor: adminTheme.borderSubtle,
            },
            Platform.OS === 'web'
              ? ({
                  boxShadow:
                    adminTheme.theme === 'light'
                      ? '0 24px 60px rgba(27, 27, 32, 0.12)'
                      : '0 24px 60px rgba(0, 0, 0, 0.32)',
                } as any)
              : {
                  shadowColor: '#000000',
                  shadowOpacity: adminTheme.theme === 'light' ? 0.12 : 0.26,
                  shadowRadius: 20,
                  shadowOffset: { width: 0, height: 10 },
                  elevation: 12,
                },
          ]}>
          <View style={[styles.menuHeader, { borderBottomColor: adminTheme.borderSubtle }]}>
            <View>
              <Text style={[styles.menuTitle, { color: adminTheme.onSurface }]}>Bildirimler</Text>
              <Text style={[styles.menuSubtitle, { color: adminTheme.onSurfaceVariant }]}>
                {unreadCount} yeni olay, panel akisinda onceliklendirildi.
              </Text>
            </View>

            <View style={[styles.menuMetaPill, { backgroundColor: hexToRgba(adminTheme.primary, 0.12) }]}>
              <Text style={[styles.menuMetaText, { color: adminTheme.primary }]}>Canli</Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={[styles.summaryCard, { backgroundColor: adminTheme.cardBackgroundMuted }]}>
              <Text style={[styles.summaryLabel, { color: adminTheme.onSurfaceVariant }]}>Bekleyen</Text>
              <Text style={[styles.summaryValue, { color: adminTheme.onSurface }]}>02</Text>
            </View>
            <View style={[styles.summaryCard, { backgroundColor: adminTheme.cardBackgroundMuted }]}>
              <Text style={[styles.summaryLabel, { color: adminTheme.onSurfaceVariant }]}>Kritik</Text>
              <Text style={[styles.summaryValue, { color: adminTheme.error }]}>01</Text>
            </View>
            <View style={[styles.summaryCard, { backgroundColor: adminTheme.cardBackgroundMuted }]}>
              <Text style={[styles.summaryLabel, { color: adminTheme.onSurfaceVariant }]}>Bugun</Text>
              <Text style={[styles.summaryValue, { color: adminTheme.primary }]}>08</Text>
            </View>
          </View>

          <ScrollView style={styles.menuScroll} contentContainerStyle={styles.menuScrollContent} showsVerticalScrollIndicator={false}>
            {adminNotifications.map((item) => (
              <NotificationRow key={item.id} item={item} />
            ))}
          </ScrollView>

          <View style={[styles.menuFooter, { borderTopColor: adminTheme.borderSubtle }]}>
            <Pressable
              onPress={() => setOpen(false)}
              style={({ hovered }) => [
                styles.footerButton,
                {
                  backgroundColor: hovered ? adminTheme.cardBackgroundStrong : adminTheme.cardBackgroundMuted,
                },
              ]}>
              <Text style={[styles.footerButtonText, { color: adminTheme.onSurface }]}>Tum bildirimleri gor</Text>
              <MaterialIcons name="east" size={16} color={adminTheme.primary} />
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  anchor: {
    position: 'relative',
    zIndex: 120,
  },
  backdrop: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'transparent',
    zIndex: 110,
  },
  trigger: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    zIndex: 130,
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
          transition: 'background-color 180ms ease, border-color 180ms ease, transform 160ms ease',
        } as any)
      : {}),
  },
  countBadge: {
    position: 'absolute',
    top: 1,
    right: 1,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  countBadgeText: {
    fontSize: 9,
    fontFamily: 'Manrope-Bold',
    lineHeight: 10,
  },
  menu: {
    position: 'absolute',
    top: 52,
    right: 0,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    zIndex: 130,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  menuTitle: {
    ...Typography.titleLg,
    fontFamily: 'NotoSerif-Bold',
    fontSize: 22,
    marginBottom: 4,
  },
  menuSubtitle: {
    ...Typography.bodyMd,
    maxWidth: 220,
  },
  menuMetaPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  menuMetaText: {
    ...Typography.labelSm,
    fontSize: 9,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 6,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 6,
  },
  summaryLabel: {
    ...Typography.labelSm,
    fontSize: 9,
  },
  summaryValue: {
    fontFamily: 'NotoSerif-Bold',
    fontSize: 20,
    lineHeight: 22,
  },
  menuScroll: {
    maxHeight: 340,
  },
  menuScrollContent: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
          transition: 'background-color 180ms ease, border-color 180ms ease',
        } as any)
      : {}),
  },
  notificationIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  notificationCopy: {
    flex: 1,
    gap: 6,
    minWidth: 0,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  notificationTitle: {
    ...Typography.titleMd,
    flex: 1,
    lineHeight: 20,
  },
  notificationTime: {
    ...Typography.labelSm,
    fontSize: 9,
    flexShrink: 0,
  },
  notificationDescription: {
    ...Typography.bodyMd,
    fontSize: 13,
    lineHeight: 19,
  },
  unreadDot: {
    width: 9,
    height: 9,
    borderRadius: 999,
    marginTop: 6,
    flexShrink: 0,
  },
  menuFooter: {
    padding: 12,
    borderTopWidth: 1,
  },
  footerButton: {
    minHeight: 46,
    borderRadius: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
          transition: 'background-color 180ms ease',
        } as any)
      : {}),
  },
  footerButtonText: {
    ...Typography.labelMd,
    fontSize: 10,
  },
});

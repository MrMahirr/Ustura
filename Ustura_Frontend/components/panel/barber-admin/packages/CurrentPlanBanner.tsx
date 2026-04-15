import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Pressable, Text, View, useWindowDimensions } from 'react-native';

import { hexToRgba } from '@/utils/color';

import { useBarberAdminTheme } from '../theme';
import { getBannerStyle } from './presentation';
import type { CurrentPlanViewModel } from './types';

interface CurrentPlanBannerProps {
  plan: CurrentPlanViewModel;
  onUpgrade?: () => void;
}

export default function CurrentPlanBanner({ plan, onUpgrade }: CurrentPlanBannerProps) {
  const { width } = useWindowDimensions();
  const theme = useBarberAdminTheme();
  const bannerStyle = getBannerStyle(theme);
  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;
  const isPending = plan.subscriptionStatus === 'pending';

  return (
    <View
      style={[
        bannerStyle,
        { padding: isMobile ? 20 : isTablet ? 24 : 32 },
        isPending
          ? { borderLeftColor: theme.warning }
          : null,
      ]}>
      {isMobile ? (
        <View className="gap-6">
          <PlanIdentity
            name={plan.packageName}
            priceLabel={plan.priceLabel}
            isPending={isPending}
          />
          <StatusBadge
            daysRemaining={plan.daysRemaining}
            endDateLabel={plan.endDateLabel}
            isPending={isPending}
          />
          <UsageBarsSection bars={plan.usageBars} warningMessage={plan.warningMessage} />
          {!isPending && <UpgradeButton onPress={onUpgrade} />}
        </View>
      ) : (
        <View className="gap-8">
          <View className="flex-row items-start justify-between gap-6">
            <PlanIdentity
              name={plan.packageName}
              priceLabel={plan.priceLabel}
              isPending={isPending}
            />
            <StatusBadge
              daysRemaining={plan.daysRemaining}
              endDateLabel={plan.endDateLabel}
              isPending={isPending}
            />
          </View>
          <UsageBarsSection bars={plan.usageBars} warningMessage={plan.warningMessage} />
          <View className="flex-row items-center justify-end">
            {!isPending && <UpgradeButton onPress={onUpgrade} />}
          </View>
        </View>
      )}
    </View>
  );
}

function PlanIdentity({
  name,
  priceLabel,
  isPending,
}: {
  name: string;
  priceLabel: string;
  isPending: boolean;
}) {
  const { width } = useWindowDimensions();
  const theme = useBarberAdminTheme();
  const isMobile = width < 640;

  return (
    <View className="gap-2">
      <View className="flex-row items-center gap-2">
        <Text
          className="font-bold uppercase"
          style={{
            color: isPending ? theme.warning : theme.primary,
            fontFamily: theme.bodyFont,
            fontSize: 10,
            letterSpacing: 3,
          }}>
          {isPending ? 'Onay Bekliyor' : 'Mevcut Paket'}
        </Text>
        {isPending && (
          <MaterialIcons name="hourglass-top" size={14} color={theme.warning} />
        )}
        {!isPending && (
          <View
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: theme.success }}
          />
        )}
      </View>
      <Text
        className="font-bold"
        style={{
          color: theme.onSurface,
          fontFamily: theme.serifFont,
          fontSize: isMobile ? 24 : 30,
        }}>
        {name}
      </Text>
      <View className="flex-row items-baseline">
        <Text
          className="font-medium"
          style={{
            color: theme.onSurface,
            fontFamily: theme.bodyFont,
            fontSize: isMobile ? 20 : 24,
          }}>
          {priceLabel}
        </Text>
        <Text
          className="text-sm"
          style={{ color: theme.onSurfaceVariant, fontFamily: theme.bodyFont }}>
          /ay
        </Text>
      </View>
    </View>
  );
}

function StatusBadge({
  daysRemaining,
  endDateLabel,
  isPending,
}: {
  daysRemaining: number | null;
  endDateLabel: string | null;
  isPending: boolean;
}) {
  const theme = useBarberAdminTheme();

  return (
    <View className="gap-3">
      {isPending && (
        <View
          className="flex-row items-center gap-2 self-start rounded-sm px-3 py-1.5"
          style={{
            backgroundColor: hexToRgba(theme.warning, 0.1),
            borderWidth: 1,
            borderColor: hexToRgba(theme.warning, 0.2),
          }}>
          <MaterialIcons name="schedule" size={14} color={theme.warning} />
          <Text
            className="font-bold uppercase"
            style={{
              color: theme.warning,
              fontFamily: theme.bodyFont,
              fontSize: 10,
              letterSpacing: 2,
            }}>
            Admin Onayı Bekleniyor
          </Text>
        </View>
      )}
      {!isPending && daysRemaining != null && (
        <View
          className="flex-row items-center gap-2 self-start rounded-sm px-3 py-1.5"
          style={{
            backgroundColor: hexToRgba(theme.primaryContainer, 0.1),
            borderWidth: 1,
            borderColor: hexToRgba(theme.primaryContainer, 0.2),
          }}>
          <View
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: theme.primary }}
          />
          <Text
            className="font-bold uppercase"
            style={{
              color: theme.primaryContainer,
              fontFamily: theme.bodyFont,
              fontSize: 10,
              letterSpacing: 3,
            }}>
            {daysRemaining} gün kaldı
          </Text>
        </View>
      )}
      {endDateLabel && (
        <Text className="text-xs" style={{ color: theme.onSurfaceVariant, fontFamily: theme.bodyFont }}>
          Son Tarih:{' '}
          <Text className="font-semibold" style={{ color: theme.onSurface }}>
            {endDateLabel}
          </Text>
        </Text>
      )}
    </View>
  );
}

function UsageBarsSection({
  bars,
  warningMessage,
}: {
  bars: CurrentPlanViewModel['usageBars'];
  warningMessage: string | null;
}) {
  const { width } = useWindowDimensions();
  const theme = useBarberAdminTheme();

  if (bars.length === 0) return null;

  return (
    <View className="gap-5">
      <View
        style={{
          flexDirection: width < 480 ? 'column' : 'row',
          flexWrap: 'wrap',
          gap: width < 480 ? 16 : 20,
        }}>
        {bars.map((bar) => (
          <View key={bar.label} style={{ minWidth: 120, flex: 1, gap: 8 }}>
            <View className="flex-row items-center justify-between">
              <Text
                className="font-bold uppercase"
                style={{
                  color: theme.onSurfaceVariant,
                  fontFamily: theme.bodyFont,
                  fontSize: 10,
                  letterSpacing: 2.5,
                }}>
                {bar.label}
              </Text>
              <Text
                className="font-bold"
                style={{
                  color: bar.isCritical ? theme.error : theme.primary,
                  fontFamily: theme.bodyFont,
                  fontSize: 11,
                }}>
                {bar.percent}%
              </Text>
            </View>
            <View
              className="h-1.5 w-full overflow-hidden rounded-full"
              style={{ backgroundColor: theme.surfaceContainerHighest }}>
              <View
                className="h-full rounded-full"
                style={[
                  {
                    width: `${bar.percent}%`,
                    backgroundColor: bar.isCritical ? theme.error : theme.primary,
                  },
                  Platform.OS === 'web'
                    ? ({ transition: 'width 600ms cubic-bezier(0.4, 0, 0.2, 1)' } as any)
                    : null,
                ]}
              />
            </View>
          </View>
        ))}
      </View>

      {warningMessage && (
        <View
          className="flex-row items-center gap-2 self-start rounded-md px-3 py-2"
          style={{ backgroundColor: hexToRgba(theme.warning, 0.08) }}>
          <MaterialIcons name="warning-amber" size={16} color={theme.warning} />
          <Text
            className="flex-shrink text-xs font-semibold"
            style={{ color: theme.warning, fontFamily: theme.bodyFont }}>
            {warningMessage}
          </Text>
        </View>
      )}
    </View>
  );
}

function UpgradeButton({ onPress }: { onPress?: () => void }) {
  const theme = useBarberAdminTheme();

  return (
    <Pressable
      className="items-center self-start rounded-sm px-10 py-3.5"
      onPress={onPress}
      style={({ hovered }) => [
        { backgroundColor: theme.primary },
        Platform.OS === 'web'
          ? ({
              backgroundImage: `linear-gradient(to top right, ${theme.primary}, ${theme.primaryContainer})`,
              boxShadow: hovered
                ? `0 12px 28px ${hexToRgba(theme.primary, 0.35)}`
                : `0 8px 20px ${hexToRgba(theme.primary, 0.2)}`,
              transform: [{ translateY: hovered ? -1 : 0 }],
              transition: 'box-shadow 240ms ease, transform 240ms ease',
              cursor: 'pointer',
            } as any)
          : null,
      ]}>
      <Text
        className="font-extrabold uppercase"
        style={{
          color: theme.onPrimary,
          fontFamily: theme.bodyFont,
          fontSize: 11,
          letterSpacing: 2,
        }}>
        Planları İncele
      </Text>
    </Pressable>
  );
}

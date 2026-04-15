import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { ActivityIndicator, Platform, Pressable, Text, View, useWindowDimensions } from 'react-native';

import { hexToRgba } from '@/utils/color';

import { useBarberAdminTheme } from '../theme';
import { getPlanCardStyle } from './presentation';
import type { PlanCardViewModel } from './types';

interface PlanComparisonCardProps {
  plan: PlanCardViewModel;
  onSelectPlan?: (packageId: string) => void;
  disabled?: boolean;
}

export default function PlanComparisonCard({ plan, onSelectPlan, disabled }: PlanComparisonCardProps) {
  const { width } = useWindowDimensions();
  const theme = useBarberAdminTheme();
  const cardStyle = getPlanCardStyle(theme, plan.isFeatured);
  const isMobile = width < 640;

  const padding = isMobile ? 20 : width < 1024 ? 28 : 36;

  return (
    <View
      style={[
        cardStyle,
        {
          padding,
          overflow: 'hidden',
          position: 'relative',
        },
        plan.isFeatured && !isMobile
          ? [
              { marginTop: -12 },
              Platform.OS === 'web'
                ? ({ boxShadow: `0 24px 54px ${hexToRgba(theme.primary, 0.1)}` } as any)
                : null,
            ]
          : null,
        plan.isPending
          ? { borderColor: theme.warning, borderWidth: 2 }
          : null,
        Platform.OS === 'web' && !plan.isFeatured && !plan.isPending
          ? ({ transition: 'background-color 200ms ease, box-shadow 200ms ease' } as any)
          : null,
      ]}>
      {plan.isPending && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: hexToRgba(theme.warning, 0.1),
            paddingVertical: 6,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 6,
          }}>
          <MaterialIcons name="hourglass-top" size={14} color={theme.warning} />
          <Text
            className="font-bold uppercase"
            style={{
              color: theme.warning,
              fontFamily: theme.bodyFont,
              fontSize: 10,
              letterSpacing: 2,
            }}>
            Onay Bekliyor
          </Text>
        </View>
      )}

      {plan.isFeatured && !plan.isPending && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            backgroundColor: theme.primary,
            paddingHorizontal: 14,
            paddingVertical: 6,
            borderBottomLeftRadius: 8,
          }}>
          <Text
            className="font-extrabold uppercase"
            style={{
              color: theme.onPrimary,
              fontFamily: theme.bodyFont,
              fontSize: 9,
              letterSpacing: 2.5,
            }}>
            Önerilen
          </Text>
        </View>
      )}

      {plan.isCurrent && !plan.isPending && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            backgroundColor: theme.success,
            paddingHorizontal: 14,
            paddingVertical: 6,
            borderBottomLeftRadius: 8,
          }}>
          <Text
            className="font-extrabold uppercase"
            style={{
              color: '#fff',
              fontFamily: theme.bodyFont,
              fontSize: 9,
              letterSpacing: 2.5,
            }}>
            Aktif Paket
          </Text>
        </View>
      )}

      <View style={{ marginTop: plan.isPending ? 16 : 0 }}>
        <CardHeader
          name={plan.name}
          subtitle={plan.subtitle}
          priceLabel={plan.priceLabel}
          priceSuffix={plan.priceSuffix}
        />
      </View>

      <View style={{ marginTop: 20, marginBottom: isMobile ? 24 : 32, flex: 1, gap: isMobile ? 14 : 16 }}>
        {plan.features.map((feature, i) => (
          <FeatureItem key={i} label={feature.label} included={feature.included} />
        ))}
      </View>

      <CTAButton
        plan={plan}
        onPress={onSelectPlan ? () => onSelectPlan(plan.id) : undefined}
        disabled={disabled}
      />
    </View>
  );
}

function CardHeader({
  name,
  subtitle,
  priceLabel,
  priceSuffix,
}: {
  name: string;
  subtitle: string;
  priceLabel: string;
  priceSuffix: string;
}) {
  const { width } = useWindowDimensions();
  const theme = useBarberAdminTheme();
  const isMobile = width < 640;

  return (
    <View style={{ gap: 4, marginBottom: isMobile ? 16 : 24 }}>
      <Text
        className="font-bold"
        style={{
          color: theme.onSurface,
          fontFamily: theme.serifFont,
          fontSize: isMobile ? 18 : 20,
        }}>
        {name}
      </Text>
      <Text
        className="uppercase"
        style={{
          color: theme.onSurfaceVariant,
          fontFamily: theme.bodyFont,
          fontSize: 10,
          letterSpacing: 3,
          marginBottom: isMobile ? 12 : 20,
        }}>
        {subtitle}
      </Text>
      <View className="flex-row items-baseline">
        <Text
          className="font-bold"
          style={{
            color: theme.onSurface,
            fontFamily: theme.bodyFont,
            fontSize: isMobile ? 28 : 36,
          }}>
          {priceLabel}
        </Text>
        <Text
          className="font-normal"
          style={{
            color: theme.onSurfaceVariant,
            fontFamily: theme.bodyFont,
            fontSize: isMobile ? 13 : 15,
          }}>
          {priceSuffix}
        </Text>
      </View>
    </View>
  );
}

function FeatureItem({ label, included }: { label: string; included: boolean }) {
  const theme = useBarberAdminTheme();

  return (
    <View className="flex-row items-center gap-3">
      <MaterialIcons
        name={included ? 'check-circle' : 'cancel'}
        size={18}
        color={included ? theme.primary : hexToRgba(theme.onSurfaceVariant, 0.3)}
      />
      <Text
        className="flex-shrink text-sm"
        style={{
          color: included ? theme.onSurface : theme.onSurfaceVariant,
          opacity: included ? 1 : 0.45,
          fontFamily: theme.bodyFont,
        }}>
        {label}
      </Text>
    </View>
  );
}

function CTAButton({
  plan,
  onPress,
  disabled,
}: {
  plan: PlanCardViewModel;
  onPress?: () => void;
  disabled?: boolean;
}) {
  const theme = useBarberAdminTheme();
  const isInteractive = plan.cardState === 'available' && !disabled;

  if (plan.isPending) {
    return (
      <View
        className="w-full flex-row items-center justify-center gap-2 rounded-sm py-4"
        style={{
          backgroundColor: hexToRgba(theme.warning, 0.08),
          borderWidth: 1,
          borderColor: hexToRgba(theme.warning, 0.2),
        }}>
        <ActivityIndicator size="small" color={theme.warning} />
        <Text
          className="font-bold uppercase"
          style={{
            color: theme.warning,
            fontFamily: theme.bodyFont,
            fontSize: 11,
            letterSpacing: 2,
          }}>
          Onay Bekliyor
        </Text>
      </View>
    );
  }

  if (plan.isCurrent) {
    return (
      <View
        className="w-full flex-row items-center justify-center gap-2 rounded-sm py-4"
        style={{
          backgroundColor: hexToRgba(theme.success, 0.08),
          borderWidth: 1,
          borderColor: hexToRgba(theme.success, 0.2),
        }}>
        <MaterialIcons name="check-circle" size={16} color={theme.success} />
        <Text
          className="font-bold uppercase"
          style={{
            color: theme.success,
            fontFamily: theme.bodyFont,
            fontSize: 11,
            letterSpacing: 2,
          }}>
          Geçerli Paket
        </Text>
      </View>
    );
  }

  if (plan.isFeatured) {
    return (
      <Pressable
        className="w-full items-center rounded-sm py-4"
        disabled={!isInteractive}
        onPress={onPress}
        style={({ hovered }) => [
          {
            backgroundColor: theme.primary,
            opacity: isInteractive ? 1 : 0.5,
          },
          Platform.OS === 'web'
            ? ({
                backgroundImage: `linear-gradient(to top right, ${theme.primary}, ${theme.primaryContainer})`,
                boxShadow: hovered && isInteractive
                  ? `0 12px 28px ${hexToRgba(theme.primary, 0.35)}`
                  : `0 8px 20px ${hexToRgba(theme.primary, 0.2)}`,
                transition: 'box-shadow 240ms ease, transform 200ms ease',
                transform: [{ translateY: hovered && isInteractive ? -1 : 0 }],
                cursor: isInteractive ? 'pointer' : 'default',
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
          {plan.ctaLabel}
        </Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      className="w-full items-center border rounded-sm py-4"
      disabled={!isInteractive}
      onPress={onPress}
      style={({ hovered }) => [
        {
          borderColor: hexToRgba(theme.onSurfaceVariant, 0.2),
          opacity: isInteractive ? 1 : 0.5,
        },
        Platform.OS === 'web' && hovered && isInteractive
          ? ({
              borderColor: hexToRgba(theme.primary, 0.5),
              backgroundColor: hexToRgba(theme.primary, 0.03),
              transition: 'border-color 200ms ease, background-color 200ms ease',
              cursor: 'pointer',
            } as any)
          : Platform.OS === 'web'
            ? ({
                transition: 'border-color 200ms ease, background-color 200ms ease',
                cursor: isInteractive ? 'pointer' : 'default',
              } as any)
            : null,
      ]}>
      <Text
        className="font-bold uppercase"
        style={{
          color: theme.onSurfaceVariant,
          fontFamily: theme.bodyFont,
          fontSize: 11,
          letterSpacing: 2,
        }}>
        {plan.ctaLabel}
      </Text>
    </Pressable>
  );
}

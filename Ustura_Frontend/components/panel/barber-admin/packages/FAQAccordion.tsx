import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { LayoutAnimation, Platform, Pressable, Text, UIManager, View, useWindowDimensions } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { hexToRgba } from '@/utils/color';

import { useBarberAdminTheme } from '../theme';
import { getFaqItemStyle, getInteractiveStyle } from './presentation';
import type { FAQItem } from './types';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const { width } = useWindowDimensions();
  const theme = useBarberAdminTheme();
  const isMobile = width < 640;

  return (
    <View
      className="w-full self-center"
      style={{
        maxWidth: 768,
        gap: isMobile ? 20 : 32,
        paddingBottom: isMobile ? 40 : 80,
        paddingTop: isMobile ? 8 : 48,
      }}>
      <View className="items-center gap-3">
        <Text
          className="font-bold text-center"
          style={{
            color: theme.onSurface,
            fontFamily: theme.serifFont,
            fontSize: isMobile ? 22 : 30,
          }}>
          Sıkça Sorulan Sorular
        </Text>
        <Text
          className="text-center"
          style={{
            color: theme.onSurfaceVariant,
            fontFamily: theme.bodyFont,
            fontSize: isMobile ? 13 : 15,
            lineHeight: isMobile ? 20 : 24,
            maxWidth: 480,
          }}>
          Plan yükseltme ve ödeme süreçleri hakkında merak ettikleriniz.
        </Text>
      </View>

      <View className="gap-3">
        {items.map((item) => (
          <FAQAccordionItem key={item.id} item={item} />
        ))}
      </View>
    </View>
  );
}

function FAQAccordionItem({ item }: { item: FAQItem }) {
  const { width } = useWindowDimensions();
  const theme = useBarberAdminTheme();
  const [expanded, setExpanded] = React.useState(false);
  const itemStyle = getFaqItemStyle(theme);
  const isMobile = width < 640;

  const toggle = React.useCallback(() => {
    if (Platform.OS !== 'web') {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    setExpanded((prev) => !prev);
  }, []);

  return (
    <View className="overflow-hidden rounded-md" style={itemStyle}>
      <Pressable
        className="flex-row items-center justify-between"
        onPress={toggle}
        style={[
          { padding: isMobile ? 16 : 24 },
          getInteractiveStyle(),
        ]}>
        <Text
          className="flex-1 font-bold"
          style={{
            color: expanded ? theme.primary : theme.onSurface,
            fontFamily: theme.bodyFont,
            fontSize: isMobile ? 13 : 14,
          }}>
          {item.question}
        </Text>
        <Animated.View
          style={[
            { marginLeft: 12 },
            Platform.OS === 'web'
              ? ({
                  transition: 'transform 200ms ease',
                  transform: [{ rotate: expanded ? '180deg' : '0deg' }],
                } as any)
              : { transform: [{ rotate: expanded ? '180deg' : '0deg' }] },
          ]}>
          <MaterialIcons
            name="expand-more"
            size={isMobile ? 20 : 24}
            color={expanded ? theme.primary : theme.onSurfaceVariant}
          />
        </Animated.View>
      </Pressable>

      {expanded && (
        <Animated.View
          entering={Platform.OS === 'web' ? undefined : FadeIn.duration(160)}
          exiting={Platform.OS === 'web' ? undefined : FadeOut.duration(120)}>
          <View
            className="border-t"
            style={{
              borderTopColor: hexToRgba(theme.onSurfaceVariant, 0.05),
              paddingHorizontal: isMobile ? 16 : 24,
              paddingBottom: isMobile ? 16 : 24,
              paddingTop: isMobile ? 12 : 16,
            }}>
            <Text
              className="leading-6"
              style={{
                color: theme.onSurfaceVariant,
                fontFamily: theme.bodyFont,
                fontSize: isMobile ? 13 : 14,
                lineHeight: isMobile ? 21 : 24,
              }}>
              {item.answer}
            </Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

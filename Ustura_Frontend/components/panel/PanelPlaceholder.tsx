import type { ComponentProps } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import Card from '@/components/ui/Card';
import { Typography } from '@/constants/typography';
import { useThemeColor } from '@/hooks/use-theme-color';
import { hexToRgba } from '@/utils/color';

type IconName = ComponentProps<typeof MaterialIcons>['name'];

interface PanelPlaceholderProps {
  title: string;
  description: string;
  icon: IconName;
}

export default function PanelPlaceholder({ title, description, icon }: PanelPlaceholderProps) {
  const primary = useThemeColor({}, 'primary');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');

  return (
    <View style={styles.container}>
      <Card variant="glass" padding={28} style={styles.card}>
        <View style={[styles.iconWrap, { backgroundColor: hexToRgba(primary, 0.14) }]}>
          <MaterialIcons name={icon} size={30} color={primary} />
        </View>
        <Text style={[styles.title, { color: onSurface }]}>{title}</Text>
        <Text style={[styles.description, { color: onSurfaceVariant }]}>{description}</Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  card: {
    maxWidth: 560,
    width: '100%',
    alignSelf: 'center',
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    ...Typography.displayMd,
    fontSize: 30,
    marginBottom: 12,
  },
  description: {
    ...Typography.bodyLg,
  },
});

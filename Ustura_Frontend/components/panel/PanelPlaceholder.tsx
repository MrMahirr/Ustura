import type { ComponentProps } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import Card from '@/components/ui/Card';
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
    <View className="flex-1 justify-center p-6">
      <View className="w-full max-w-[560px] self-center">
        <Card variant="glass" padding={28}>
          <View className="mb-5 h-[72px] w-[72px] items-center justify-center rounded-3xl" style={{ backgroundColor: hexToRgba(primary, 0.14) }}>
            <MaterialIcons name={icon} size={30} color={primary} />
          </View>
          <Text className="mb-3 font-headline text-[30px]" style={{ color: onSurface }}>
            {title}
          </Text>
          <Text className="font-body text-lg" style={{ color: onSurfaceVariant }}>
            {description}
          </Text>
        </Card>
      </View>
    </View>
  );
}

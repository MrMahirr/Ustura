import { Image } from 'expo-image';
import { Text, View } from 'react-native';

import { useAuthAccessTheme } from '@/components/auth/shared/use-auth-access-theme';
import { hexToRgba } from '@/utils/color';

import type { CustomerAccessBarberProfile } from './presentation';

interface CustomerAccessAvatarStackProps {
  label: string;
  profiles: CustomerAccessBarberProfile[];
  compact?: boolean;
}

export default function CustomerAccessAvatarStack({
  label,
  profiles,
  compact = false,
}: CustomerAccessAvatarStackProps) {
  const theme = useAuthAccessTheme();
  const avatarSize = compact ? 42 : 48;
  const overlap = compact ? -12 : -14;

  return (
    <View className="flex-row items-center" style={{ gap: 16 }}>
      <View className="flex-row items-center">
        {profiles.map((profile, index) => (
          <Image
            key={profile.id}
            source={{ uri: profile.imageUri }}
            accessibilityLabel={profile.accessibilityLabel}
            contentFit="cover"
            style={{
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
              borderWidth: 2,
              borderColor: theme.surface,
              marginLeft: index === 0 ? 0 : overlap,
            }}
          />
        ))}
      </View>
      <Text
        className="font-label text-[10px] uppercase tracking-[2px]"
        style={{ color: hexToRgba(theme.onSurfaceVariant, 0.62) }}>
        {label}
      </Text>
    </View>
  );
}

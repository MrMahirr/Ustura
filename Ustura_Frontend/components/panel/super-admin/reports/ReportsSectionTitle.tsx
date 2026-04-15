import React from 'react';
import { Text, View } from 'react-native';

interface ReportsSectionTitleProps {
  title: string;
  borderColor: string;
  onSurface: string;
  rightSlot?: React.ReactNode;
}

export default function ReportsSectionTitle({
  title,
  borderColor,
  onSurface,
  rightSlot,
}: ReportsSectionTitleProps) {
  return (
    <View className="mb-6 flex-row items-center justify-between gap-4">
      <View className="min-w-0 flex-1 flex-row items-center gap-3">
        <View style={{ width: 4, alignSelf: 'stretch', backgroundColor: borderColor, borderRadius: 1 }} />
        <Text className="flex-1 font-headline text-xl font-bold uppercase italic tracking-tighter" style={{ color: onSurface }}>
          {title}
        </Text>
      </View>
      {rightSlot ? <View className="shrink-0">{rightSlot}</View> : null}
    </View>
  );
}

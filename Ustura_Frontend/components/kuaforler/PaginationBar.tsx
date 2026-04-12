import React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useThemeColor } from '@/hooks/use-theme-color';
import { hexToRgba } from '@/utils/color';

interface PaginationBarProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getVisiblePages(page: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (page <= 3) {
    return [1, 2, 3, 4, totalPages];
  }

  if (page >= totalPages - 2) {
    return [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, page - 1, page, page + 1, totalPages];
}

function PaginationButton({
  label,
  icon,
  isActive = false,
  disabled = false,
  onPress,
}: {
  label: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  isActive?: boolean;
  disabled?: boolean;
  onPress?: () => void;
}) {
  const primary = useThemeColor({}, 'primary');
  const onSurface = useThemeColor({}, 'onSurface');
  const outlineVariant = useThemeColor({}, 'outlineVariant');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ hovered, pressed }) => [
        {
          minWidth: 40,
          height: 40,
          paddingHorizontal: 12,
          borderRadius: 999,
          borderWidth: 1,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.4 : 1,
          borderColor: isActive ? primary : hovered ? hexToRgba(primary, 0.26) : outlineVariant,
          backgroundColor: isActive
            ? primary
            : pressed || hovered
              ? surfaceContainerLow
              : 'transparent',
        },
        Platform.OS === 'web'
          ? ({
              transition: 'background-color 180ms ease, border-color 180ms ease, transform 180ms ease',
              transform: [{ translateY: hovered && !disabled ? -1 : 0 }],
            } as any)
          : null,
      ]}>
      {icon ? (
        <MaterialIcons
          name={icon}
          size={18}
          color={isActive ? '#FFFFFF' : onSurface}
        />
      ) : (
        <Text
          className="font-body text-sm font-bold"
          style={{ color: isActive ? '#FFFFFF' : onSurface }}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

export default function PaginationBar({
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
}: PaginationBarProps) {
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const outlineVariant = useThemeColor({}, 'outlineVariant');
  const surfaceContainerLowest = useThemeColor({}, 'surfaceContainerLowest');

  if (totalPages <= 1) {
    return null;
  }

  const startRow = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endRow = Math.min(total, page * pageSize);
  const visiblePages = getVisiblePages(page, totalPages);

  return (
    <View
      className="mt-8 flex-wrap items-center justify-between gap-4 rounded-[18px] border px-5 py-4"
      style={{
        borderColor: outlineVariant,
        backgroundColor: surfaceContainerLowest,
      }}>
      <Text className="font-body text-sm" style={{ color: onSurfaceVariant }}>
        {startRow}-{endRow} / {total} salon
      </Text>

      <View className="flex-row flex-wrap items-center justify-center gap-2">
        <PaginationButton
          label="Onceki"
          icon="chevron-left"
          disabled={page === 1}
          onPress={() => onPageChange(page - 1)}
        />

        {visiblePages.map((pageNumber, index) => {
          const previousPage = visiblePages[index - 1];
          const shouldShowGap = previousPage != null && pageNumber - previousPage > 1;

          return (
            <React.Fragment key={pageNumber}>
              {shouldShowGap ? (
                <Text className="px-1 font-body text-sm font-bold" style={{ color: onSurfaceVariant }}>
                  ...
                </Text>
              ) : null}
              <PaginationButton
                label={String(pageNumber)}
                isActive={pageNumber === page}
                onPress={() => onPageChange(pageNumber)}
              />
            </React.Fragment>
          );
        })}

        <PaginationButton
          label="Sonraki"
          icon="chevron-right"
          disabled={page === totalPages}
          onPress={() => onPageChange(page + 1)}
        />
      </View>
    </View>
  );
}

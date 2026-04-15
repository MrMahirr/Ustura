import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, ScrollView, Text, View, useWindowDimensions } from 'react-native';

import { hexToRgba } from '@/utils/color';

import { useBarberAdminTheme } from '../theme';
import { getTableStyle } from './presentation';
import type { FeatureCategory, FeatureCellValue, FeatureRow } from './types';

interface FeatureComparisonTableProps {
  categories: FeatureCategory[];
  planNames: string[];
  featuredIndex: number;
}

export default function FeatureComparisonTable({
  categories,
  planNames,
  featuredIndex,
}: FeatureComparisonTableProps) {
  const { width } = useWindowDimensions();
  const theme = useBarberAdminTheme();
  const isMobile = width < 680;

  return (
    <View style={{ gap: width < 768 ? 20 : 32, paddingTop: width < 768 ? 8 : 48 }}>
      <Text
        className="font-bold"
        style={{
          color: theme.onSurface,
          fontFamily: theme.serifFont,
          fontSize: width < 640 ? 22 : 30,
        }}>
        Özellik Karşılaştırması
      </Text>

      {isMobile ? (
        <MobileFeatureList
          categories={categories}
          planNames={planNames}
          featuredIndex={featuredIndex}
        />
      ) : (
        <DesktopTable
          categories={categories}
          planNames={planNames}
          featuredIndex={featuredIndex}
        />
      )}
    </View>
  );
}

function DesktopTable({
  categories,
  planNames,
  featuredIndex,
}: FeatureComparisonTableProps) {
  const theme = useBarberAdminTheme();
  const tableStyle = getTableStyle(theme);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="min-w-[680px]" style={tableStyle}>
        <TableHeader planNames={planNames} featuredIndex={featuredIndex} />
        {categories.map((category) => (
          <React.Fragment key={category.title}>
            <CategoryHeader title={category.title} />
            {category.rows.map((row, ri) => (
              <TableRow
                key={ri}
                label={row.label}
                values={row.values}
                featuredIndex={featuredIndex}
              />
            ))}
          </React.Fragment>
        ))}
      </View>
    </ScrollView>
  );
}

function MobileFeatureList({
  categories,
  planNames,
  featuredIndex,
}: {
  categories: FeatureCategory[];
  planNames: string[];
  featuredIndex: number;
}) {
  const theme = useBarberAdminTheme();

  return (
    <View className="gap-4">
      {categories.map((category) => (
        <View
          key={category.title}
          className="overflow-hidden rounded-md"
          style={{
            backgroundColor: theme.panelBackground,
            borderWidth: 1,
            borderColor: theme.borderSubtle,
          }}>
          <View
            className="px-4 py-3"
            style={{ backgroundColor: hexToRgba(theme.surfaceContainerLow, 0.5) }}>
            <Text
              className="font-extrabold uppercase"
              style={{
                color: theme.primaryContainer,
                fontFamily: theme.bodyFont,
                fontSize: 10,
                letterSpacing: 2.5,
              }}>
              {category.title}
            </Text>
          </View>
          {category.rows.map((row, ri) => (
            <MobileFeatureRow
              key={ri}
              row={row}
              planNames={planNames}
              featuredIndex={featuredIndex}
              isLast={ri === category.rows.length - 1}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

function MobileFeatureRow({
  row,
  planNames,
  featuredIndex,
  isLast,
}: {
  row: FeatureRow;
  planNames: string[];
  featuredIndex: number;
  isLast: boolean;
}) {
  const theme = useBarberAdminTheme();

  return (
    <View
      className="px-4 py-3"
      style={
        !isLast
          ? { borderBottomWidth: 1, borderBottomColor: hexToRgba(theme.onSurfaceVariant, 0.06) }
          : undefined
      }>
      <Text
        className="mb-2 text-sm font-medium"
        style={{ color: theme.onSurface, fontFamily: theme.bodyFont }}>
        {row.label}
      </Text>
      <View className="flex-row flex-wrap gap-x-4 gap-y-1">
        {row.values.map((cell, ci) => (
          <View key={ci} className="flex-row items-center gap-1.5">
            <MobileCellValue cell={cell} isFeatured={ci === featuredIndex} />
            <Text
              className="text-xs"
              style={{
                color: ci === featuredIndex ? theme.primary : hexToRgba(theme.onSurfaceVariant, 0.6),
                fontWeight: ci === featuredIndex ? '600' : '400',
                fontFamily: theme.bodyFont,
              }}>
              {planNames[ci]}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function MobileCellValue({ cell, isFeatured }: { cell: FeatureCellValue; isFeatured: boolean }) {
  const theme = useBarberAdminTheme();

  if (cell.kind === 'check') {
    return <MaterialIcons name="check-circle" size={14} color={theme.primary} />;
  }
  if (cell.kind === 'dash') {
    return (
      <MaterialIcons name="remove" size={14} color={hexToRgba(theme.onSurfaceVariant, 0.3)} />
    );
  }
  return (
    <Text
      className="text-xs"
      style={{
        color: isFeatured ? theme.primary : theme.onSurfaceVariant,
        fontWeight: isFeatured ? '700' : '400',
        fontFamily: theme.bodyFont,
      }}>
      {cell.text}
    </Text>
  );
}

function TableHeader({
  planNames,
  featuredIndex,
}: {
  planNames: string[];
  featuredIndex: number;
}) {
  const theme = useBarberAdminTheme();

  return (
    <View
      className="flex-row"
      style={{
        backgroundColor: hexToRgba(theme.surfaceContainerLow, 0.5),
      }}>
      <View className="flex-[2] p-5">
        <Text
          className="font-bold uppercase"
          style={{
            color: theme.onSurfaceVariant,
            fontFamily: theme.bodyFont,
            fontSize: 10,
            letterSpacing: 2.5,
          }}>
          Kategori / Özellik
        </Text>
      </View>
      {planNames.map((name, i) => (
        <View key={name} className="flex-1 items-center p-5">
          <Text
            className="font-bold uppercase"
            style={{
              color: i === featuredIndex ? theme.primary : theme.onSurfaceVariant,
              fontFamily: theme.bodyFont,
              fontSize: 10,
              letterSpacing: 2.5,
            }}>
            {name}
          </Text>
        </View>
      ))}
    </View>
  );
}

function CategoryHeader({ title }: { title: string }) {
  const theme = useBarberAdminTheme();

  return (
    <View
      className="px-5 py-4"
      style={{
        backgroundColor: hexToRgba(theme.surfaceContainerLowest, 0.3),
      }}>
      <Text
        className="font-extrabold uppercase"
        style={{
          color: theme.primaryContainer,
          fontFamily: theme.bodyFont,
          fontSize: 10,
          letterSpacing: 2.5,
        }}>
        {title}
      </Text>
    </View>
  );
}

function TableRow({
  label,
  values,
  featuredIndex,
}: {
  label: string;
  values: FeatureCellValue[];
  featuredIndex: number;
}) {
  const theme = useBarberAdminTheme();

  return (
    <View
      className="flex-row border-b"
      style={[
        { borderBottomColor: hexToRgba(theme.onSurfaceVariant, 0.08) },
        Platform.OS === 'web'
          ? ({ transition: 'background-color 160ms ease' } as any)
          : null,
      ]}>
      <View className="flex-[2] justify-center px-5 py-4">
        <Text
          className="text-sm"
          style={{ color: theme.onSurface, fontFamily: theme.bodyFont }}>
          {label}
        </Text>
      </View>
      {values.map((cell, i) => (
        <CellValue key={i} cell={cell} isFeatured={i === featuredIndex} />
      ))}
    </View>
  );
}

function CellValue({ cell, isFeatured }: { cell: FeatureCellValue; isFeatured: boolean }) {
  const theme = useBarberAdminTheme();

  return (
    <View className="flex-1 items-center justify-center py-4">
      {cell.kind === 'check' && (
        <MaterialIcons name="check-circle" size={20} color={theme.primary} />
      )}
      {cell.kind === 'dash' && (
        <MaterialIcons
          name="remove"
          size={20}
          color={hexToRgba(theme.onSurfaceVariant, 0.3)}
        />
      )}
      {cell.kind === 'text' && (
        <Text
          className="text-center text-sm"
          style={{
            color: isFeatured ? theme.primary : theme.onSurfaceVariant,
            fontWeight: isFeatured ? '700' : '400',
            fontFamily: theme.bodyFont,
          }}>
          {cell.text}
        </Text>
      )}
    </View>
  );
}

import React from 'react';
import { View, useWindowDimensions } from 'react-native';

import PackageCard from './PackageCard';
import type { PackageDefinition } from './types';

interface PackageCardsGridProps {
  packages: PackageDefinition[];
  onEditPackage: (pkgId: string) => void;
  onDisablePackage: (pkgId: string) => void;
}

export default function PackageCardsGrid({
  packages,
  onEditPackage,
  onDisablePackage,
}: PackageCardsGridProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1100;

  return (
    <View
      className="gap-6"
      style={{ flexDirection: isDesktop ? 'row' : 'column' }}>
      {packages.map((pkg) => (
        <PackageCard
          key={pkg.id}
          pkg={pkg}
          onEdit={() => onEditPackage(pkg.id)}
          onDisable={() => onDisablePackage(pkg.id)}
        />
      ))}
    </View>
  );
}

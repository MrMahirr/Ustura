import React from 'react';
import { View, useWindowDimensions } from 'react-native';

import PackageCard from './PackageCard';
import type { PackageDefinition } from './types';

interface PackageCardsGridProps {
  packages: PackageDefinition[];
  onEditPackage: (pkgId: string) => void;
  onTogglePackageState: (pkgId: string, nextIsActive: boolean) => void;
  onDeletePackage: (pkgId: string) => void;
}

export default function PackageCardsGrid({
  packages,
  onEditPackage,
  onTogglePackageState,
  onDeletePackage,
}: PackageCardsGridProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1100;

  return (
    <View
      className="flex-row flex-wrap gap-4 justify-center"
      style={{ flexDirection: isDesktop ? 'row' : 'column' }}>
      {packages.map((pkg) => (
        <PackageCard
          key={pkg.id}
          pkg={pkg}
          onEdit={() => onEditPackage(pkg.id)}
          onToggleActive={(nextIsActive) =>
            onTogglePackageState(pkg.id, nextIsActive)
          }
          onDelete={() => onDeletePackage(pkg.id)}
        />
      ))}
    </View>
  );
}

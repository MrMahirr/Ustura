import React from 'react';
import { View, useWindowDimensions } from 'react-native';

import PlanComparisonCard from './PlanComparisonCard';
import type { PlanCardViewModel } from './types';

interface PlanComparisonGridProps {
  plans: PlanCardViewModel[];
  onSelectPlan?: (packageId: string) => void;
  disabled?: boolean;
}

export default function PlanComparisonGrid({ plans, onSelectPlan, disabled }: PlanComparisonGridProps) {
  const { width } = useWindowDimensions();

  const columns = width < 640 ? 1 : width < 1024 ? 2 : plans.length;
  const gap = width < 640 ? 16 : width < 1024 ? 20 : 24;

  return (
    <View
      style={{
        flexDirection: columns === 1 ? 'column' : 'row',
        flexWrap: columns === 1 ? undefined : 'wrap',
        gap,
        paddingTop: width < 768 ? 8 : 48,
        alignItems: columns === 1 ? 'stretch' : 'flex-start',
      }}>
      {plans.map((plan) => (
        <View
          key={plan.id}
          style={{
            flex: columns >= plans.length ? 1 : undefined,
            width: columns > 1 && columns < plans.length
              ? `${(100 - ((columns - 1) * gap) / (width * 0.01)) / columns}%`
              : undefined,
            minWidth: columns > 1 ? 260 : undefined,
            flexGrow: columns >= plans.length ? 1 : undefined,
            flexBasis: columns > 1 && columns < plans.length
              ? `${100 / columns - 2}%`
              : undefined,
          }}>
          <PlanComparisonCard
            plan={plan}
            onSelectPlan={onSelectPlan}
            disabled={disabled}
          />
        </View>
      ))}
    </View>
  );
}

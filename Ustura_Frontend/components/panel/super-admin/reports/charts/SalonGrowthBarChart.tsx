import { Platform } from 'react-native';

export type { SalonGrowthBarChartProps } from './SalonGrowthBarChart.native';

const SalonGrowthBarChart =
  Platform.OS === 'web'
    ? require('./SalonGrowthBarChart.web').default
    : require('./SalonGrowthBarChart.native').default;

export default SalonGrowthBarChart;

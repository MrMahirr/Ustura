import { Platform } from 'react-native';
import SalonGrowthBarChartNative from './SalonGrowthBarChart.native';
import SalonGrowthBarChartWeb from './SalonGrowthBarChart.web';

export type { SalonGrowthBarChartProps } from './SalonGrowthBarChart.native';

const SalonGrowthBarChart =
  Platform.OS === 'web'
    ? SalonGrowthBarChartWeb
    : SalonGrowthBarChartNative;

export default SalonGrowthBarChart;

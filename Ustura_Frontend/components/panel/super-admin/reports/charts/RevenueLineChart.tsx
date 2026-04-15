import { Platform } from 'react-native';
import RevenueLineChartNative from './RevenueLineChart.native';
import RevenueLineChartWeb from './RevenueLineChart.web';

export type { RevenueLineChartProps } from './RevenueLineChart.native';

const RevenueLineChart =
  Platform.OS === 'web'
    ? RevenueLineChartWeb
    : RevenueLineChartNative;

export default RevenueLineChart;

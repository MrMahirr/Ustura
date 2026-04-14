import { Platform } from 'react-native';

export type { RevenueLineChartProps } from './RevenueLineChart.native';

const RevenueLineChart =
  Platform.OS === 'web'
    ? require('./RevenueLineChart.web').default
    : require('./RevenueLineChart.native').default;

export default RevenueLineChart;

import { Platform } from 'react-native';

export type { PackageDonutChartProps, PackageSlice } from './PackageDonutChart.native';

const PackageDonutChart =
  Platform.OS === 'web'
    ? require('./PackageDonutChart.web').default
    : require('./PackageDonutChart.native').default;

export default PackageDonutChart;

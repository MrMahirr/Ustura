import { Platform } from 'react-native';
import PackageDonutChartNative from './PackageDonutChart.native';
import PackageDonutChartWeb from './PackageDonutChart.web';

export type { PackageDonutChartProps, PackageSlice } from './PackageDonutChart.native';

const PackageDonutChart =
  Platform.OS === 'web'
    ? PackageDonutChartWeb
    : PackageDonutChartNative;

export default PackageDonutChart;

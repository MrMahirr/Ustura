import { Platform, StyleSheet } from 'react-native';

import { Typography } from '@/constants/typography';

export const styles = StyleSheet.create({
  page: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: Platform.OS === 'web' ? 1 : 0,
    backgroundSize: '40px 40px',
    pointerEvents: 'none',
  } as any,
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    width: '100%',
    maxWidth: 1600,
    alignSelf: 'center',
    gap: 36,
  },
  headerSection: {
    justifyContent: 'space-between',
    gap: 20,
  },
  headerCopy: {
    flex: 1,
    maxWidth: 640,
  },
  title: {
    fontFamily: 'NotoSerif-Bold',
    fontSize: 36,
    letterSpacing: -0.6,
    marginBottom: 10,
  },
  description: {
    ...Typography.bodyLg,
    fontFamily: 'Manrope-Regular',
    fontWeight: '300',
  },
  headerActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  secondaryCta: {
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer', transition: 'background-color 180ms ease' } as any) : {}),
  },
  secondaryCtaText: {
    ...Typography.labelMd,
    fontSize: 11,
    fontFamily: 'Manrope-Bold',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  metricItem: {
    minWidth: 160,
  },
  middleGrid: {
    gap: 24,
  },
  middlePrimary: {
    flex: 1.85,
    minWidth: 0,
  },
  middleSecondary: {
    flex: 1,
    minWidth: 0,
  },
  bottomGrid: {
    gap: 24,
    alignItems: 'stretch',
  },
  footerRule: {
    borderTopWidth: 1,
    marginTop: 8,
  },
  footer: {
    ...Typography.labelSm,
    fontSize: 10,
    letterSpacing: 2,
    textAlign: 'center',
    paddingBottom: 8,
  },
});

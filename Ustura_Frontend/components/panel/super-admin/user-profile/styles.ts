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
    gap: 28,
  },
  contentGrid: {
    gap: 24,
  },
  leftColumn: {
    gap: 24,
  },
  rightColumn: {
    gap: 24,
  },
  heroSection: {
    justifyContent: 'space-between',
    gap: 24,
  },
  heroMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    flexWrap: 'wrap',
  },
  heroAvatarWrap: {
    width: 176,
    height: 176,
    position: 'relative',
    flexShrink: 0,
  },
  heroAvatarFrame: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 4,
  },
  heroAvatar: {
    width: '100%',
    height: '100%',
  },
  heroStatusDot: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    width: 24,
    height: 24,
    borderRadius: 999,
    borderWidth: 4,
  },
  heroCopy: {
    flex: 1,
    minWidth: 260,
    gap: 10,
  },
  heroMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  heroRoleBadge: {
    minHeight: 30,
    borderRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroRoleText: {
    ...Typography.labelSm,
    fontFamily: 'Manrope-Bold',
    fontSize: 10,
    letterSpacing: 2,
  },
  heroLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heroLocationText: {
    ...Typography.bodyMd,
    fontSize: 13,
  },
  heroTitle: {
    fontFamily: 'NotoSerif-Bold',
    fontSize: 54,
    lineHeight: 60,
    letterSpacing: -1.2,
  },
  heroSalonLink: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
          transition: 'opacity 160ms ease, transform 180ms ease',
        } as any)
      : {}),
  },
  heroSalonText: {
    ...Typography.bodyLg,
    fontFamily: 'Manrope-SemiBold',
    fontSize: 20,
  },
  heroActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  actionButton: {
    minHeight: 46,
    borderRadius: 4,
    borderWidth: 1,
    overflow: 'hidden',
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
          transition: 'transform 180ms ease, background-color 180ms ease, border-color 180ms ease',
        } as any)
      : {}),
  },
  actionButtonInner: {
    minHeight: 46,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionButtonText: {
    ...Typography.labelSm,
    fontFamily: 'Manrope-Bold',
    fontSize: 11,
    letterSpacing: 1.6,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  metricCard: {
    minHeight: 168,
    borderLeftWidth: 2,
    padding: 24,
    gap: 14,
  },
  metricLabel: {
    ...Typography.labelSm,
    fontFamily: 'Manrope-Bold',
    fontSize: 10,
    letterSpacing: 2.1,
  },
  metricValueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    flexWrap: 'wrap',
  },
  metricValue: {
    fontFamily: 'Manrope-Bold',
    fontSize: 40,
    lineHeight: 44,
    letterSpacing: -1,
  },
  metricAccent: {
    ...Typography.labelSm,
    fontFamily: 'Manrope-Bold',
    fontSize: 11,
    letterSpacing: 1.2,
  },
  metricNote: {
    ...Typography.bodyMd,
    fontSize: 12,
    lineHeight: 18,
  },
  metricProgressTrack: {
    width: '100%',
    height: 4,
    borderRadius: 999,
    overflow: 'hidden',
  },
  metricProgressBar: {
    height: '100%',
    borderRadius: 999,
  },
  metricRatingWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  panelCard: {
    borderRadius: 4,
    padding: 28,
    gap: 18,
  },
  panelHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  panelHeaderCopy: {
    gap: 6,
  },
  panelTitle: {
    fontFamily: 'NotoSerif-Bold',
    fontSize: 30,
    letterSpacing: -0.4,
  },
  panelTitleSm: {
    fontFamily: 'NotoSerif-Bold',
    fontSize: 24,
    letterSpacing: -0.3,
  },
  panelSubtitle: {
    ...Typography.bodyMd,
    fontSize: 12,
    lineHeight: 18,
  },
  panelIconButton: {
    width: 34,
    height: 34,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
          transition: 'background-color 160ms ease, transform 160ms ease',
        } as any)
      : {}),
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
  },
  infoColumn: {
    flex: 1,
    minWidth: 280,
    gap: 18,
  },
  infoItem: {
    gap: 6,
  },
  infoLabel: {
    ...Typography.labelSm,
    fontFamily: 'Manrope-Bold',
    fontSize: 10,
    letterSpacing: 2.2,
  },
  infoValue: {
    ...Typography.bodyLg,
    fontFamily: 'Manrope-SemiBold',
    fontSize: 18,
    lineHeight: 26,
  },
  scheduleList: {
    gap: 8,
  },
  scheduleRow: {
    minHeight: 42,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  scheduleRowLabel: {
    ...Typography.bodyMd,
    fontSize: 14,
  },
  scheduleRowValue: {
    ...Typography.bodyMd,
    fontFamily: 'Manrope-Bold',
    fontSize: 14,
  },
  tableWrap: {
    gap: 8,
  },
  tableHeaderRow: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  tableHeaderText: {
    ...Typography.labelSm,
    fontFamily: 'Manrope-Bold',
    fontSize: 10,
    letterSpacing: 2,
  },
  tableRow: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  tableCell: {
    justifyContent: 'center',
    paddingVertical: 14,
    minWidth: 0,
  },
  customerCell: {
    flex: 1.35,
    paddingRight: 12,
  },
  serviceCell: {
    flex: 1.5,
    paddingRight: 12,
  },
  dateCell: {
    flex: 1.2,
    paddingRight: 12,
  },
  statusCell: {
    flex: 0.9,
    paddingRight: 12,
  },
  actionsCell: {
    width: 56,
    alignItems: 'flex-end',
  },
  tablePrimaryText: {
    ...Typography.bodyMd,
    fontFamily: 'Manrope-SemiBold',
    fontSize: 14,
  },
  tableSecondaryText: {
    ...Typography.bodyMd,
    fontSize: 13,
    lineHeight: 18,
  },
  statusPill: {
    alignSelf: 'flex-start',
    minHeight: 24,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusPillText: {
    ...Typography.labelSm,
    fontFamily: 'Manrope-Bold',
    fontSize: 10,
    letterSpacing: 1.4,
  },
  mobileAppointmentList: {
    gap: 12,
  },
  mobileAppointmentCard: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 16,
    gap: 12,
  },
  mobileAppointmentMeta: {
    gap: 4,
  },
  earningsLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  legendText: {
    ...Typography.labelSm,
    fontFamily: 'Manrope-Bold',
    fontSize: 10,
    letterSpacing: 1.6,
  },
  chartWrap: {
    height: 260,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 8,
    paddingTop: 12,
  },
  chartColumn: {
    flex: 1,
    alignItems: 'center',
    gap: 12,
  },
  chartTrack: {
    width: '100%',
    height: 200,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    position: 'relative',
  },
  chartAverageFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  chartRevenueFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  chartMonthText: {
    ...Typography.labelSm,
    fontFamily: 'Manrope-Bold',
    fontSize: 10,
    letterSpacing: 1.8,
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tagPill: {
    minHeight: 36,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
  },
  tagText: {
    ...Typography.labelSm,
    fontFamily: 'Manrope-Bold',
    fontSize: 10,
    letterSpacing: 1.8,
  },
  activityTimeline: {
    position: 'relative',
    gap: 22,
    paddingTop: 4,
  },
  activityTimelineLine: {
    position: 'absolute',
    left: 7,
    top: 8,
    bottom: 8,
    width: 2,
  },
  activityItem: {
    paddingLeft: 28,
    position: 'relative',
    gap: 4,
  },
  activityDot: {
    position: 'absolute',
    left: 0,
    top: 2,
    width: 16,
    height: 16,
    borderRadius: 999,
    borderWidth: 4,
  },
  activityTitle: {
    ...Typography.bodyMd,
    fontFamily: 'Manrope-Bold',
    fontSize: 13,
  },
  activityDetail: {
    ...Typography.bodyMd,
    fontSize: 11,
    lineHeight: 18,
  },
  activityFooterButton: {
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
          transition: 'opacity 160ms ease',
        } as any)
      : {}),
  },
  activityFooterText: {
    ...Typography.labelSm,
    fontFamily: 'Manrope-Bold',
    fontSize: 10,
    letterSpacing: 2.2,
  },
  quickActionsList: {
    gap: 10,
  },
  quickActionButton: {
    minHeight: 48,
    paddingHorizontal: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
          transition: 'transform 180ms ease, background-color 180ms ease, color 180ms ease',
        } as any)
      : {}),
  },
  quickActionText: {
    ...Typography.labelSm,
    fontFamily: 'Manrope-Bold',
    fontSize: 10,
    letterSpacing: 2.1,
  },
  emptyState: {
    minHeight: 260,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    ...Typography.titleMd,
    fontFamily: 'Manrope-Bold',
  },
  emptyDescription: {
    ...Typography.bodyMd,
    textAlign: 'center',
    maxWidth: 420,
  },
  webInteractiveCard: {
    transition: 'transform 180ms ease, background-color 180ms ease, border-color 180ms ease, box-shadow 220ms ease, opacity 180ms ease',
  } as any,
  webInteractiveButton: {
    transition: 'transform 160ms ease, background-color 160ms ease, border-color 160ms ease, opacity 160ms ease',
    cursor: 'pointer',
  } as any,
});

import { Platform, StyleSheet } from 'react-native';

import { Typography } from '@/constants/typography';

export const salonGroupedStyles = StyleSheet.create({
  container: {
    gap: 24,
  },
  section: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  sectionHeader: {
    paddingHorizontal: 24,
    paddingVertical: 22,
    borderBottomWidth: 1,
    gap: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  sectionIdentity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
    minWidth: 260,
  },
  sectionIconFrame: {
    width: 52,
    height: 52,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    flexShrink: 0,
  },
  sectionTitleWrap: {
    flex: 1,
    minWidth: 0,
    gap: 8,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  sectionTitle: {
    fontFamily: 'NotoSerif-Bold',
    fontSize: 24,
    letterSpacing: -0.5,
    flexShrink: 1,
  },
  planPill: {
    minHeight: 24,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planPillText: {
    ...Typography.labelSm,
    fontFamily: 'Manrope-Bold',
    fontSize: 10,
    letterSpacing: 1.8,
  },
  sectionMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  sectionMetaText: {
    ...Typography.labelSm,
    fontFamily: 'Manrope-Bold',
    fontSize: 10,
    letterSpacing: 2.2,
  },
  sectionActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  actionButton: {
    minHeight: 40,
    borderRadius: 4,
    borderWidth: 1,
    overflow: 'hidden',
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
          transition: 'transform 180ms ease, border-color 180ms ease, background-color 180ms ease, opacity 180ms ease',
        } as any)
      : {}),
  },
  actionButtonInner: {
    minHeight: 40,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionButtonText: {
    ...Typography.labelSm,
    fontFamily: 'Manrope-Bold',
    fontSize: 10,
    letterSpacing: 2,
  },
  actionIconButton: {
    width: 40,
    height: 40,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
          transition: 'transform 180ms ease, border-color 180ms ease, background-color 180ms ease, opacity 180ms ease',
        } as any)
      : {}),
  },
  sectionBody: {
    padding: 24,
  },
  membersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  memberCard: {
    minHeight: 236,
    borderWidth: 1,
    borderRadius: 6,
    padding: 20,
    gap: 16,
    overflow: 'hidden',
  },
  memberCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  memberAvatarWrap: {
    width: 64,
    height: 64,
    position: 'relative',
  },
  memberAvatarFrame: {
    width: 64,
    height: 64,
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
  },
  memberAvatar: {
    width: '100%',
    height: '100%',
  },
  memberStatusDot: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 14,
    height: 14,
    borderRadius: 999,
    borderWidth: 2,
  },
  memberMenuButton: {
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
  memberCopy: {
    gap: 8,
  },
  memberName: {
    fontFamily: 'NotoSerif-Bold',
    fontSize: 22,
    letterSpacing: -0.4,
  },
  memberTitle: {
    ...Typography.labelSm,
    fontFamily: 'Manrope-Bold',
    fontSize: 10,
    letterSpacing: 2.4,
  },
  memberSpecialtiesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  memberSpecialtyPill: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 4,
  },
  memberSpecialtyText: {
    ...Typography.labelSm,
    fontFamily: 'Manrope-Bold',
    fontSize: 10,
    letterSpacing: 1.4,
  },
  addCard: {
    minHeight: 236,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 14,
  },
  addCardIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCardText: {
    ...Typography.labelSm,
    fontFamily: 'Manrope-Bold',
    fontSize: 10,
    letterSpacing: 2.2,
  },
  webInteractiveCard: {
    transition: 'transform 220ms ease, background-color 220ms ease, border-color 220ms ease, opacity 220ms ease, box-shadow 220ms ease',
  } as any,
});

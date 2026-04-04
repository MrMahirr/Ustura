export function getLandingLayout(width: number) {
  const horizontalPadding =
    width < 480 ? 16 :
    width < 768 ? 18 :
    width < 1024 ? 22 :
    width < 1440 ? 28 :
    width < 1800 ? 32 : 40;

  const maxViewportContent = Math.max(0, width - (horizontalPadding * 2));

  const contentMaxWidth =
    width < 768 ? maxViewportContent :
    Math.min(maxViewportContent, 1880);

  const sectionPaddingVertical =
    width < 768 ? 88 :
    width < 1440 ? 112 : 128;

  return {
    horizontalPadding,
    contentMaxWidth,
    sectionPaddingVertical,
    isCompact: width < 1100,
    isTablet: width >= 768,
    isDesktop: width >= 1100,
    isWide: width >= 1440,
  };
}

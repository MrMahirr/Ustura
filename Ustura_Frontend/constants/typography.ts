// Ustura — Typography (Noto Serif + Manrope)

export const Typography = {
  // Display & Headlines (Noto Serif) — Art Elements
  displayLg: {
    fontFamily: 'NotoSerif-Bold',
    fontSize: 40,
    letterSpacing: -0.8, // -2%
  },
  displayMd: {
    fontFamily: 'NotoSerif-Bold',
    fontSize: 32,
    letterSpacing: -0.64,
  },
  headlineLg: {
    fontFamily: 'NotoSerif-Bold',
    fontSize:42,
    letterSpacing: -0.56,
  },

  // Titles & Body (Manrope)
  titleLg: {
    fontFamily: 'Manrope-Bold',
    fontSize: 20,
  },
  titleMd: {
    fontFamily: 'Manrope-SemiBold',
    fontSize: 16,
  },
  bodyLg: {
    fontFamily: 'Manrope-Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  bodyMd: {
    fontFamily: 'Manrope-Regular',
    fontSize: 14,
    lineHeight: 20,
  },

  // Labels (Manrope, ALL CAPS)
  labelLg: {
    fontFamily: 'Manrope-SemiBold',
    fontSize: 14,
    letterSpacing: 1.4,
    textTransform: 'uppercase' as const,
  },
  labelMd: {
    fontFamily: 'Manrope-Medium',
    fontSize: 12,
    letterSpacing: 1.6,
    textTransform: 'uppercase' as const,
  },
  labelSm: {
    fontFamily: 'Manrope-Medium',
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: 'uppercase' as const,
  },
};

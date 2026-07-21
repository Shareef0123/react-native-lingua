export const fonts = {
  regular: "Poppins-Regular",
  medium: "Poppins-Medium",
  semiBold: "Poppins-SemiBold",
  bold: "Poppins-Bold",
} as const;

export const typography = {
  h1: {
    fontSize: 32,
    lineHeight: 38.4,
    fontFamily: fonts.bold,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 24,
    lineHeight: 31.2,
    fontFamily: fonts.semiBold,
    fontWeight: "600" as const,
  },
  h3: {
    fontSize: 20,
    lineHeight: 26.0,
    fontFamily: fonts.semiBold,
    fontWeight: "600" as const,
  },
  h4: {
    fontSize: 16,
    lineHeight: 22.4,
    fontFamily: fonts.medium,
    fontWeight: "500" as const,
  },
  bodyLarge: {
    fontSize: 16,
    lineHeight: 25.6,
    fontFamily: fonts.regular,
    fontWeight: "400" as const,
  },
  bodyMedium: {
    fontSize: 14,
    lineHeight: 22.4,
    fontFamily: fonts.regular,
    fontWeight: "400" as const,
  },
  bodySmall: {
    fontSize: 13,
    lineHeight: 20.8,
    fontFamily: fonts.regular,
    fontWeight: "400" as const,
  },
  caption: {
    fontSize: 11,
    lineHeight: 15.4,
    fontFamily: fonts.regular,
    fontWeight: "400" as const,
  },
} as const;

export type Typography = typeof typography;

export const FontFamily = {
    light: 'Outfit-Light',
    regular: 'Outfit-Regular',
    medium: 'Outfit-Medium',
    semiBold: 'Outfit-SemiBold',
    bold: 'Outfit-Bold',
} as const;

export const FontSize = {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 24,
    xxxl: 30,
    title: 40,
} as const;

export const Typography = {
    title: {
        fontFamily: FontFamily.semiBold,
        fontSize: FontSize.title,
    },
    subtitle1: {
        fontFamily: FontFamily.medium,
        fontSize: FontSize.xxxl,
    },
    subtitle2: {
        fontFamily: FontFamily.regular,
        fontSize: FontSize.xxl,
    },
    body: {
        fontFamily: FontFamily.light,
        fontSize: FontSize.lg,
    },
    bodyMedium: {
        fontFamily: FontFamily.medium,
        fontSize: FontSize.md,
    },
    caption: {
        fontFamily: FontFamily.regular,
        fontSize: FontSize.sm,
    },
    small: {
        fontFamily: FontFamily.light,
        fontSize: FontSize.xs,
    },
    button: {
        fontFamily: FontFamily.semiBold,
        fontSize: FontSize.md,
    },
} as const;

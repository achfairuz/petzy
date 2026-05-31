import { StyleSheet } from "react-native";
import { Colors, FontFamily, FontSize, Spacing, Typography } from "../../../core/theme";
import { description } from "@/core/theme/styling";

export const authScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        paddingHorizontal: Spacing.xxl,
        paddingVertical: Spacing.xxxl,
    },
    header: {
        marginBottom: Spacing.xxxl,
    },
    description: {
        ...description
    },
    appName: {
        ...Typography.title,
        color: Colors.primary,
        marginBottom: Spacing.sm,
    },
    title: {
        ...Typography.subtitle1,
        color: Colors.textPrimary,
    },
    subtitle: {
        fontFamily: FontFamily.regular,
        fontSize: FontSize.lg,
        color: Colors.textSecondary,
        marginTop: Spacing.xs,
    },
    form: {
        marginBottom: Spacing.xxl,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    footerText: {
        fontFamily: FontFamily.regular,
        fontSize: FontSize.md,
        color: Colors.textSecondary,
    },
    footerLink: {
        fontFamily: FontFamily.semiBold,
        fontSize: FontSize.md,
        color: Colors.primary,
    },
});

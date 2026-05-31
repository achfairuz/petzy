import React from "react";
import {View, Text, StyleSheet, ViewStyle} from "react-native";
import {Colors, FontFamily, FontSize, Spacing} from "@/core/theme";

interface SectionProps {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  style?: ViewStyle;
  paddingHorizontal?: number;
}

export const Section: React.FC<SectionProps> = ({
  title,
  action,
  children,
  style,
  paddingHorizontal = Spacing.xxl,
}) => (
  <View style={[{marginBottom: Spacing.xl}, style]}>
    <View style={[styles.header, {paddingHorizontal}]}>
      <Text style={styles.title}>{title}</Text>
      {action}
    </View>
    {children}
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  title: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
});

import React from "react";
import {View, Text, StyleSheet} from "react-native";
import {
  BorderRadius,
  Colors,
  FontFamily,
  FontSize,
  Spacing,
} from "@/core/theme";

interface BadgeProps {
  label: string;
  color?: string;
  background?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  color = Colors.primary,
  background = "#FFF0F0",
}) => (
  <View style={[styles.badge, {backgroundColor: background}]}>
    <Text style={[styles.text, {color}]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  text: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
  },
});

import React from "react";
import {Text, TouchableOpacity, StyleSheet} from "react-native";
import {Ionicons} from "@expo/vector-icons";

type Props = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  bgColor: string;
  iconColor: string;
  large?: boolean;
  onPress?: () => void;
};

export const FeatureCard: React.FC<Props> = ({
  title,
  icon,
  bgColor,
  iconColor,
  large = false,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.card,
        {backgroundColor: bgColor},
        large && styles.largeCard,
        {
          flexDirection: large ? "column" : "row",
          alignItems: "center",
          justifyContent: "center",
        },
      ]}
      activeOpacity={0.8}
    >
      <Ionicons
        name={icon}
        size={large ? 40 : 40}
        color={iconColor}
        style={{
          marginBottom: large ? 8 : 0,
          marginRight: !large ? 8 : 0,
        }}
      />

      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: 120,
    borderRadius: 20,
    padding: 16,
    justifyContent: "space-between",

    backgroundColor: "#fff", // ⬅️ penting

    borderWidth: 1.5,
    borderColor: "#E0E0E0",

    elevation: 2,

    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  largeCard: {
    height: 180,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
});

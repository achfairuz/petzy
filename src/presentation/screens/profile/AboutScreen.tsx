import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useNavigation} from "@react-navigation/native";
import {Ionicons} from "@expo/vector-icons";

import {
  BorderRadius,
  Colors,
  FontFamily,
  FontSize,
  Spacing,
} from "@/core/theme";
import {ScreenHeader} from "@/presentation/components/ScreenHeader";

const AboutScreen: React.FC = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScreenHeader title="About Petzy" onBack={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={{padding: Spacing.xxl, paddingBottom: 120}}
      >
        <View style={styles.logo}>
          <Text style={styles.logoText}>P</Text>
        </View>
        <Text style={styles.brand}>Petzy</Text>
        <Text style={styles.tagline}>Care for your beloved pet</Text>

        <Text style={styles.body}>
          Petzy helps pet parents book vet appointments, shop for essentials,
          chat with experts, and track their pets' health — all in one elegant
          app.
        </Text>

        <View style={styles.card}>
          <Row label="Version" value="1.0.0" />
          <Row label="Build" value="100" />
          <Row label="Environment" value="Mock data (offline)" />
        </View>

        <View style={styles.card}>
          <LinkRow
            label="Terms of Service"
            onPress={() => Linking.openURL("https://example.com/terms")}
          />
          <LinkRow
            label="Privacy Policy"
            onPress={() => Linking.openURL("https://example.com/privacy")}
          />
          <LinkRow
            label="Open source licenses"
            onPress={() => Linking.openURL("https://example.com/licenses")}
          />
          <LinkRow
            label="Rate us on the store"
            onPress={() => Linking.openURL("https://example.com/rate")}
          />
        </View>

        <Text style={styles.footer}>
          Made with care • {new Date().getFullYear()}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const Row: React.FC<{label: string; value: string}> = ({label, value}) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

const LinkRow: React.FC<{label: string; onPress: () => void}> = ({
  label,
  onPress,
}) => (
  <TouchableOpacity style={styles.row} onPress={onPress}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Ionicons name="chevron-forward" size={16} color={Colors.textDisabled} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: Colors.background},
  logo: {
    alignSelf: "center",
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  logoText: {
    color: Colors.white,
    fontFamily: FontFamily.bold,
    fontSize: 40,
  },
  brand: {
    textAlign: "center",
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xxl,
    color: Colors.textPrimary,
  },
  tagline: {
    textAlign: "center",
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  body: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xxl,
    overflow: "hidden",
    marginBottom: Spacing.md,
  },
  row: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  rowLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  rowValue: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  footer: {
    textAlign: "center",
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textDisabled,
    marginTop: Spacing.lg,
  },
});

export default AboutScreen;

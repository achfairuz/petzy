import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useNavigation} from "@react-navigation/native";
import {Ionicons} from "@expo/vector-icons";
import Toast from "react-native-toast-message";

import {
  BorderRadius,
  Colors,
  FontFamily,
  FontSize,
  Spacing,
} from "@/core/theme";
import {ScreenHeader} from "@/presentation/components/ScreenHeader";
import {useSettingsStore, AppPreferences} from "@/core/store/settingsStore";

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const preferences = useSettingsStore((s) => s.preferences);
  const setPreference = useSettingsStore((s) => s.setPreference);

  const toggle = <K extends keyof AppPreferences>(
    key: K,
    value: AppPreferences[K],
  ) => {
    setPreference(key, value);
  };

  const switchLanguage = () => {
    const next = preferences.language === "en" ? "id" : "en";
    setPreference("language", next);
    Toast.show({type: "success", text1: `Language: ${next.toUpperCase()}`});
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScreenHeader title="Settings" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{paddingBottom: 120}}>
        <Group title="Notifications">
          <Toggle
            label="Push notifications"
            value={preferences.pushNotifications}
            onChange={(v) => toggle("pushNotifications", v)}
          />
          <Toggle
            label="Email updates"
            value={preferences.emailNotifications}
            onChange={(v) => toggle("emailNotifications", v)}
          />
          <Toggle
            label="Promotions & offers"
            value={preferences.promotions}
            onChange={(v) => toggle("promotions", v)}
          />
        </Group>

        <Group title="Appearance">
          <Toggle
            label="Dark mode"
            value={preferences.darkMode}
            onChange={(v) => toggle("darkMode", v)}
          />
          <Row
            label="Language"
            value={
              preferences.language === "en" ? "English" : "Bahasa Indonesia"
            }
            onPress={switchLanguage}
          />
        </Group>

        <Group title="Security">
          <Row
            label="Change password"
            onPress={() =>
              Toast.show({type: "info", text1: "Password flow coming soon"})
            }
          />
          <Row
            label="Two-factor authentication"
            value="Off"
            onPress={() => Toast.show({type: "info", text1: "Soon"})}
          />
        </Group>

        <Group title="Data">
          <Row
            label="Clear cache"
            onPress={() =>
              Toast.show({type: "success", text1: "Cache cleared"})
            }
          />
        </Group>
      </ScrollView>
    </SafeAreaView>
  );
};

const Group: React.FC<{title: string; children: React.ReactNode}> = ({
  title,
  children,
}) => (
  <View style={styles.group}>
    <Text style={styles.groupTitle}>{title}</Text>
    <View style={styles.card}>{children}</View>
  </View>
);

const Toggle: React.FC<{
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}> = ({label, value, onChange}) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onChange}
      trackColor={{true: Colors.primary, false: Colors.border}}
      thumbColor={Colors.white}
    />
  </View>
);

const Row: React.FC<{label: string; value?: string; onPress?: () => void}> = ({
  label,
  value,
  onPress,
}) => (
  <TouchableOpacity
    style={styles.row}
    onPress={onPress}
    activeOpacity={onPress ? 0.7 : 1}
  >
    <Text style={styles.rowLabel}>{label}</Text>
    <View style={{flexDirection: "row", alignItems: "center", gap: 4}}>
      {value ? <Text style={styles.rowValue}>{value}</Text> : null}
      <Ionicons name="chevron-forward" size={16} color={Colors.textDisabled} />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: Colors.background},
  group: {marginHorizontal: Spacing.xxl, marginBottom: Spacing.lg},
  groupTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xxl,
    overflow: "hidden",
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
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  rowValue: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
});

export default SettingsScreen;

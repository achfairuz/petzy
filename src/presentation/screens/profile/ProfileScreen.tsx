import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Ionicons, MaterialCommunityIcons, Feather} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";
import type {NativeStackNavigationProp} from "@react-navigation/native-stack";

import {
  BorderRadius,
  Colors,
  FontFamily,
  FontSize,
  Spacing,
  iconSizes,
} from "@/core/theme";
import {ScreenHeader} from "@/presentation/components/ScreenHeader";
import {useAuthStore} from "@/core/store/authStore";
import {useCartStore} from "@/core/store/cartStore";
import type {AppStackParamList} from "@/presentation/navigation/types";

const ProfileScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const clearCart = useCartStore((s) => s.clear);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to sign out?", [
      {text: "Cancel", style: "cancel"},
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          clearCart();
          logout();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScreenHeader
        title="Profile"
        right={
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate("Notifications")}
          >
            <Ionicons
              name="notifications-outline"
              size={iconSizes.medium}
              color={Colors.textPrimary}
            />
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={{paddingBottom: 140}}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile card */}
        <View style={styles.profileCard}>
          <Image
            source={{uri: user?.avatarUrl ?? "https://i.pravatar.cc/300"}}
            style={styles.avatar}
          />
          <Text style={styles.name}>{user?.name ?? "Petzy User"}</Text>
          <Text style={styles.email}>{user?.email ?? "—"}</Text>
          {user?.bio ? <Text style={styles.bio}>{user.bio}</Text> : null}

          <View style={styles.statsRow}>
            <Stat label="Pets" value="2" />
            <View style={styles.statDivider} />
            <Stat label="Orders" value="14" />
            <View style={styles.statDivider} />
            <Stat label="Visits" value="7" />
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menuGroup}>
          <MenuItem
            icon="paw-outline"
            label="My Pets"
            onPress={() => navigation.navigate("MyPets")}
          />
          <MenuItem
            icon="calendar-outline"
            label="My Appointments"
            onPress={() => navigation.navigate("Appointments")}
          />
          <MenuItem
            icon="bag-outline"
            label="My Cart"
            onPress={() => navigation.navigate("Cart")}
          />
          <MenuItem
            icon="notifications-outline"
            label="Notifications"
            onPress={() => navigation.navigate("Notifications")}
          />
        </View>

        <View style={styles.menuGroup}>
          <MenuItem
            icon="person-circle-outline"
            label="Edit Profile"
            onPress={() => navigation.navigate("EditProfile")}
          />
          <MenuItem
            icon="card-outline"
            label="Payment Methods"
            onPress={() => navigation.navigate("PaymentMethods")}
          />
          <MenuItem
            icon="location-outline"
            label="Addresses"
            onPress={() => navigation.navigate("Addresses")}
          />
          <MenuItem
            icon="shield-checkmark-outline"
            label="Privacy & Security"
            onPress={() => navigation.navigate("Settings")}
          />
        </View>

        <View style={styles.menuGroup}>
          <MenuItem
            icon="help-circle-outline"
            label="Help & Support"
            onPress={() => navigation.navigate("Help")}
          />
          <MenuItem
            icon="information-circle-outline"
            label="About Petzy"
            onPress={() => navigation.navigate("About")}
          />
        </View>

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.85}
        >
          <Feather name="log-out" size={18} color={Colors.error} />
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Petzy v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const Stat: React.FC<{label: string; value: string}> = ({label, value}) => (
  <View style={{alignItems: "center", flex: 1}}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const MenuItem: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
}> = ({icon, label, onPress}) => (
  <TouchableOpacity
    style={styles.menuItem}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.menuIcon}>
      <Ionicons name={icon} size={20} color={Colors.primary} />
    </View>
    <Text style={styles.menuLabel}>{label}</Text>
    <Ionicons name="chevron-forward" size={18} color={Colors.textDisabled} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: Colors.background},
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },

  profileCard: {
    marginHorizontal: Spacing.xxl,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xl,
    alignItems: "center",
    marginBottom: Spacing.xl,
    elevation: 2,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 3,
    borderColor: Colors.primary,
    marginBottom: Spacing.md,
  },
  name: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xl,
    color: Colors.textPrimary,
  },
  email: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  bio: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: Spacing.sm,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.lg,
    width: "100%",
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  statDivider: {width: 1, height: 24, backgroundColor: Colors.border},
  statValue: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  statLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  menuGroup: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.xxl,
    borderRadius: BorderRadius.xxl,
    marginBottom: Spacing.lg,
    overflow: "hidden",
    elevation: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: "#FFF0F0",
    alignItems: "center",
    justifyContent: "center",
  },
  menuLabel: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },

  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    marginHorizontal: Spacing.xxl,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xxl,
    backgroundColor: "#FFEBEE",
    marginTop: Spacing.sm,
  },
  logoutText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.error,
  },
  version: {
    textAlign: "center",
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textDisabled,
    marginTop: Spacing.xl,
  },
});

export default ProfileScreen;

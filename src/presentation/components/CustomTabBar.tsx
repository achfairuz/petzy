import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
} from "react-native";
import {BottomTabBarProps} from "@react-navigation/bottom-tabs";
import {Ionicons, MaterialCommunityIcons, Feather} from "@expo/vector-icons";
import {useSafeAreaInsets} from "react-native-safe-area-context";

import {BorderRadius, Colors, Spacing} from "../../core/theme";
import {useAuthStore} from "../../core/store/authStore";
import {useCartStore} from "../../core/store/cartStore";

const FALLBACK_AVATAR = "https://i.pravatar.cc/100";

type TabIconProps = {
  routeName: string;
  focused: boolean;
  avatarUrl?: string;
};

const TabIcon: React.FC<TabIconProps> = ({routeName, focused, avatarUrl}) => {
  const color = focused ? Colors.primary : "#C8C8C8";
  const size = 24;

  switch (routeName) {
    case "Home":
      return (
        <Ionicons
          name={focused ? "home" : "home-outline"}
          size={size}
          color={color}
        />
      );
    case "Health":
      return (
        <MaterialCommunityIcons name="stethoscope" size={size} color={color} />
      );
    case "Shop":
      return <Feather name="shopping-bag" size={26} color={Colors.white} />;
    case "Chat":
      return (
        <Ionicons
          name={focused ? "chatbubble-ellipses" : "chatbubble-ellipses-outline"}
          size={size}
          color={color}
        />
      );
    case "Profile":
      return (
        <Image
          source={{uri: avatarUrl ?? FALLBACK_AVATAR}}
          style={[styles.avatar, focused && styles.avatarActive]}
        />
      );
    default:
      return null;
  }
};

const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const avatarUrl = useAuthStore((s) => s.user?.avatarUrl);
  const cartCount = useCartStore((s) => s.totalItems());

  return (
    <View style={[styles.wrapper, {paddingBottom: insets.bottom + 12}]}>
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const isFocused = state.index === index;
          const isCenter = index === 2;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          if (isCenter) {
            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                accessibilityRole="button"
                accessibilityState={isFocused ? {selected: true} : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                style={styles.centerButtonWrapper}
                activeOpacity={0.85}
              >
                <View style={styles.centerButton}>
                  <TabIcon routeName={route.name} focused={isFocused} />
                  {cartCount > 0 ? <View style={styles.cartDot} /> : null}
                </View>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              accessibilityRole="button"
              accessibilityState={isFocused ? {selected: true} : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              <TabIcon
                routeName={route.name}
                focused={isFocused}
                avatarUrl={avatarUrl}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.xxl,
    borderRadius: 40,
    paddingHorizontal: Spacing.sm,
    height: 72,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.1,
        shadowRadius: 16,
      },
      android: {elevation: 10},
    }),
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  centerButtonWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -16,
  },
  centerButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: Colors.white,
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {elevation: 8},
    }),
  },
  cartDot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.warning,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  avatarActive: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
});

export default CustomTabBar;

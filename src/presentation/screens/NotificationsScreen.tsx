import React from "react";
import {View, Text, StyleSheet, FlatList} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Ionicons} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";

import {
  BorderRadius,
  Colors,
  FontFamily,
  FontSize,
  Spacing,
} from "@/core/theme";
import {ScreenHeader} from "@/presentation/components/ScreenHeader";
import {formatRelativeTime} from "@/core/utils/format";

interface Notif {
  id: string;
  title: string;
  body: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bg: string;
  iso: string;
  unread: boolean;
}

const NOTIFICATIONS: Notif[] = [
  {
    id: "n1",
    title: "Vaccination reminder",
    body: "Milo's annual vaccine is due in 7 days.",
    icon: "medkit-outline",
    color: "#2DA010",
    bg: "#DEF6D8",
    iso: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    unread: true,
  },
  {
    id: "n2",
    title: "New message from Dr. Anita",
    body: "Please come 10 minutes early on Thursday.",
    icon: "chatbubble-ellipses-outline",
    color: Colors.primary,
    bg: "#FFF0F0",
    iso: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    unread: true,
  },
  {
    id: "n3",
    title: "Order shipped",
    body: "Premium Dog Food 5kg is on the way.",
    icon: "cube-outline",
    color: "#EA5E10",
    bg: "#FFE6D9",
    iso: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    unread: false,
  },
  {
    id: "n4",
    title: "Weekly tip",
    body: "Brushing your cat reduces hairballs by 70%.",
    icon: "bulb-outline",
    color: "#512EB7",
    bg: "#E1D8FC",
    iso: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    unread: false,
  },
];

const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScreenHeader title="Notifications" onBack={() => navigation.goBack()} />
      <FlatList
        data={NOTIFICATIONS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: Spacing.xxl,
          paddingBottom: 100,
          gap: Spacing.md,
        }}
        renderItem={({item}) => (
          <View style={[styles.row, item.unread && styles.rowUnread]}>
            <View style={[styles.iconWrap, {backgroundColor: item.bg}]}>
              <Ionicons name={item.icon} size={20} color={item.color} />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.body}>{item.body}</Text>
              <Text style={styles.time}>{formatRelativeTime(item.iso)}</Text>
            </View>
            {item.unread ? <View style={styles.dot} /> : null}
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: Colors.background},
  row: {
    flexDirection: "row",
    gap: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xxl,
    elevation: 1,
  },
  rowUnread: {borderLeftWidth: 4, borderLeftColor: Colors.primary},
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  body: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  time: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textDisabled,
    marginTop: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    alignSelf: "center",
  },
});

export default NotificationsScreen;

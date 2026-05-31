import React from "react";
import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {
  useNavigation,
  useRoute,
  RouteProp,
  CommonActions,
} from "@react-navigation/native";
import type {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {Ionicons} from "@expo/vector-icons";

import {
  BorderRadius,
  Colors,
  FontFamily,
  FontSize,
  Spacing,
} from "@/core/theme";
import {formatCurrency} from "@/core/utils/format";
import type {AppStackParamList} from "@/presentation/navigation/types";

type Route = RouteProp<AppStackParamList, "OrderSuccess">;

const OrderSuccessScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const route = useRoute<Route>();
  const {orderId, total} = route.params;

  const goHome = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: "Tabs"}],
      }),
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.icon}>
          <Ionicons name="checkmark" size={56} color={Colors.white} />
        </View>
        <Text style={styles.title}>Order placed!</Text>
        <Text style={styles.subtitle}>
          Your order is confirmed. We'll notify you when it ships.
        </Text>

        <View style={styles.card}>
          <Row label="Order ID" value={orderId} />
          <Row label="Amount" value={formatCurrency(total)} bold />
          <Row label="Estimated delivery" value="2-4 days" />
        </View>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={goHome}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryText}>Back to home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate("Tabs", {screen: "Shop"})}
        >
          <Text style={styles.secondaryText}>Continue shopping</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const Row: React.FC<{label: string; value: string; bold?: boolean}> = ({
  label,
  value,
  bold,
}) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={[styles.rowValue, bold && {color: Colors.primary}]}>
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: Colors.background},
  container: {
    flex: 1,
    padding: Spacing.xxl,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.success,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xxl,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  card: {
    width: "100%",
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    gap: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm,
  },
  rowLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  rowValue: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  primaryBtn: {
    width: "100%",
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryText: {
    color: Colors.white,
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
  },
  secondaryBtn: {marginTop: Spacing.md, padding: Spacing.sm},
  secondaryText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
});

export default OrderSuccessScreen;

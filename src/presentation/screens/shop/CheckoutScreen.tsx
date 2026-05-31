import React, {useMemo, useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useNavigation} from "@react-navigation/native";
import type {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {Ionicons, FontAwesome5} from "@expo/vector-icons";
import Toast from "react-native-toast-message";

import {
  BorderRadius,
  Colors,
  FontFamily,
  FontSize,
  Spacing,
} from "@/core/theme";
import {ScreenHeader} from "@/presentation/components/ScreenHeader";
import {productDisplayPrice, useCartStore} from "@/core/store/cartStore";
import {useSettingsStore} from "@/core/store/settingsStore";
import {formatCurrency} from "@/core/utils/format";
import type {AppStackParamList} from "@/presentation/navigation/types";

const SHIPPING_OPTIONS = [
  {id: "std", label: "Standard (2-4 days)", price: 15000},
  {id: "exp", label: "Express (next day)", price: 35000},
];

const CheckoutScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.totalPrice());
  const clear = useCartStore((s) => s.clear);

  const addresses = useSettingsStore((s) => s.addresses);
  const paymentMethods = useSettingsStore((s) => s.paymentMethods);

  const defaultAddr = useMemo(
    () => addresses.find((a) => a.isDefault) ?? addresses[0],
    [addresses],
  );
  const defaultPm = useMemo(
    () => paymentMethods.find((p) => p.isDefault) ?? paymentMethods[0],
    [paymentMethods],
  );

  const [shippingId, setShippingId] = useState(SHIPPING_OPTIONS[0].id);
  const shipping =
    SHIPPING_OPTIONS.find((s) => s.id === shippingId) ?? SHIPPING_OPTIONS[0];

  const total = subtotal + shipping.price;

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      Toast.show({type: "error", text1: "Cart is empty"});
      return;
    }
    if (!defaultAddr) {
      Toast.show({type: "error", text1: "Add a delivery address"});
      navigation.navigate("AddressForm");
      return;
    }
    if (!defaultPm) {
      Toast.show({type: "error", text1: "Add a payment method"});
      navigation.navigate("PaymentMethods");
      return;
    }
    const orderId = `PTZ-${Date.now().toString().slice(-6)}`;
    clear();
    navigation.replace("OrderSuccess", {orderId, total});
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScreenHeader title="Checkout" onBack={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={{padding: Spacing.xxl, paddingBottom: 140}}
        showsVerticalScrollIndicator={false}
      >
        {/* Delivery */}
        <Text style={styles.section}>Delivery address</Text>
        <View style={styles.card}>
          {defaultAddr ? (
            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={styles.cardTitle}>{defaultAddr.label}</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Addresses")}
                >
                  <Text style={styles.link}>Change</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.cardLine}>
                {defaultAddr.recipient} • {defaultAddr.phone}
              </Text>
              <Text style={styles.cardLine}>
                {defaultAddr.line}, {defaultAddr.city} {defaultAddr.postalCode}
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => navigation.navigate("AddressForm")}
            >
              <Text style={styles.link}>+ Add address</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Items */}
        <Text style={styles.section}>Items ({items.length})</Text>
        <View style={styles.card}>
          {items.map((it) => (
            <View key={it.product.id} style={styles.itemRow}>
              <Image
                source={{uri: it.product.imageUrl}}
                style={styles.itemImg}
              />
              <View style={{flex: 1}}>
                <Text style={styles.itemName} numberOfLines={2}>
                  {it.product.name}
                </Text>
                <Text style={styles.itemQty}>Qty {it.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>
                {formatCurrency(productDisplayPrice(it.product) * it.quantity)}
              </Text>
            </View>
          ))}
        </View>

        {/* Shipping */}
        <Text style={styles.section}>Shipping</Text>
        <View style={styles.card}>
          {SHIPPING_OPTIONS.map((opt) => {
            const active = opt.id === shippingId;
            return (
              <TouchableOpacity
                key={opt.id}
                style={styles.optionRow}
                onPress={() => setShippingId(opt.id)}
                activeOpacity={0.85}
              >
                <Ionicons
                  name={active ? "radio-button-on" : "radio-button-off"}
                  size={20}
                  color={active ? Colors.primary : Colors.textDisabled}
                />
                <Text style={styles.optionLabel}>{opt.label}</Text>
                <Text style={styles.optionPrice}>
                  {formatCurrency(opt.price)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Payment */}
        <Text style={styles.section}>Payment</Text>
        <View style={styles.card}>
          {defaultPm ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: Spacing.md,
              }}
            >
              <View style={styles.pmIcon}>
                <FontAwesome5
                  name={
                    defaultPm.brand === "Visa"
                      ? "cc-visa"
                      : defaultPm.brand === "Mastercard"
                        ? "cc-mastercard"
                        : "wallet"
                  }
                  size={20}
                  color={Colors.primary}
                />
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.cardTitle}>{defaultPm.brand}</Text>
                <Text style={styles.cardLine}>
                  {defaultPm.label} • •••• {defaultPm.last4}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate("PaymentMethods")}
              >
                <Text style={styles.link}>Change</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => navigation.navigate("PaymentMethods")}
            >
              <Text style={styles.link}>+ Add payment method</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Summary */}
        <View style={[styles.card, {marginTop: Spacing.md}]}>
          <SumRow label="Subtotal" value={formatCurrency(subtotal)} />
          <SumRow label="Shipping" value={formatCurrency(shipping.price)} />
          <View style={styles.divider} />
          <SumRow label="Total" value={formatCurrency(total)} bold />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.footerLabel}>Total</Text>
          <Text style={styles.footerTotal}>{formatCurrency(total)}</Text>
        </View>
        <TouchableOpacity
          style={styles.placeBtn}
          onPress={handlePlaceOrder}
          activeOpacity={0.85}
        >
          <Text style={styles.placeText}>Place order</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const SumRow: React.FC<{label: string; value: string; bold?: boolean}> = ({
  label,
  value,
  bold,
}) => (
  <View style={styles.sumRow}>
    <Text style={[styles.sumLabel, bold && {fontFamily: FontFamily.semiBold}]}>
      {label}
    </Text>
    <Text
      style={[
        styles.sumValue,
        bold && {color: Colors.primary, fontFamily: FontFamily.bold},
      ]}
    >
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: Colors.background},
  section: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  cardTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  cardLine: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  link: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  itemImg: {width: 50, height: 50, borderRadius: BorderRadius.lg},
  itemName: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  itemQty: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  itemPrice: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  optionLabel: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  optionPrice: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  pmIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF0F0",
    alignItems: "center",
    justifyContent: "center",
  },
  sumRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  sumLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  sumValue: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  divider: {height: 1, backgroundColor: Colors.border, marginVertical: 6},
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.xxl,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footerLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  footerTotal: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.primary,
  },
  placeBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 14,
    borderRadius: BorderRadius.full,
  },
  placeText: {
    color: Colors.white,
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
  },
});

export default CheckoutScreen;

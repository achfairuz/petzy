import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Ionicons} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";
import type {NativeStackNavigationProp} from "@react-navigation/native-stack";

import {
  BorderRadius,
  Colors,
  FontFamily,
  FontSize,
  Spacing,
} from "@/core/theme";
import {ScreenHeader} from "@/presentation/components/ScreenHeader";
import {EmptyState} from "@/presentation/components/EmptyState";
import {
  useCartStore,
  productDisplayPrice,
  CartItem,
} from "@/core/store/cartStore";
import {formatCurrency} from "@/core/utils/format";
import type {AppStackParamList} from "@/presentation/navigation/types";

const CartScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice());
  const totalItems = useCartStore((s) => s.totalItems());
  const increment = useCartStore((s) => s.increment);
  const decrement = useCartStore((s) => s.decrement);
  const remove = useCartStore((s) => s.remove);

  const handleCheckout = () => {
    navigation.navigate("Checkout");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScreenHeader
        title="My Cart"
        subtitle={items.length > 0 ? `${totalItems} items` : "Nothing here yet"}
        onBack={() => navigation.goBack()}
      />

      {items.length === 0 ? (
        <EmptyState
          icon="bag-outline"
          title="Your cart is empty"
          description="Add some goodies for your pet from the shop."
        />
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.product.id}
            contentContainerStyle={{
              paddingHorizontal: Spacing.xxl,
              paddingVertical: Spacing.md,
              gap: Spacing.md,
              paddingBottom: 160,
            }}
            renderItem={({item}) => (
              <CartRow
                item={item}
                onInc={() => increment(item.product.id)}
                onDec={() => decrement(item.product.id)}
                onRemove={() => remove(item.product.id)}
              />
            )}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.checkoutBar}>
            <View>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(totalPrice)}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={handleCheckout}
              activeOpacity={0.85}
            >
              <Text style={styles.checkoutText}>Checkout</Text>
              <Ionicons name="arrow-forward" size={18} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const CartRow: React.FC<{
  item: CartItem;
  onInc: () => void;
  onDec: () => void;
  onRemove: () => void;
}> = ({item, onInc, onDec, onRemove}) => {
  const price = productDisplayPrice(item.product);
  return (
    <View style={styles.row}>
      <Image source={{uri: item.product.imageUrl}} style={styles.thumb} />
      <View style={{flex: 1}}>
        <Text style={styles.name} numberOfLines={2}>
          {item.product.name}
        </Text>
        <Text style={styles.price}>{formatCurrency(price)}</Text>
        <View style={styles.controls}>
          <TouchableOpacity onPress={onDec} style={styles.qtyBtn}>
            <Ionicons name="remove" size={14} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.qty}>{item.quantity}</Text>
          <TouchableOpacity onPress={onInc} style={styles.qtyBtn}>
            <Ionicons name="add" size={14} color={Colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onRemove} style={styles.removeBtn}>
            <Ionicons name="trash-outline" size={16} color={Colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: Colors.background},
  row: {
    flexDirection: "row",
    gap: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.md,
    elevation: 1,
  },
  thumb: {width: 80, height: 80, borderRadius: BorderRadius.lg},
  name: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  price: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.primary,
    marginTop: 4,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  qty: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    minWidth: 16,
    textAlign: "center",
  },
  removeBtn: {marginLeft: "auto", padding: 4},

  checkoutBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    elevation: 8,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  totalLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  totalValue: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.textPrimary,
  },
  checkoutBtn: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  checkoutText: {
    color: Colors.white,
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
  },
});

export default CartScreen;

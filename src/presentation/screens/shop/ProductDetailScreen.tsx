import React, {useEffect, useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useNavigation, useRoute, RouteProp} from "@react-navigation/native";
import type {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {Ionicons} from "@expo/vector-icons";
import Toast from "react-native-toast-message";

import {
  BorderRadius,
  Colors,
  FontFamily,
  FontSize,
  Spacing,
} from "@/core/theme";
import {Badge} from "@/presentation/components/Badge";
import {productDisplayPrice, useCartStore} from "@/core/store/cartStore";
import {formatCurrency} from "@/core/utils/format";
import {Product} from "@/domain/entities/Product";
import {getProductByIdUseCase} from "@/domain/usecases/ProductUseCases";
import {productRepository} from "@/data/repositories/productRepository";
import type {AppStackParamList} from "@/presentation/navigation/types";

const getProduct = getProductByIdUseCase(productRepository);

type Route = RouteProp<AppStackParamList, "ProductDetail">;

const ProductDetailScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const route = useRoute<Route>();
  const {productId} = route.params;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  const add = useCartStore((s) => s.add);
  const totalItems = useCartStore((s) => s.totalItems());

  useEffect(() => {
    getProduct(productId)
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator color={Colors.primary} style={{marginTop: 80}} />
      </SafeAreaView>
    );
  }
  if (!product) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.empty}>Product not found</Text>
      </SafeAreaView>
    );
  }

  const price = productDisplayPrice(product);

  const handleAdd = () => {
    if (!product.inStock) {
      Toast.show({type: "error", text1: "Out of stock"});
      return;
    }
    for (let i = 0; i < qty; i++) add(product);
    Toast.show({
      type: "success",
      text1: "Added to cart",
      text2: `${qty} × ${product.name}`,
    });
  };

  const handleBuyNow = () => {
    if (!product.inStock) {
      Toast.show({type: "error", text1: "Out of stock"});
      return;
    }
    for (let i = 0; i < qty; i++) add(product);
    navigation.navigate("Checkout");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={{paddingBottom: 140}}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Image source={{uri: product.imageUrl}} style={styles.heroImage} />
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="chevron-back"
              size={22}
              color={Colors.textPrimary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconBtn, {right: 16, left: undefined}]}
            onPress={() => navigation.navigate("Cart")}
          >
            <Ionicons name="bag-outline" size={20} color={Colors.textPrimary} />
            {totalItems > 0 ? (
              <View style={styles.cartDot}>
                <Text style={styles.cartDotText}>{totalItems}</Text>
              </View>
            ) : null}
          </TouchableOpacity>
          {product.discountPercent ? (
            <View style={styles.discountTag}>
              <Text style={styles.discountTagText}>
                -{product.discountPercent}%
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.body}>
          <Text style={styles.category}>{product.category}</Text>
          <Text style={styles.name}>{product.name}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="star" size={14} color="#FFC107" />
              <Text style={styles.metaText}>
                {product.rating} ({product.reviewCount} reviews)
              </Text>
            </View>
            <Badge
              label={product.inStock ? "In stock" : "Out of stock"}
              color={product.inStock ? Colors.success : Colors.error}
              background={product.inStock ? "#E8F5E9" : "#FFEEEE"}
            />
          </View>

          <View style={styles.priceRow}>
            <View>
              <Text style={styles.price}>{formatCurrency(price)}</Text>
              {product.discountPercent ? (
                <Text style={styles.priceOld}>
                  {formatCurrency(product.price)}
                </Text>
              ) : null}
            </View>
            <View style={styles.qtyBox}>
              <TouchableOpacity
                onPress={() => setQty((q) => Math.max(1, q - 1))}
                style={styles.qtyBtn}
              >
                <Ionicons name="remove" size={16} color={Colors.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{qty}</Text>
              <TouchableOpacity
                onPress={() => setQty((q) => q + 1)}
                style={styles.qtyBtn}
              >
                <Ionicons name="add" size={16} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.section}>Description</Text>
          <Text style={styles.desc}>{product.description}</Text>

          <Text style={styles.section}>Highlights</Text>
          <View style={{gap: Spacing.sm}}>
            <Highlight text="Vet-approved formulation" />
            <Highlight text="Free shipping over Rp 200,000" />
            <Highlight text="7-day easy returns" />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.footerBtn, styles.outlineBtn]}
          onPress={handleAdd}
          activeOpacity={0.85}
        >
          <Ionicons name="bag-add-outline" size={18} color={Colors.primary} />
          <Text style={[styles.footerBtnText, {color: Colors.primary}]}>
            Add to cart
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.footerBtn, styles.primaryBtn]}
          onPress={handleBuyNow}
          activeOpacity={0.85}
        >
          <Text style={[styles.footerBtnText, {color: Colors.white}]}>
            Buy now
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const Highlight: React.FC<{text: string}> = ({text}) => (
  <View style={{flexDirection: "row", alignItems: "center", gap: Spacing.sm}}>
    <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
    <Text style={styles.highlightText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: Colors.background},
  empty: {
    textAlign: "center",
    marginTop: 80,
    color: Colors.textSecondary,
    fontFamily: FontFamily.regular,
  },
  hero: {position: "relative", backgroundColor: Colors.white},
  heroImage: {width: "100%", height: 320},
  iconBtn: {
    position: "absolute",
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  cartDot: {
    position: "absolute",
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  cartDotText: {
    color: Colors.white,
    fontFamily: FontFamily.semiBold,
    fontSize: 10,
  },
  discountTag: {
    position: "absolute",
    bottom: 20,
    left: 16,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  discountTagText: {
    color: Colors.white,
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
  },
  body: {
    backgroundColor: Colors.white,
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  category: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.primary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  name: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.textPrimary,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaItem: {flexDirection: "row", alignItems: "center", gap: 4},
  metaText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  price: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.primary,
  },
  priceOld: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textDisabled,
    textDecorationLine: "line-through",
  },
  qtyBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    minWidth: 16,
    textAlign: "center",
  },
  section: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    marginTop: Spacing.sm,
  },
  desc: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  highlightText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    gap: Spacing.md,
    padding: Spacing.xxl,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footerBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: BorderRadius.full,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.sm,
  },
  outlineBtn: {borderWidth: 1.5, borderColor: Colors.primary},
  primaryBtn: {backgroundColor: Colors.primary},
  footerBtnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
  },
});

export default ProductDetailScreen;

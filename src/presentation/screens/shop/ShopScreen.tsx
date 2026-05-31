import React, {useEffect, useMemo, useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Ionicons, Feather} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";
import type {NativeStackNavigationProp} from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";

import {
  BorderRadius,
  Colors,
  FontFamily,
  FontSize,
  Spacing,
  iconSizes,
} from "@/core/theme";
import {ScreenHeader} from "@/presentation/components/ScreenHeader";
import {Product, ProductCategory} from "@/domain/entities/Product";
import {getProductsByCategoryUseCase} from "@/domain/usecases/ProductUseCases";
import {productRepository} from "@/data/repositories/productRepository";
import {useCartStore, productDisplayPrice} from "@/core/store/cartStore";
import {formatCurrency} from "@/core/utils/format";
import type {AppStackParamList} from "@/presentation/navigation/types";

const getProducts = getProductsByCategoryUseCase(productRepository);

const CATEGORIES: Array<{key: ProductCategory | "All"; label: string}> = [
  {key: "All", label: "All"},
  {key: "Food", label: "Food"},
  {key: "Toys", label: "Toys"},
  {key: "Health", label: "Health"},
  {key: "Accessories", label: "Accessories"},
  {key: "Grooming", label: "Grooming"},
];

const ShopScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const [category, setCategory] = useState<ProductCategory | "All">("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const totalItems = useCartStore((s) => s.totalItems());
  const addToCart = useCartStore((s) => s.add);

  useEffect(() => {
    setLoading(true);
    getProducts(category)
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [category]);

  const filtered = useMemo(
    () =>
      query
        ? products.filter((p) =>
            p.name.toLowerCase().includes(query.toLowerCase()),
          )
        : products,
    [products, query],
  );

  const handleAdd = (product: Product) => {
    if (!product.inStock) {
      Toast.show({type: "error", text1: "Out of stock"});
      return;
    }
    addToCart(product);
    Toast.show({
      type: "success",
      text1: "Added to cart",
      text2: product.name,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScreenHeader
        title="Shop"
        subtitle="Goodies for your buddy"
        right={
          <TouchableOpacity
            style={styles.cartBtn}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Cart")}
          >
            <Feather
              name="shopping-bag"
              size={iconSizes.medium}
              color={Colors.textPrimary}
            />
            {totalItems > 0 ? (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{totalItems}</Text>
              </View>
            ) : null}
          </TouchableOpacity>
        }
      />

      {/* Search */}
      <View style={styles.searchWrap}>
        <Feather name="search" size={18} color={Colors.textSecondary} />
        <Text
          style={styles.searchInput}
          onPress={() => {
            /* keep simple — read-only placeholder */
          }}
        >
          Search products
        </Text>
        <TouchableOpacity>
          <Feather name="sliders" size={18} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
        style={{flexGrow: 0}}
      >
        {CATEGORIES.map((c) => {
          const active = c.key === category;
          return (
            <TouchableOpacity
              key={c.key}
              onPress={() => setCategory(c.key)}
              activeOpacity={0.85}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {c.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{marginTop: 60}} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{gap: Spacing.md, paddingHorizontal: Spacing.xxl}}
          contentContainerStyle={{
            gap: Spacing.md,
            paddingBottom: 140,
            paddingTop: Spacing.sm,
          }}
          renderItem={({item}) => (
            <ProductCard
              product={item}
              onAdd={() => handleAdd(item)}
              onPress={() =>
                navigation.navigate("ProductDetail", {productId: item.id})
              }
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const ProductCard: React.FC<{
  product: Product;
  onAdd: () => void;
  onPress: () => void;
}> = ({product, onAdd, onPress}) => {
  const displayPrice = productDisplayPrice(product);
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.productCard}
    >
      <View style={styles.productImageWrap}>
        <Image source={{uri: product.imageUrl}} style={styles.productImage} />
        {product.discountPercent ? (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{product.discountPercent}%</Text>
          </View>
        ) : null}
        {!product.inStock ? (
          <View style={styles.oosOverlay}>
            <Text style={styles.oosText}>Out of stock</Text>
          </View>
        ) : null}
      </View>
      <View style={{padding: Spacing.md, gap: 4}}>
        <Text style={styles.productCategory}>{product.category}</Text>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={12} color="#FFC107" />
          <Text style={styles.ratingText}>
            {product.rating} ({product.reviewCount})
          </Text>
        </View>
        <View style={styles.priceRow}>
          <View>
            <Text style={styles.price}>{formatCurrency(displayPrice)}</Text>
            {product.discountPercent ? (
              <Text style={styles.priceOld}>
                {formatCurrency(product.price)}
              </Text>
            ) : null}
          </View>
          <TouchableOpacity
            style={[styles.addBtn, !product.inStock && {opacity: 0.4}]}
            onPress={onAdd}
            disabled={!product.inStock}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: Colors.background},
  cartBtn: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  cartBadge: {
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
  cartBadgeText: {
    color: Colors.white,
    fontFamily: FontFamily.semiBold,
    fontSize: 10,
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginHorizontal: Spacing.xxl,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.lg,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.textDisabled,
  },
  chipRow: {
    paddingHorizontal: Spacing.xxl,
    gap: Spacing.sm,
    paddingBottom: Spacing.lg,
  },
  chip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  chipTextActive: {color: Colors.white},

  productCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xxl,
    overflow: "hidden",
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  productImageWrap: {position: "relative"},
  productImage: {width: "100%", height: 130},
  discountBadge: {
    position: "absolute",
    top: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  discountText: {
    color: Colors.white,
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
  },
  oosOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  oosText: {
    color: Colors.white,
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
  },
  productCategory: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  productName: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    minHeight: 36,
  },
  ratingRow: {flexDirection: "row", alignItems: "center", gap: 4},
  ratingText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: Spacing.sm,
  },
  price: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.primary,
  },
  priceOld: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textDisabled,
    textDecorationLine: "line-through",
  },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ShopScreen;

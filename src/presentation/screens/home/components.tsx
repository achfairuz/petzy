import {Colors, iconSizes, Spacing, Typography} from "@/core/theme";
import {
  AntDesign,
  Feather,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {useNavigation} from "@react-navigation/native";
import type {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {HomeStyles} from "./home.styles";
import {FeatureCard} from "@/presentation/components/FeaturedCard";
import {CATEGORIES, FEATURED_PETS, PET_CARE, TIPS} from "@/core/data/dummy";
import {PetCareCard} from "@/presentation/components/PetcareCard";
import {useAuthStore} from "@/core/store/authStore";
import type {AppStackParamList} from "@/presentation/navigation/types";

type Nav = NativeStackNavigationProp<AppStackParamList>;

export function HeaderHome() {
  const navigation = useNavigation<Nav>();
  const user = useAuthStore((s) => s.user);
  return (
    <View style={styles.container}>
      <View style={styles.headerLeft}>
        <Image
          source={{
            uri: user?.avatarUrl ?? "https://i.pravatar.cc/100?img=68",
          }}
          style={styles.logo}
        />
        <View style={styles.containerText}>
          <Text style={styles.title}>Hello, {user?.name ?? "Friend"}</Text>
          <Text style={styles.subtitle}>Your pet's best friend</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.notificationButton}
        onPress={() => navigation.navigate("Notifications")}
        activeOpacity={0.8}
      >
        <AntDesign name="bell" size={iconSizes.medium} color={Colors.black} />
        <View style={styles.notifDot} />
      </TouchableOpacity>
    </View>
  );
}

export function HomeSearch() {
  return (
    <View style={HomeStyles.searchContainer}>
      <TouchableOpacity style={HomeStyles.searchBar} activeOpacity={0.7}>
        <Feather
          name="search"
          size={iconSizes.small}
          color={Colors.textSecondary}
        />
        <Text style={HomeStyles.searchPlaceholder}>Search...</Text>
      </TouchableOpacity>
      <TouchableOpacity style={HomeStyles.filterBtn} activeOpacity={0.7}>
        <Feather name="sliders" size={iconSizes.medium} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
}

export function HomeBanner() {
  const navigation = useNavigation<Nav>();
  return (
    <View style={HomeStyles.heroBanner}>
      <View style={HomeStyles.heroContent}>
        <View style={HomeStyles.heroBadge}>
          <Text style={HomeStyles.heroBadgeText}>Special Offer</Text>
        </View>
        <Text style={HomeStyles.heroTitle}>Care for Your{"\n"}Beloved Pet</Text>
        <Text style={HomeStyles.heroSubtitle}>
          Get 20% off on first vet consultation
        </Text>
        <TouchableOpacity
          style={HomeStyles.heroBtn}
          onPress={() => navigation.navigate("BookAppointment")}
          activeOpacity={0.85}
        >
          <Text style={HomeStyles.heroBtnText}>Book Now</Text>
          <AntDesign name="arrow-right" size={14} color={Colors.white} />
        </TouchableOpacity>
      </View>
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=300&q=80",
        }}
        style={HomeStyles.heroImage}
        resizeMode="cover"
      />
    </View>
  );
}

export function HomeCategories() {
  return (
    <View style={HomeStyles.categoryRow}>
      {CATEGORIES.map((cat) => (
        <TouchableOpacity
          key={cat.id}
          style={HomeStyles.categoryCard}
          activeOpacity={0.8}
        >
          <View style={[HomeStyles.categoryIcon, {backgroundColor: cat.color}]}>
            <MaterialCommunityIcons
              name={cat.icon as any}
              size={iconSizes.medium}
              color={cat.iconColor}
            />
          </View>
          <Text style={HomeStyles.categoryLabel}>{cat.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export function HeaderContent({
  title,
  onPress,
}: {
  title: string;
  onPress?: () => void;
}) {
  return (
    <View style={HomeStyles.sectionHeader}>
      <Text style={HomeStyles.sectionTitle}>{title}</Text>
      {onPress ? (
        <TouchableOpacity onPress={onPress}>
          <Text style={HomeStyles.seeAll}>See all</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export function HomeServices() {
  const navigation = useNavigation<Nav>();
  return (
    <View style={styles.containerServices}>
      <View style={styles.leftColumn}>
        <FeatureCard
          title="Daycare"
          icon="home-outline"
          bgColor="#FFE6D9"
          iconColor="#EA5E10"
          large
          onPress={() => navigation.navigate("BookAppointment")}
        />
        <View style={{height: 16}} />
        <FeatureCard
          title="Tracking"
          icon="location-outline"
          bgColor="#FCD9D9"
          iconColor="#C03838"
          onPress={() => navigation.navigate("MyPets")}
        />
      </View>

      <View style={styles.rightColumn}>
        <FeatureCard
          title="Health"
          icon="medkit-outline"
          bgColor="#DEF6D8"
          iconColor="#2DA010"
          onPress={() => navigation.navigate("Tabs", {screen: "Health"})}
        />
        <View style={{height: 16}} />
        <FeatureCard
          title="Grooming"
          icon="paw-outline"
          bgColor="#E1D8FC"
          iconColor="#512EB7"
          large
          onPress={() => navigation.navigate("BookAppointment")}
        />
      </View>
    </View>
  );
}

export function HomeFeaturedPets() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={HomeStyles.horizontalList}
    >
      {FEATURED_PETS.map((pet) => (
        <View key={pet.id} style={{position: "relative"}}>
          <TouchableOpacity style={HomeStyles.petCard} activeOpacity={0.85}>
            <Image
              source={{uri: pet.image}}
              style={HomeStyles.petImage}
              resizeMode="cover"
            />
            <View style={HomeStyles.petInfo}>
              <View style={HomeStyles.petTag}>
                <Text style={HomeStyles.petTagText}>{pet.tag}</Text>
              </View>
              <Text style={HomeStyles.petName}>{pet.name}</Text>
              <View style={HomeStyles.petMeta}>
                <FontAwesome5
                  name="birthday-cake"
                  size={10}
                  color={Colors.textSecondary}
                />
                <Text style={HomeStyles.petAge}>{pet.age}</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={HomeStyles.petFav}>
            <AntDesign name="heart" size={14} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

export function HomePetCareTips() {
  return (
    <View style={HomeStyles.tipsContainer}>
      {TIPS.map((tip) => (
        <TouchableOpacity
          key={tip.id}
          style={HomeStyles.tipCard}
          activeOpacity={0.85}
        >
          <Image
            source={{uri: tip.image}}
            style={HomeStyles.tipImage}
            resizeMode="cover"
          />
          <View style={HomeStyles.tipBody}>
            <Text style={HomeStyles.tipTitle}>{tip.title}</Text>
            <Text style={HomeStyles.tipDesc} numberOfLines={2}>
              {tip.description}
            </Text>
            <View style={HomeStyles.tipReadMore}>
              <Text style={HomeStyles.tipReadMoreText}>Read more</Text>
              <AntDesign name="arrow-right" size={12} color={Colors.primary} />
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function PetCareList() {
  return (
    <View style={styles.petrCareContainer}>
      <FlatList
        data={PET_CARE}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({item}) => (
          <PetCareCard
            title={item.title}
            distance={item.distance}
            reviews={item.reviews}
            image={item.image}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginTop: 16,
    marginBottom: 12,
  },
  headerLeft: {flexDirection: "row", alignItems: "center"},
  logo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  containerText: {flexDirection: "column", marginLeft: 12},
  title: {...Typography.bodyMedium, color: Colors.textPrimary},
  subtitle: {...Typography.caption, color: Colors.textSecondary},
  notificationButton: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: Colors.white,
    elevation: 3,
  },
  notifDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  containerServices: {
    flexDirection: "row",
    gap: 16,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  leftColumn: {flex: 1},
  rightColumn: {flex: 1},
  petrCareContainer: {marginHorizontal: Spacing.xxl},
});

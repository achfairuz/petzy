import React, {useEffect, useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useNavigation, useRoute, RouteProp} from "@react-navigation/native";
import type {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";

import {
  BorderRadius,
  Colors,
  FontFamily,
  FontSize,
  Spacing,
} from "@/core/theme";
import {Badge} from "@/presentation/components/Badge";
import {Vet} from "@/domain/entities/Vet";
import {getVetByIdUseCase} from "@/domain/usecases/VetUseCases";
import {vetRepository} from "@/data/repositories/vetRepository";
import {formatCurrency} from "@/core/utils/format";
import type {AppStackParamList} from "@/presentation/navigation/types";

const getVet = getVetByIdUseCase(vetRepository);

type Route = RouteProp<AppStackParamList, "VetDetail">;

const VetDetailScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const route = useRoute<Route>();
  const {vetId} = route.params;

  const [vet, setVet] = useState<Vet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVet(vetId)
      .then(setVet)
      .finally(() => setLoading(false));
  }, [vetId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator color={Colors.primary} style={{marginTop: 80}} />
      </SafeAreaView>
    );
  }
  if (!vet) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.empty}>Vet not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={{paddingBottom: 140}}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="chevron-back"
              size={22}
              color={Colors.textPrimary}
            />
          </TouchableOpacity>
          <Image source={{uri: vet.avatarUrl}} style={styles.avatar} />
          <Text style={styles.name}>{vet.name}</Text>
          <Text style={styles.spec}>
            {vet.specialty} • {vet.clinic}
          </Text>
          <Badge
            label={vet.availableToday ? "Available today" : "Booked today"}
            color={vet.availableToday ? Colors.success : Colors.warning}
            background={vet.availableToday ? "#E8F5E9" : "#FFF7E0"}
          />
        </View>

        <View style={styles.statsRow}>
          <Stat
            icon="star"
            value={`${vet.rating}`}
            label={`${vet.reviewCount} reviews`}
            color="#FFC107"
          />
          <Stat
            icon="map-marker"
            value={`${vet.distanceKm} km`}
            label="Distance"
            color={Colors.primary}
          />
          <Stat
            icon="cash"
            value={formatCurrency(vet.pricePerVisit)}
            label="Per visit"
            color={Colors.success}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.body}>
            {vet.name} is a board-certified {vet.specialty.toLowerCase()}{" "}
            specialist with years of experience caring for pets at {vet.clinic}.
            Known for a gentle approach and clear communication with pet
            parents.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Services</Text>
          <View style={{gap: Spacing.sm}}>
            <ServiceRow label="General checkup" price={vet.pricePerVisit} />
            <ServiceRow
              label="Vaccination"
              price={Math.round(vet.pricePerVisit * 1.2)}
            />
            <ServiceRow
              label="Surgery consultation"
              price={Math.round(vet.pricePerVisit * 2)}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Working hours</Text>
          <Hours day="Mon - Fri" hours="09:00 - 18:00" />
          <Hours day="Saturday" hours="10:00 - 15:00" />
          <Hours day="Sunday" hours="Closed" />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.footerLabel}>From</Text>
          <Text style={styles.footerPrice}>
            {formatCurrency(vet.pricePerVisit)}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.bookBtn}
          onPress={() =>
            navigation.navigate("BookAppointment", {vetId: vet.id})
          }
          activeOpacity={0.85}
        >
          <Text style={styles.bookText}>Book appointment</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const Stat: React.FC<{
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  value: string;
  label: string;
  color: string;
}> = ({icon, value, label, color}) => (
  <View style={styles.statCard}>
    <MaterialCommunityIcons name={icon} size={20} color={color} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const ServiceRow: React.FC<{label: string; price: number}> = ({
  label,
  price,
}) => (
  <View style={styles.serviceRow}>
    <Text style={styles.serviceLabel}>{label}</Text>
    <Text style={styles.servicePrice}>{formatCurrency(price)}</Text>
  </View>
);

const Hours: React.FC<{day: string; hours: string}> = ({day, hours}) => (
  <View style={styles.hoursRow}>
    <Text style={styles.serviceLabel}>{day}</Text>
    <Text style={styles.serviceLabel}>{hours}</Text>
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
  hero: {
    backgroundColor: Colors.white,
    alignItems: "center",
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xl,
    borderBottomLeftRadius: BorderRadius.xxl,
    borderBottomRightRadius: BorderRadius.xxl,
    gap: 6,
  },
  backBtn: {
    position: "absolute",
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: Colors.primary,
    marginBottom: Spacing.md,
  },
  name: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.textPrimary,
  },
  spec: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  statsRow: {
    flexDirection: "row",
    marginHorizontal: Spacing.xxl,
    marginTop: -20,
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    alignItems: "center",
    gap: 2,
    elevation: 2,
  },
  statValue: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  statLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  section: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xxl,
    margin: Spacing.xxl,
    marginBottom: 0,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  body: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  serviceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  hoursRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm,
  },
  serviceLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  servicePrice: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
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
  footerPrice: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.primary,
  },
  bookBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 14,
    borderRadius: BorderRadius.full,
  },
  bookText: {
    color: Colors.white,
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
  },
});

export default VetDetailScreen;

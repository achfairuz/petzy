import React, {useEffect, useState} from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useNavigation} from "@react-navigation/native";
import type {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";

import {
  BorderRadius,
  Colors,
  FontFamily,
  FontSize,
  Spacing,
  iconSizes,
} from "@/core/theme";
import {ScreenHeader} from "@/presentation/components/ScreenHeader";
import {Section} from "@/presentation/components/Section";
import {Badge} from "@/presentation/components/Badge";
import {EmptyState} from "@/presentation/components/EmptyState";
import {formatCurrency, formatDateTime} from "@/core/utils/format";

import {Pet} from "@/domain/entities/Pet";
import {Vet} from "@/domain/entities/Vet";
import {Appointment} from "@/domain/entities/Appointment";

import {getMyPetsUseCase} from "@/domain/usecases/PetUseCases";
import {getVetsUseCase} from "@/domain/usecases/VetUseCases";
import {getUpcomingAppointmentsUseCase} from "@/domain/usecases/AppointmentUseCases";

import {petRepository} from "@/data/repositories/petRepository";
import {vetRepository} from "@/data/repositories/vetRepository";
import {appointmentRepository} from "@/data/repositories/appointmentRepository";
import type {AppStackParamList} from "@/presentation/navigation/types";

const getMyPets = getMyPetsUseCase(petRepository);
const getVets = getVetsUseCase(vetRepository);
const getAppointments = getUpcomingAppointmentsUseCase(appointmentRepository);

const HealthScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const [pets, setPets] = useState<Pet[]>([]);
  const [vets, setVets] = useState<Vet[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMyPets(), getVets(), getAppointments()])
      .then(([p, v, a]) => {
        setPets(p);
        setVets(v);
        setAppointments(a);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ActivityIndicator color={Colors.primary} style={{marginTop: 80}} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 120}}
      >
        <ScreenHeader
          title="Pet Health"
          subtitle="Keep your buddies happy & well"
        />

        {/* Quick actions */}
        <View style={styles.quickRow}>
          <QuickAction
            icon="calendar-outline"
            label="Book Vet"
            color="#EA5E10"
            bg="#FFE6D9"
            onPress={() => navigation.navigate("BookAppointment")}
          />
          <QuickAction
            icon="medkit-outline"
            label="Vaccines"
            color="#2DA010"
            bg="#DEF6D8"
            onPress={() => navigation.navigate("Appointments")}
          />
          <QuickAction
            icon="paw-outline"
            label="My Pets"
            color="#512EB7"
            bg="#E1D8FC"
            onPress={() => navigation.navigate("MyPets")}
          />
          <QuickAction
            icon="pulse-outline"
            label="Records"
            color="#C03838"
            bg="#FCD9D9"
            onPress={() => navigation.navigate("Appointments")}
          />
        </View>

        {/* Upcoming */}
        <Section
          title="Upcoming Appointments"
          action={
            appointments.length > 0 ? (
              <Text style={styles.count}>{appointments.length}</Text>
            ) : null
          }
        >
          {appointments.length === 0 ? (
            <EmptyState
              icon="calendar-outline"
              title="No appointments yet"
              description="Book a checkup to keep your pet healthy."
            />
          ) : (
            <View style={{paddingHorizontal: Spacing.xxl, gap: Spacing.md}}>
              {appointments.map((a) => (
                <TouchableOpacity
                  key={a.id}
                  activeOpacity={0.85}
                  onPress={() =>
                    navigation.navigate("AppointmentDetail", {
                      appointmentId: a.id,
                    })
                  }
                >
                  <AppointmentCard appointment={a} />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </Section>

        {/* My pets vitals */}
        <Section
          title="My Pets"
          action={
            <TouchableOpacity onPress={() => navigation.navigate("MyPets")}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          }
        >
          <FlatList
            horizontal
            data={pets}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: Spacing.xxl,
              gap: Spacing.md,
            }}
            renderItem={({item}) => (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() =>
                  navigation.navigate("PetDetail", {petId: item.id})
                }
              >
                <PetVitalCard pet={item} />
              </TouchableOpacity>
            )}
          />
        </Section>

        {/* Recommended vets */}
        <Section
          title="Top Vets Nearby"
          action={
            <TouchableOpacity
              onPress={() => navigation.navigate("Appointments")}
            >
              <Text style={styles.seeAll}>My visits</Text>
            </TouchableOpacity>
          }
        >
          <View style={{paddingHorizontal: Spacing.xxl, gap: Spacing.md}}>
            {vets.map((v) => (
              <VetCard
                key={v.id}
                vet={v}
                onBook={() =>
                  navigation.navigate("BookAppointment", {vetId: v.id})
                }
                onPress={() => navigation.navigate("VetDetail", {vetId: v.id})}
              />
            ))}
          </View>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
};

const QuickAction: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  bg: string;
  onPress?: () => void;
}> = ({icon, label, color, bg, onPress}) => (
  <TouchableOpacity
    activeOpacity={0.8}
    style={styles.quickItem}
    onPress={onPress}
  >
    <View style={[styles.quickIcon, {backgroundColor: bg}]}>
      <Ionicons name={icon} size={iconSizes.medium} color={color} />
    </View>
    <Text style={styles.quickLabel}>{label}</Text>
  </TouchableOpacity>
);

const AppointmentCard: React.FC<{appointment: Appointment}> = ({
  appointment,
}) => (
  <View style={styles.apptCard}>
    <Image source={{uri: appointment.petImage}} style={styles.apptAvatar} />
    <View style={{flex: 1}}>
      <View style={styles.apptHeader}>
        <Text style={styles.apptPet}>{appointment.petName}</Text>
        <Badge label={appointment.serviceType} />
      </View>
      <Text style={styles.apptVet}>
        {appointment.vetName} • {appointment.clinic}
      </Text>
      <View style={styles.apptMeta}>
        <Ionicons name="time-outline" size={14} color={Colors.primary} />
        <Text style={styles.apptDate}>
          {formatDateTime(appointment.dateISO)}
        </Text>
      </View>
    </View>
  </View>
);

const PetVitalCard: React.FC<{pet: Pet}> = ({pet}) => (
  <View style={styles.vitalCard}>
    <Image source={{uri: pet.imageUrl}} style={styles.vitalImage} />
    <View style={{padding: Spacing.md, gap: 4}}>
      <Text style={styles.vitalName}>{pet.name}</Text>
      <Text style={styles.vitalBreed}>{pet.breed}</Text>
      <View style={styles.vitalStats}>
        <View style={styles.vitalStat}>
          <MaterialCommunityIcons
            name="weight-kilogram"
            size={14}
            color={Colors.textSecondary}
          />
          <Text style={styles.vitalStatText}>{pet.weightKg} kg</Text>
        </View>
        <View style={styles.vitalStat}>
          <Ionicons
            name="calendar-outline"
            size={14}
            color={Colors.textSecondary}
          />
          <Text style={styles.vitalStatText}>{pet.age}</Text>
        </View>
      </View>
      <Badge
        label={pet.vaccinated ? "Vaccinated" : "Vaccine due"}
        color={pet.vaccinated ? Colors.success : Colors.warning}
        background={pet.vaccinated ? "#E8F5E9" : "#FFF7E0"}
      />
    </View>
  </View>
);

const VetCard: React.FC<{
  vet: Vet;
  onBook: () => void;
  onPress: () => void;
}> = ({vet, onBook, onPress}) => (
  <TouchableOpacity
    style={styles.vetCard}
    activeOpacity={0.85}
    onPress={onPress}
  >
    <Image source={{uri: vet.avatarUrl}} style={styles.vetAvatar} />
    <View style={{flex: 1}}>
      <Text style={styles.vetName}>{vet.name}</Text>
      <Text style={styles.vetSpec}>
        {vet.specialty} • {vet.clinic}
      </Text>
      <View style={styles.vetMetaRow}>
        <View style={styles.vetMeta}>
          <Ionicons name="star" size={12} color="#FFC107" />
          <Text style={styles.vetMetaText}>
            {vet.rating} ({vet.reviewCount})
          </Text>
        </View>
        <View style={styles.vetMeta}>
          <Ionicons
            name="location-outline"
            size={12}
            color={Colors.textSecondary}
          />
          <Text style={styles.vetMetaText}>{vet.distanceKm} km</Text>
        </View>
      </View>
      <Text style={styles.vetPrice}>{formatCurrency(vet.pricePerVisit)}</Text>
    </View>
    <TouchableOpacity
      style={styles.vetBookBtn}
      onPress={onBook}
      activeOpacity={0.85}
    >
      <Text style={styles.vetBookText}>Book</Text>
    </TouchableOpacity>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: Colors.background},
  count: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    color: Colors.primary,
    backgroundColor: "#FFF0F0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    overflow: "hidden",
  },
  seeAll: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
  quickRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.xxl,
    marginBottom: Spacing.xl,
  },
  quickItem: {alignItems: "center", gap: Spacing.sm, flex: 1},
  quickIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  quickLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.textPrimary,
  },

  apptCard: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.md,
    gap: Spacing.md,
    alignItems: "center",
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  apptAvatar: {width: 56, height: 56, borderRadius: BorderRadius.xl},
  apptHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  apptPet: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  apptVet: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  apptMeta: {flexDirection: "row", alignItems: "center", gap: 4},
  apptDate: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.primary,
  },

  vitalCard: {
    width: 180,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xxl,
    overflow: "hidden",
    elevation: 2,
  },
  vitalImage: {width: "100%", height: 110},
  vitalName: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  vitalBreed: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  vitalStats: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: 4,
    marginBottom: 6,
  },
  vitalStat: {flexDirection: "row", alignItems: "center", gap: 4},
  vitalStatText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },

  vetCard: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.md,
    gap: Spacing.md,
    alignItems: "center",
    elevation: 2,
  },
  vetAvatar: {width: 64, height: 64, borderRadius: BorderRadius.full},
  vetName: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  vetSpec: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  vetMetaRow: {flexDirection: "row", gap: Spacing.md, marginTop: 4},
  vetMeta: {flexDirection: "row", alignItems: "center", gap: 3},
  vetMetaText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  vetPrice: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.primary,
    marginTop: 4,
  },
  vetBookBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  vetBookText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.white,
  },
});

export default HealthScreen;

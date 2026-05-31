import React, {useEffect, useMemo, useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Ionicons} from "@expo/vector-icons";
import {useNavigation, useRoute, RouteProp} from "@react-navigation/native";
import Toast from "react-native-toast-message";

import {
  BorderRadius,
  Colors,
  FontFamily,
  FontSize,
  Spacing,
} from "@/core/theme";
import {ScreenHeader} from "@/presentation/components/ScreenHeader";

import {Vet} from "@/domain/entities/Vet";
import {Pet} from "@/domain/entities/Pet";
import {Appointment} from "@/domain/entities/Appointment";

import {getVetsUseCase} from "@/domain/usecases/VetUseCases";
import {getMyPetsUseCase} from "@/domain/usecases/PetUseCases";
import {bookAppointmentUseCase} from "@/domain/usecases/AppointmentUseCases";

import {vetRepository} from "@/data/repositories/vetRepository";
import {petRepository} from "@/data/repositories/petRepository";
import {appointmentRepository} from "@/data/repositories/appointmentRepository";

import type {AppStackParamList} from "@/presentation/navigation/types";
import {formatCurrency} from "@/core/utils/format";

const getVets = getVetsUseCase(vetRepository);
const getMyPets = getMyPetsUseCase(petRepository);
const bookAppointment = bookAppointmentUseCase(appointmentRepository);

const SERVICES: Appointment["serviceType"][] = [
  "Checkup",
  "Vaccination",
  "Grooming",
  "Surgery",
];

const SLOTS = ["09:00", "10:30", "13:00", "15:30", "17:00"];

const BookAppointmentScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<AppStackParamList, "BookAppointment">>();
  const initialVetId = route.params?.vetId;

  const [vets, setVets] = useState<Vet[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [vetId, setVetId] = useState<string | undefined>(initialVetId);
  const [petId, setPetId] = useState<string>();
  const [service, setService] = useState<Appointment["serviceType"]>("Checkup");
  const [slot, setSlot] = useState<string>(SLOTS[1]);

  useEffect(() => {
    Promise.all([getVets(), getMyPets()])
      .then(([v, p]) => {
        setVets(v);
        setPets(p);
        if (!vetId && v[0]) setVetId(v[0].id);
        if (p[0]) setPetId(p[0].id);
      })
      .finally(() => setLoading(false));
  }, []);

  const selectedVet = useMemo(
    () => vets.find((v) => v.id === vetId),
    [vets, vetId],
  );
  const selectedPet = useMemo(
    () => pets.find((p) => p.id === petId),
    [pets, petId],
  );

  const handleBook = async () => {
    if (!selectedVet || !selectedPet) return;
    setSubmitting(true);
    try {
      const [hour, minute] = slot.split(":").map(Number);
      const date = new Date();
      date.setDate(date.getDate() + 1);
      date.setHours(hour, minute, 0, 0);

      await bookAppointment({
        petName: selectedPet.name,
        petImage: selectedPet.imageUrl,
        vetName: selectedVet.name,
        clinic: selectedVet.clinic,
        serviceType: service,
        dateISO: date.toISOString(),
      });

      Toast.show({
        type: "success",
        text1: "Appointment booked",
        text2: `${service} with ${selectedVet.name} on ${slot}`,
      });
      navigation.goBack();
    } catch (e: any) {
      Toast.show({type: "error", text1: "Booking failed", text2: e?.message});
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ActivityIndicator color={Colors.primary} style={{marginTop: 80}} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScreenHeader
        title="Book Appointment"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={{
          padding: Spacing.xxl,
          paddingBottom: 160,
          gap: Spacing.xl,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Pet selection */}
        <View>
          <Text style={styles.label}>Choose a pet</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{flexDirection: "row", gap: Spacing.md}}>
              {pets.map((p) => {
                const active = p.id === petId;
                return (
                  <TouchableOpacity
                    key={p.id}
                    style={[styles.petChip, active && styles.petChipActive]}
                    onPress={() => setPetId(p.id)}
                  >
                    <Image
                      source={{uri: p.imageUrl}}
                      style={styles.petAvatar}
                    />
                    <Text
                      style={[
                        styles.petName,
                        active && {color: Colors.primary},
                      ]}
                    >
                      {p.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Service */}
        <View>
          <Text style={styles.label}>Service</Text>
          <View style={styles.row}>
            {SERVICES.map((s) => {
              const active = s === service;
              return (
                <TouchableOpacity
                  key={s}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => setService(s)}
                >
                  <Text
                    style={[styles.chipText, active && styles.chipTextActive]}
                  >
                    {s}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Vet */}
        <View>
          <Text style={styles.label}>Vet</Text>
          <View style={{gap: Spacing.sm}}>
            {vets.map((v) => {
              const active = v.id === vetId;
              return (
                <TouchableOpacity
                  key={v.id}
                  style={[styles.vetCard, active && styles.vetCardActive]}
                  onPress={() => setVetId(v.id)}
                >
                  <Image source={{uri: v.avatarUrl}} style={styles.vetAvatar} />
                  <View style={{flex: 1}}>
                    <Text style={styles.vetName}>{v.name}</Text>
                    <Text style={styles.vetSpec}>
                      {v.specialty} • {v.clinic}
                    </Text>
                    <Text style={styles.vetPrice}>
                      {formatCurrency(v.pricePerVisit)}
                    </Text>
                  </View>
                  {active ? (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={Colors.primary}
                    />
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Slot */}
        <View>
          <Text style={styles.label}>Tomorrow's available slots</Text>
          <View style={styles.row}>
            {SLOTS.map((s) => {
              const active = s === slot;
              return (
                <TouchableOpacity
                  key={s}
                  style={[styles.slot, active && styles.slotActive]}
                  onPress={() => setSlot(s)}
                >
                  <Text
                    style={[styles.slotText, active && styles.slotTextActive]}
                  >
                    {s}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.bookBtn}
          onPress={handleBook}
          disabled={submitting}
          activeOpacity={0.85}
        >
          {submitting ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.bookText}>Confirm booking</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: Colors.background},
  label: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  row: {flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm},

  petChip: {
    alignItems: "center",
    gap: 6,
    padding: Spacing.sm,
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    width: 80,
  },
  petChipActive: {borderColor: Colors.primary},
  petAvatar: {width: 50, height: 50, borderRadius: 25},
  petName: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },

  chip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {backgroundColor: Colors.primary, borderColor: Colors.primary},
  chipText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  chipTextActive: {color: Colors.white},

  vetCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.xxl,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  vetCardActive: {borderColor: Colors.primary},
  vetAvatar: {width: 56, height: 56, borderRadius: 28},
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
  vetPrice: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.primary,
    marginTop: 2,
  },

  slot: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  slotActive: {backgroundColor: Colors.primary, borderColor: Colors.primary},
  slotText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  slotTextActive: {color: Colors.white},

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    elevation: 8,
  },
  bookBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.full,
    alignItems: "center",
  },
  bookText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.white,
  },
});

export default BookAppointmentScreen;

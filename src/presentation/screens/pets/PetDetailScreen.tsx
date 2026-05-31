import React, {useEffect, useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useNavigation, useRoute, RouteProp} from "@react-navigation/native";
import type {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import Toast from "react-native-toast-message";

import {
  BorderRadius,
  Colors,
  FontFamily,
  FontSize,
  Spacing,
} from "@/core/theme";
import {Badge} from "@/presentation/components/Badge";
import {Pet} from "@/domain/entities/Pet";
import {usePetsStore} from "@/core/store/petsStore";
import {getPetByIdUseCase} from "@/domain/usecases/PetUseCases";
import {petRepository} from "@/data/repositories/petRepository";
import type {AppStackParamList} from "@/presentation/navigation/types";

const getPet = getPetByIdUseCase(petRepository);

type DetailRoute = RouteProp<AppStackParamList, "PetDetail">;

const PetDetailScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const route = useRoute<DetailRoute>();
  const {petId} = route.params;

  const storePet = usePetsStore((s) => s.getById(petId));
  const removePet = usePetsStore((s) => s.remove);

  const [pet, setPet] = useState<Pet | null>(storePet ?? null);
  const [loading, setLoading] = useState(!storePet);

  useEffect(() => {
    if (storePet) {
      setPet(storePet);
      setLoading(false);
      return;
    }
    getPet(petId)
      .then((p) => setPet(p))
      .finally(() => setLoading(false));
  }, [petId, storePet]);

  const handleDelete = () => {
    if (!pet) return;
    Alert.alert("Remove pet", `Remove ${pet.name} from your pack?`, [
      {text: "Cancel", style: "cancel"},
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          await removePet(pet.id);
          Toast.show({type: "success", text1: "Pet removed"});
          navigation.goBack();
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator color={Colors.primary} style={{marginTop: 80}} />
      </SafeAreaView>
    );
  }

  if (!pet) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.notFound}>Pet not found</Text>
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
          <Image source={{uri: pet.imageUrl}} style={styles.heroImage} />
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={22} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => navigation.navigate("PetForm", {petId: pet.id})}
          >
            <Ionicons name="pencil" size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text style={styles.name}>{pet.name}</Text>
              <Text style={styles.breed}>
                {pet.species} • {pet.breed}
              </Text>
            </View>
            <Badge
              label={pet.vaccinated ? "Vaccinated" : "Vaccine due"}
              color={pet.vaccinated ? Colors.success : Colors.warning}
              background={pet.vaccinated ? "#E8F5E9" : "#FFF7E0"}
            />
          </View>

          <View style={styles.statsRow}>
            <StatCard
              icon="weight-kilogram"
              label="Weight"
              value={`${pet.weightKg} kg`}
            />
            <StatCard icon="calendar" label="Age" value={pet.age} />
            <StatCard
              icon={pet.gender === "Male" ? "gender-male" : "gender-female"}
              label="Gender"
              value={pet.gender}
            />
          </View>

          <Text style={styles.section}>About</Text>
          <Text style={styles.about}>
            {pet.name} is a {pet.age.toLowerCase()} old {pet.breed} who loves
            adventure and cuddles. Keep tabs on vaccinations and book a checkup
            anytime.
          </Text>

          <Text style={styles.section}>Quick actions</Text>
          <View style={styles.actionsRow}>
            <ActionPill
              icon="calendar-outline"
              label="Book vet"
              onPress={() => navigation.navigate("BookAppointment")}
            />
            <ActionPill
              icon="document-text-outline"
              label="Records"
              onPress={() => Toast.show({type: "info", text1: "Coming soon"})}
            />
            <ActionPill
              icon="cut-outline"
              label="Grooming"
              onPress={() => navigation.navigate("BookAppointment")}
            />
          </View>

          <Text style={styles.section}>Health timeline</Text>
          <Timeline
            items={[
              {date: "Last visit", text: "General checkup • Dr. Anita"},
              {
                date: "Next vaccine",
                text: pet.vaccinated ? "In 6 months" : "Overdue",
              },
              {date: "Joined Petzy", text: "Member since 2024"},
            ]}
          />

          <TouchableOpacity style={styles.removeBtn} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={18} color={Colors.error} />
            <Text style={styles.removeText}>Remove pet</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const StatCard: React.FC<{
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string;
}> = ({icon, label, value}) => (
  <View style={styles.statCard}>
    <MaterialCommunityIcons name={icon} size={20} color={Colors.primary} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const ActionPill: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}> = ({icon, label, onPress}) => (
  <TouchableOpacity
    style={styles.actionPill}
    onPress={onPress}
    activeOpacity={0.85}
  >
    <Ionicons name={icon} size={18} color={Colors.primary} />
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

const Timeline: React.FC<{items: Array<{date: string; text: string}>}> = ({
  items,
}) => (
  <View style={{gap: Spacing.md}}>
    {items.map((it, idx) => (
      <View key={idx} style={styles.timelineRow}>
        <View style={styles.timelineDot} />
        <View style={{flex: 1}}>
          <Text style={styles.timelineDate}>{it.date}</Text>
          <Text style={styles.timelineText}>{it.text}</Text>
        </View>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: Colors.background},
  notFound: {
    textAlign: "center",
    marginTop: 80,
    color: Colors.textSecondary,
    fontFamily: FontFamily.regular,
  },
  hero: {position: "relative"},
  heroImage: {width: "100%", height: 320},
  backBtn: {
    position: "absolute",
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  editBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    backgroundColor: Colors.white,
    marginTop: -24,
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  name: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xxl,
    color: Colors.textPrimary,
  },
  breed: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  statsRow: {flexDirection: "row", gap: Spacing.md},
  statCard: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  statLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  section: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    marginTop: Spacing.md,
  },
  about: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  actionsRow: {flexDirection: "row", gap: Spacing.md},
  actionPill: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.md,
    alignItems: "center",
    gap: 4,
  },
  actionLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.textPrimary,
  },
  timelineRow: {flexDirection: "row", gap: Spacing.md, alignItems: "center"},
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  timelineDate: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  timelineText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  removeBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.sm,
    padding: Spacing.lg,
    backgroundColor: "#FFEEEE",
    borderRadius: BorderRadius.xl,
    marginTop: Spacing.lg,
  },
  removeText: {
    color: Colors.error,
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
  },
});

export default PetDetailScreen;

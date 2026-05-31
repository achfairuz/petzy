import React, {useEffect} from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
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
import {Badge} from "@/presentation/components/Badge";
import {EmptyState} from "@/presentation/components/EmptyState";
import {Pet} from "@/domain/entities/Pet";
import {usePetsStore} from "@/core/store/petsStore";
import type {AppStackParamList} from "@/presentation/navigation/types";

const MyPetsScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const pets = usePetsStore((s) => s.pets);
  const loading = usePetsStore((s) => s.loading);
  const load = usePetsStore((s) => s.load);

  useEffect(() => {
    if (pets.length === 0) load();
  }, [pets.length, load]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScreenHeader
        title="My Pets"
        subtitle={`${pets.length} ${pets.length === 1 ? "buddy" : "buddies"}`}
        onBack={() => navigation.goBack()}
        right={
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate("PetForm")}
            activeOpacity={0.85}
          >
            <Ionicons name="add" size={20} color={Colors.white} />
          </TouchableOpacity>
        }
      />

      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{marginTop: 60}} />
      ) : pets.length === 0 ? (
        <EmptyState
          icon="paw-outline"
          title="No pets yet"
          description="Add your first pet to start tracking their health."
          actionLabel="Add pet"
          onAction={() => navigation.navigate("PetForm")}
        />
      ) : (
        <FlatList
          data={pets}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: Spacing.xxl,
            paddingBottom: 140,
            gap: Spacing.md,
          }}
          renderItem={({item}) => (
            <PetCard
              pet={item}
              onPress={() => navigation.navigate("PetDetail", {petId: item.id})}
              onEdit={() => navigation.navigate("PetForm", {petId: item.id})}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const PetCard: React.FC<{
  pet: Pet;
  onPress: () => void;
  onEdit: () => void;
}> = ({pet, onPress, onEdit}) => (
  <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
    <Image source={{uri: pet.imageUrl}} style={styles.image} />
    <TouchableOpacity
      style={styles.editFab}
      onPress={onEdit}
      activeOpacity={0.85}
    >
      <Ionicons name="pencil" size={14} color={Colors.white} />
    </TouchableOpacity>
    <View style={styles.body}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={styles.name}>{pet.name}</Text>
        <Badge
          label={pet.vaccinated ? "Vaccinated" : "Vaccine due"}
          color={pet.vaccinated ? Colors.success : Colors.warning}
          background={pet.vaccinated ? "#E8F5E9" : "#FFF7E0"}
        />
      </View>
      <Text style={styles.breed}>
        {pet.species} • {pet.breed}
      </Text>
      <View style={styles.statsRow}>
        <Stat icon="weight-kilogram" label={`${pet.weightKg} kg`} />
        <Stat icon="calendar" label={pet.age} />
        <Stat
          icon={pet.gender === "Male" ? "gender-male" : "gender-female"}
          label={pet.gender}
        />
      </View>
    </View>
  </TouchableOpacity>
);

const Stat: React.FC<{
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
}> = ({icon, label}) => (
  <View style={styles.stat}>
    <MaterialCommunityIcons
      name={icon}
      size={14}
      color={Colors.textSecondary}
    />
    <Text style={styles.statText}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: Colors.background},
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xxl,
    overflow: "hidden",
    elevation: 2,
  },
  image: {width: "100%", height: 180},
  editFab: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {padding: Spacing.lg, gap: 6},
  name: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  breed: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.lg,
    marginTop: Spacing.sm,
  },
  stat: {flexDirection: "row", alignItems: "center", gap: 4},
  statText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
});

export default MyPetsScreen;

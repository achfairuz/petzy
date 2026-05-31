import React, {useEffect, useMemo, useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
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
import {Pet, PetSpecies} from "@/domain/entities/Pet";
import {usePetsStore} from "@/core/store/petsStore";
import type {AppStackParamList} from "@/presentation/navigation/types";

const SPECIES: PetSpecies[] = ["Dog", "Cat", "Rabbit", "Bird", "Other"];
const GENDERS: Pet["gender"][] = ["Male", "Female"];
const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&q=80";

type FormRoute = RouteProp<AppStackParamList, "PetForm">;

const PetFormScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<FormRoute>();
  const petId = route.params?.petId;

  const pets = usePetsStore((s) => s.pets);
  const addPet = usePetsStore((s) => s.add);
  const updatePet = usePetsStore((s) => s.update);
  const removePet = usePetsStore((s) => s.remove);

  const existing = useMemo(
    () => (petId ? pets.find((p) => p.id === petId) : undefined),
    [petId, pets],
  );

  const [name, setName] = useState(existing?.name ?? "");
  const [species, setSpecies] = useState<PetSpecies>(
    existing?.species ?? "Dog",
  );
  const [breed, setBreed] = useState(existing?.breed ?? "");
  const [age, setAge] = useState(existing?.age ?? "");
  const [weight, setWeight] = useState(
    existing?.weightKg ? String(existing.weightKg) : "",
  );
  const [gender, setGender] = useState<Pet["gender"]>(
    existing?.gender ?? "Male",
  );
  const [vaccinated, setVaccinated] = useState(existing?.vaccinated ?? false);
  const [imageUrl, setImageUrl] = useState(existing?.imageUrl ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (petId && !existing) navigation.goBack();
  }, [petId, existing, navigation]);

  const handleSave = async () => {
    if (!name.trim() || !breed.trim() || !age.trim()) {
      Toast.show({type: "error", text1: "Please fill all required fields"});
      return;
    }
    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      Toast.show({type: "error", text1: "Enter a valid weight"});
      return;
    }
    setSaving(true);
    try {
      const payload: Omit<Pet, "id"> = {
        name: name.trim(),
        species,
        breed: breed.trim(),
        age: age.trim(),
        weightKg: weightNum,
        gender,
        vaccinated,
        imageUrl: imageUrl.trim() || FALLBACK_AVATAR,
      };
      if (petId) {
        await updatePet(petId, payload);
        Toast.show({type: "success", text1: "Pet updated"});
      } else {
        await addPet(payload);
        Toast.show({type: "success", text1: "Pet added"});
      }
      navigation.goBack();
    } catch {
      Toast.show({type: "error", text1: "Failed to save"});
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (!petId) return;
    Alert.alert("Remove pet", `Remove ${existing?.name} from your pack?`, [
      {text: "Cancel", style: "cancel"},
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          await removePet(petId);
          Toast.show({type: "success", text1: "Pet removed"});
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScreenHeader
        title={petId ? "Edit Pet" : "Add Pet"}
        onBack={() => navigation.goBack()}
      />
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{paddingBottom: 140}}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.avatarWrap}>
            <Image
              source={{uri: imageUrl || FALLBACK_AVATAR}}
              style={styles.avatar}
            />
            <Text style={styles.hint}>Paste an image URL below</Text>
          </View>

          <View style={styles.form}>
            <Field label="Photo URL">
              <TextInput
                value={imageUrl}
                onChangeText={setImageUrl}
                placeholder="https://..."
                style={styles.input}
                autoCapitalize="none"
              />
            </Field>

            <Field label="Name *">
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="e.g. Milo"
                style={styles.input}
              />
            </Field>

            <Field label="Species">
              <ChipRow
                options={SPECIES}
                value={species}
                onChange={(v) => setSpecies(v as PetSpecies)}
              />
            </Field>

            <Field label="Breed *">
              <TextInput
                value={breed}
                onChangeText={setBreed}
                placeholder="e.g. Shiba Inu"
                style={styles.input}
              />
            </Field>

            <View style={{flexDirection: "row", gap: Spacing.md}}>
              <View style={{flex: 1}}>
                <Field label="Age *">
                  <TextInput
                    value={age}
                    onChangeText={setAge}
                    placeholder="3 years"
                    style={styles.input}
                  />
                </Field>
              </View>
              <View style={{flex: 1}}>
                <Field label="Weight (kg) *">
                  <TextInput
                    value={weight}
                    onChangeText={setWeight}
                    placeholder="10"
                    keyboardType="decimal-pad"
                    style={styles.input}
                  />
                </Field>
              </View>
            </View>

            <Field label="Gender">
              <ChipRow
                options={GENDERS}
                value={gender}
                onChange={(v) => setGender(v as Pet["gender"])}
              />
            </Field>

            <View style={styles.switchRow}>
              <View>
                <Text style={styles.switchLabel}>Vaccinated</Text>
                <Text style={styles.switchHint}>
                  Vaccinations are up to date
                </Text>
              </View>
              <Switch
                value={vaccinated}
                onValueChange={setVaccinated}
                trackColor={{true: Colors.primary, false: Colors.border}}
                thumbColor={Colors.white}
              />
            </View>

            {petId ? (
              <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
                <Text style={styles.deleteText}>Remove this pet</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.saveBtn, saving && {opacity: 0.6}]}
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.85}
          >
            <Text style={styles.saveText}>
              {petId ? "Save Changes" : "Add Pet"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const Field: React.FC<{label: string; children: React.ReactNode}> = ({
  label,
  children,
}) => (
  <View style={{marginBottom: Spacing.lg}}>
    <Text style={styles.label}>{label}</Text>
    {children}
  </View>
);

const ChipRow: React.FC<{
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}> = ({options, value, onChange}) => (
  <View style={{flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm}}>
    {options.map((opt) => {
      const active = opt === value;
      return (
        <TouchableOpacity
          key={opt}
          onPress={() => onChange(opt)}
          style={[styles.chip, active && styles.chipActive]}
          activeOpacity={0.85}
        >
          <Text style={[styles.chipText, active && styles.chipTextActive]}>
            {opt}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: Colors.background},
  avatarWrap: {alignItems: "center", marginTop: Spacing.md},
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  hint: {
    marginTop: Spacing.sm,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  form: {
    backgroundColor: Colors.white,
    margin: Spacing.xxl,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xxl,
  },
  label: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  chip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  chipActive: {backgroundColor: Colors.primary, borderColor: Colors.primary},
  chipText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  chipTextActive: {color: Colors.white},
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.md,
  },
  switchLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  switchHint: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  deleteBtn: {alignItems: "center", paddingVertical: Spacing.md},
  deleteText: {
    color: Colors.error,
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.xxl,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingVertical: 16,
    alignItems: "center",
  },
  saveText: {
    color: Colors.white,
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
  },
});

export default PetFormScreen;

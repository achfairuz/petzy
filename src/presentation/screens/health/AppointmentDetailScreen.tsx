import React, {useEffect, useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useNavigation, useRoute, RouteProp} from "@react-navigation/native";
import {Ionicons} from "@expo/vector-icons";
import Toast from "react-native-toast-message";

import {
  BorderRadius,
  Colors,
  FontFamily,
  FontSize,
  Spacing,
} from "@/core/theme";
import {ScreenHeader} from "@/presentation/components/ScreenHeader";
import {Badge} from "@/presentation/components/Badge";
import {Appointment} from "@/domain/entities/Appointment";
import {
  cancelAppointmentUseCase,
  getAppointmentByIdUseCase,
} from "@/domain/usecases/AppointmentUseCases";
import {appointmentRepository} from "@/data/repositories/appointmentRepository";
import {formatDateTime} from "@/core/utils/format";
import type {AppStackParamList} from "@/presentation/navigation/types";

const getAppt = getAppointmentByIdUseCase(appointmentRepository);
const cancelAppt = cancelAppointmentUseCase(appointmentRepository);

type Route = RouteProp<AppStackParamList, "AppointmentDetail">;

const statusColor = (s: Appointment["status"]) => {
  switch (s) {
    case "upcoming":
      return {color: Colors.primary, bg: "#FFF0F0"};
    case "completed":
      return {color: Colors.success, bg: "#E8F5E9"};
    case "cancelled":
      return {color: Colors.error, bg: "#FFEEEE"};
  }
};

const AppointmentDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<Route>();
  const {appointmentId} = route.params;

  const [appt, setAppt] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAppt(appointmentId)
      .then(setAppt)
      .finally(() => setLoading(false));
  }, [appointmentId]);

  const handleCancel = () => {
    if (!appt) return;
    Alert.alert("Cancel appointment", "Are you sure?", [
      {text: "Keep it", style: "cancel"},
      {
        text: "Cancel",
        style: "destructive",
        onPress: async () => {
          await cancelAppt(appt.id);
          setAppt({...appt, status: "cancelled"});
          Toast.show({type: "success", text1: "Appointment cancelled"});
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
  if (!appt) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.empty}>Appointment not found</Text>
      </SafeAreaView>
    );
  }

  const stColor = statusColor(appt.status);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScreenHeader title="Appointment" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{paddingBottom: 140}}>
        <View style={styles.heroCard}>
          <Image source={{uri: appt.petImage}} style={styles.petImg} />
          <Text style={styles.petName}>{appt.petName}</Text>
          <Badge
            label={appt.status.toUpperCase()}
            color={stColor.color}
            background={stColor.bg}
          />
        </View>

        <View style={styles.card}>
          <Row label="Service" value={appt.serviceType} />
          <Row label="Vet" value={appt.vetName} />
          <Row label="Clinic" value={appt.clinic} />
          <Row label="When" value={formatDateTime(appt.dateISO)} />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>What to bring</Text>
          <Bullet text="Pet's medical records (if first visit)" />
          <Bullet text="Vaccination booklet" />
          <Bullet text="A leash or carrier" />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Need to make changes?</Text>
          <Text style={styles.cardBody}>
            Cancellations within 2 hours of the appointment may incur a fee.
            Please contact the clinic for emergencies.
          </Text>
        </View>

        {appt.status === "upcoming" ? (
          <View
            style={{
              paddingHorizontal: Spacing.xxl,
              gap: Spacing.md,
              marginTop: Spacing.md,
            }}
          >
            <TouchableOpacity style={styles.primary}>
              <Ionicons
                name="navigate-outline"
                size={18}
                color={Colors.white}
              />
              <Text style={styles.primaryText}>Get directions</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.danger} onPress={handleCancel}>
              <Text style={styles.dangerText}>Cancel appointment</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const Row: React.FC<{label: string; value: string}> = ({label, value}) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

const Bullet: React.FC<{text: string}> = ({text}) => (
  <View style={{flexDirection: "row", gap: Spacing.sm, alignItems: "center"}}>
    <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
    <Text style={styles.cardBody}>{text}</Text>
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
  heroCard: {
    margin: Spacing.xxl,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xxl,
    alignItems: "center",
    padding: Spacing.xl,
    gap: 8,
    elevation: 2,
  },
  petImg: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  petName: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xxl,
    marginHorizontal: Spacing.xxl,
    marginBottom: Spacing.md,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  rowLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  rowValue: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  sectionTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  cardBody: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  primary: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingVertical: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  primaryText: {
    color: Colors.white,
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
  },
  danger: {
    borderWidth: 1.5,
    borderColor: Colors.error,
    borderRadius: BorderRadius.full,
    paddingVertical: 14,
    alignItems: "center",
  },
  dangerText: {
    color: Colors.error,
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
  },
});

export default AppointmentDetailScreen;

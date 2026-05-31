import React, {useEffect, useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useNavigation} from "@react-navigation/native";
import type {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {Ionicons} from "@expo/vector-icons";

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
import {Appointment} from "@/domain/entities/Appointment";
import {getAppointmentsUseCase} from "@/domain/usecases/AppointmentUseCases";
import {appointmentRepository} from "@/data/repositories/appointmentRepository";
import {formatDateTime} from "@/core/utils/format";
import type {AppStackParamList} from "@/presentation/navigation/types";

const getAppointments = getAppointmentsUseCase(appointmentRepository);

type Filter = "upcoming" | "completed" | "cancelled";

const AppointmentsScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const [data, setData] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("upcoming");

  const load = () => {
    setLoading(true);
    getAppointments()
      .then(setData)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = data.filter((a) => a.status === filter);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScreenHeader
        title="My Appointments"
        onBack={() => navigation.goBack()}
        right={
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate("BookAppointment")}
          >
            <Ionicons name="add" size={20} color={Colors.white} />
          </TouchableOpacity>
        }
      />

      <View style={styles.tabs}>
        {(["upcoming", "completed", "cancelled"] as Filter[]).map((f) => {
          const active = f === filter;
          return (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              style={[styles.tab, active && styles.tabActive]}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{marginTop: 60}} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="calendar-outline"
          title={`No ${filter} appointments`}
          description="Book a visit to keep your pet healthy."
          actionLabel={filter === "upcoming" ? "Book appointment" : undefined}
          onAction={
            filter === "upcoming"
              ? () => navigation.navigate("BookAppointment")
              : undefined
          }
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(a) => a.id}
          contentContainerStyle={{
            padding: Spacing.xxl,
            gap: Spacing.md,
            paddingBottom: 120,
          }}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate("AppointmentDetail", {
                  appointmentId: item.id,
                })
              }
            >
              <Image source={{uri: item.petImage}} style={styles.avatar} />
              <View style={{flex: 1}}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.pet}>{item.petName}</Text>
                  <Badge label={item.serviceType} />
                </View>
                <Text style={styles.vet}>
                  {item.vetName} • {item.clinic}
                </Text>
                <View style={styles.metaRow}>
                  <Ionicons
                    name="time-outline"
                    size={14}
                    color={Colors.primary}
                  />
                  <Text style={styles.date}>
                    {formatDateTime(item.dateISO)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
};

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
  tabs: {
    flexDirection: "row",
    marginHorizontal: Spacing.xxl,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.full,
    padding: 4,
    marginBottom: Spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: BorderRadius.full,
  },
  tabActive: {backgroundColor: Colors.primary},
  tabText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  tabTextActive: {color: Colors.white, fontFamily: FontFamily.semiBold},
  card: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.md,
    gap: Spacing.md,
    elevation: 1,
  },
  avatar: {width: 56, height: 56, borderRadius: 28},
  pet: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  vet: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  metaRow: {flexDirection: "row", alignItems: "center", gap: 4, marginTop: 6},
  date: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.primary,
  },
});

export default AppointmentsScreen;

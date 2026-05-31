import React from "react";
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useNavigation} from "@react-navigation/native";
import type {NativeStackNavigationProp} from "@react-navigation/native-stack";
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
import {EmptyState} from "@/presentation/components/EmptyState";
import {Badge} from "@/presentation/components/Badge";
import {Address, useSettingsStore} from "@/core/store/settingsStore";
import type {AppStackParamList} from "@/presentation/navigation/types";

const AddressesScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const addresses = useSettingsStore((s) => s.addresses);
  const removeAddress = useSettingsStore((s) => s.removeAddress);
  const setDefault = useSettingsStore((s) => s.setDefaultAddress);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScreenHeader
        title="Addresses"
        subtitle="Where should we deliver?"
        onBack={() => navigation.goBack()}
        right={
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate("AddressForm")}
          >
            <Ionicons name="add" size={20} color={Colors.white} />
          </TouchableOpacity>
        }
      />
      {addresses.length === 0 ? (
        <EmptyState
          icon="location-outline"
          title="No addresses yet"
          description="Add your first delivery address."
          actionLabel="Add address"
          onAction={() => navigation.navigate("AddressForm")}
        />
      ) : (
        <FlatList
          data={addresses}
          keyExtractor={(a) => a.id}
          contentContainerStyle={{
            padding: Spacing.xxl,
            gap: Spacing.md,
            paddingBottom: 120,
          }}
          renderItem={({item}) => (
            <AddressCard
              address={item}
              onEdit={() =>
                navigation.navigate("AddressForm", {addressId: item.id})
              }
              onRemove={() => {
                removeAddress(item.id);
                Toast.show({type: "success", text1: "Address removed"});
              }}
              onMakeDefault={() => {
                setDefault(item.id);
                Toast.show({type: "success", text1: "Default updated"});
              }}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
};

const AddressCard: React.FC<{
  address: Address;
  onEdit: () => void;
  onRemove: () => void;
  onMakeDefault: () => void;
}> = ({address, onEdit, onRemove, onMakeDefault}) => (
  <View style={styles.card}>
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View
        style={{flexDirection: "row", gap: Spacing.sm, alignItems: "center"}}
      >
        <Ionicons name="location" size={18} color={Colors.primary} />
        <Text style={styles.label}>{address.label}</Text>
      </View>
      {address.isDefault ? (
        <Badge label="Default" background="#FFF0F0" color={Colors.primary} />
      ) : null}
    </View>
    <Text style={styles.recipient}>
      {address.recipient} • {address.phone}
    </Text>
    <Text style={styles.line}>
      {address.line}, {address.city} {address.postalCode}
    </Text>

    <View style={styles.actions}>
      {!address.isDefault ? (
        <TouchableOpacity onPress={onMakeDefault}>
          <Text style={styles.action}>Set default</Text>
        </TouchableOpacity>
      ) : (
        <View />
      )}
      <View style={{flexDirection: "row", gap: Spacing.lg}}>
        <TouchableOpacity onPress={onEdit}>
          <Text style={styles.action}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onRemove}>
          <Text style={[styles.action, {color: Colors.error}]}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    padding: Spacing.lg,
    gap: Spacing.sm,
    elevation: 1,
  },
  label: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  recipient: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  line: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  action: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
});

export default AddressesScreen;

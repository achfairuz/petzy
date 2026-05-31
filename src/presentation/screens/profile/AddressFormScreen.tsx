import React, {useMemo, useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Switch,
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
import {useSettingsStore} from "@/core/store/settingsStore";
import type {AppStackParamList} from "@/presentation/navigation/types";

type Route = RouteProp<AppStackParamList, "AddressForm">;

const AddressFormScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<Route>();
  const id = route.params?.addressId;
  const addresses = useSettingsStore((s) => s.addresses);
  const addAddress = useSettingsStore((s) => s.addAddress);
  const updateAddress = useSettingsStore((s) => s.updateAddress);

  const existing = useMemo(
    () => addresses.find((a) => a.id === id),
    [id, addresses],
  );

  const [label, setLabel] = useState(existing?.label ?? "");
  const [recipient, setRecipient] = useState(existing?.recipient ?? "");
  const [phone, setPhone] = useState(existing?.phone ?? "");
  const [line, setLine] = useState(existing?.line ?? "");
  const [city, setCity] = useState(existing?.city ?? "");
  const [postalCode, setPostalCode] = useState(existing?.postalCode ?? "");
  const [isDefault, setIsDefault] = useState(existing?.isDefault ?? false);

  const handleSave = () => {
    if (!label.trim() || !recipient.trim() || !line.trim() || !city.trim()) {
      Toast.show({type: "error", text1: "Please fill required fields"});
      return;
    }
    const payload = {
      label: label.trim(),
      recipient: recipient.trim(),
      phone: phone.trim(),
      line: line.trim(),
      city: city.trim(),
      postalCode: postalCode.trim(),
      isDefault,
    };
    if (id) {
      updateAddress(id, payload);
      Toast.show({type: "success", text1: "Address updated"});
    } else {
      addAddress(payload);
      Toast.show({type: "success", text1: "Address added"});
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScreenHeader
        title={id ? "Edit Address" : "Add Address"}
        onBack={() => navigation.goBack()}
      />
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={{paddingBottom: 140}}>
          <View style={styles.form}>
            <Field label="Label *">
              <TextInput
                value={label}
                onChangeText={setLabel}
                placeholder="Home / Office"
                style={styles.input}
              />
            </Field>
            <Field label="Recipient *">
              <TextInput
                value={recipient}
                onChangeText={setRecipient}
                placeholder="Full name"
                style={styles.input}
              />
            </Field>
            <Field label="Phone">
              <TextInput
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholder="+62 ..."
                style={styles.input}
              />
            </Field>
            <Field label="Address line *">
              <TextInput
                value={line}
                onChangeText={setLine}
                placeholder="Street, building, apt"
                style={[styles.input, {height: 80, textAlignVertical: "top"}]}
                multiline
              />
            </Field>
            <View style={{flexDirection: "row", gap: Spacing.md}}>
              <View style={{flex: 2}}>
                <Field label="City *">
                  <TextInput
                    value={city}
                    onChangeText={setCity}
                    placeholder="Jakarta"
                    style={styles.input}
                  />
                </Field>
              </View>
              <View style={{flex: 1}}>
                <Field label="Postal">
                  <TextInput
                    value={postalCode}
                    onChangeText={setPostalCode}
                    placeholder="12150"
                    keyboardType="number-pad"
                    style={styles.input}
                  />
                </Field>
              </View>
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Set as default</Text>
              <Switch
                value={isDefault}
                onValueChange={setIsDefault}
                trackColor={{true: Colors.primary, false: Colors.border}}
                thumbColor={Colors.white}
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSave}
            activeOpacity={0.85}
          >
            <Text style={styles.saveText}>
              {id ? "Save Changes" : "Add Address"}
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

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: Colors.background},
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
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  switchLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
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

export default AddressFormScreen;

import React, {useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useNavigation} from "@react-navigation/native";
import {FontAwesome5, Ionicons} from "@expo/vector-icons";
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
import {EmptyState} from "@/presentation/components/EmptyState";
import {
  PaymentBrand,
  PaymentMethod,
  useSettingsStore,
} from "@/core/store/settingsStore";

const BRANDS: PaymentBrand[] = ["Visa", "Mastercard", "GoPay", "OVO", "BCA"];

const brandIcon = (brand: PaymentBrand) => {
  switch (brand) {
    case "Visa":
      return "cc-visa";
    case "Mastercard":
      return "cc-mastercard";
    default:
      return "wallet";
  }
};

const PaymentMethodsScreen: React.FC = () => {
  const navigation = useNavigation();
  const methods = useSettingsStore((s) => s.paymentMethods);
  const add = useSettingsStore((s) => s.addPayment);
  const remove = useSettingsStore((s) => s.removePayment);
  const setDefault = useSettingsStore((s) => s.setDefaultPayment);

  const [modalOpen, setModalOpen] = useState(false);
  const [brand, setBrand] = useState<PaymentBrand>("Visa");
  const [label, setLabel] = useState("");
  const [last4, setLast4] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const handleAdd = () => {
    if (!label.trim() || last4.trim().length !== 4) {
      Toast.show({type: "error", text1: "Need label and last-4 digits"});
      return;
    }
    add({brand, label: label.trim(), last4: last4.trim(), isDefault});
    setModalOpen(false);
    setLabel("");
    setLast4("");
    setIsDefault(false);
    setBrand("Visa");
    Toast.show({type: "success", text1: "Payment method added"});
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScreenHeader
        title="Payment Methods"
        subtitle="Manage your cards & wallets"
        onBack={() => navigation.goBack()}
        right={
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setModalOpen(true)}
          >
            <Ionicons name="add" size={20} color={Colors.white} />
          </TouchableOpacity>
        }
      />

      {methods.length === 0 ? (
        <EmptyState
          icon="card-outline"
          title="No payment methods"
          description="Add a card or wallet to checkout faster."
          actionLabel="Add method"
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <FlatList
          data={methods}
          keyExtractor={(m) => m.id}
          contentContainerStyle={{
            padding: Spacing.xxl,
            gap: Spacing.md,
            paddingBottom: 120,
          }}
          renderItem={({item}) => (
            <PMCard
              method={item}
              onRemove={() => {
                remove(item.id);
                Toast.show({type: "success", text1: "Removed"});
              }}
              onDefault={() => {
                setDefault(item.id);
                Toast.show({type: "success", text1: "Default updated"});
              }}
            />
          )}
        />
      )}

      <Modal
        visible={modalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setModalOpen(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalBg}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Add Payment Method</Text>

            <Text style={styles.smallLabel}>Brand</Text>
            <View
              style={{flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm}}
            >
              {BRANDS.map((b) => {
                const active = b === brand;
                return (
                  <TouchableOpacity
                    key={b}
                    onPress={() => setBrand(b)}
                    style={[styles.chip, active && styles.chipActive]}
                  >
                    <Text
                      style={[styles.chipText, active && styles.chipTextActive]}
                    >
                      {b}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.smallLabel}>Label</Text>
            <TextInput
              value={label}
              onChangeText={setLabel}
              placeholder="e.g. Personal"
              style={styles.input}
            />

            <Text style={styles.smallLabel}>Last 4 digits</Text>
            <TextInput
              value={last4}
              onChangeText={(t) => setLast4(t.slice(0, 4))}
              placeholder="1234"
              keyboardType="number-pad"
              style={styles.input}
              maxLength={4}
            />

            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: Spacing.sm,
                marginVertical: Spacing.md,
              }}
              onPress={() => setIsDefault((v) => !v)}
            >
              <Ionicons
                name={isDefault ? "checkbox" : "square-outline"}
                size={20}
                color={Colors.primary}
              />
              <Text style={styles.checkboxLabel}>Set as default</Text>
            </TouchableOpacity>

            <View style={{flexDirection: "row", gap: Spacing.md}}>
              <TouchableOpacity
                style={[styles.modalBtn, {backgroundColor: Colors.background}]}
                onPress={() => setModalOpen(false)}
              >
                <Text
                  style={[styles.modalBtnText, {color: Colors.textPrimary}]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtn} onPress={handleAdd}>
                <Text style={styles.modalBtnText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

const PMCard: React.FC<{
  method: PaymentMethod;
  onRemove: () => void;
  onDefault: () => void;
}> = ({method, onRemove, onDefault}) => (
  <View style={styles.card}>
    <View style={styles.cardIcon}>
      <FontAwesome5
        name={brandIcon(method.brand) as any}
        size={22}
        color={Colors.primary}
      />
    </View>
    <View style={{flex: 1}}>
      <View
        style={{flexDirection: "row", gap: Spacing.sm, alignItems: "center"}}
      >
        <Text style={styles.cardBrand}>{method.brand}</Text>
        {method.isDefault ? (
          <Badge label="Default" background="#FFF0F0" color={Colors.primary} />
        ) : null}
      </View>
      <Text style={styles.cardMeta}>
        {method.label} • •••• {method.last4}
      </Text>
      <View style={{flexDirection: "row", gap: Spacing.lg, marginTop: 4}}>
        {!method.isDefault ? (
          <TouchableOpacity onPress={onDefault}>
            <Text style={styles.action}>Set default</Text>
          </TouchableOpacity>
        ) : null}
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
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.lg,
    gap: Spacing.md,
    elevation: 1,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFF0F0",
    alignItems: "center",
    justifyContent: "center",
  },
  cardBrand: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  cardMeta: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  action: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
  modalBg: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    padding: Spacing.xxl,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: Spacing.lg,
  },
  sheetTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  smallLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
  },
  chip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
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
  checkboxLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  modalBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingVertical: 14,
    alignItems: "center",
  },
  modalBtnText: {
    color: Colors.white,
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
  },
});

export default PaymentMethodsScreen;

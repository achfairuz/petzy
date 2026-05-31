import React, {useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useNavigation} from "@react-navigation/native";
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";

import {
  BorderRadius,
  Colors,
  FontFamily,
  FontSize,
  Spacing,
} from "@/core/theme";
import {ScreenHeader} from "@/presentation/components/ScreenHeader";

const FAQS = [
  {
    q: "How do I book a vet appointment?",
    a: "Open the Health tab, choose a vet, pick a service and time slot, then confirm.",
  },
  {
    q: "Can I edit my pet after adding?",
    a: "Yes. Open Profile → My Pets → tap the pet → tap the edit icon.",
  },
  {
    q: "How are deliveries handled?",
    a: "Orders ship from partnered local stores. You'll get notifications at each step.",
  },
  {
    q: "Is my payment information secure?",
    a: "We never store full card numbers — only the last 4 digits for display.",
  },
];

const HelpScreen: React.FC = () => {
  const navigation = useNavigation();
  const [open, setOpen] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScreenHeader title="Help & Support" onBack={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={{padding: Spacing.xxl, paddingBottom: 120}}
      >
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Ionicons
              name="help-buoy-outline"
              size={28}
              color={Colors.primary}
            />
          </View>
          <Text style={styles.heroTitle}>How can we help?</Text>
          <Text style={styles.heroSubtitle}>
            Browse common questions or reach out to our team.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Contact us</Text>
        <View style={styles.card}>
          <ContactRow
            icon="mail-outline"
            label="Email"
            value="support@petzy.app"
            onPress={() => Linking.openURL("mailto:support@petzy.app")}
          />
          <ContactRow
            icon="logo-whatsapp"
            label="WhatsApp"
            value="+62 812 0000 0000"
            onPress={() => Linking.openURL("https://wa.me/6281200000000")}
          />
          <ContactRow
            icon="call-outline"
            label="Phone"
            value="(021) 555-1234"
            onPress={() => Linking.openURL("tel:0215551234")}
          />
        </View>

        <Text style={styles.sectionTitle}>Frequently asked</Text>
        <View style={styles.card}>
          {FAQS.map((item) => {
            const expanded = open === item.q;
            return (
              <TouchableOpacity
                key={item.q}
                activeOpacity={0.8}
                onPress={() => setOpen(expanded ? null : item.q)}
                style={styles.faqRow}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.faqQ}>{item.q}</Text>
                  <Ionicons
                    name={expanded ? "chevron-up" : "chevron-down"}
                    size={18}
                    color={Colors.textSecondary}
                  />
                </View>
                {expanded ? <Text style={styles.faqA}>{item.a}</Text> : null}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const ContactRow: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  onPress: () => void;
}> = ({icon, label, value, onPress}) => (
  <TouchableOpacity style={styles.contactRow} onPress={onPress}>
    <View style={styles.contactIcon}>
      <Ionicons name={icon} size={20} color={Colors.primary} />
    </View>
    <View style={{flex: 1}}>
      <Text style={styles.contactLabel}>{label}</Text>
      <Text style={styles.contactValue}>{value}</Text>
    </View>
    <Ionicons name="chevron-forward" size={16} color={Colors.textDisabled} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: Colors.background},
  heroCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xl,
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  heroIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFF0F0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  heroTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  heroSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 4,
    textAlign: "center",
  },
  sectionTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xxl,
    overflow: "hidden",
    marginBottom: Spacing.md,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF0F0",
    alignItems: "center",
    justifyContent: "center",
  },
  contactLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  contactValue: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  faqRow: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.sm,
  },
  faqQ: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    flex: 1,
    paddingRight: Spacing.sm,
  },
  faqA: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginTop: 6,
  },
});

export default HelpScreen;

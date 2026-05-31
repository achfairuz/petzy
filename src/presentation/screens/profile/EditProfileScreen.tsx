import React, {useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useNavigation} from "@react-navigation/native";
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
import {useAuthStore} from "@/core/store/authStore";

const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? "");

  const handleSave = () => {
    if (!name.trim() || !email.trim()) {
      Toast.show({type: "error", text1: "Name and email are required"});
      return;
    }
    updateProfile({
      name: name.trim(),
      email: email.trim(),
      bio: bio.trim(),
      avatarUrl: avatarUrl.trim() || user?.avatarUrl,
    });
    Toast.show({type: "success", text1: "Profile updated"});
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScreenHeader title="Edit Profile" onBack={() => navigation.goBack()} />
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
              source={{
                uri:
                  avatarUrl || user?.avatarUrl || "https://i.pravatar.cc/300",
              }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.cameraBtn}>
              <Ionicons name="camera" size={16} color={Colors.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <Field label="Photo URL">
              <TextInput
                value={avatarUrl}
                onChangeText={setAvatarUrl}
                placeholder="https://..."
                style={styles.input}
                autoCapitalize="none"
              />
            </Field>
            <Field label="Full name">
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                style={styles.input}
              />
            </Field>
            <Field label="Email">
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </Field>
            <Field label="Bio">
              <TextInput
                value={bio}
                onChangeText={setBio}
                placeholder="Tell us about yourself"
                style={[styles.input, {height: 100, textAlignVertical: "top"}]}
                multiline
              />
            </Field>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSave}
            activeOpacity={0.85}
          >
            <Text style={styles.saveText}>Save Changes</Text>
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
  avatarWrap: {alignItems: "center", marginTop: Spacing.md},
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  cameraBtn: {
    position: "absolute",
    bottom: 0,
    right: "37%",
    backgroundColor: Colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.white,
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

export default EditProfileScreen;

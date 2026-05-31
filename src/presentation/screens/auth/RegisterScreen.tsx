import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type {NativeStackScreenProps} from "@react-navigation/native-stack";
import {InputField, PrimaryButton} from "../../components/AuthComponents";
import type {AuthStackParamList} from "../../navigation/types";
import {useRegister} from "../../../core/hooks/auth/useRegister";
import {authScreenStyles as styles} from "./authScreenStyles";
import Divider from "@/presentation/components/Divider";
import SosmedAccount from "@/presentation/components/SosmedAccount";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

const RegisterScreen: React.FC<Props> = ({navigation}) => {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    handleRegister,
    isLoading,
  } = useRegister();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.description}>
            Join Petzy to give your pets the care and love they deserve.
          </Text>
        </View>

        <View style={styles.form}>
          <InputField
            label=""
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            keyboardType="default"
          />
          <InputField
            label=""
            value={email}
            onChangeText={setEmail}
            placeholder="Your email"
            keyboardType="email-address"
          />
          <InputField
            label=""
            value={password}
            onChangeText={setPassword}
            placeholder="Create a password"
            secureTextEntry
          />
          <InputField
            label=""
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm your password"
            secureTextEntry
          />

          <Divider></Divider>
          <SosmedAccount></SosmedAccount>

          <PrimaryButton
            title="Sign Up"
            onPress={handleRegister}
            isLoading={isLoading}
            disabled={
              !name.trim() ||
              !email.trim() ||
              !password.trim() ||
              !confirmPassword.trim()
            }
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.footerLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

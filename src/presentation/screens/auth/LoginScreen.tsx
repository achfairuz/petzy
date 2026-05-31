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
import {useLogin} from "../../../core/hooks/auth/useLogin";
import {authScreenStyles as styles} from "./authScreenStyles";
import Divider from "@/presentation/components/Divider";
import SosmedAccount from "@/presentation/components/SosmedAccount";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

const LoginScreen: React.FC<Props> = ({navigation}) => {
  const {email, setEmail, password, setPassword, handleLogin, isLoading} =
    useLogin();

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
          <Text style={styles.appName}>Hello 👋,</Text>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>
            Sign in to manage your pets, book vet visits, and chat with experts.
          </Text>
        </View>

        <View style={styles.form}>
          <InputField
            label=""
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
          />
          <InputField
            label=""
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
          />

          <Divider />
          <SosmedAccount />

          <PrimaryButton
            title="Sign In"
            onPress={handleLogin}
            isLoading={isLoading}
            // disabled={!email.trim() || !password.trim()}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.footerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

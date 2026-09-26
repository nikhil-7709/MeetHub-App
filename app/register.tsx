import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Colors } from "@/constants/Colors";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterScreen() {
  const { register } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  const validation = useMemo(() => {
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    return {
      fullName: !trimmedName
        ? "Full name is required."
        : trimmedName.length < 2
          ? "Name must be at least 2 characters."
          : "",
      email: !trimmedEmail
        ? "Email is required."
        : /\S+@\S+\.\S+/.test(trimmedEmail)
          ? ""
          : "Please enter a valid email.",
      password: !password
        ? "Password is required."
        : password.length < 6
          ? "Password must be at least 6 characters."
          : "",
      confirmPassword: !confirmPassword
        ? "Please confirm your password."
        : password !== confirmPassword
          ? "Passwords do not match."
          : "",
    };
  }, [email, fullName, password, confirmPassword]);

  const canSubmit =
    !validation.fullName &&
    !validation.email &&
    !validation.password &&
    !validation.confirmPassword &&
    !isLoading;

  const handleRegister = async () => {
    if (!canSubmit) {
      setStatusMessage({
        type: "error",
        text: "Please fix the highlighted fields before continuing.",
      });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    const result = await register(fullName, email, password);
    setIsLoading(false);

    if (result.success) {
      setStatusMessage({
        type: "success",
        text: result.message,
      });
      router.replace("/(tabs)");
      return;
    }

    setStatusMessage({
      type: "error",
      text: result.message,
    });
    Alert.alert("Registration failed", result.message);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.backgroundOrbOne} />
        <View style={styles.backgroundOrbTwo} />

        <View style={styles.headerWrap}>
          <Text style={styles.brand}>MeetHub</Text>
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>
            Set up your workspace and start scheduling better meetings.
          </Text>
        </View>

        {statusMessage ? (
          <View
            style={[
              styles.statusBanner,
              statusMessage.type === "success"
                ? styles.successBanner
                : styles.errorBanner,
            ]}
          >
            <Text style={styles.statusText}>{statusMessage.text}</Text>
          </View>
        ) : null}

        <View style={styles.card}>
          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Full name</Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="John Doe"
              placeholderTextColor="#8B8DA7"
              autoCapitalize="words"
              style={[
                styles.input,
                validation.fullName ? styles.inputError : null,
              ]}
            />
            {validation.fullName ? (
              <Text style={styles.errorText}>{validation.fullName}</Text>
            ) : null}
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="you@example.com"
              placeholderTextColor="#8B8DA7"
              style={[
                styles.input,
                validation.email ? styles.inputError : null,
              ]}
            />
            {validation.email ? (
              <Text style={styles.errorText}>{validation.email}</Text>
            ) : null}
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Password</Text>
            <View
              style={[
                styles.passwordWrap,
                validation.password ? styles.inputError : null,
              ]}
            >
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholder="Create a password"
                placeholderTextColor="#8B8DA7"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.passwordInput}
              />
              <Pressable
                accessibilityRole="button"
                onPress={() => setShowPassword((value) => !value)}
                hitSlop={10}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#6B7280"
                />
              </Pressable>
            </View>
            {validation.password ? (
              <Text style={styles.errorText}>{validation.password}</Text>
            ) : null}
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Confirm password</Text>
            <View
              style={[
                styles.passwordWrap,
                validation.confirmPassword ? styles.inputError : null,
              ]}
            >
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                placeholder="Confirm your password"
                placeholderTextColor="#8B8DA7"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.passwordInput}
              />
              <Pressable
                accessibilityRole="button"
                onPress={() => setShowConfirmPassword((value) => !value)}
                hitSlop={10}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#6B7280"
                />
              </Pressable>
            </View>
            {validation.confirmPassword ? (
              <Text style={styles.errorText}>{validation.confirmPassword}</Text>
            ) : null}
          </View>

          <Pressable
            accessibilityRole="button"
            disabled={!canSubmit}
            onPress={handleRegister}
            style={({ pressed }) => [
              styles.registerButton,
              { opacity: pressed || !canSubmit ? 0.96 : 1 },
              { transform: [{ scale: pressed ? 0.985 : 1 }] },
            ]}
          >
            <LinearGradient
              colors={["#4F46E5", "#7C3AED", "#8B5CF6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradient}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.buttonText}>Register</Text>
              )}
            </LinearGradient>
          </Pressable>
        </View>

        <Text style={styles.bottomText}>
          Already have an account?{" "}
          <Link href="/login" style={styles.loginLink}>
            Login
          </Link>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F3FF",
  },
  scroll: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 48,
    paddingBottom: 40,
    backgroundColor: "#F5F3FF",
    position: "relative",
  },
  backgroundOrbOne: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(139, 92, 246, 0.12)",
    top: -60,
    left: -40,
  },
  backgroundOrbTwo: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(99, 102, 241, 0.10)",
    right: -60,
    bottom: 100,
  },
  headerWrap: {
    alignItems: "center",
    marginBottom: 28,
  },
  brand: {
    fontWeight: "900",
    fontSize: 34,
    letterSpacing: -1,
    color: Colors.primary,
  },
  title: {
    fontWeight: "800",
    fontSize: 30,
    color: "#111827",
    marginTop: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 8,
    color: "#5B6177",
    textAlign: "center",
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 290,
  },
  statusBanner: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 18,
    borderWidth: 1,
  },
  successBanner: {
    backgroundColor: "rgba(34, 197, 94, 0.10)",
    borderColor: "rgba(34, 197, 94, 0.25)",
  },
  errorBanner: {
    backgroundColor: "rgba(239, 68, 68, 0.08)",
    borderColor: "rgba(239, 68, 68, 0.18)",
  },
  statusText: {
    fontSize: 13,
    fontWeight: "700",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(79, 70, 229, 0.08)",
    padding: 20,
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 6,
  },
  fieldWrap: {
    marginBottom: 16,
  },
  label: {
    color: "#3F3F46",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    backgroundColor: "#F9FAFF",
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: "#111827",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
  },
  passwordWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    backgroundColor: "#F9FAFF",
    paddingHorizontal: 14,
    paddingVertical: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111827",
  },
  inputError: {
    borderColor: "#EF4444",
  },
  errorText: {
    marginTop: 6,
    color: "#DC2626",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  registerButton: {
    borderRadius: 18,
    overflow: "hidden",
    marginTop: 10,
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 6,
  },
  gradient: {
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 54,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  bottomText: {
    marginTop: 22,
    textAlign: "center",
    color: "#5B6177",
    fontSize: 14,
  },
  loginLink: {
    color: Colors.primary,
    fontWeight: "800",
  },
});

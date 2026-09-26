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

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const emailError = useMemo(() => {
    if (!email.trim()) {
      return "Email is required.";
    }

    const isValid = /\S+@\S+\.\S+/.test(email);
    return isValid ? "" : "Please enter a valid email.";
  }, [email]);

  const passwordError = useMemo(() => {
    if (!password.trim()) {
      return "Password is required.";
    }

    return password.length >= 6
      ? ""
      : "Password must be at least 6 characters.";
  }, [password]);

  const canSubmit = !emailError && !passwordError && !isLoading;

  const handleLogin = async () => {
    if (emailError || passwordError) {
      Alert.alert("Check your details", "Please fix the highlighted fields.");
      return;
    }

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      router.replace("/(tabs)");
      return;
    }

    Alert.alert("Login failed", result.message);
  };

  const handleForgotPassword = () => {
    if (!email.trim()) {
      Alert.alert(
        "Enter your email",
        "Type your email address first, then tap Forgot password again.",
      );
      return;
    }

    Alert.alert(
      "Password reset",
      `A reset link has been sent to ${email}.\nPlease follow the instructions in your email to set a new password.`,
    );
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
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>
            Sign in to manage meetings and connect with your team.
          </Text>
        </View>

        <View style={styles.card}>
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
              style={[styles.input, emailError ? styles.inputError : null]}
            />
            {emailError ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : null}
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Password</Text>
            <View
              style={[
                styles.passwordWrap,
                passwordError ? styles.inputError : null,
              ]}
            >
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholder="Enter your password"
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
            {passwordError ? (
              <Text style={styles.errorText}>{passwordError}</Text>
            ) : null}
          </View>

          <Pressable onPress={handleForgotPassword} style={styles.forgotWrap}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            disabled={!canSubmit}
            onPress={handleLogin}
            style={({ pressed }) => [
              styles.loginButton,
              { opacity: pressed || !canSubmit ? 0.95 : 1 },
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
                <Text style={styles.loginButtonText}>Login</Text>
              )}
            </LinearGradient>
          </Pressable>
        </View>

        <Text style={styles.bottomText}>
          Don’t have an account?{" "}
          <Link href="/register" style={styles.registerLink}>
            Register
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
    maxWidth: 280,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
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
  forgotWrap: {
    alignSelf: "flex-end",
    marginBottom: 18,
    marginTop: 2,
  },
  forgotText: {
    color: Colors.primary,
    fontWeight: "700",
    fontSize: 13,
  },
  loginButton: {
    borderRadius: 18,
    overflow: "hidden",
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
  loginButtonText: {
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
  registerLink: {
    color: Colors.primary,
    fontWeight: "800",
  },
});

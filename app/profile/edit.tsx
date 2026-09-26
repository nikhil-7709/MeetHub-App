import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { AppButton } from "@/components/Button";
import { AppInput } from "@/components/Input";
import { Theme } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuth } from "@/hooks/useAuth";

export default function EditProfileScreen() {
  const { user, updateUser } = useAuth();
  const colorScheme = useColorScheme() ?? "light";
  const theme = colorScheme === "dark" ? Theme.dark : Theme.light;
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFullName(user?.fullName ?? "");
    setEmail(user?.email ?? "");
  }, [user?.fullName, user?.email]);

  const initials = useMemo(() => {
    if (!fullName.trim()) {
      return "ME";
    }

    return fullName
      .split(" ")
      .map((segment) => segment[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [fullName]);

  const handleSave = async () => {
    if (!fullName.trim() || !email.trim()) {
      Alert.alert("Missing details", "Please complete your name and email.");
      return;
    }

    setIsSaving(true);
    await updateUser({
      fullName: fullName.trim(),
      email: email.trim(),
      avatar: initials,
    });
    setIsSaving(false);
    router.back();
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: theme.background },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.title, { color: theme.text }]}>Edit Profile</Text>

        <View
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <AppInput
            label="Full name"
            value={fullName}
            onChangeText={setFullName}
          />
          <AppInput
            label="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <AppButton
            title={isSaving ? "Saving..." : "Save Changes"}
            onPress={handleSave}
            disabled={isSaving}
          />
          <AppButton
            title="Cancel"
            variant="ghost"
            onPress={() => router.back()}
            style={styles.cancelButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 36,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 18,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
  },
  cancelButton: {
    marginTop: 12,
  },
});

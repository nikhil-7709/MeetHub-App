import { router } from "expo-router";
import React from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { Avatar } from "@/components/Avatar";
import { AppButton } from "@/components/Button";
import { Colors, Theme } from "@/constants/Colors";
import {
    setPreferredColorScheme,
    useColorScheme,
} from "@/hooks/use-color-scheme";
import { useAuth } from "@/hooks/useAuth";

const settings = [
  "Notifications",
  "Dark mode",
  "Language",
  "Privacy",
  "About MeetHub",
];

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const colorScheme = useColorScheme() ?? "light";
  const theme = colorScheme === "dark" ? Theme.dark : Theme.light;

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const handleSettingPress = (item: string) => {
    if (item === "Notifications") {
      router.push("/profile/notifications");
      return;
    }

    if (item === "Language") {
      router.push("/profile/language");
      return;
    }

    if (item === "Privacy") {
      router.push("/profile/privacy");
      return;
    }

    if (item === "About MeetHub") {
      router.push("/profile/about");
      return;
    }
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
      >
        <Text style={[styles.title, { color: theme.text }]}>Profile</Text>

        <View
          style={[
            styles.profileCard,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <Avatar label={user?.avatar ?? "ME"} color="#4F46E5" size={70} />
          <Text style={[styles.name, { color: theme.text }]}>
            {user?.fullName ?? "Guest User"}
          </Text>
          <Text style={[styles.email, { color: theme.muted }]}>
            {user?.email ?? "guest@meethub.app"}
          </Text>
          <AppButton
            title="Edit Profile"
            variant="secondary"
            onPress={() => router.push("/profile/edit")}
          />
        </View>

        <View
          style={[
            styles.sectionCard,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          {settings.map((item) => {
            const isDarkModeRow = item === "Dark mode";

            return (
              <TouchableOpacity
                key={item}
                accessibilityRole="button"
                activeOpacity={0.7}
                style={[
                  styles.settingRow,
                  { borderBottomColor: theme.border },
                  isDarkModeRow && styles.darkModeRow,
                ]}
                onPress={() => {
                  if (isDarkModeRow) {
                    setPreferredColorScheme(
                      colorScheme === "dark" ? "light" : "dark",
                    );
                    return;
                  }

                  handleSettingPress(item);
                }}
              >
                <Text style={[styles.settingText, { color: theme.text }]}>
                  {item}
                </Text>

                {isDarkModeRow ? (
                  <Switch
                    value={colorScheme === "dark"}
                    onValueChange={(value) => {
                      setPreferredColorScheme(value ? "dark" : "light");
                    }}
                    trackColor={{ false: "#D1D5DB", true: Colors.primary }}
                    thumbColor={"#FFFFFF"}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    accessibilityLabel="Dark mode"
                  />
                ) : (
                  <Text style={[styles.chevron, { color: theme.muted }]}>
                    ›
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <AppButton
          title="Logout"
          variant="ghost"
          onPress={handleLogout}
          style={styles.logoutButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 36,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 18,
  },
  profileCard: {
    borderRadius: 20,
    padding: 22,
    alignItems: "center",
    borderWidth: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: "800",
    marginTop: 12,
  },
  email: {
    marginTop: 6,
    marginBottom: 18,
  },
  sectionCard: {
    marginTop: 18,
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
  },
  settingRow: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 58,
  },
  darkModeRow: {
    paddingRight: 12,
  },
  settingText: {
    fontWeight: "600",
  },
  chevron: {
    fontSize: 24,
  },
  logoutButton: {
    marginTop: 18,
  },
});

import { router } from "expo-router";
import React, { useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    View,
} from "react-native";

import { AppButton } from "@/components/Button";
import { Theme } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function NotificationSettingsScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = colorScheme === "dark" ? Theme.dark : Theme.light;

  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [meetingReminders, setMeetingReminders] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: theme.text }]}>Notifications</Text>

        <View
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <View style={[styles.row, { borderBottomColor: theme.border }]}>
            <Text style={[styles.label, { color: theme.text }]}>
              Push notifications
            </Text>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: "#D1D5DB", true: "#4F46E5" }}
            />
          </View>

          <View style={[styles.row, { borderBottomColor: theme.border }]}>
            <Text style={[styles.label, { color: theme.text }]}>
              Email alerts
            </Text>
            <Switch
              value={emailAlerts}
              onValueChange={setEmailAlerts}
              trackColor={{ false: "#D1D5DB", true: "#4F46E5" }}
            />
          </View>

          <View style={[styles.row, { borderBottomColor: theme.border }]}>
            <Text style={[styles.label, { color: theme.text }]}>
              Meeting reminders
            </Text>
            <Switch
              value={meetingReminders}
              onValueChange={setMeetingReminders}
              trackColor={{ false: "#D1D5DB", true: "#4F46E5" }}
            />
          </View>

          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.text }]}>
              Marketing emails
            </Text>
            <Switch
              value={marketingEmails}
              onValueChange={setMarketingEmails}
              trackColor={{ false: "#D1D5DB", true: "#4F46E5" }}
            />
          </View>
        </View>

        <AppButton title="Back to profile" onPress={() => router.back()} />
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
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 20,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
    minHeight: 58,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
});

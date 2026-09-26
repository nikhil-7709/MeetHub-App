import { router } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { AppButton } from "@/components/Button";
import { Colors, Theme } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function AboutMeetHubScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = colorScheme === "dark" ? Theme.dark : Theme.light;

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: theme.text }]}>About MeetHub</Text>

        <View
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.brand, { color: Colors.primary }]}>MeetHub</Text>
          <Text style={[styles.version, { color: theme.muted }]}>
            Version 1.0.0
          </Text>
          <Text style={[styles.text, { color: theme.text }]}>
            MeetHub helps teams plan meetings, manage scheduling, and stay in
            sync with fewer back-and-forth emails.
          </Text>
          <Text style={[styles.text, { color: theme.text }]}>
            Built for quick collaboration and better meeting flow across
            workspaces.
          </Text>
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
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    marginBottom: 20,
  },
  brand: {
    fontWeight: "800",
    fontSize: 30,
    marginBottom: 6,
  },
  version: {
    fontSize: 14,
    marginBottom: 18,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
});

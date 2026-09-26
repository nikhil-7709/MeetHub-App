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

export default function PrivacyScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = colorScheme === "dark" ? Theme.dark : Theme.light;

  const [profileVisible, setProfileVisible] = useState(true);
  const [showActivity, setShowActivity] = useState(false);
  const [locationAccess, setLocationAccess] = useState(false);
  const [shareData, setShareData] = useState(false);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: theme.text }]}>Privacy</Text>

        <View
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <View style={[styles.row, { borderBottomColor: theme.border }]}>
            <Text style={[styles.label, { color: theme.text }]}>
              Profile visibility
            </Text>
            <Switch
              value={profileVisible}
              onValueChange={setProfileVisible}
              trackColor={{ false: "#D1D5DB", true: "#4F46E5" }}
            />
          </View>

          <View style={[styles.row, { borderBottomColor: theme.border }]}>
            <Text style={[styles.label, { color: theme.text }]}>
              Show activity status
            </Text>
            <Switch
              value={showActivity}
              onValueChange={setShowActivity}
              trackColor={{ false: "#D1D5DB", true: "#4F46E5" }}
            />
          </View>

          <View style={[styles.row, { borderBottomColor: theme.border }]}>
            <Text style={[styles.label, { color: theme.text }]}>
              Location access
            </Text>
            <Switch
              value={locationAccess}
              onValueChange={setLocationAccess}
              trackColor={{ false: "#D1D5DB", true: "#4F46E5" }}
            />
          </View>

          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.text }]}>
              Share analytics
            </Text>
            <Switch
              value={shareData}
              onValueChange={setShareData}
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

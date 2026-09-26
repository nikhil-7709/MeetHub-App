import { router } from "expo-router";
import React, { useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { AppButton } from "@/components/Button";
import { Theme } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/use-color-scheme";

const languages = ["English", "Hindi", "Spanish", "French", "Arabic"];

export default function LanguageScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = colorScheme === "dark" ? Theme.dark : Theme.light;
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: theme.text }]}>Language</Text>

        <View
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          {languages.map((language) => {
            const isSelected = selectedLanguage === language;

            return (
              <TouchableOpacity
                key={language}
                activeOpacity={0.7}
                onPress={() => setSelectedLanguage(language)}
                style={[
                  styles.row,
                  { borderBottomColor: theme.border },
                  isSelected && styles.selectedRow,
                ]}
              >
                <Text style={[styles.label, { color: theme.text }]}>
                  {language}
                </Text>
                <Text style={[styles.check, { color: theme.primary }]}>
                  {isSelected ? "✓" : ""}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <AppButton title="Apply language" onPress={() => router.back()} />
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
  selectedRow: {
    backgroundColor: "rgba(79, 70, 229, 0.06)",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  check: {
    fontSize: 18,
    fontWeight: "800",
  },
});

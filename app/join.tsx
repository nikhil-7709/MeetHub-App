import { router } from "expo-router";
import React, { useState } from "react";
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
import { Colors, Theme } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function JoinMeetingScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = colorScheme === "dark" ? Theme.dark : Theme.light;
  const [meetingId, setMeetingId] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleJoin = () => {
    if (!meetingId.trim() || !password.trim() || !name.trim()) {
      Alert.alert(
        "Missing details",
        "Please fill in the meeting ID, password, and your name.",
      );
      return;
    }

    Alert.alert("Joined", `Welcome ${name}. You are joining ${meetingId}.`);
    router.push({
      pathname: "/meeting/room",
      params: { id: meetingId, title: "Joined Meeting" },
    });
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.container,
          { backgroundColor: theme.background },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.brand, { color: Colors.primary }]}>MeetHub</Text>
        <Text style={[styles.title, { color: theme.text }]}>Join meeting</Text>
        <Text style={[styles.subtitle, { color: theme.muted }]}>
          Enter the meeting details to access your room.
        </Text>

        <View
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <AppInput
            label="Meeting ID"
            value={meetingId}
            onChangeText={setMeetingId}
            autoCapitalize="characters"
          />
          <AppInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <AppInput label="Your name" value={name} onChangeText={setName} />
          <AppButton title="Join Meeting" onPress={handleJoin} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 32,
  },
  brand: {
    fontWeight: "800",
    fontSize: 28,
    textAlign: "center",
    marginBottom: 10,
  },
  title: {
    fontWeight: "800",
    fontSize: 28,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
  },
});

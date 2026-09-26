import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Alert,
    Animated,
    Linking,
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
import { useAuth } from "@/hooks/useAuth";
import { useMeetings } from "@/hooks/useMeetings";
import { MeetingInput, MeetingPlatform } from "@/types/meeting";

const today = new Date().toISOString().slice(0, 10);
const meetingPlatforms: MeetingPlatform[] = [
  "MeetHub",
  "Google Meet",
  "Zoom",
  "Microsoft Teams",
  "Custom",
];

const makeMeetingId = () =>
  `MH-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

export default function CreateMeetingScreen() {
  const { user } = useAuth();
  const { createMeeting } = useMeetings();
  const colorScheme = useColorScheme() ?? "light";
  const theme = colorScheme === "dark" ? Theme.dark : Theme.light;
  const slideAnim = useRef(new Animated.Value(24)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [form, setForm] = useState<MeetingInput>({
    title: "",
    description: "",
    date: today,
    startTime: "09:00",
    endTime: "10:00",
    durationMinutes: 60,
    password: "",
    participantLimit: 10,
    meetingType: "Scheduled",
    hostName: user?.fullName ?? "",
    meetingPlatform: "MeetHub",
    inviteLink: "",
  });

  const [createdMeeting, setCreatedMeeting] = useState<null | {
    id: string;
    title: string;
    link: string;
  }>(null);

  useEffect(() => {
    setForm((previous) => ({
      ...previous,
      hostName: previous.hostName || user?.fullName || "",
    }));
  }, [user?.fullName]);

  const selectedPlatform = form.meetingPlatform;

  useEffect(() => {
    if (!createdMeeting) {
      slideAnim.setValue(24);
      fadeAnim.setValue(0);
      return;
    }

    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [createdMeeting, fadeAnim, slideAnim]);

  const updateField = <K extends keyof MeetingInput>(
    key: K,
    value: MeetingInput[K],
  ) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const canSubmit = useMemo(
    () =>
      form.title.trim() &&
      form.hostName.trim() &&
      form.date &&
      form.startTime &&
      form.endTime,
    [form.date, form.endTime, form.hostName, form.startTime, form.title],
  );

  const handleCreateMeeting = async () => {
    if (!canSubmit) {
      Alert.alert(
        "Missing details",
        "Add a meeting title, host name, date, start time, and end time.",
      );
      return;
    }

    if (!user) {
      Alert.alert("Login required", "Please log in before creating a meeting.");
      router.push("/login");
      return;
    }

    const nextForm: MeetingInput = {
      ...form,
      title: form.title.trim(),
      hostName: form.hostName.trim() || user.fullName,
      description:
        form.description.trim() ||
        `${form.title.trim()} collaboration session.`,
      endTime: form.endTime || form.startTime,
    };

    const result = await createMeeting(nextForm, nextForm.hostName, user.id);

    const nextCreated = {
      id: result.meeting.id || makeMeetingId(),
      title: result.meeting.title || nextForm.title,
      link: result.meeting.meetingLink,
    };

    setCreatedMeeting(nextCreated);
    Alert.alert("Meeting created", `Meeting ID: ${nextCreated.id}`);
  };

  const handleCancel = () => {
    setCreatedMeeting(null);
    setForm({
      title: "",
      description: "",
      date: today,
      startTime: "09:00",
      endTime: "10:00",
      durationMinutes: 60,
      password: "",
      participantLimit: 10,
      meetingType: "Scheduled",
      hostName: user?.fullName ?? "",
      meetingPlatform: "MeetHub",
      inviteLink: "",
    });
    router.back();
  };

  const openMeetingLink = async (link: string) => {
    if (link.startsWith("meethub://")) {
      const meetingId = link.split("/").pop() || createdMeeting?.id || "";
      router.push({
        pathname: "/meeting/room",
        params: { id: meetingId, title: createdMeeting?.title || form.title },
      });
      return;
    }

    const supported = await Linking.canOpenURL(link);

    if (!supported) {
      Alert.alert(
        "Unable to open link",
        "The invite link could not be opened.",
      );
      return;
    }

    await Linking.openURL(link);
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
        keyboardDismissMode="on-drag"
        automaticallyAdjustKeyboardInsets={true}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: theme.text }]}>
            Create Meeting
          </Text>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>Live</Text>
          </View>
        </View>

        <Text style={[styles.subtitle, { color: theme.muted }]}>
          Plan a smart, polished session for your team in a few quick steps.
        </Text>

        <View
          style={[
            styles.formCard,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <AppInput
            label="Meeting Title"
            value={form.title}
            onChangeText={(value) => updateField("title", value)}
            placeholder="Sprint planning"
          />

          <View style={styles.splitRow}>
            <AppInput
              label="Date"
              value={form.date}
              onChangeText={(value) => updateField("date", value)}
              style={styles.halfInput}
              placeholder="2026-09-24"
            />
            <AppInput
              label="Start Time"
              value={form.startTime}
              onChangeText={(value) => updateField("startTime", value)}
              style={styles.halfInput}
              placeholder="09:00"
            />
          </View>

          <View style={styles.splitRow}>
            <AppInput
              label="End Time"
              value={form.endTime}
              onChangeText={(value) => updateField("endTime", value)}
              style={styles.halfInput}
              placeholder="10:00"
            />
            <AppInput
              label="Host Name"
              value={form.hostName}
              onChangeText={(value) => updateField("hostName", value)}
              style={styles.halfInput}
              placeholder="Alex Morgan"
            />
          </View>

          <Text style={[styles.fieldLabel, { color: theme.muted }]}>
            Meeting app
          </Text>
          <View style={styles.platformRow}>
            {meetingPlatforms.map((platform) => (
              <AppButton
                key={platform}
                title={platform}
                variant={
                  form.meetingPlatform === platform ? "primary" : "ghost"
                }
                onPress={() => updateField("meetingPlatform", platform)}
                style={styles.platformButton}
              />
            ))}
          </View>

          {selectedPlatform === "Custom" ? (
            <AppInput
              label="Custom meeting link"
              value={form.inviteLink}
              onChangeText={(value) => updateField("inviteLink", value)}
              placeholder="https://your-meeting-link.com"
            />
          ) : null}

          <AppInput
            label="Meeting Description"
            value={form.description}
            onChangeText={(value) => updateField("description", value)}
            multiline
            numberOfLines={4}
            placeholder="Share agenda, goals, and context for the session."
          />

          <View style={styles.footerButtons}>
            <AppButton
              title="Cancel"
              variant="ghost"
              onPress={handleCancel}
              style={styles.cancelButton}
            />
            <AppButton
              title="Create Meeting"
              onPress={handleCreateMeeting}
              style={styles.createButton}
            />
          </View>
        </View>

        {createdMeeting ? (
          <Animated.View
            style={[
              styles.summaryCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.summaryLabel}>Meeting summary</Text>
            <Text style={[styles.summaryTitle, { color: theme.text }]}>
              {createdMeeting.title}
            </Text>
            <Text style={[styles.summaryText, { color: theme.muted }]}>
              Meeting ID
            </Text>
            <Text style={[styles.summaryId, { color: Colors.primary }]}>
              {createdMeeting.id}
            </Text>

            <View style={styles.summaryActions}>
              <AppButton
                title="Join Meeting"
                onPress={() => openMeetingLink(createdMeeting.link)}
                style={styles.summaryPrimary}
              />
              <AppButton
                title="Copy ID"
                variant="secondary"
                onPress={() => Alert.alert("Copied", createdMeeting.id)}
                style={styles.summarySecondary}
              />
            </View>
          </Animated.View>
        ) : null}
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 56,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.6,
  },
  headerBadge: {
    backgroundColor: "rgba(79, 70, 229, 0.12)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(79, 70, 229, 0.2)",
  },
  headerBadgeText: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 18,
  },
  formCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 18,
    shadowColor: "#4F46E5",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  splitRow: {
    flexDirection: "row",
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 13,
    marginBottom: 8,
    fontWeight: "600",
  },
  platformRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },
  platformButton: {
    minHeight: 38,
    marginBottom: 4,
  },
  footerButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
  },
  createButton: {
    flex: 2,
  },
  summaryCard: {
    marginTop: 18,
    borderRadius: 24,
    borderWidth: 1,
    padding: 18,
    shadowColor: "#4F46E5",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    color: Colors.primary,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  summaryId: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 16,
  },
  summaryActions: {
    flexDirection: "row",
    gap: 10,
  },
  summaryPrimary: {
    flex: 2,
  },
  summarySecondary: {
    flex: 1,
  },
});

import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    Alert,
    Linking,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { AppButton } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { MeetingCard } from "@/components/MeetingCard";
import { Theme } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useMeetings } from "@/hooks/useMeetings";

const filterTabs = ["Upcoming", "Today", "Past"];

export default function MeetingsScreen() {
  const { meetings, loading, joinMeetingByCode } = useMeetings();
  const colorScheme = useColorScheme() ?? "light";
  const theme = colorScheme === "dark" ? Theme.dark : Theme.light;
  const [filter, setFilter] = useState<"Upcoming" | "Today" | "Past">(
    "Upcoming",
  );
  const [search, setSearch] = useState("");
  const [joinCode, setJoinCode] = useState("");

  const visibleMeetings = useMemo(() => {
    const normalized = search.toLowerCase();
    const next = meetings.filter((meeting) => {
      const matchFilter =
        (filter === "Upcoming" &&
          (meeting.status === "upcoming" || meeting.status === "today")) ||
        (filter === "Today" && meeting.status === "today") ||
        (filter === "Past" && meeting.status === "past");

      const matchSearch =
        meeting.title.toLowerCase().includes(normalized) ||
        meeting.hostName.toLowerCase().includes(normalized) ||
        meeting.id.toLowerCase().includes(normalized) ||
        meeting.meetingLink.toLowerCase().includes(normalized);

      return matchFilter && matchSearch;
    });

    return next;
  }, [filter, meetings, search]);

  const handleJoinMeeting = async () => {
    const meeting = await joinMeetingByCode(joinCode);

    if (!meeting) {
      Alert.alert(
        "Meeting not found",
        "Enter a valid Meeting ID or invite link.",
      );
      return;
    }

    if (meeting.meetingLink.startsWith("http")) {
      const supported = await Linking.canOpenURL(meeting.meetingLink);
      if (supported) {
        await Linking.openURL(meeting.meetingLink);
        return;
      }
    }

    router.push({
      pathname: "/meeting/room",
      params: { id: meeting.id, title: meeting.title },
    });
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: theme.background }]}
      >
        <View style={styles.loadingBox}>
          <Text style={[styles.loadingText, { color: theme.text }]}>
            Loading meetings...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { backgroundColor: theme.background },
        ]}
      >
        <Text style={[styles.title, { color: theme.text }]}>Meetings</Text>

        <View
          style={[
            styles.joinCard,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Join meeting
          </Text>
          <TextInput
            value={joinCode}
            onChangeText={setJoinCode}
            placeholder="Meeting ID or invite link"
            placeholderTextColor={theme.muted}
            style={[
              styles.searchInput,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
                color: theme.text,
              },
            ]}
          />
          <AppButton title="Join Meeting" onPress={handleJoinMeeting} />
        </View>

        <TextInput
          value={search}
          onChangeText={setSearch}
          style={[
            styles.searchInput,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
              color: theme.text,
            },
          ]}
          placeholder="Search meetings"
          placeholderTextColor={theme.muted}
        />

        <View style={styles.filterRow}>
          {filterTabs.map((tab) => (
            <AppButton
              key={tab}
              title={tab}
              variant={filter === tab ? "primary" : "ghost"}
              style={styles.filterButton}
              onPress={() => setFilter(tab as "Upcoming" | "Today" | "Past")}
            />
          ))}
        </View>

        {visibleMeetings.length === 0 ? (
          <EmptyState
            title="No meetings found"
            subtitle="Try searching for another meeting or create a new one."
          />
        ) : (
          visibleMeetings.map((meeting) => (
            <MeetingCard
              key={meeting.id}
              meeting={meeting}
              onPress={() =>
                router.push({
                  pathname: "/meeting/[id]",
                  params: { id: meeting.id },
                })
              }
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 36,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 18,
  },
  joinCard: {
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },
  filterRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },
  searchInput: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    marginBottom: 14,
  },
  filterButton: {
    flex: 1,
    minHeight: 38,
  },
  loadingBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontWeight: "700",
  },
});

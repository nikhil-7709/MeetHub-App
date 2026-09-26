import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Linking,
    Pressable,
    SafeAreaView,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { Avatar } from "@/components/Avatar";
import { AppButton } from "@/components/Button";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/hooks/useAuth";
import { useMeetings } from "@/hooks/useMeetings";
import { Meeting } from "@/types/meeting";

const meetingStatusColors = {
  upcoming: "#E0F2FE",
  today: "#DCFCE7",
  past: "#FEE2E2",
};

export default function MeetingDetailScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const { meetings, getMeetingById } = useMeetings();
  const { user } = useAuth();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const resolveMeeting = async () => {
      const meetingId = typeof params.id === "string" ? params.id : "";
      if (!meetingId) {
        setMeeting(null);
        return;
      }

      const found =
        meetings.find((item) => item.id === meetingId) ??
        (await getMeetingById(meetingId));

      setMeeting(found ?? null);
    };

    resolveMeeting();
  }, [getMeetingById, meetings, params.id]);

  const meetingBadgeStyles = useMemo(
    () => ({
      backgroundColor: meeting
        ? meetingStatusColors[meeting.status]
        : "#EEF2FF",
    }),
    [meeting],
  );

  if (!meeting) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No meeting found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleJoin = async () => {
    if (!user) {
      Alert.alert("Login required", "Please log in to join this meeting.");
      router.push("/login");
      return;
    }

    if (meeting.meetingLink.startsWith("http")) {
      const supported = await Linking.canOpenURL(meeting.meetingLink);
      if (supported) {
        await Linking.openURL(meeting.meetingLink);
        setJoined(true);
        return;
      }
    }

    setJoined(true);
    router.push({
      pathname: "/meeting/room",
      params: { id: meeting.id, title: meeting.title },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.badge}>Meeting details</Text>
          <Text style={styles.title}>{meeting.title}</Text>
          <Text style={styles.description}>{meeting.description}</Text>
        </View>

        <View style={[styles.badgeRow, meetingBadgeStyles]}>
          <Text style={styles.badgeText}>{meeting.status}</Text>
        </View>

        <View style={styles.grid}>
          <View style={styles.infoCard}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>{meeting.date}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.label}>Time</Text>
            <Text style={styles.value}>
              {meeting.startTime} - {meeting.endTime}
            </Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.label}>Host</Text>
            <Text style={styles.value}>{meeting.hostName}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.label}>Meeting ID</Text>
            <Text style={styles.value}>{meeting.id}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Participants</Text>
        <View style={styles.participantsRow}>
          {meeting.participants.map((participant) => (
            <View key={participant.id} style={styles.participantItem}>
              <Avatar
                label={participant.name.slice(0, 2).toUpperCase()}
                size={36}
                color={participant.color}
              />
              <Text style={styles.participantName}>{participant.name}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actionsRow}>
          <Pressable
            style={styles.secondaryButton}
            onPress={() => Alert.alert("Copied", `Meeting ID: ${meeting.id}`)}
          >
            <Text style={styles.secondaryText}>Copy Meeting ID</Text>
          </Pressable>
          <Pressable
            style={styles.secondaryButton}
            onPress={() => Share.share({ message: meeting.meetingLink })}
          >
            <Text style={styles.secondaryText}>Share</Text>
          </Pressable>
        </View>

        <AppButton
          title={joined ? "Joined" : "Join Meeting"}
          onPress={handleJoin}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    gap: 16,
    paddingBottom: 32,
  },
  header: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#EEF2F7",
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#EEF2FF",
    borderRadius: 999,
    color: Colors.primary,
    fontWeight: "700",
    fontSize: 12,
  },
  title: {
    color: Colors.text,
    fontSize: 26,
    fontWeight: "800",
    marginTop: 12,
  },
  description: {
    color: Colors.muted,
    marginTop: 8,
    lineHeight: 20,
  },
  badgeRow: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  badgeText: {
    textTransform: "capitalize",
    color: "#0F172A",
    fontWeight: "700",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  infoCard: {
    flexBasis: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#EEF2F7",
  },
  label: {
    color: Colors.muted,
    fontSize: 12,
  },
  value: {
    color: Colors.text,
    fontWeight: "700",
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.text,
  },
  participantsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  participantItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#EEF2F7",
    alignItems: "center",
  },
  participantName: {
    marginTop: 8,
    fontWeight: "600",
    color: Colors.text,
    fontSize: 12,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#EEF2FF",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryText: {
    color: Colors.primary,
    fontWeight: "700",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: Colors.text,
    fontWeight: "700",
  },
});

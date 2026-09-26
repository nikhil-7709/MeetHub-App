import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Colors, Theme } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Meeting } from "@/types/meeting";

type MeetingCardProps = {
  meeting: Meeting;
  onPress?: () => void;
  actionLabel?: string;
};

export function MeetingCard({
  meeting,
  onPress,
  actionLabel = "Join",
}: MeetingCardProps) {
  const colorScheme = useColorScheme() ?? "light";
  const theme = colorScheme === "dark" ? Theme.dark : Theme.light;

  const statusConfig =
    meeting.status === "past"
      ? { label: "Past", tint: "#FEE2E2", text: "#B91C1C" }
      : meeting.status === "today"
        ? { label: "Today", tint: "#DCFCE7", text: "#15803D" }
        : { label: "Upcoming", tint: "#E0E7FF", text: "#4338CA" };

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.border },
      ]}
    >
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <Text style={[styles.title, { color: theme.text }]}>
            {meeting.title}
          </Text>
          <Text style={[styles.meta, { color: theme.muted }]}>
            {meeting.meetingType}
          </Text>
        </View>

        <View
          style={[styles.statusBadge, { backgroundColor: statusConfig.tint }]}
        >
          <Text style={[styles.statusText, { color: statusConfig.text }]}>
            {statusConfig.label}
          </Text>
        </View>
      </View>

      <View style={styles.detailRow}>
        <View style={styles.iconBubble}>
          <Text style={styles.iconText}>📅</Text>
        </View>
        <View>
          <Text style={[styles.label, { color: theme.muted }]}>Date</Text>
          <Text style={[styles.detail, { color: theme.text }]}>
            {meeting.date}
          </Text>
        </View>
      </View>

      <View style={styles.timeRow}>
        <View style={styles.timeBlock}>
          <Text style={[styles.label, { color: theme.muted }]}>Time</Text>
          <Text style={[styles.detail, { color: theme.text }]}>
            {meeting.startTime} - {meeting.endTime}
          </Text>
        </View>
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.infoBlock}>
          <Text style={[styles.label, { color: theme.muted }]}>Host</Text>
          <Text style={[styles.infoText, { color: theme.text }]}>
            {meeting.hostName}
          </Text>
        </View>
        <View style={styles.infoBlock}>
          <Text style={[styles.label, { color: theme.muted }]}>Meeting ID</Text>
          <Text style={[styles.infoText, { color: theme.text }]}>
            {meeting.id}
          </Text>
        </View>
      </View>

      <Pressable style={styles.actionButton} onPress={onPress}>
        <Text style={styles.actionText}>{actionLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    shadowColor: "#4F46E5",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  titleWrap: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  meta: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "600",
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: "center",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  iconBubble: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: "rgba(79, 70, 229, 0.10)",
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  detail: {
    fontSize: 14,
    fontWeight: "600",
  },
  timeRow: {
    marginBottom: 12,
  },
  timeBlock: {
    paddingLeft: 44,
  },
  infoGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  infoBlock: {
    flex: 1,
    backgroundColor: "rgba(148, 163, 184, 0.06)",
    borderRadius: 12,
    padding: 10,
  },
  infoText: {
    fontSize: 13,
    fontWeight: "700",
  },
  actionButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    shadowColor: "#4F46E5",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  actionText: {
    color: "#FFF",
    fontWeight: "800",
    fontSize: 14,
  },
});

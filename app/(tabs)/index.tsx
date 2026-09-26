import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { AppButton } from "@/components/Button";
import { MeetingCard } from "@/components/MeetingCard";
import { Colors, Theme } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuth } from "@/hooks/useAuth";
import { useMeetings } from "@/hooks/useMeetings";

const stats = [
  { title: "Today", value: "3", icon: "calendar" },
  { title: "Calls", value: "2", icon: "videocam" },
  { title: "Online", value: "12", icon: "people" },
];

export default function HomeScreen() {
  const { user } = useAuth();
  const { meetings } = useMeetings();
  const colorScheme = useColorScheme() ?? "light";
  const theme = colorScheme === "dark" ? Theme.dark : Theme.light;

  const displayName = user?.fullName?.split(" ")[0] ?? "User";

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
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topRow}>
          <View>
            <Text style={[styles.brand, { color: Colors.primary }]}>
              MeetHub
            </Text>
            <Text style={[styles.greeting, { color: theme.text }]}>
              Good Morning, {displayName} 👋
            </Text>
          </View>

          <View style={styles.avatarWrap}>
            <Text style={styles.avatarText}>{user?.avatar ?? "ME"}</Text>
          </View>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroGlow} />
          <View style={styles.heroHeaderRow}>
            <Text style={styles.heroLabel}>Your day</Text>
            <View style={styles.heroChip}>
              <Text style={styles.heroChipText}>4 scheduled</Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>Stay aligned with your team.</Text>
          <Text style={styles.heroSubtitle}>
            Jump into meetings, review the agenda, and keep everyone moving.
          </Text>

          <View style={styles.actionsRow}>
            <AppButton
              title="Start Meeting"
              variant="secondary"
              onPress={() => router.push("/(tabs)/create")}
              style={styles.primaryButton}
              textStyle={styles.primaryButtonText}
            />
            <AppButton
              title="Join Meeting"
              variant="primary"
              onPress={() => router.push("/join")}
              style={styles.secondaryButton}
              textStyle={styles.secondaryButtonText}
            />
          </View>
        </View>

        <View style={styles.statsRow}>
          {stats.map((item) => (
            <View
              key={item.title}
              style={[
                styles.statCard,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              <View style={styles.statIconWrap}>
                <Ionicons
                  name={item.icon as any}
                  size={16}
                  color={Colors.primary}
                />
              </View>
              <Text style={[styles.statTitle, { color: theme.muted }]}>
                {item.title}
              </Text>
              <Text style={[styles.statValue, { color: theme.text }]}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Upcoming Meetings
          </Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/meetings")}>
            <Text style={[styles.viewAll, { color: Colors.primary }]}>
              View all
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.sectionCard,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          {meetings.slice(0, 2).map((meeting) => (
            <MeetingCard
              key={meeting.id}
              meeting={meeting}
              onPress={() =>
                router.push({
                  pathname: "/meeting/[id]",
                  params: { id: meeting.id },
                })
              }
              actionLabel="Join"
            />
          ))}
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
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 120,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  brand: {
    fontWeight: "800",
    fontSize: 30,
    letterSpacing: -0.5,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "800",
    marginTop: 6,
    letterSpacing: -0.4,
  },
  avatarWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(79, 70, 229, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: Colors.primary,
    fontWeight: "800",
    fontSize: 12,
  },
  heroCard: {
    borderRadius: 28,
    padding: 20,
    backgroundColor: "#4F46E5",
    overflow: "hidden",
    shadowColor: "#4F46E5",
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
    marginBottom: 18,
  },
  heroGlow: {
    position: "absolute",
    right: -30,
    top: -30,
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  heroHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  heroLabel: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  heroChip: {
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  heroChipText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFF",
  },
  heroTitle: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 34,
    marginBottom: 8,
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 18,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  primaryButtonText: {
    color: "#111827",
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
  secondaryButtonText: {
    color: "#FFFFFF",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 22,
  },
  statCard: {
    flex: 1,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    shadowColor: "#0F172A",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  statIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: "rgba(79, 70, 229, 0.10)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  statTitle: {
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
  },
  viewAll: {
    fontSize: 13,
    fontWeight: "700",
  },
  sectionCard: {
    borderRadius: 22,
    padding: 14,
    borderWidth: 1,
    shadowColor: "#4F46E5",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
});

import React from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { EmptyState } from "@/components/EmptyState";
import { Colors, Theme } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useMeetings } from "@/hooks/useMeetings";

export default function NotificationsScreen() {
  const { notifications, markNotificationRead, clearNotifications } =
    useMeetings();
  const colorScheme = useColorScheme() ?? "light";
  const theme = colorScheme === "dark" ? Theme.dark : Theme.light;

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Notifications</Text>
        <TouchableOpacity onPress={() => clearNotifications()}>
          <Text style={[styles.clearText, { color: Colors.primary }]}>
            Clear all
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: theme.background },
        ]}
      >
        {notifications.length === 0 ? (
          <EmptyState
            title="No notifications"
            subtitle="You are all caught up for now."
          />
        ) : (
          notifications.map((notification) => (
            <View
              key={notification.id}
              style={[
                styles.card,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
                !notification.read && {
                  borderColor: "#C7D2FE",
                  backgroundColor:
                    colorScheme === "dark" ? "#1E293B" : "#F8FAFF",
                },
              ]}
            >
              <View style={styles.row}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>
                  {notification.title}
                </Text>
                {!notification.read ? (
                  <Text style={[styles.dot, { color: Colors.primary }]}>●</Text>
                ) : null}
              </View>
              <Text style={[styles.message, { color: theme.muted }]}>
                {notification.message}
              </Text>
              <View style={styles.footerRow}>
                <Text style={[styles.time, { color: theme.muted }]}>
                  {new Date(notification.createdAt).toLocaleDateString()}
                </Text>
                {!notification.read ? (
                  <TouchableOpacity
                    onPress={() => markNotificationRead(notification.id)}
                  >
                    <Text style={[styles.readText, { color: Colors.primary }]}>
                      Mark as read
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={[styles.readText, { color: Colors.primary }]}>
                    Read
                  </Text>
                )}
              </View>
            </View>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
  },
  clearText: {
    fontWeight: "700",
  },
  container: {
    padding: 20,
    paddingTop: 0,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontWeight: "700",
    fontSize: 16,
    flex: 1,
  },
  dot: {
    fontWeight: "700",
  },
  message: {
    marginTop: 8,
    lineHeight: 20,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  time: {
    fontSize: 12,
  },
  readText: {
    fontWeight: "700",
  },
});

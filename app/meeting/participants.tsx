import React from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";

import { Avatar } from "@/components/Avatar";
import { Colors } from "@/constants/Colors";

const participants = [
  {
    id: "1",
    name: "Ava Brown",
    mute: false,
    cameraOn: true,
    host: true,
    color: "#7C3AED",
  },
  {
    id: "2",
    name: "Liam Carter",
    mute: true,
    cameraOn: true,
    host: false,
    color: "#4F46E5",
  },
  {
    id: "3",
    name: "Zoe Lane",
    mute: false,
    cameraOn: false,
    host: false,
    color: "#14B8A6",
  },
  {
    id: "4",
    name: "Mia Patel",
    mute: false,
    cameraOn: true,
    host: false,
    color: "#F97316",
  },
];

export default function MeetingParticipantsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Participants</Text>
      </View>

      <FlatList
        data={participants}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.leftWrap}>
              <Avatar
                label={item.name.slice(0, 2).toUpperCase()}
                color={item.color}
                size={42}
              />
              <View style={styles.nameBlock}>
                <Text style={styles.name}>{item.name}</Text>
                {item.host ? <Text style={styles.hostBadge}>Host</Text> : null}
              </View>
            </View>
            <View style={styles.statusBlock}>
              <Text style={styles.status}>
                {item.mute ? "Mic off" : "Mic on"}
              </Text>
              <Text style={styles.status}>
                {item.cameraOn ? "Camera on" : "Camera off"}
              </Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF2F7",
  },
  title: {
    color: Colors.text,
    fontWeight: "800",
    fontSize: 20,
  },
  list: {
    padding: 16,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EEF2F7",
  },
  leftWrap: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  nameBlock: {
    marginLeft: 12,
  },
  name: {
    color: Colors.text,
    fontWeight: "700",
  },
  hostBadge: {
    color: Colors.primary,
    fontWeight: "700",
    marginTop: 2,
    fontSize: 12,
  },
  statusBlock: {
    alignItems: "flex-end",
  },
  status: {
    color: Colors.muted,
    fontSize: 12,
    marginBottom: 2,
  },
});

import React, { useState } from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/Colors";

const initialMessages = [
  {
    id: "1",
    sender: "Ava",
    text: "Thanks for joining. Let’s start with our sprint review.",
    time: "09:58 AM",
    isOwn: false,
  },
  {
    id: "2",
    sender: "You",
    text: "Perfect, I’m ready to share the update.",
    time: "10:00 AM",
    isOwn: true,
  },
  {
    id: "3",
    sender: "Liam",
    text: "I have uploaded the latest mockups.",
    time: "10:01 AM",
    isOwn: false,
  },
];

export default function MeetingChatScreen() {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");

  const sendMessage = () => {
    if (!draft.trim()) {
      return;
    }

    const newMessage = {
      id: Date.now().toString(),
      sender: "You",
      text: draft.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isOwn: true,
    };

    setMessages((previous) => [...previous, newMessage]);
    setDraft("");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Meeting Chat</Text>
        </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View
            style={[
              styles.bubbleWrap,
              item.isOwn ? styles.bubbleOwn : styles.bubbleOther,
            ]}
          >
            <Text style={styles.sender}>{item.sender}</Text>
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
        )}
      />

      <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Type a message"
          style={styles.input}
          placeholderTextColor="#94A3B8"
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
      </KeyboardAvoidingView>
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
    gap: 10,
  },
  bubbleWrap: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  bubbleOwn: {
    alignSelf: "flex-end",
    backgroundColor: Colors.primary,
  },
  bubbleOther: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
  },
  sender: {
    fontWeight: "700",
    fontSize: 12,
    marginBottom: 6,
    color: "#CBD5E1",
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#FFFFFF",
  },
  time: {
    marginTop: 6,
    fontSize: 11,
    color: "#E2E8F0",
  },
  inputBar: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#EEF2F7",
    backgroundColor: "#FFFFFF",
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: Colors.text,
  },
  sendButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: "center",
  },
  sendText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});

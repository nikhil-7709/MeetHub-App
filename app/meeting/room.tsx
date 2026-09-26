import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions, useMicrophonePermissions } from "expo-camera";
import { router, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View, Dimensions, Share } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Avatar } from "@/components/Avatar";
import { Colors } from "@/constants/Colors";
import { useMeetings } from "@/hooks/useMeetings";
import { Meeting } from "@/types/meeting";

const { width } = Dimensions.get("window");

export default function MeetingRoomScreen() {
  const params = useLocalSearchParams<{ id?: string; title?: string }>();
  const { meetings, getMeetingById } = useMeetings();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [screenShareOn, setScreenShareOn] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [recording, setRecording] = useState(false);

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();

  useEffect(() => {
    const resolveMeeting = async () => {
      const meetingId = typeof params.id === "string" ? params.id : "";
      if (!meetingId) {
        setMeeting(null);
        return;
      }
      const found = meetings.find((item) => item.id === meetingId) ?? (await getMeetingById(meetingId));
      setMeeting(found ?? null);
    };
    resolveMeeting();
  }, [getMeetingById, meetings, params.id]);

  const handleRequestPermissions = async () => {
    const cameraStatus = await requestCameraPermission();
    const micStatus = await requestMicrophonePermission();
    if (!cameraStatus.granted || !micStatus.granted) {
      Alert.alert("Permissions needed", "MeetHub needs camera and microphone access to join the meeting.");
    }
  };

  const handleInvite = async () => {
    if (!meeting) return;
    try {
      await Share.share({
        message: `Join my meeting "${meeting.title}"!\nPlatform: ${meeting.meetingPlatform}\nLink: ${meeting.meetingLink}`,
      });
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  if (!meeting) {
    return (
      <View style={styles.darkBackground}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Meeting room unavailable</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const title = typeof params.title === "string" ? params.title : meeting.title;
  const roomParticipants = meeting.participants.length
    ? meeting.participants
    : [{ id: meeting.hostId, name: meeting.hostName, role: "host", mute: false, cameraOn: true, color: "#7C3AED" }];

  const hasPermissions = cameraPermission?.granted === true && microphonePermission?.granted === true;

  return (
    <View style={styles.darkBackground}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#FFF" />
          </Pressable>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.title} numberOfLines={1}>{title}</Text>
            <View style={styles.liveBadgeRow}>
              <View style={styles.liveDot} />
              <Text style={styles.meta}>{roomParticipants.length} Participants</Text>
            </View>
          </View>
          <Pressable
            style={styles.leaveButton}
            onPress={() => {
              Alert.alert("Leave meeting", "You have left the meeting.");
              router.back();
            }}
          >
            <Text style={styles.leaveText}>Leave</Text>
          </Pressable>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          {/* Main Video Area */}
          <View style={styles.mainVideoContainer}>
            {hasPermissions ? (
              <View style={styles.cameraWrapper}>
                {cameraOn ? (
                  <CameraView style={styles.cameraPreview} facing="front" mute={!micOn} />
                ) : (
                  <LinearGradient colors={["#1E1E2E", "#0B0B14"]} style={styles.cameraPreviewCenter}>
                    <Avatar label={meeting.hostName.slice(0, 2).toUpperCase()} size={90} color="#7C3AED" />
                  </LinearGradient>
                )}
                
                {/* Overlay Elements */}
                <LinearGradient colors={["transparent", "rgba(0,0,0,0.8)"]} style={styles.bottomGradient} pointerEvents="none" />
                <View style={styles.cameraOverlay}>
                  <View style={styles.hostInfoBadge}>
                    <Text style={styles.hostNameOverlay}>{meeting.hostName} (You)</Text>
                  </View>
                  <View style={styles.statusIcons}>
                    {!micOn && <View style={styles.mutedBadge}><Ionicons name="mic-off" size={14} color="#FFF" /></View>}
                    {handRaised && <View style={styles.handBadge}><Ionicons name="hand-right" size={14} color="#FFF" /></View>}
                  </View>
                </View>
              </View>
            ) : (
              <LinearGradient colors={["#1E1E2E", "#161625"]} style={styles.permissionBox}>
                <Avatar label={meeting.hostName.slice(0, 2).toUpperCase()} size={112} color="#7C3AED" />
                <Text style={styles.permissionTitle}>Join audio & video</Text>
                <Pressable style={styles.permissionButton} onPress={handleRequestPermissions}>
                  <Text style={styles.permissionButtonText}>Allow access</Text>
                </Pressable>
              </LinearGradient>
            )}
          </View>

          {/* Meeting Platform Info */}
          <View style={styles.platformCard}>
            <View style={styles.platformIconBg}>
              <Ionicons name="link" size={20} color="#6366F1" />
            </View>
            <View style={styles.platformTextCol}>
              <Text style={styles.platformLabel}>Platform: {meeting.meetingPlatform}</Text>
              {meeting.meetingPlatform === "MeetHub" ? (
                <Text style={styles.platformLink}>{meeting.meetingLink}</Text>
              ) : (
                <Pressable onPress={() => Linking.openURL(meeting.meetingLink)}>
                  <Text style={[styles.platformLink, { color: "#818CF8", textDecorationLine: "underline" }]}>
                    Join on {meeting.meetingPlatform}
                  </Text>
                </Pressable>
              )}
            </View>
          </View>

          {screenShareOn && (
            <View style={styles.shareBanner}>
              <Ionicons name="share" size={20} color="#4F46E5" />
              <Text style={styles.shareBannerText}>You are sharing your screen</Text>
            </View>
          )}

          {/* Participants Grid */}
          <View style={styles.participantsSection}>
            <Text style={styles.sectionTitle}>Participants</Text>
            <View style={styles.grid}>
              {roomParticipants.map((person) => (
                <View key={person.id} style={styles.tile}>
                  <Avatar label={person.name.slice(0, 2).toUpperCase()} color={person.color} size={52} />
                  <Text style={styles.tileName} numberOfLines={1}>{person.name}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Floating Bottom Actions - Scrollable for more options */}
        <View style={styles.bottomBarWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.actionsScrollRow}>
            
            <Pressable style={[styles.actionBtn, !micOn && styles.actionBtnOff]} onPress={() => setMicOn(v => !v)}>
              <Ionicons name={micOn ? "mic" : "mic-off"} size={24} color="#FFF" />
              <Text style={styles.actionBtnText}>{micOn ? "Mute" : "Unmute"}</Text>
            </Pressable>

            <Pressable style={[styles.actionBtn, !cameraOn && styles.actionBtnOff]} onPress={() => setCameraOn(v => !v)}>
              <Ionicons name={cameraOn ? "videocam" : "videocam-off"} size={24} color="#FFF" />
              <Text style={styles.actionBtnText}>{cameraOn ? "Stop" : "Start Video"}</Text>
            </Pressable>

            <Pressable style={[styles.actionBtn, screenShareOn && styles.actionBtnActive]} onPress={() => setScreenShareOn(v => !v)}>
              <Ionicons name="share-outline" size={24} color="#FFF" />
              <Text style={styles.actionBtnText}>Share</Text>
            </Pressable>
            
            <Pressable style={[styles.actionBtn, handRaised && styles.actionBtnWarning]} onPress={() => setHandRaised(v => !v)}>
              <Ionicons name={handRaised ? "hand-right" : "hand-right-outline"} size={24} color="#FFF" />
              <Text style={styles.actionBtnText}>Raise</Text>
            </Pressable>

            <Pressable style={styles.actionBtn} onPress={handleInvite}>
              <Ionicons name="person-add-outline" size={24} color="#FFF" />
              <Text style={styles.actionBtnText}>Invite</Text>
            </Pressable>

            <Pressable style={styles.actionBtn} onPress={() => router.push("/meeting/chat")}>
              <Ionicons name="chatbubble-ellipses-outline" size={24} color="#FFF" />
              <Text style={styles.actionBtnText}>Chat</Text>
            </Pressable>

            <Pressable style={styles.actionBtn} onPress={() => router.push("/meeting/participants")}>
              <Ionicons name="people-outline" size={24} color="#FFF" />
              <Text style={styles.actionBtnText}>People</Text>
            </Pressable>

            <Pressable style={[styles.actionBtn, recording && styles.actionBtnOff]} onPress={() => setRecording(v => !v)}>
              <Ionicons name={recording ? "stop-circle" : "recording"} size={24} color="#FFF" />
              <Text style={styles.actionBtnText}>{recording ? "Stop Rec" : "Record"}</Text>
            </Pressable>

            <Pressable style={styles.actionBtn} onPress={() => Alert.alert("More Options", "Additional settings coming soon.")}>
              <Ionicons name="ellipsis-horizontal-circle-outline" size={24} color="#FFF" />
              <Text style={styles.actionBtnText}>More</Text>
            </Pressable>

          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  darkBackground: {
    flex: 1,
    backgroundColor: "#05050A",
  },
  safeArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 120, // space for bottom bar
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  liveBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#EF4444",
    marginRight: 6,
  },
  meta: {
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: "500",
  },
  leaveButton: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
  },
  leaveText: {
    color: "#F87171",
    fontWeight: "700",
    fontSize: 14,
  },
  mainVideoContainer: {
    width: "100%",
    height: width * 1.15,
    borderRadius: 32,
    overflow: "hidden",
    backgroundColor: "#161625",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    marginBottom: 20,
  },
  cameraWrapper: {
    flex: 1,
  },
  cameraPreview: {
    flex: 1,
  },
  cameraPreviewCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  cameraOverlay: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  hostInfoBadge: {
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  hostNameOverlay: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 13,
  },
  statusIcons: {
    flexDirection: "row",
    gap: 8,
  },
  mutedBadge: {
    backgroundColor: "#EF4444",
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  handBadge: {
    backgroundColor: "#EAB308",
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  permissionBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  permissionTitle: {
    marginTop: 24,
    color: "#FFF",
    fontWeight: "700",
    fontSize: 20,
  },
  permissionButton: {
    marginTop: 20,
    backgroundColor: "#6366F1",
    borderRadius: 14,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  permissionButtonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },
  platformCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#161625",
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  platformIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(99, 102, 241, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  platformTextCol: {
    flex: 1,
  },
  platformLabel: {
    color: "#E2E8F0",
    fontWeight: "600",
    fontSize: 14,
  },
  platformLink: {
    color: "#94A3B8",
    fontSize: 13,
    marginTop: 4,
  },
  shareBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(79, 70, 229, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(79, 70, 229, 0.3)",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    gap: 12,
  },
  shareBannerText: {
    color: "#818CF8",
    fontWeight: "600",
    fontSize: 14,
  },
  participantsSection: {
    marginTop: 10,
  },
  sectionTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  tile: {
    width: "48%",
    backgroundColor: "#161625",
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  tileName: {
    marginTop: 12,
    color: "#E2E8F0",
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
  },
  bottomBarWrapper: {
    position: "absolute",
    bottom: 24,
    left: 16,
    right: 16,
    height: 86,
    backgroundColor: "rgba(22, 22, 37, 0.95)",
    borderRadius: 43,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    overflow: "hidden",
    justifyContent: "center",
  },
  actionsScrollRow: {
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 12,
  },
  actionBtn: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  actionBtnOff: {
    backgroundColor: "#EF4444",
  },
  actionBtnActive: {
    backgroundColor: "#6366F1",
  },
  actionBtnWarning: {
    backgroundColor: "#EAB308",
  },
  actionBtnText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "600",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 18,
  },
});

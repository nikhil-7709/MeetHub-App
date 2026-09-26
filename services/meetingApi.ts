import Constants from "expo-constants";

export type MeetingApiCreatePayload = {
  title: string;
  description: string;
  date: string;
  startTime: string;
  durationMinutes: number;
  password: string;
  participantLimit: number;
  meetingType: "Instant" | "Scheduled" | "Private";
  meetingPlatform?:
    | "MeetHub"
    | "Google Meet"
    | "Zoom"
    | "Microsoft Teams"
    | "Custom";
  inviteLink?: string;
  hostName: string;
  hostId: string;
};

export type MeetingApiCreateResponse = {
  id: string;
  title: string;
  meetingLink: string;
  password: string;
  hostName: string;
  hostId: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  participantLimit: number;
  meetingType: "Instant" | "Scheduled" | "Private";
  meetingPlatform?:
    | "MeetHub"
    | "Google Meet"
    | "Zoom"
    | "Microsoft Teams"
    | "Custom";
  description: string;
};

const API_BASE_URL =
  (Constants.expoConfig?.extra?.meetingApiUrl as string | undefined) ??
  process.env.EXPO_PUBLIC_MEETING_API_URL ??
  "";

const buildUrl = (path: string) => {
  const normalizedBase = API_BASE_URL.replace(/\/$/, "");
  return `${normalizedBase}${path}`;
};

export const meetingApi = {
  isConfigured() {
    return Boolean(API_BASE_URL);
  },
  async createMeeting(payload: MeetingApiCreatePayload) {
    if (!API_BASE_URL) {
      throw new Error(
        "Meeting backend is not configured. Set EXPO_PUBLIC_MEETING_API_URL or expo.extra.meetingApiUrl.",
      );
    }

    const response = await fetch(buildUrl("/api/meetings"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const raw = await response.text();
      throw new Error(raw || "Unable to create meeting on the server.");
    }

    return (await response.json()) as MeetingApiCreateResponse;
  },
  async getMeetings() {
    if (!API_BASE_URL) {
      return [] as MeetingApiCreateResponse[];
    }

    const response = await fetch(buildUrl("/api/meetings"));
    if (!response.ok) {
      return [] as MeetingApiCreateResponse[];
    }

    return (await response.json()) as MeetingApiCreateResponse[];
  },
};

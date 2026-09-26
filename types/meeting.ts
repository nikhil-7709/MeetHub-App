export type MeetingType = "Instant" | "Scheduled" | "Private";
export type MeetingPlatform =
  | "MeetHub"
  | "Google Meet"
  | "Zoom"
  | "Microsoft Teams"
  | "Custom";

export type MeetingMessage = {
  id: string;
  sender: string;
  senderId?: string;
  text: string;
  time: string;
  isOwn?: boolean;
};

export type MeetingParticipant = {
  id: string;
  name: string;
  role: "host" | "member";
  mute: boolean;
  cameraOn: boolean;
  color: string;
};

export type Meeting = {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  meetingLink: string;
  meetingPlatform: MeetingPlatform;
  password: string;
  participantLimit: number;
  hostName: string;
  hostId: string;
  meetingType: MeetingType;
  status: "upcoming" | "today" | "past";
  participants: MeetingParticipant[];
  messages: MeetingMessage[];
  createdAt: string;
};

export type MeetingInput = {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  password: string;
  participantLimit: number;
  meetingType: MeetingType;
  hostName: string;
  meetingPlatform: MeetingPlatform;
  inviteLink: string;
};

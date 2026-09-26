import { useCallback, useEffect, useMemo, useState } from "react";

import { meetingApi } from "@/services/meetingApi";
import { storage } from "@/services/storage";
import { Meeting, MeetingInput, MeetingPlatform } from "@/types/meeting";
import { NotificationItem } from "@/types/notification";

const createMeetingId = () =>
  `MTG-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

const createGoogleMeetCode = () => {
  const randomPart = () =>
    Array.from({ length: 3 }, () => {
      const alphabet = "abcdefghijklmnopqrstuvwxyz";
      return alphabet[Math.floor(Math.random() * alphabet.length)];
    }).join("");

  return `${randomPart()}-${randomPart()}-${randomPart()}`;
};

const createZoomCode = () =>
  Math.floor(1000000000 + Math.random() * 9000000000);

const createTeamsCode = () =>
  `19:${Math.random().toString(36).slice(2, 18)}@thread.v2`;

const buildMeetingLink = (
  platform: MeetingPlatform,
  customLink?: string,
  id?: string,
) => {
  if (platform === "Google Meet") {
    return customLink || `https://meet.google.com/${createGoogleMeetCode()}`;
  }

  if (platform === "Zoom") {
    return customLink || `https://zoom.us/j/${createZoomCode()}`;
  }

  if (platform === "Microsoft Teams") {
    return (
      customLink ||
      `https://teams.microsoft.com/l/meetup-join/${createTeamsCode()}`
    );
  }

  if (platform === "Custom") {
    return customLink || `https://meet.example.com/${id ?? createMeetingId()}`;
  }

  return customLink || `meethub://room/${id ?? createMeetingId()}`;
};

const createMeetingLink = (value?: string) =>
  value || `https://meet.google.com/${createGoogleMeetCode()}`;

const formatMeetingTime = (time: string, durationMinutes: number) => {
  const [hours, minutes] = time.split(":").map(Number);
  const startDate = new Date();
  startDate.setHours(hours, minutes, 0, 0);
  startDate.setMinutes(startDate.getMinutes() + durationMinutes);

  return startDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const getMeetingStatus = (date: string, time: string): Meeting["status"] => {
  const now = new Date();
  const target = new Date(`${date}T${time}:00`);

  if (target < now) {
    return "past";
  }

  const sameDay =
    target.getFullYear() === now.getFullYear() &&
    target.getMonth() === now.getMonth() &&
    target.getDate() === now.getDate();

  return sameDay ? "today" : "upcoming";
};

const normalizeMeetingCode = (value: string) => {
  const raw = value.trim();
  if (!raw) {
    return "";
  }

  return raw
    .replace(/^https?:\/\//i, "")
    .replace(/^reactnetive:\/\//i, "")
    .replace(/^meet\.google\.com\//i, "")
    .replace(/^.*\//, "")
    .replace(/\?.*$/, "")
    .replace(/[^a-z0-9-]/gi, "")
    .toUpperCase();
};

const defaultMeetings: Meeting[] = [];

const defaultNotifications: NotificationItem[] = [];

export function useMeetings() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const savedMeetings = await storage.getMeetings();
        const savedNotifications = await storage.getNotifications();

        const remoteMeetings = meetingApi.isConfigured()
          ? await meetingApi.getMeetings()
          : [];

        const nextMeetings = remoteMeetings.length
          ? remoteMeetings.map((item) => ({
              id: item.id,
              title: item.title,
              description: item.description,
              date: item.date,
              startTime: item.startTime,
              endTime: item.endTime,
              durationMinutes: item.durationMinutes,
              meetingLink: item.meetingLink,
              meetingPlatform: item.meetingPlatform ?? "MeetHub",
              password: item.password,
              participantLimit: item.participantLimit,
              hostName: item.hostName,
              hostId: item.hostId,
              meetingType: item.meetingType,
              status: getMeetingStatus(item.date, item.startTime),
              participants: [],
              messages: [],
              createdAt: new Date().toISOString(),
            }))
          : savedMeetings.length
            ? savedMeetings
            : defaultMeetings;

        const nextNotifications = savedNotifications.length
          ? savedNotifications
          : defaultNotifications;

        setMeetings(nextMeetings);
        setNotifications(nextNotifications);
        await storage.saveMeetings(nextMeetings);
        await storage.saveNotifications(nextNotifications);
      } catch {
        const savedMeetings = await storage.getMeetings();
        const savedNotifications = await storage.getNotifications();
        setMeetings(savedMeetings.length ? savedMeetings : defaultMeetings);
        setNotifications(
          savedNotifications.length ? savedNotifications : defaultNotifications,
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const getMeetingById = useCallback(async (meetingId: string) => {
    const query = meetingId.trim();
    const allMeetings = await storage.getMeetings();

    return (
      allMeetings.find((meeting) => meeting.id === query) ??
      allMeetings.find((meeting) => meeting.meetingLink.includes(query)) ??
      null
    );
  }, []);

  const joinMeetingByCode = useCallback(async (meetingCode: string) => {
    const normalized = normalizeMeetingCode(meetingCode);
    if (!normalized) {
      return null;
    }

    const allMeetings = await storage.getMeetings();
    const value = normalized.toUpperCase();

    return (
      allMeetings.find((meeting) => meeting.id.toUpperCase() === value) ??
      allMeetings.find(
        (meeting) =>
          normalizeMeetingCode(meeting.meetingLink).toUpperCase() === value ||
          meeting.meetingLink.toLowerCase().includes(value.toLowerCase()),
      ) ??
      null
    );
  }, []);

  const createMeeting = useCallback(
    async (input: MeetingInput, hostName: string, hostId: string) => {
      if (!meetingApi.isConfigured()) {
        const meetingId = createMeetingId();
        const endTime =
          input.endTime ||
          formatMeetingTime(input.startTime, input.durationMinutes);
        const meetingLink = buildMeetingLink(
          input.meetingPlatform ?? "MeetHub",
          input.inviteLink,
          meetingId,
        );
        const nextMeeting: Meeting = {
          id: meetingId,
          title: input.title,
          description:
            input.description || `${input.title} collaboration session.`,
          date: input.date,
          startTime: input.startTime,
          endTime,
          durationMinutes: input.durationMinutes,
          meetingLink,
          meetingPlatform: input.meetingPlatform ?? "MeetHub",
          password: input.password || "meet123",
          participantLimit: input.participantLimit,
          hostName: input.hostName || hostName,
          hostId,
          meetingType: input.meetingType,
          status: getMeetingStatus(input.date, input.startTime),
          createdAt: new Date().toISOString(),
          messages: [
            {
              id: `msg-${Date.now()}`,
              sender: "System",
              text: "Meeting created successfully.",
              time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          ],
          participants: [
            {
              id: hostId,
              name: hostName,
              role: "host",
              mute: false,
              cameraOn: true,
              color: "#4F46E5",
            },
          ],
        };

        const nextMeetings = [nextMeeting, ...meetings];
        setMeetings(nextMeetings);
        await storage.saveMeetings(nextMeetings);

        const nextNotification: NotificationItem = {
          id: `n-${Date.now()}`,
          title: "Meeting created successfully",
          message: `${nextMeeting.title} is ready. Meeting ID: ${meetingId}`,
          read: false,
          createdAt: new Date().toISOString(),
          type: "system",
        };

        const updatedNotifications = [nextNotification, ...notifications];
        setNotifications(updatedNotifications);
        await storage.saveNotifications(updatedNotifications);

        return { meeting: nextMeeting, notification: nextNotification };
      }

      const response = await meetingApi.createMeeting({
        title: input.title,
        description:
          input.description || `${input.title} collaboration session.`,
        date: input.date,
        startTime: input.startTime,
        durationMinutes: input.durationMinutes,
        password: input.password || "meet123",
        participantLimit: input.participantLimit,
        meetingType: input.meetingType,
        hostName,
        hostId,
      });

      const meetingId = response.id || createMeetingId();
      const endTime =
        response.endTime ||
        input.endTime ||
        formatMeetingTime(input.startTime, input.durationMinutes);
      const meetingLink = buildMeetingLink(
        input.meetingPlatform ?? "MeetHub",
        input.inviteLink || response.meetingLink,
        meetingId,
      );
      const nextMeeting: Meeting = {
        id: meetingId,
        title: response.title || input.title,
        description: response.description || input.description,
        date: response.date || input.date,
        startTime: response.startTime || input.startTime,
        endTime,
        durationMinutes: response.durationMinutes || input.durationMinutes,
        meetingLink,
        meetingPlatform: input.meetingPlatform ?? "MeetHub",
        password: response.password || input.password || "meet123",
        participantLimit: response.participantLimit || input.participantLimit,
        hostName: response.hostName || input.hostName || hostName,
        hostId: response.hostId || hostId,
        meetingType: response.meetingType || input.meetingType,
        status: getMeetingStatus(
          response.date || input.date,
          response.startTime || input.startTime,
        ),
        createdAt: new Date().toISOString(),
        messages: [
          {
            id: `msg-${Date.now()}`,
            sender: "System",
            text: "Meeting created successfully.",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ],
        participants: [
          {
            id: hostId,
            name: hostName,
            role: "host",
            mute: false,
            cameraOn: true,
            color: "#4F46E5",
          },
        ],
      };

      const nextMeetings = [nextMeeting, ...meetings];
      setMeetings(nextMeetings);
      await storage.saveMeetings(nextMeetings);

      const nextNotification: NotificationItem = {
        id: `n-${Date.now()}`,
        title: "Meeting created successfully",
        message: `${nextMeeting.title} is ready. Meeting ID: ${meetingId}`,
        read: false,
        createdAt: new Date().toISOString(),
        type: "system",
      };

      const updatedNotifications = [nextNotification, ...notifications];
      setNotifications(updatedNotifications);
      await storage.saveNotifications(updatedNotifications);

      return { meeting: nextMeeting, notification: nextNotification };
    },
    [meetings, notifications],
  );

  const markNotificationRead = useCallback(
    async (notificationId: string) => {
      const updated = notifications.map((item) =>
        item.id === notificationId ? { ...item, read: true } : item,
      );
      setNotifications(updated);
      await storage.saveNotifications(updated);
    },
    [notifications],
  );

  const clearNotifications = useCallback(async () => {
    setNotifications([]);
    await storage.saveNotifications([]);
  }, []);

  const addNotification = useCallback(
    async (notification: NotificationItem) => {
      const updated = [notification, ...notifications];
      setNotifications(updated);
      await storage.saveNotifications(updated);
    },
    [notifications],
  );

  const upcomingMeetings = useMemo(
    () =>
      meetings.filter(
        (meeting) =>
          meeting.status === "upcoming" || meeting.status === "today",
      ),
    [meetings],
  );

  const todayMeetings = useMemo(
    () => meetings.filter((meeting) => meeting.status === "today"),
    [meetings],
  );

  const pastMeetings = useMemo(
    () => meetings.filter((meeting) => meeting.status === "past"),
    [meetings],
  );

  return {
    meetings,
    notifications,
    loading,
    upcomingMeetings,
    todayMeetings,
    pastMeetings,
    getMeetingById,
    joinMeetingByCode,
    createMeeting,
    markNotificationRead,
    clearNotifications,
    addNotification,
  };
}

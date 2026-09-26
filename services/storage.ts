import AsyncStorage from "@react-native-async-storage/async-storage";

import { Meeting } from "@/types/meeting";
import { NotificationItem } from "@/types/notification";
import { User } from "@/types/user";

const USERS_KEY = "meethub_users";
const MEETINGS_KEY = "meethub_meetings";
const NOTIFICATIONS_KEY = "meethub_notifications";
const CURRENT_USER_KEY = "meethub_current_user";

const readJSON = async <T>(key: string, fallback: T): Promise<T> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeJSON = async <T>(key: string, value: T) => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

export const storage = {
  async getUsers(): Promise<User[]> {
    return readJSON<User[]>(USERS_KEY, []);
  },
  async saveUsers(users: User[]) {
    await writeJSON(USERS_KEY, users);
  },
  async getMeetings(): Promise<Meeting[]> {
    return readJSON<Meeting[]>(MEETINGS_KEY, []);
  },
  async saveMeetings(meetings: Meeting[]) {
    await writeJSON(MEETINGS_KEY, meetings);
  },
  async getNotifications(): Promise<NotificationItem[]> {
    return readJSON<NotificationItem[]>(NOTIFICATIONS_KEY, []);
  },
  async saveNotifications(notifications: NotificationItem[]) {
    await writeJSON(NOTIFICATIONS_KEY, notifications);
  },
  async getCurrentUser(): Promise<User | null> {
    const value = await AsyncStorage.getItem(CURRENT_USER_KEY);
    return value ? (JSON.parse(value) as User) : null;
  },
  async saveCurrentUser(user: User | null) {
    if (!user) {
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
      return;
    }
    await writeJSON(CURRENT_USER_KEY, user);
  },
};

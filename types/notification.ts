export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  type: "meeting" | "system" | "invitation";
};

export type User = {
  id: string;
  fullName: string;
  email: string;
  password: string;
  avatar: string;
  role: "host" | "member";
};

import { useCallback, useEffect, useMemo, useState } from "react";

import { storage } from "@/services/storage";
import { User } from "@/types/user";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const saved = await storage.getCurrentUser();
      setUser(saved ?? null);
      setIsReady(true);
    };

    loadUser();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const users = await storage.getUsers();
    const matchedUser = users.find(
      (item) =>
        item.email.toLowerCase() === email.toLowerCase() &&
        item.password === password,
    );

    if (!matchedUser) {
      return { success: false, message: "Invalid email or password." };
    }

    setUser(matchedUser);
    await storage.saveCurrentUser(matchedUser);
    return { success: true, message: "Welcome back!" };
  }, []);

  const register = useCallback(
    async (fullName: string, email: string, password: string) => {
      const users = await storage.getUsers();
      const existing = users.find(
        (item) => item.email.toLowerCase() === email.toLowerCase(),
      );

      if (existing) {
        return {
          success: false,
          message: "An account already exists for that email.",
        };
      }

      const nextUser: User = {
        id: `user-${Date.now()}`,
        fullName,
        email,
        password,
        avatar: fullName
          .split(" ")
          .map((segment) => segment[0])
          .slice(0, 2)
          .join("")
          .toUpperCase(),
        role: "host",
      };

      const updatedUsers = [...users, nextUser];
      await storage.saveUsers(updatedUsers);
      setUser(nextUser);
      await storage.saveCurrentUser(nextUser);
      return { success: true, message: "Account created successfully." };
    },
    [],
  );

  const logout = useCallback(async () => {
    setUser(null);
    await storage.saveCurrentUser(null);
  }, []);

  const updateUser = useCallback(async (updates: Partial<User>) => {
    setUser((currentUser) => {
      if (!currentUser) {
        return currentUser;
      }

      const nextUser = { ...currentUser, ...updates };

      void storage.saveCurrentUser(nextUser);

      void storage.getUsers().then((users) => {
        const existingIndex = users.findIndex(
          (item) => item.id === nextUser.id,
        );

        if (existingIndex >= 0) {
          const updatedUsers = [...users];
          updatedUsers[existingIndex] = nextUser;
          void storage.saveUsers(updatedUsers);
          return;
        }

        void storage.saveUsers([...users, nextUser]);
      });

      return nextUser;
    });
  }, []);

  return useMemo(
    () => ({
      user,
      isReady,
      login,
      register,
      logout,
      updateUser,
    }),
    [isReady, login, logout, register, updateUser, user],
  );
}

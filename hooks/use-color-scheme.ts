import { useEffect, useState } from "react";
import { Appearance, Platform } from "react-native";

export type AppColorScheme = "light" | "dark";

const STORAGE_KEY = "app-color-scheme";
let appColorScheme: AppColorScheme | null = null;
const listeners = new Set<(scheme: AppColorScheme) => void>();

function notifyListeners(scheme: AppColorScheme) {
  appColorScheme = scheme;
  listeners.forEach((listener) => listener(scheme));
}

export function getPreferredColorScheme(): AppColorScheme {
  const systemScheme = Appearance.getColorScheme() ?? "light";

  if (Platform.OS === "web") {
    const stored = globalThis.localStorage?.getItem(
      STORAGE_KEY,
    ) as AppColorScheme | null;
    return stored ?? appColorScheme ?? systemScheme;
  }

  return appColorScheme ?? systemScheme;
}

export function setPreferredColorScheme(scheme: AppColorScheme) {
  if (Platform.OS === "web") {
    globalThis.localStorage?.setItem(STORAGE_KEY, scheme);
  }

  if (typeof Appearance.setColorScheme === "function") {
    Appearance.setColorScheme(scheme);
  }

  notifyListeners(scheme);
}

export function useColorScheme() {
  const [scheme, setScheme] = useState<AppColorScheme>(() => {
    const nextScheme = getPreferredColorScheme();
    appColorScheme ??= nextScheme;
    return nextScheme;
  });

  useEffect(() => {
    const syncScheme = () => {
      const stored =
        Platform.OS === "web"
          ? (globalThis.localStorage?.getItem(
              STORAGE_KEY,
            ) as AppColorScheme | null)
          : null;

      const nextScheme =
        stored ?? appColorScheme ?? Appearance.getColorScheme() ?? "light";
      appColorScheme = nextScheme;
      setScheme(nextScheme);
    };

    syncScheme();

    const listener = (nextScheme: AppColorScheme) => setScheme(nextScheme);
    listeners.add(listener);

    if (Platform.OS === "web") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleMediaChange = () => syncScheme();
      mediaQuery.addEventListener?.("change", handleMediaChange);
      return () => {
        listeners.delete(listener);
        mediaQuery.removeEventListener?.("change", handleMediaChange);
      };
    }

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      const nextScheme = colorScheme ?? "light";
      notifyListeners(nextScheme);
    });

    return () => {
      listeners.delete(listener);
      subscription.remove();
    };
  }, []);

  return scheme;
}

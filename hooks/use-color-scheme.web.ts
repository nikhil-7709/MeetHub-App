import { useEffect, useState } from "react";
import { useColorScheme as useRNColorScheme } from "react-native";

export type AppColorScheme = "light" | "dark";

const STORAGE_KEY = "app-color-scheme";
let appColorScheme: AppColorScheme | null = null;
const listeners = new Set<(scheme: AppColorScheme) => void>();

function notifyListeners(scheme: AppColorScheme) {
  appColorScheme = scheme;
  listeners.forEach((listener) => listener(scheme));
}

export function setPreferredColorScheme(scheme: AppColorScheme) {
  globalThis.localStorage?.setItem(STORAGE_KEY, scheme);
  notifyListeners(scheme);
  window.dispatchEvent(
    new CustomEvent("app-theme-change", { detail: { scheme } }),
  );
}

export function useColorScheme() {
  const systemScheme = useRNColorScheme() ?? "light";
  const [hasHydrated, setHasHydrated] = useState(false);
  const [scheme, setScheme] = useState<AppColorScheme>(() => {
    const stored = globalThis.localStorage?.getItem(
      STORAGE_KEY,
    ) as AppColorScheme | null;
    const nextScheme = stored ?? appColorScheme ?? systemScheme;
    appColorScheme ??= nextScheme;
    return nextScheme;
  });

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    const syncScheme = () => {
      const stored = globalThis.localStorage?.getItem(
        STORAGE_KEY,
      ) as AppColorScheme | null;
      const nextScheme = stored ?? appColorScheme ?? systemScheme;
      appColorScheme = nextScheme;
      setScheme(nextScheme);
    };

    const listener = (nextScheme: AppColorScheme) => setScheme(nextScheme);
    listeners.add(listener);

    syncScheme();

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMediaChange = () => syncScheme();
    mediaQuery.addEventListener?.("change", handleMediaChange);
    const handleThemeChange = () => syncScheme();
    window.addEventListener(
      "app-theme-change",
      handleThemeChange as EventListener,
    );

    return () => {
      listeners.delete(listener);
      mediaQuery.removeEventListener?.("change", handleMediaChange);
      window.removeEventListener(
        "app-theme-change",
        handleThemeChange as EventListener,
      );
    };
  }, [systemScheme]);

  if (!hasHydrated) {
    return "light";
  }

  return scheme;
}

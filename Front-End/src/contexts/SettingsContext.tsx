import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useAuth } from "@clerk/react";

interface Settings {
  autoSave: boolean;
}

interface SettingsContextValue {
  settings: Settings;
  loading: boolean;
}

const defaultSettings: Settings = {
  autoSave: true,
};

const SettingsContext = createContext<SettingsContextValue>({
  settings: defaultSettings,
  loading: true,
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const { getToken, isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isLoaded) {
      console.log("SettingsProvider - Clerk not loaded yet");
      return;
    }

    console.log("SettingsProvider - isSignedIn:", isSignedIn);

    async function fetchSettings() {
      try {
        const token = await getToken();
        console.log("SettingsProvider - token:", token ? "exists" : "null");

        if (!token) {
          setSettings(defaultSettings);
          setLoading(false);
          return;
        }

        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const res = await fetch(`/api/users/me/settings`, { headers });
        console.log("SettingsProvider - response status:", res.status);

        if (!res.ok) {
          console.log("SettingsProvider - failed, using defaults");
          setSettings(defaultSettings);
          setLoading(false);
          return;
        }

        const json = await res.json();
        console.log("SettingsProvider - response:", json);

        if (json.status === "success" && json.data) {
          setSettings(json.data);
        } else {
          setSettings(defaultSettings);
        }
      } catch (e) {
        console.error("SettingsProvider - error:", e);
        setSettings(defaultSettings);
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, [getToken, isLoaded, isSignedIn]);

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
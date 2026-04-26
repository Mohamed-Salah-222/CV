import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { env } from "@/config/env";

interface Settings {
  autoSave: boolean;
}

interface SettingsContextValue {
  settings: Settings | null;
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
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch(`${env.API_URL}/api/users/me/settings`);
        const json = await res.json();
        if (json.status === "success" && json.data) {
          setSettings(json.data);
        } else {
          setSettings(defaultSettings);
        }
      } catch (e) {
        console.error("Failed to fetch settings:", e);
        setSettings(defaultSettings);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
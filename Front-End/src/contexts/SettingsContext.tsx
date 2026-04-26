import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useAuth } from "@clerk/react";

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
  const { getToken, isLoaded } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;

    async function fetchSettings() {
      try {
        const token = await getToken();
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;

        const res = await fetch(`/api/users/me/settings`, { headers });
        
        // If not logged in (401/redirect to login), use defaults
        if (!res.ok) {
          setSettings(defaultSettings);
          setLoading(false);
          return;
        }
        
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
  }, [getToken, isLoaded]);

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}

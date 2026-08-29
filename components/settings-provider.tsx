'use client';

import * as React from 'react';
import { BusinessSettings } from '@/types';
import { getSettings, DEFAULT_SETTINGS } from '@/lib/supabase/services';

const SettingsContext = React.createContext<{
  settings: BusinessSettings;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
}>({
  settings: DEFAULT_SETTINGS,
  isLoading: false,
  refreshSettings: async () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = React.useState<BusinessSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const refreshSettings = React.useCallback(async () => {
    try {
      const data = await getSettings();
      setSettings(data);
    } catch (err) {
      console.warn('Failed to load settings:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    let active = true;
    getSettings().then((data) => {
      if (active) {
        setSettings(data);
        setIsLoading(false);
      }
    });
    return () => { active = false; };
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, isLoading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = React.useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

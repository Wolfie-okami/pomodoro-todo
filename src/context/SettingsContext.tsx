import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Types
export type ThemeOption = 'tomatoRed' | 'mintGreen' | 'midnightDark';

export interface Settings {
  workDuration: number;
  breakDuration: number;
  autoStartBreak: boolean;
  theme: ThemeOption;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
}

// Default settings
const defaultSettings: Settings = {
  workDuration: 25, // in minutes
  breakDuration: 5, // in minutes
  autoStartBreak: true,
  theme: 'tomatoRed'
};

// Context
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Provider
export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useLocalStorage<Settings>('pomodoro-settings', defaultSettings);
  
  // Update settings
  const updateSettings = (updates: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };
  
  // Apply theme
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
    
    // Apply theme-specific CSS variables
    if (settings.theme === 'tomatoRed') {
      document.documentElement.style.setProperty('--color-mode-primary', 'var(--color-primary-700)');
      document.documentElement.style.setProperty('--color-mode-secondary', 'var(--color-primary-100)');
      document.documentElement.style.setProperty('--color-mode-accent', 'var(--color-primary-500)');
      document.documentElement.style.setProperty('--color-mode-background', 'var(--color-neutral-50)');
      document.documentElement.style.setProperty('--color-mode-text', 'var(--color-neutral-900)');
    } else if (settings.theme === 'mintGreen') {
      document.documentElement.style.setProperty('--color-mode-primary', 'var(--color-secondary-600)');
      document.documentElement.style.setProperty('--color-mode-secondary', 'var(--color-secondary-100)');
      document.documentElement.style.setProperty('--color-mode-accent', 'var(--color-secondary-400)');
      document.documentElement.style.setProperty('--color-mode-background', 'var(--color-neutral-50)');
      document.documentElement.style.setProperty('--color-mode-text', 'var(--color-neutral-900)');
    } else if (settings.theme === 'midnightDark') {
      document.documentElement.style.setProperty('--color-mode-primary', 'var(--color-neutral-400)');
      document.documentElement.style.setProperty('--color-mode-secondary', 'var(--color-neutral-800)');
      document.documentElement.style.setProperty('--color-mode-accent', 'var(--color-neutral-600)');
      document.documentElement.style.setProperty('--color-mode-background', 'var(--color-neutral-900)');
      document.documentElement.style.setProperty('--color-mode-text', 'var(--color-neutral-50)');
    }
  }, [settings.theme]);
  
  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

// Hook
export function useSettingsContext() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettingsContext must be used within a SettingsProvider');
  }
  return context;
}
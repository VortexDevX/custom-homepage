"use client";

import { useState, useEffect } from "react";

const SCHEMA_VERSION = 1;

export interface Pin {
  id: string;
  title: string;
  url: string;
  icon?: string;
  category?: string;
}

export interface Note {
  id: string;
  content: string;
  createdAt: number;
  label?: string;
  color?: string;
  completed?: boolean;
}

export interface NotesPosition {
  x: number;
  y: number;
}

export interface AppSettings {
  schemaVersion: number;
  theme?: string;
  searchEngine: string;
  weatherApiKey?: string;
  weatherUnit: "C" | "F";
  weatherCity?: string;
  bgMode: "auto" | "manual" | "custom";
  bgChoice?: string;
  selectedBg?: string;
  customBg?: string;
  accent?: string;
  overlayStrength: number;
  pinnedSitesOpacity?: number;
  pins: Pin[];
  notes: Note[];
  notesPos: NotesPosition;
  lastWeatherUpdate?: number;
}

const defaultSettings: AppSettings = {
  schemaVersion: SCHEMA_VERSION,
  searchEngine: "duckduckgo",
  weatherUnit: "C",
  bgMode: "auto",
  overlayStrength: 30,
  pinnedSitesOpacity: 85,
  pins: [],
  notes: [],
  notesPos: { x: 20, y: 20 },
};

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
    }
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (isClient) {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  return [storedValue, setValue];
}

export function useAppSettings() {
  return useLocalStorage<AppSettings>("appSettings", defaultSettings);
}

export function exportSettings(): string {
  try {
    const settings = localStorage.getItem("appSettings");
    return settings || JSON.stringify(defaultSettings);
  } catch (error) {
    console.error("Error exporting settings:", error);
    return JSON.stringify(defaultSettings);
  }
}

export function importSettings(jsonString: string): boolean {
  try {
    const parsed = JSON.parse(jsonString);

    // Basic validation
    if (typeof parsed !== "object" || parsed === null) {
      throw new Error("Invalid settings format");
    }

    // Migrate if needed
    const migrated = migrateSettings(parsed);

    localStorage.setItem("appSettings", JSON.stringify(migrated));

    // Trigger storage event for other tabs
    window.dispatchEvent(new Event("storage"));

    return true;
  } catch (error) {
    console.error("Error importing settings:", error);
    return false;
  }
}

function migrateSettings(settings: any): AppSettings {
  // If no schema version, assume version 1
  const currentVersion = settings.schemaVersion || 1;

  if (currentVersion < SCHEMA_VERSION) {
    // Add migration logic here when schema version increases
    settings.schemaVersion = SCHEMA_VERSION;
  }

  // Ensure all required fields exist
  return {
    ...defaultSettings,
    ...settings,
  };
}

export function resetSettings(): void {
  try {
    localStorage.removeItem("appSettings");
    window.dispatchEvent(new Event("storage"));
  } catch (error) {
    console.error("Error resetting settings:", error);
  }
}

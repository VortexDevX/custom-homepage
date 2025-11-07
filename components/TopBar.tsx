"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SearchBar from "./SearchBar";
import WeatherWidget from "./WeatherWidget";
import ThemeToggle from "./ThemeToggle";
import { Settings, StickyNote } from "lucide-react";

interface TopBarProps {
  searchEngine: string;
  onSearchEngineChange: (engine: string) => void;
  weatherApiKey?: string;
  weatherUnit: "C" | "F";
  weatherCity?: string;
  onWeatherCityChange: (city: string) => void;
  onOpenSettings: () => void;
  onToggleNotes: () => void;
}

export default function TopBar({
  searchEngine,
  onSearchEngineChange,
  weatherApiKey,
  weatherUnit,
  weatherCity,
  onWeatherCityChange,
  onOpenSettings,
  onToggleNotes,
}: TopBarProps) {
  const [time, setTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="w-full mb-12">
      {/* Top Row: Time/Date and Actions */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex flex-col gap-1">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="text-6xl font-semibold tracking-tight text-(--text) text-contrast"
          >
            {formatTime(time)}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-lg font-semibold text-(--text) tracking-wide text-contrast drop-shadow-lg"
          >
            {formatDate(time)}
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="flex items-center gap-3"
        >
          <WeatherWidget
            apiKey={weatherApiKey}
            unit={weatherUnit}
            city={weatherCity}
            onCityChange={onWeatherCityChange}
          />
          <motion.button
            whileHover={{ scale: 1.08, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleNotes}
            className="glass rounded-xl p-3 hover:bg-opacity-70 transition-all duration-200 shadow-md"
            aria-label="Toggle notes"
            title="Toggle notes"
          >
            <StickyNote className="h-5 w-5 text-(--text) drop-shadow-md" />
          </motion.button>
          <ThemeToggle />
          <motion.button
            whileHover={{ scale: 1.08, rotate: 90 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenSettings}
            className="glass rounded-xl p-3 hover:bg-opacity-70 transition-all duration-200 shadow-md"
            aria-label="Open settings"
            title="Open settings"
          >
            <Settings className="h-5 w-5 text-(--text) drop-shadow-md" />
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <SearchBar
          searchEngine={searchEngine}
          onSearchEngineChange={onSearchEngineChange}
        />
      </motion.div>
    </div>
  );
}

"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import BackgroundImage from "@/components/BackgroundImage";

interface AppearanceTabProps {
  settings: any;
  onSettingsChange: (settings: any) => void;
}

const accentColors = [
  { name: "Blue", value: "#3b82f6" },
  { name: "Purple", value: "#a855f7" },
  { name: "Green", value: "#22c55e" },
  { name: "Red", value: "#ef4444" },
  { name: "Orange", value: "#f97316" },
  { name: "Pink", value: "#ec4899" },
];

// Manually list your actual background files
const lightBackgrounds = [
  "/backgrounds/light/1.jpg",
  "/backgrounds/light/2.png",
  "/backgrounds/light/3.jpg",
  "/backgrounds/light/4.png",
  "/backgrounds/light/5.png",
  "/backgrounds/light/6.png",
  "/backgrounds/light/7.jpg",
];

const darkBackgrounds = [
  "/backgrounds/dark/1.png",
  "/backgrounds/dark/2.png",
  "/backgrounds/dark/3.png",
  "/backgrounds/dark/4.png",
  "/backgrounds/dark/5.png",
  "/backgrounds/dark/6.png",
  "/backgrounds/dark/7.png",
];

export default function AppearanceTab({
  settings,
  onSettingsChange,
}: AppearanceTabProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<string>("light");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (theme === "system") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setCurrentTheme(isDark ? "dark" : "light");
    } else {
      setCurrentTheme(theme || "light");
    }
  }, [theme]);

  // Validate and reset invalid background selection
  useEffect(() => {
    if (settings.bgMode === "manual" && settings.selectedBg) {
      const allBackgrounds = [...lightBackgrounds, ...darkBackgrounds];
      if (!allBackgrounds.includes(settings.selectedBg)) {
        // Selected background doesn't exist anymore, reset to first one
        onSettingsChange({
          ...settings,
          selectedBg:
            currentTheme === "dark" ? darkBackgrounds[0] : lightBackgrounds[0],
        });
      }
    }
  }, [settings.bgMode, settings.selectedBg, currentTheme]);

  const handleAccentChange = (color: string) => {
    onSettingsChange({ ...settings, accent: color });
    document.documentElement.style.setProperty("--accent", color);
  };

  if (!mounted) return null;

  return (
    <div className="space-y-8 w-full max-w-full">
      <div className="w-full">
        <h3 className="text-xl font-semibold text-(--text) mb-2 drop-shadow-sm">
          Theme
        </h3>
        <p className="text-sm text-(--text-muted) mb-6">
          Choose your preferred color scheme
        </p>
        <div className="flex gap-4">
          {["light", "dark", "system"].map((t) => (
            <motion.button
              key={t}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTheme(t)}
              className={`flex-1 px-5 py-3 rounded-xl capitalize transition-all font-medium ${
                theme === t
                  ? "bg-(--accent) text-white shadow-lg"
                  : "glass text-(--text) hover:bg-opacity-90"
              }`}
            >
              {t}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="w-full">
        <h3 className="text-xl font-semibold text-(--text) mb-2 drop-shadow-sm">
          Accent Color
        </h3>
        <p className="text-sm text-(--text-muted) mb-6">
          Personalize with your favorite color
        </p>
        <div className="grid grid-cols-6 gap-4">
          {accentColors.map((color) => (
            <motion.button
              key={color.name}
              whileHover={{ scale: 1.15, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAccentChange(color.value)}
              className={`h-14 rounded-xl transition-all shadow-md ${
                settings.accent === color.value
                  ? "ring-4 ring-offset-4 ring-(--accent)"
                  : "hover:scale-110"
              }`}
              style={{ backgroundColor: color.value }}
              aria-label={`Select ${color.name} accent`}
              title={color.name}
            />
          ))}
        </div>
      </div>

      <div className="w-full">
        <h3 className="text-xl font-semibold text-(--text) mb-2 drop-shadow-sm">
          Background Overlay
        </h3>
        <p className="text-sm text-(--text-muted) mb-6">
          Adjust background opacity for better readability
        </p>
        <div className="space-y-3">
          <input
            type="range"
            min="0"
            max="100"
            value={settings.overlayStrength || 30}
            onChange={(e) =>
              onSettingsChange({
                ...settings,
                overlayStrength: parseInt(e.target.value),
              })
            }
            className="w-full h-2 bg-(--glass-bg) rounded-full appearance-none cursor-pointer"
            aria-label="Background overlay strength"
          />
          <div className="flex justify-between text-sm font-medium">
            <span className="text-(--text-muted)">Transparent</span>
            <span className="text-(--accent)">
              {settings.overlayStrength || 30}%
            </span>
            <span className="text-(--text-muted)">Opaque</span>
          </div>
        </div>
      </div>

      <div className="w-full">
        <h3 className="text-xl font-semibold text-(--text) mb-2 drop-shadow-sm">
          Pinned Sites Opacity
        </h3>
        <p className="text-sm text-(--text-muted) mb-6">
          Adjust the background opacity of pinned site cards
        </p>
        <div className="space-y-3">
          <input
            type="range"
            min="0"
            max="100"
            value={settings.pinnedSitesOpacity || 85}
            onChange={(e) =>
              onSettingsChange({
                ...settings,
                pinnedSitesOpacity: parseInt(e.target.value),
              })
            }
            className="w-full h-2 bg-(--glass-bg) rounded-full appearance-none cursor-pointer"
            aria-label="Pinned sites opacity"
          />
          <div className="flex justify-between text-sm font-medium">
            <span className="text-(--text-muted)">Transparent</span>
            <span className="text-(--accent)">
              {settings.pinnedSitesOpacity || 85}%
            </span>
            <span className="text-(--text-muted)">Opaque</span>
          </div>
        </div>
      </div>

      <div className="w-full">
        <h3 className="text-xl font-semibold text-(--text) mb-2 drop-shadow-sm">
          Background Mode
        </h3>
        <p className="text-sm text-(--text-muted) mb-6">
          Select how to manage your background
        </p>
        <div className="space-y-3">
          {["auto", "manual", "custom"].map((mode) => (
            <motion.label
              key={mode}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-4 p-4 glass rounded-xl cursor-pointer transition-all ${
                settings.bgMode === mode
                  ? "bg-(--accent) bg-opacity-15 border-2 border-(--accent) shadow-md"
                  : "hover:bg-opacity-90 border-2 border-transparent"
              }`}
            >
              <input
                type="radio"
                name="bgMode"
                value={mode}
                checked={settings.bgMode === mode}
                onChange={(e) =>
                  onSettingsChange({
                    ...settings,
                    bgMode: e.target.value,
                  })
                }
                className="h-5 w-5 text-(--accent)"
                aria-label={`Background mode: ${mode}`}
              />
              <div className="w-full">
                <span className="text-(--text) capitalize font-medium">
                  {mode}
                </span>
                <p className="text-xs text-(--text-muted) mt-1">
                  {mode === "auto" && "Changes with theme"}
                  {mode === "manual" && "Select from gallery"}
                  {mode === "custom" && "Upload your own"}
                </p>
              </div>
            </motion.label>
          ))}
        </div>
      </div>

      {settings.bgMode === "manual" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <h3 className="text-xl font-semibold text-(--text) mb-2 drop-shadow-sm">
            Select Background
          </h3>
          <p className="text-sm text-(--text-muted) mb-6">
            Choose from our curated collection
          </p>
          <div className="grid grid-cols-3 gap-4 max-h-96 overflow-y-auto p-1">
            {(currentTheme === "dark" ? darkBackgrounds : lightBackgrounds).map(
              (bgPath, index) => (
                <motion.button
                  key={bgPath}
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    onSettingsChange({
                      ...settings,
                      selectedBg: bgPath,
                    })
                  }
                  className={`relative aspect-video rounded-xl overflow-hidden transition-all shadow-md ${
                    settings.selectedBg === bgPath
                      ? "ring-4 ring-(--accent) shadow-xl scale-105"
                      : "opacity-70 hover:opacity-100"
                  }`}
                  aria-label={`Select background ${index + 1}`}
                >
                  <BackgroundImage src={bgPath} index={index} />
                </motion.button>
              )
            )}
          </div>
        </motion.div>
      )}

      {settings.bgMode === "custom" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <h3 className="text-xl font-semibold text-(--text) mb-2 drop-shadow-sm">
            Upload Background
          </h3>
          <p className="text-sm text-(--text-muted) mb-6">
            Use your own image as background
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                  onSettingsChange({
                    ...settings,
                    customBg: reader.result as string,
                  });
                };
                reader.readAsDataURL(file);
              }
            }}
            className="w-full glass rounded-xl p-4 text-(--text) cursor-pointer hover:bg-opacity-90 transition-all"
            aria-label="Upload custom background image"
          />
          <p className="text-xs text-(--text-muted) mt-3">
            Recommended: 1920x1080 or larger. Max 5MB.
          </p>
        </motion.div>
      )}
    </div>
  );
}

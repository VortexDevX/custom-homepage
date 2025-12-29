"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { useAppSettings } from "@/lib/storage";
import { useBackground } from "@/hooks/useBackground";
import TopBar from "@/components/TopBar";
import PinnedGrid from "@/components/PinnedGrid";
import Image from "next/image";

// Dynamic imports for heavy components
const NotesWidget = lazy(() => import("@/components/NotesWidget"));
const SettingsModal = lazy(() => import("@/components/SettingsModal"));
const CommandPalette = lazy(() => import("@/components/CommandPalette"));

export default function Home() {
  const [settings, setSettings] = useAppSettings();
  const [showNotes, setShowNotes] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<string>("light");

  // Combined initialization effect
  useEffect(() => {
    setMounted(true);

    // Track current theme (resolved from system preference if needed)
    const updateTheme = () => {
      if (theme === "system") {
        const isDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        setCurrentTheme(isDark ? "dark" : "light");
      } else {
        setCurrentTheme(theme || "light");
      }
    };

    updateTheme();
  }, [theme]);

  // Use custom hook for background management
  const backgroundImage = useBackground({
    bgMode: settings.bgMode,
    customBg: settings.customBg,
    selectedBg: settings.selectedBg,
    currentTheme,
  });

  // Combined keyboard and accent color effect
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Apply custom accent color
    if (settings.accent) {
      document.documentElement.style.setProperty("--accent", settings.accent);
    }

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [settings.accent]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-(--text-muted)"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Image */}
      {backgroundImage && (
        <div className="absolute inset-0">
          <Image
            src={backgroundImage}
            alt="Background"
            fill
            sizes="100vw"
            className="object-cover"
            priority
            quality={85}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
          />
        </div>
      )}

      {/* Background Overlay */}
      <div
        className="absolute inset-0 bg-background"
        style={{
          opacity: (settings.overlayStrength || 30) / 100,
        }}
      />

      {/* Main Content */}
      <motion.div
        id="main-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 container mx-auto px-6 py-12 max-w-6xl"
      >
        {/* Top Bar */}
        <TopBar
          searchEngine={settings.searchEngine}
          onSearchEngineChange={(engine) =>
            setSettings({ ...settings, searchEngine: engine })
          }
          weatherApiKey={settings.weatherApiKey}
          weatherUnit={settings.weatherUnit}
          weatherCity={settings.weatherCity}
          onWeatherCityChange={(city) =>
            setSettings({ ...settings, weatherCity: city })
          }
          onOpenSettings={() => setShowSettings(true)}
          onToggleNotes={() => setShowNotes(!showNotes)}
        />

        {/* Pinned Sites Grid */}
        <PinnedGrid
          pins={settings.pins}
          onPinsChange={(pins) => setSettings({ ...settings, pins })}
          pinnedSitesOpacity={settings.pinnedSitesOpacity}
        />

        {/* Keyboard Shortcut Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-(--text-muted) font-light tracking-wide text-contrast">
            Press{" "}
            <kbd className="px-2.5 py-1 glass rounded-md text-xs font-mono">
              Ctrl+K
            </kbd>{" "}
            to open command palette
          </p>
        </motion.div>
      </motion.div>

      {/* Notes Widget */}
      <Suspense fallback={null}>
        <NotesWidget
          notes={settings.notes}
          position={settings.notesPos}
          visible={showNotes}
          onNotesChange={(notes) => setSettings({ ...settings, notes })}
          onPositionChange={(notesPos) =>
            setSettings({ ...settings, notesPos })
          }
          onClose={() => setShowNotes(false)}
        />
      </Suspense>

      {/* Settings Modal */}
      <Suspense fallback={null}>
        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          settings={settings}
          onSettingsChange={setSettings}
        />
      </Suspense>

      {/* Command Palette */}
      <Suspense fallback={null}>
        <CommandPalette
          isOpen={showCommandPalette}
          onClose={() => setShowCommandPalette(false)}
          onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
          onOpenSettings={() => {
            setShowSettings(true);
            setShowCommandPalette(false);
          }}
          onToggleNotes={() => {
            setShowNotes(!showNotes);
            setShowCommandPalette(false);
          }}
          pins={settings.pins}
          theme={theme}
        />
      </Suspense>
    </div>
  );
}

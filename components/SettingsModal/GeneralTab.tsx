"use client";

import { motion } from "framer-motion";

interface GeneralTabProps {
  settings: any;
  onSettingsChange: (settings: any) => void;
}

const searchEngines = [
  { id: "google", name: "Google" },
  { id: "duckduckgo", name: "DuckDuckGo" },
  { id: "bing", name: "Bing" },
  { id: "brave", name: "Brave" },
];

export default function GeneralTab({
  settings,
  onSettingsChange,
}: GeneralTabProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-(--text) mb-2 drop-shadow-sm">
          Search Engine
        </h3>
        <p className="text-sm text-(--text-muted) mb-6">
          Choose your preferred search engine
        </p>
        <div className="grid grid-cols-2 gap-3">
          {searchEngines.map((engine) => (
            <motion.label
              key={engine.id}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-3 p-4 glass rounded-xl cursor-pointer transition-all ${
                settings.searchEngine === engine.id
                  ? "bg-(--accent) bg-opacity-15 border-2 border-(--accent) shadow-md"
                  : "hover:bg-opacity-90 border-2 border-transparent"
              }`}
            >
              <input
                type="radio"
                name="searchEngine"
                value={engine.id}
                checked={settings.searchEngine === engine.id}
                onChange={(e) =>
                  onSettingsChange({
                    ...settings,
                    searchEngine: e.target.value,
                  })
                }
                className="h-5 w-5 text-(--accent)"
                aria-label={`Select ${engine.name}`}
              />
              <span className="text-(--text) font-medium">{engine.name}</span>
            </motion.label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-(--text) mb-2 drop-shadow-sm">
          Homepage Behavior
        </h3>
        <p className="text-sm text-(--text-muted) leading-relaxed">
          All settings are saved locally in your browser and persist across
          sessions.
        </p>
      </div>
    </div>
  );
}

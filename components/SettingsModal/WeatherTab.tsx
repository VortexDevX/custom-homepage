"use client";

import { motion } from "framer-motion";

interface WeatherTabProps {
  settings: any;
  onSettingsChange: (settings: any) => void;
}

export default function WeatherTab({
  settings,
  onSettingsChange,
}: WeatherTabProps) {
  return (
    <div className="space-y-8 w-full max-w-full">
      <div className="w-full">
        <h3 className="text-xl font-semibold text-(--text) mb-2 drop-shadow-sm">
          Temperature Unit
        </h3>
        <p className="text-sm text-(--text-muted) mb-6">
          Choose your preferred temperature scale
        </p>
        <div className="flex gap-4">
          {[
            { value: "C", label: "Celsius" },
            { value: "F", label: "Fahrenheit" },
          ].map((unit) => (
            <motion.button
              key={unit.value}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                onSettingsChange({
                  ...settings,
                  weatherUnit: unit.value,
                })
              }
              className={`flex-1 px-5 py-3 rounded-xl transition-all font-medium ${
                settings.weatherUnit === unit.value
                  ? "bg-(--accent) text-white shadow-lg"
                  : "glass text-(--text) hover:bg-opacity-90"
              }`}
            >
              {unit.label}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="w-full">
        <h3 className="text-xl font-semibold text-(--text) mb-2 drop-shadow-sm">
          Default City
        </h3>
        <p className="text-sm text-(--text-muted) mb-6">
          Set your location or use auto-detection
        </p>
        <input
          type="text"
          value={settings.weatherCity || ""}
          onChange={(e) =>
            onSettingsChange({
              ...settings,
              weatherCity: e.target.value,
            })
          }
          placeholder="Enter city name (optional)"
          className="w-full glass rounded-xl px-4 py-3 outline-none text-(--text) placeholder:text-(--text-muted)"
        />
        <p className="text-xs text-(--text-muted) mt-3">
          Leave empty to use automatic location detection
        </p>
      </div>
    </div>
  );
}

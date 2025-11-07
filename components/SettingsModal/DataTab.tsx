"use client";

import { Download, Upload, RotateCcw, AlertTriangle } from "lucide-react";
import { exportSettings, importSettings, resetSettings } from "@/lib/storage";
import { useState } from "react";
import { motion } from "framer-motion";

interface DataTabProps {
  settings: any;
  onSettingsChange: (settings: any) => void;
}

export default function DataTab({ settings, onSettingsChange }: DataTabProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleExport = () => {
    const data = exportSettings();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `homepage-settings-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const success = importSettings(reader.result as string);
          if (success) {
            window.location.reload();
          } else {
            alert("Failed to import settings. Please check the file format.");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleReset = () => {
    resetSettings();
    setShowResetConfirm(false);
    window.location.reload();
  };

  return (
    <div className="space-y-8 w-full max-w-full">
      <div className="w-full">
        <h3 className="text-xl font-semibold text-(--text) mb-2 drop-shadow-sm">
          Export Settings
        </h3>
        <p className="text-sm text-(--text-muted) mb-6">
          Download all your settings, pins, and notes as a JSON file.
        </p>
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleExport}
          className="flex items-center gap-2 px-6 py-3 bg-(--accent) text-white rounded-xl hover:bg-(--accent-hover) transition-all shadow-md font-medium"
        >
          <Download className="h-5 w-5" />
          Export Data
        </motion.button>
      </div>

      <div className="w-full">
        <h3 className="text-xl font-semibold text-(--text) mb-2 drop-shadow-sm">
          Import Settings
        </h3>
        <p className="text-sm text-(--text-muted) mb-6">
          Restore your settings from a previously exported file.
        </p>
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleImport}
          className="flex items-center gap-2 px-6 py-3 glass rounded-xl hover:bg-opacity-90 transition-all text-(--text) shadow-md font-medium"
        >
          <Upload className="h-5 w-5" />
          Import Data
        </motion.button>
      </div>

      <div className="w-full">
        <h3 className="text-xl font-semibold text-red-500 mb-2 drop-shadow-sm">
          Reset to Defaults
        </h3>
        <p className="text-sm text-(--text-muted) mb-6">
          This will delete all your settings, pins, and notes. This action
          cannot be undone.
        </p>
        {!showResetConfirm ? (
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-2 px-6 py-3 glass rounded-xl hover:bg-red-500 hover:bg-opacity-20 transition-all text-red-500 shadow-md font-medium"
          >
            <RotateCcw className="h-5 w-5" />
            Reset All Data
          </motion.button>
        ) : (
          <div className="glass rounded-xl p-5 shadow-md">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-(--text) font-medium">
                Are you sure? This will permanently delete all your data.
              </p>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReset}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium"
              >
                Yes, Reset Everything
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-3 glass rounded-xl hover:bg-opacity-90 transition-colors font-medium"
              >
                Cancel
              </motion.button>
            </div>
          </div>
        )}
      </div>

      <div className="w-full pt-4 border-t border-(--panel-border)">
        <h3 className="text-xl font-semibold text-(--text) mb-2 drop-shadow-sm">
          Storage Information
        </h3>
        <div className="text-sm text-(--text-muted) space-y-2 mt-4">
          <p className="font-medium">• Pins: {settings.pins?.length || 0}</p>
          <p className="font-medium">• Notes: {settings.notes?.length || 0}</p>
          <p className="font-medium">
            • All data is stored locally in your browser
          </p>
        </div>
      </div>
    </div>
  );
}

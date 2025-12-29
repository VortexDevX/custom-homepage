"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Settings2, Palette, Cloud, Database } from "lucide-react";
import GeneralTab from "./GeneralTab";
import AppearanceTab from "./AppearanceTab";
import WeatherTab from "./WeatherTab";
import DataTab from "./DataTab";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: any;
  onSettingsChange: (settings: any) => void;
}

const tabs = [
  { id: "General", label: "General", icon: Settings2 },
  { id: "Appearance", label: "Appearance", icon: Palette },
  { id: "Weather", label: "Weather", icon: Cloud },
  { id: "Data", label: "Data", icon: Database },
];

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState("General");

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="settings-title"
        >
          {/* Backdrop - static blur for better performance */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-md" />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="relative w-full max-w-6xl h-[90vh] flex flex-col md:flex-row glass rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-(--panel-border) bg-(--panel-bg) bg-opacity-30 p-6">
              <div className="mb-8">
                <div className="flex items-center justify-between md:justify-start gap-3 mb-2">
                  <Settings2 className="h-6 w-6 text-(--accent) drop-shadow-md" />
                  <h2
                    id="settings-title"
                    className="text-2xl font-bold text-(--text) tracking-tight"
                  >
                    Settings
                  </h2>
                  <button
                    onClick={onClose}
                    className="md:hidden ml-auto p-2 hover:bg-red-500/15 rounded-xl transition-colors"
                    aria-label="Close settings"
                  >
                    <X className="h-5 w-5 text-red-500" />
                  </button>
                </div>
                <p className="text-sm text-(--text-muted) font-medium">
                  Customize your experience
                </p>
              </div>

              {/* Tab Navigation */}
              <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible scrollbar-hide">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left whitespace-nowrap ${
                        isActive
                          ? "bg-(--accent) text-white shadow-lg"
                          : "text-(--text-muted) hover:text-(--text) hover:bg-white/5"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 shrink-0 ${
                          isActive ? "drop-shadow-md" : ""
                        }`}
                      />
                      <span className="font-medium text-sm">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Close button for desktop */}
              <button
                onClick={onClose}
                className="hidden md:flex items-center justify-center gap-2 w-full mt-8 px-4 py-3 glass rounded-xl hover:bg-opacity-70 transition-colors text-sm font-medium shadow-md"
              >
                <X className="h-4 w-4" />
                Close
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Header - Desktop only */}
              <div className="hidden md:flex items-center justify-between p-6 border-b border-(--panel-border)">
                <div>
                  <h3 className="text-xl font-semibold text-(--text)">
                    {tabs.find((t) => t.id === activeTab)?.label}
                  </h3>
                  <p className="text-sm text-(--text-muted) mt-1">
                    {activeTab === "General" &&
                      "Configure your search and homepage behavior"}
                    {activeTab === "Appearance" &&
                      "Personalize themes, colors, and backgrounds"}
                    {activeTab === "Weather" &&
                      "Set up weather display preferences"}
                    {activeTab === "Data" && "Manage your settings and data"}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2.5 hover:bg-red-500/15 rounded-xl transition-colors"
                  aria-label="Close settings"
                >
                  <X className="h-5 w-5 text-red-500" />
                </button>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden">
                <div className="p-6 md:p-8">
                  {activeTab === "General" && (
                    <GeneralTab
                      settings={settings}
                      onSettingsChange={onSettingsChange}
                    />
                  )}
                  {activeTab === "Appearance" && (
                    <AppearanceTab
                      settings={settings}
                      onSettingsChange={onSettingsChange}
                    />
                  )}
                  {activeTab === "Weather" && (
                    <WeatherTab
                      settings={settings}
                      onSettingsChange={onSettingsChange}
                    />
                  )}
                  {activeTab === "Data" && (
                    <DataTab
                      settings={settings}
                      onSettingsChange={onSettingsChange}
                    />
                  )}
                </div>
              </div>

              {/* Footer - Mobile only */}
              <div className="md:hidden border-t border-(--panel-border) p-4 bg-(--panel-bg)/50">
                <button
                  onClick={onClose}
                  className="w-full px-6 py-3 bg-(--accent) text-white rounded-xl font-medium shadow-lg hover:opacity-90 transition-opacity"
                >
                  Save & Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

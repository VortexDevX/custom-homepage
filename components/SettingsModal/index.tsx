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
          {/* Backdrop with blur */}
          <motion.div
            initial={{ backdropFilter: "blur(0px)", opacity: 0 }}
            animate={{ backdropFilter: "blur(12px)", opacity: 1 }}
            exit={{ backdropFilter: "blur(0px)", opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/50"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 22,
            }}
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
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="md:hidden ml-auto p-2 hover:bg-red-500/15 rounded-xl transition-all"
                    aria-label="Close settings"
                  >
                    <X className="h-5 w-5 text-red-500" />
                  </motion.button>
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
                    <motion.button
                      key={tab.id}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
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
                    </motion.button>
                  );
                })}
              </nav>

              {/* Close button for desktop */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="hidden md:flex items-center justify-center gap-2 w-full mt-8 px-4 py-3 glass rounded-xl hover:bg-opacity-70 transition-all text-sm font-medium shadow-md"
              >
                <X className="h-4 w-4" />
                Close
              </motion.button>
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
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2.5 hover:bg-red-500/15 rounded-xl transition-all"
                  aria-label="Close settings"
                >
                  <X className="h-5 w-5 text-red-500" />
                </motion.button>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="p-6 md:p-8"
                  >
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
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer - Mobile only */}
              <div className="md:hidden border-t border-(--panel-border) p-4 bg-(--panel-bg)/50">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="w-full px-6 py-3 bg-(--accent) text-white rounded-xl font-medium shadow-lg"
                >
                  Save & Close
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Settings,
  Moon,
  Sun,
  StickyNote,
  ExternalLink,
  Command,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Pin } from "@/lib/storage";
import Image from "next/image";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  pins: Pin[];
  onOpenSettings: () => void;
  onToggleTheme: () => void;
  onToggleNotes: () => void;
  theme?: string;
}

interface CommandItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  category: string;
  description?: string;
}

export default function CommandPalette({
  isOpen,
  onClose,
  pins,
  onOpenSettings,
  onToggleTheme,
  onToggleNotes,
  theme,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const commands: CommandItem[] = [
    {
      id: "settings",
      label: "Open Settings",
      description: "Customize your homepage",
      icon: <Settings className="h-5 w-5" />,
      action: () => {
        onOpenSettings();
        onClose();
      },
      category: "Actions",
    },
    {
      id: "theme",
      label: `Switch to ${theme === "dark" ? "Light" : "Dark"} Theme`,
      description: `Activate ${theme === "dark" ? "light" : "dark"} mode`,
      icon:
        theme === "dark" ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        ),
      action: () => {
        onToggleTheme();
        onClose();
      },
      category: "Actions",
    },
    {
      id: "notes",
      label: "Toggle Notes",
      description: "Show or hide notes widget",
      icon: <StickyNote className="h-5 w-5" />,
      action: () => {
        onToggleNotes();
        onClose();
      },
      category: "Actions",
    },
    ...pins.map((pin) => {
      const getFavicon = (url: string) => {
        try {
          const domain = new URL(url).hostname;
          return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
        } catch {
          return null;
        }
      };

      const faviconUrl = pin.icon || getFavicon(pin.url);

      return {
        id: `pin-${pin.id}`,
        label: pin.title,
        description: new URL(pin.url).hostname,
        icon: faviconUrl ? (
          <div className="h-5 w-5 rounded-sm overflow-hidden relative">
            <Image
              src={faviconUrl}
              alt={`${pin.title} icon`}
              fill
              sizes="20px"
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                target.parentElement!.innerHTML =
                  '<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>';
              }}
              quality={75}
              loading="lazy"
            />
          </div>
        ) : (
          <ExternalLink className="h-5 w-5" />
        ),
        action: () => {
          window.open(pin.url, "_blank");
          onClose();
        },
        category: "Pinned Sites",
      };
    }),
  ];

  const filteredCommands = query
    ? commands.filter((cmd) =>
        cmd.label.toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => (i + 1) % filteredCommands.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) =>
          i === 0 ? filteredCommands.length - 1 : i - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        filteredCommands[selectedIndex]?.action();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const selectedElement = listRef.current.querySelector(
        `[data-index="${selectedIndex}"]`
      );
      selectedElement?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) {
      acc[cmd.category] = [];
    }
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          {/* Enhanced Backdrop */}
          <motion.div
            initial={{ backdropFilter: "blur(0px)", opacity: 0 }}
            animate={{ backdropFilter: "blur(16px)", opacity: 1 }}
            exit={{ backdropFilter: "blur(0px)", opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-black/60"
          />

          {/* Command Palette Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
            className="relative glass rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden border-2 border-(--glass-border)"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Icon */}
            <div className="flex items-center gap-4 px-6 py-5 border-b border-(--panel-border) bg-linear-to-r from-transparent via-(--accent)/5 to-transparent">
              <div className="p-2 rounded-xl bg-(--accent)/10">
                <Command className="h-5 w-5 text-(--accent)" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-(--text)">
                  Quick Actions
                </h3>
                <p className="text-xs text-(--text-muted) mt-0.5">
                  Search commands and pinned sites
                </p>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs glass rounded-lg font-mono text-(--text-muted)">
                  <Command className="h-3 w-3" />
                  <span>K</span>
                </kbd>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative flex items-center gap-3 px-6 py-4 border-b border-(--panel-border)">
              <Search className="h-5 w-5 text-(--accent) drop-shadow-sm" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for actions, settings, or sites..."
                className="flex-1 bg-transparent outline-none text-(--text) placeholder:text-(--text-muted) text-base font-medium"
                aria-label="Search commands"
              />
              {query && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuery("")}
                  className="text-(--text-muted) hover:text-(--text) text-sm font-medium"
                >
                  Clear
                </motion.button>
              )}
            </div>

            {/* Commands List */}
            <div
              ref={listRef}
              className="max-h-[450px] overflow-y-auto overflow-x-hidden"
            >
              {Object.keys(groupedCommands).length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center p-12 text-center"
                >
                  <div className="p-4 rounded-2xl bg-(--accent)/10 mb-4">
                    <Search className="h-8 w-8 text-(--accent)" />
                  </div>
                  <p className="text-(--text) font-semibold mb-1">
                    No commands found
                  </p>
                  <p className="text-sm text-(--text-muted)">
                    Try searching with different keywords
                  </p>
                </motion.div>
              ) : (
                <div className="py-2">
                  {Object.entries(groupedCommands).map(([category, cmds]) => (
                    <div key={category} className="mb-2">
                      <div className="flex items-center gap-2 px-6 py-2 text-xs font-semibold text-(--text-muted) uppercase tracking-wider">
                        {category === "Actions" && (
                          <Sparkles className="h-3.5 w-3.5" />
                        )}
                        {category === "Pinned Sites" && (
                          <ExternalLink className="h-3.5 w-3.5" />
                        )}
                        <span>{category}</span>
                      </div>
                      {cmds.map((cmd) => {
                        const globalIdx = filteredCommands.indexOf(cmd);
                        const isSelected = globalIdx === selectedIndex;
                        return (
                          <motion.button
                            key={cmd.id}
                            data-index={globalIdx}
                            whileHover={{ x: 6 }}
                            onClick={cmd.action}
                            className={`w-full flex items-center gap-4 px-6 py-3.5 text-left transition-all group ${
                              isSelected
                                ? "bg-(--accent) bg-opacity-15 border-l-4 border-(--accent)"
                                : "hover:bg-(--accent)/5 border-l-4 border-transparent"
                            }`}
                          >
                            <div
                              className={`p-2 rounded-xl transition-all ${
                                isSelected
                                  ? "bg-(--accent) text-white shadow-md"
                                  : "bg-(--accent)/10 text-(--accent) group-hover:bg-(--accent)/15"
                              }`}
                            >
                              {cmd.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-(--text) text-sm font-semibold truncate">
                                {cmd.label}
                              </div>
                              {cmd.description && (
                                <div className="text-xs text-(--text-muted) truncate mt-0.5">
                                  {cmd.description}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {isSelected && (
                                <motion.kbd
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="hidden sm:flex px-2.5 py-1 text-xs glass rounded-lg font-mono text-(--accent) font-semibold"
                                >
                                  ↵
                                </motion.kbd>
                              )}
                              <ArrowRight
                                className={`h-4 w-4 transition-all ${
                                  isSelected
                                    ? "text-(--accent) opacity-100"
                                    : "text-(--text-muted) opacity-0 group-hover:opacity-100"
                                }`}
                              />
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Enhanced Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-(--panel-border) bg-(--panel-bg)/30">
              <div className="flex items-center gap-4 text-xs text-(--text-muted) font-medium">
                <div className="flex items-center gap-1.5">
                  <kbd className="px-2 py-1 glass rounded-md font-mono text-(--text)">
                    ↑
                  </kbd>
                  <kbd className="px-2 py-1 glass rounded-md font-mono text-(--text)">
                    ↓
                  </kbd>
                  <span>Navigate</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <kbd className="px-2 py-1 glass rounded-md font-mono text-(--text)">
                    ↵
                  </kbd>
                  <span>Select</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <kbd className="px-2 py-1 glass rounded-md font-mono text-(--text)">
                    Esc
                  </kbd>
                  <span>Close</span>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-xs text-(--text-muted)">
                <span>{filteredCommands.length}</span>
                <span>result{filteredCommands.length !== 1 ? "s" : ""}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

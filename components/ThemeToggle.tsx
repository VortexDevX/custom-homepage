"use client";

import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="glass rounded-xl p-3 transition-all duration-200 shadow-md"
        aria-label="Toggle theme"
      >
        <div className="h-5 w-5" />
      </button>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.08, rotate: 15 }}
      whileTap={{ scale: 0.95, rotate: -15 }}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="glass rounded-xl p-3 hover:bg-opacity-70 transition-all duration-200 overflow-hidden shadow-md"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <AnimatePresence mode="wait">
        {theme === "dark" ? (
          <motion.div
            key="sun"
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
          >
            <Sun className="h-5 w-5 text-(--text) drop-shadow-md" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
          >
            <Moon className="h-5 w-5 text-(--text) drop-shadow-md" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

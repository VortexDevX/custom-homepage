import { useState, useEffect } from "react";

interface UseBackgroundOptions {
  bgMode: "auto" | "manual" | "custom";
  customBg?: string;
  selectedBg?: string;
  currentTheme: string;
}

/**
 * Custom hook to manage background image selection
 * Handles auto, manual, and custom background modes
 */
export function useBackground({
  bgMode,
  customBg,
  selectedBg,
  currentTheme,
}: UseBackgroundOptions) {
  const [autoBackground, setAutoBackground] = useState<string>("");

  // Auto mode: randomly select a background based on theme
  useEffect(() => {
    if (bgMode === "auto" && currentTheme) {
      const themeFolder = currentTheme === "dark" ? "dark" : "light";
      const randomNum = Math.floor(Math.random() * 7) + 1; // 7 backgrounds available

      // Determine file extension based on theme
      let ext = "jpg";
      if (themeFolder === "light") {
        // Light: 2, 4, 5, 6 are PNG, others are JPG
        ext = [2, 4, 5, 6].includes(randomNum) ? "png" : "jpg";
      } else {
        // Dark: All are PNG
        ext = "png";
      }

      setAutoBackground(`/backgrounds/${themeFolder}/${randomNum}.${ext}`);
    }
  }, [bgMode, currentTheme]);

  // Determine which background to use
  const getBackgroundImage = (): string | undefined => {
    if (bgMode === "custom" && customBg) {
      return customBg;
    }
    if (bgMode === "manual" && selectedBg) {
      return selectedBg;
    }
    if (bgMode === "auto" && autoBackground) {
      return autoBackground;
    }
    return undefined;
  };

  return getBackgroundImage();
}

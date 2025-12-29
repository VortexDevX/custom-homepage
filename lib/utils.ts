/**
 * Shared utility functions for the application
 */

/**
 * Gets the favicon URL for a given website URL
 * @param url - The website URL
 * @param size - The icon size (default: 64)
 * @returns Favicon URL or null if invalid
 */
export function getFavicon(url: string, size = 64): string | null {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
  } catch {
    return null;
  }
}

/**
 * Classname utility for conditional classes
 * @param classes - Array of class names or conditional objects
 * @returns Combined class string
 */
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

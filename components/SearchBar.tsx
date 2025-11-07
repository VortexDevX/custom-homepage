"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Clock } from "lucide-react";

interface SearchBarProps {
  searchEngine: string;
  onSearchEngineChange: (engine: string) => void;
}

const searchEngines = {
  google: { name: "Google", url: "https://www.google.com/search?q=" },
  duckduckgo: { name: "DuckDuckGo", url: "https://duckduckgo.com/?q=" },
  bing: { name: "Bing", url: "https://www.bing.com/search?q=" },
  brave: { name: "Brave", url: "https://search.brave.com/search?q=" },
};

export default function SearchBar({
  searchEngine,
  onSearchEngineChange,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [showEngineSelect, setShowEngineSelect] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Local search suggestions based on common search terms
  const commonSuggestions = [
    "weather today",
    "news today",
    "sports scores",
    "movie times near me",
    "restaurants near me",
    "directions to",
    "translate to english",
    "define",
    "calculator",
    "timer",
    "calendar",
    "email login",
    "youtube",
    "netflix",
    "amazon",
    "wikipedia",
    "maps",
    "translate",
    "dictionary",
    "thesaurus",
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setShowEngineSelect(false);
      }
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch search suggestions with debouncing
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        // Use local suggestions instead of external API to avoid CORS issues
        const filtered = commonSuggestions
          .filter((suggestion) =>
            suggestion.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 8); // Limit to 8 suggestions

        setSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
      } catch (error) {
        console.error("Failed to generate suggestions:", error);
        setSuggestions([]);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > -1 ? prev - 1 : -1));
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleSearch(suggestions[selectedIndex]);
    }
  };

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      const engine = searchEngines[searchEngine as keyof typeof searchEngines];
      window.open(engine.url + encodeURIComponent(searchQuery), "_blank");
      setQuery("");
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const currentEngine =
    searchEngines[searchEngine as keyof typeof searchEngines] ||
    searchEngines.duckduckgo;

  return (
    <form onSubmit={handleSubmit} className="relative flex-1 max-w-3xl mx-auto">
      <motion.div
        whileHover={{ scale: 1.01, y: -2 }}
        whileFocus={{ scale: 1.01 }}
        className="glass rounded-2xl flex items-center px-6 py-4 gap-4 hover:shadow-xl transition-all focus-within:ring-2 focus-within:ring-(--accent) focus-within:ring-opacity-40 shadow-md"
      >
        <Search className="h-5 w-5 text-(--text-muted) drop-shadow-sm" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Search with ${currentEngine.name}...`}
          className="flex-1 bg-transparent outline-none text-(--text) placeholder:text-(--text-muted) text-lg font-medium tracking-wide"
          aria-label="Search"
          autoComplete="off"
        />
        <div className="relative" ref={selectRef}>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => setShowEngineSelect(!showEngineSelect)}
            className="text-sm font-medium text-(--text-muted) hover:text-(--accent) transition-all px-3 py-2 rounded-lg glass shadow-sm"
            aria-label="Select search engine"
            aria-expanded={showEngineSelect ? "true" : "false"}
          >
            {currentEngine.name}
          </motion.button>
          <AnimatePresence>
            {showEngineSelect && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, type: "spring" }}
                className="absolute right-0 top-full mt-2 glass rounded-xl shadow-xl py-2 min-w-[140px] z-50"
              >
                {Object.entries(searchEngines).map(([key, engine]) => (
                  <motion.button
                    key={key}
                    whileHover={{ backgroundColor: "rgba(0,0,0,0.08)", x: 4 }}
                    type="button"
                    onClick={() => {
                      onSearchEngineChange(key);
                      setShowEngineSelect(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm transition-all ${
                      key === searchEngine
                        ? "text-(--accent) font-semibold"
                        : "text-(--text) font-medium"
                    }`}
                  >
                    {engine.name}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Search Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            ref={suggestionsRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute w-full mt-2 glass rounded-2xl shadow-xl py-2 z-50 max-h-80 overflow-y-auto"
          >
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion}
                type="button"
                whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                onClick={() => handleSearch(suggestion)}
                className={`w-full px-6 py-3 text-left flex items-center gap-3 transition-all ${
                  index === selectedIndex ? "bg-(--accent) bg-opacity-10" : ""
                }`}
              >
                <Clock className="h-4 w-4 text-(--text-muted)" />
                <span className="text-(--text) text-sm font-medium">
                  {suggestion}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

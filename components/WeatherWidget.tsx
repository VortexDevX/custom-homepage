"use client";

import { useState, useEffect } from "react";
import { Cloud, MapPin, RefreshCw, ThermometerSun } from "lucide-react";

interface WeatherWidgetProps {
  apiKey?: string;
  unit: "C" | "F";
  city?: string;
  onCityChange: (city: string) => void;
}

interface WeatherData {
  temp: number;
  condition: string;
  location: string;
  humidity?: number;
}

export default function WeatherWidget({
  apiKey,
  unit,
  city,
  onCityChange,
}: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingCity, setEditingCity] = useState(false);
  const [cityInput, setCityInput] = useState(city || "");

  // Use environment API key if available
  const effectiveApiKey = apiKey || process.env.NEXT_PUBLIC_WEATHER_API_KEY;

  const fetchWeather = async (location?: string) => {
    if (!effectiveApiKey) {
      setError("No API key configured");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use server-side API proxy to hide API key
      const query = location || city || "London";
      const response = await fetch(
        `/api/weather?city=${encodeURIComponent(query)}&unit=${unit}`
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "City not found");
      }

      const data = await response.json();
      setWeather({
        temp: data.temp,
        condition: data.condition,
        location: data.location,
        humidity: data.humidity,
      });
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch weather";
      setError(message);
      console.error("Weather fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (effectiveApiKey) {
      fetchWeather();
    }
  }, [effectiveApiKey, unit]);

  const handleCitySubmit = () => {
    if (cityInput.trim()) {
      onCityChange(cityInput);
      fetchWeather(cityInput);
      setEditingCity(false);
    }
  };

  if (!effectiveApiKey) {
    return (
      <div className="glass rounded-xl px-4 py-2 text-xs text-(--text-muted) font-light">
        <ThermometerSun className="h-4 w-4 inline mr-2" />
        Configure weather
      </div>
    );
  }

  if (loading) {
    return (
      <div className="glass rounded-xl px-4 py-2 flex items-center gap-2">
        <RefreshCw className="h-4 w-4 animate-spin text-(--accent)" />
        <span className="text-xs text-(--text-muted) font-light">
          Loading...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass rounded-xl px-4 py-2 flex items-center gap-2">
        <Cloud className="h-4 w-4 text-red-500" />
        <span className="text-xs text-red-500 font-light">{error}</span>
        <button
          onClick={() => fetchWeather()}
          className="ml-2 text-xs text-(--accent) hover:underline font-light"
          aria-label="Retry fetching weather"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="glass rounded-xl px-4 py-2 flex items-center gap-3">
      <ThermometerSun className="h-4 w-4 text-(--accent)" />
      <div className="flex items-center gap-2">
        <span className="text-base font-light text-(--text)">
          {weather.temp}°{unit}
        </span>
        <span className="text-xs text-(--text-muted) font-light">
          {weather.condition}
        </span>
      </div>
      {editingCity ? (
        <input
          type="text"
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          onBlur={handleCitySubmit}
          onKeyDown={(e) => e.key === "Enter" && handleCitySubmit()}
          className="bg-transparent border-b border-(--accent) outline-none text-xs w-24 font-light"
          placeholder="City"
          autoFocus
        />
      ) : (
        <button
          onClick={() => setEditingCity(true)}
          className="flex items-center gap-1 text-xs text-(--text-muted) hover:text-(--accent) transition-colors font-light"
          title="Change location"
        >
          <MapPin className="h-3 w-3" />
          {weather.location}
        </button>
      )}
      <button
        onClick={() => fetchWeather()}
        className="ml-auto p-1 hover:bg-(--accent) hover:bg-opacity-10 rounded-lg transition-colors"
        aria-label="Refresh weather"
        title="Refresh weather"
      >
        <RefreshCw className="h-3.5 w-3.5 text-(--text-muted)" />
      </button>
    </div>
  );
}

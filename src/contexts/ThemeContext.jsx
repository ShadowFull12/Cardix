"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { getUserProfile } from "@/lib/firestore";

const ThemeContext = createContext({ accent: "#3b82f6" });

export function useTheme() {
  return useContext(ThemeContext);
}

/**
 * ThemeProvider loads the user's card accent color and injects it as
 * a CSS custom property --accent on the document root. This lets
 * the entire UI automatically match the user's card colour.
 */
export function ThemeProvider({ children }) {
  const { user } = useAuth();
  const [accent, setAccent] = useState("#3b82f6");

  useEffect(() => {
    async function load() {
      if (!user?.uid) return;
      try {
        const profile = await getUserProfile(user.uid);
        const color = profile?.settings?.accentColor;
        if (color) setAccent(color);
      } catch {
        // keep default
      }
    }
    load();
  }, [user]);

  // Inject into CSS custom properties so Tailwind/CSS can reference --accent
  useEffect(() => {
    document.documentElement.style.setProperty("--accent", accent);
    // Also compute an rgb version for opacity utilities
    const r = parseInt(accent.slice(1, 3), 16);
    const g = parseInt(accent.slice(3, 5), 16);
    const b = parseInt(accent.slice(5, 7), 16);
    document.documentElement.style.setProperty("--accent-rgb", `${r}, ${g}, ${b}`);
  }, [accent]);

  return (
    <ThemeContext.Provider value={{ accent, setAccent }}>
      {children}
    </ThemeContext.Provider>
  );
}

// src/useTheme.js — "system" | "light" | "dark", remembered on this device
import { useEffect, useState } from "react";

const KEY = "theme";

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem(KEY) || "system"; } catch { return "system"; }
  });
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", theme);
    try { localStorage.setItem(KEY, theme); } catch { /* private mode: ignore */ }
  }, [theme]);
  return [theme, setTheme];
}
// src/modules/water/useWater.js — live water data, shared by the tab and the home card
import { useValue, useNow } from "../../useFirebase";
import { WATER_PATH as W, ONLINE_WINDOW_MS } from "../../config";

export function useWaterLive() {
  const level = useValue(`${W}/level`);
  const distance = useValue(`${W}/distance_cm`);
  const pump = useValue(`${W}/pump/state`);
  const alert = useValue(`${W}/alert`);
  const lastSeen = useValue(`${W}/last_seen`);
  const now = useNow();

  return {
    loaded: level !== undefined,
    level: typeof level === "number" ? level : 0,
    distance: typeof distance === "number" ? distance : null,
    pump: pump || "OFF",
    alert: alert || "",
    lastSeen: lastSeen || null,
    online: !!lastSeen && now - lastSeen < ONLINE_WINDOW_MS,
    now,
  };
}

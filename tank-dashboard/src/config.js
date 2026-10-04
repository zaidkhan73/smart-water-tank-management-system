// src/config.js — single place for app-wide settings

// Firebase path where the water module lives. The ESP32 must write here too
// (e.g. /water/level, /water/pump/state, /water/events ...).
export const WATER_PATH = "water";

// Only these Google accounts see the pump toggle enabled.
// Leave empty ([]) while testing -> every logged-in user is admin.
// NOTE: this only hides the button. Real protection = Firebase security rules.
export const ADMIN_EMAILS = [
  // "zaid@gmail.com",
];

// A device counts as online if its last_seen is newer than this.
export const ONLINE_WINDOW_MS = 20000;

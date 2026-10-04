// src/useFirebase.js — small realtime helpers
import { useEffect, useState } from "react";
import { ref, onValue, query, limitToLast } from "firebase/database";
import { db } from "./firebase";

// Live value of a single path. undefined = not loaded yet, null = no data.
export function useValue(path) {
  const [v, setV] = useState(undefined);
  useEffect(() => onValue(ref(db, path), (s) => setV(s.val())), [path]);
  return v;
}

// Last N children of a node as an array (oldest -> newest).
export function useLastN(path, n) {
  const [rows, setRows] = useState(undefined);
  useEffect(
    () =>
      onValue(query(ref(db, path), limitToLast(n)), (s) => {
        const out = [];
        s.forEach((c) => out.push({ id: c.key, ...c.val() }));
        setRows(out);
      }),
    [path, n]
  );
  return rows;
}

// Re-renders every `ms` so "x min ago" / online status stay fresh.
export function useNow(ms = 5000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), ms);
    return () => clearInterval(id);
  }, [ms]);
  return now;
}

export function ago(ts, now) {
  if (!ts) return "never";
  const s = Math.max(0, Math.round((now - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  return `${Math.floor(s / 86400)} d ago`;
}

export function fmtDuration(ms) {
  const m = Math.round(ms / 60000);
  if (m < 1) return "under 1 min";
  if (m < 60) return `${m} min`;
  return `${Math.floor(m / 60)} h ${m % 60} min`;
}

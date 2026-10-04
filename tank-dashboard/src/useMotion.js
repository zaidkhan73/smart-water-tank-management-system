// src/useMotion.js — small animation helpers
import { useEffect, useRef, useState } from "react";

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Counts a number up/down smoothly toward `target`.
export function useTween(target, ms = 1200) {
  const [v, setV] = useState(0);
  const from = useRef(0);
  useEffect(() => {
    const a = from.current, t0 = performance.now(), d = reduced() ? 1 : ms;
    let id;
    const step = (t) => {
      const p = Math.min(1, (t - t0) / d);
      const cur = a + (target - a) * (1 - Math.pow(1 - p, 3));
      from.current = cur;
      setV(cur);
      if (p < 1) id = requestAnimationFrame(step);
    };
    id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [target, ms]);
  return Math.round(v);
}

// Starts at 0 on first paint, then follows `target` (so CSS can animate the fill-up).
export function useRise(target) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const id = setTimeout(() => setV(target), 80);
    return () => clearTimeout(id);
  }, [target]);
  return v;
}

// Measures an element's width (for the chart).
export function useWidth() {
  const ref = useRef(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}

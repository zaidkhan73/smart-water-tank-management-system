// src/modules/water/LogsTable.jsx — tank FULL / EMPTY (and pump) log, phone-friendly list
import { useMemo, useState } from "react";
import { useLastN, fmtDuration } from "../../useFirebase";
import { WATER_PATH as W } from "../../config";
import Seg from "../../Seg";

const TYPES = {
  FULL:     { label: "Tank full",  tone: "ok" },
  EMPTY:    { label: "Tank empty", tone: "crit" },
  PUMP_ON:  { label: "Pump on",    tone: "water" },
  PUMP_OFF: { label: "Pump off",   tone: "water" },
};

export default function LogsTable() {
  const events = useLastN(`${W}/events`, 200);
  const [filter, setFilter] = useState("all");

  const rows = useMemo(() => {
    if (!events) return [];
    let lastFull = null, lastEmpty = null; // for "Filled in 14 min"
    return events
      .filter((e) => typeof e.t === "number")
      .map((e) => {
        let gap = null;
        if (e.type === "FULL" && lastEmpty) gap = `Filled in ${fmtDuration(e.t - lastEmpty)}`;
        if (e.type === "EMPTY" && lastFull) gap = `Emptied in ${fmtDuration(e.t - lastFull)}`;
        if (e.type === "FULL") lastFull = e.t;
        if (e.type === "EMPTY") lastEmpty = e.t;
        return { ...e, gap };
      })
      .filter((e) => (filter === "all" ? true : filter === "tank" ? e.type === "FULL" || e.type === "EMPTY" : e.type.startsWith("PUMP")))
      .reverse();
  }, [events, filter]);

  return (
    <>
      <Seg value={filter} onChange={setFilter} items={[["all", "All"], ["tank", "Full / empty"], ["pump", "Pump"]]} />
      {events === undefined ? (
        <div className="empty">Loading logs…</div>
      ) : rows.length === 0 ? (
        <div className="empty">No events yet. An entry is added each time the tank becomes full or empty.</div>
      ) : (
        <ul className="logs">
          {rows.map((e) => {
            const meta = TYPES[e.type] || { label: e.type, tone: "water" };
            const d = new Date(e.t);
            const note = [e.gap || e.msg, typeof e.level === "number" ? `${e.level}%` : null].filter(Boolean).join(" · ");
            return (
              <li key={e.id} className="log">
                <span className={`pip ${meta.tone}`} />
                <div className="row-main">
                  <div className="row-title">{meta.label}</div>
                  {note && <div className="row-sub">{note}</div>}
                </div>
                <div className="log-time">
                  <b>{d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</b>
                  <span className="muted">{d.toLocaleDateString([], { day: "numeric", month: "short" })}</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

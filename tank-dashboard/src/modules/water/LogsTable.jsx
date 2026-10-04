// src/modules/water/LogsTable.jsx — tank FULL / EMPTY (and pump) event log
import { useMemo, useState } from "react";
import { useLastN, fmtDuration } from "../../useFirebase";
import { WATER_PATH as W } from "../../config";

const TYPES = {
  FULL:     { label: "Tank full",  cls: "ok" },
  EMPTY:    { label: "Tank empty", cls: "crit" },
  PUMP_ON:  { label: "Pump on",    cls: "info" },
  PUMP_OFF: { label: "Pump off",   cls: "info" },
};
const FILTERS = [
  ["all", "All"],
  ["tank", "Full / Empty"],
  ["pump", "Pump"],
];

export default function LogsTable() {
  const events = useLastN(`${W}/events`, 200);
  const [filter, setFilter] = useState("all");

  const rows = useMemo(() => {
    if (!events) return [];
    // how long since the opposite event (e.g. "full after 14 min")
    let lastFull = null, lastEmpty = null;
    const withGap = events
      .filter((e) => typeof e.t === "number")
      .map((e) => {
        let gap = null;
        if (e.type === "FULL" && lastEmpty) gap = `Filled in ${fmtDuration(e.t - lastEmpty)}`;
        if (e.type === "EMPTY" && lastFull) gap = `Emptied in ${fmtDuration(e.t - lastFull)}`;
        if (e.type === "FULL") lastFull = e.t;
        if (e.type === "EMPTY") lastEmpty = e.t;
        return { ...e, gap };
      });
    return withGap
      .filter((e) =>
        filter === "all" ? true : filter === "tank" ? e.type === "FULL" || e.type === "EMPTY" : e.type.startsWith("PUMP")
      )
      .reverse();
  }, [events, filter]);

  return (
    <>
      <div className="chips" role="tablist" aria-label="Filter logs">
        {FILTERS.map(([id, label]) => (
          <button key={id} className={`chip ${filter === id ? "on" : ""}`} onClick={() => setFilter(id)}>
            {label}
          </button>
        ))}
      </div>

      {events === undefined ? (
        <div className="empty">Loading logs…</div>
      ) : rows.length === 0 ? (
        <div className="empty">No events yet. A log entry is added each time the tank becomes full or empty.</div>
      ) : (
        <div className="table-wrap">
          <table className="logs">
            <thead>
              <tr><th>Time</th><th>Event</th><th>Level</th><th>Note</th></tr>
            </thead>
            <tbody>
              {rows.map((e) => {
                const meta = TYPES[e.type] || { label: e.type, cls: "info" };
                return (
                  <tr key={e.id}>
                    <td>{new Date(e.t).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</td>
                    <td><span className={`tag ${meta.cls}`}>{meta.label}</span></td>
                    <td>{typeof e.level === "number" ? `${e.level}%` : "–"}</td>
                    <td className="muted">{e.gap || e.msg || ""}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

// src/modules/water/WaterTab.jsx — Smart Water Management
import { useEffect, useState } from "react";
import { ref, set } from "firebase/database";
import { db } from "../../firebase";
import { WATER_PATH as W } from "../../config";
import { useAuth } from "../../auth/useAuth";
import { ago } from "../../useFirebase";
import { useWaterLive } from "./useWater";
import LevelChart from "./LevelChart";
import LogsTable from "./LogsTable";

export default function WaterTab() {
  const w = useWaterLive();
  const { isAdmin } = useAuth();
  const [view, setView] = useState("live");
  const [requested, setRequested] = useState(null); // "ON" | "OFF" sent, waiting for the device

  // "sending" ends once the device confirms the new state, or after 8s
  const pending = requested && w.pump !== requested ? requested : null;
  useEffect(() => {
    if (!requested) return;
    const id = setTimeout(() => setRequested(null), 8000);
    return () => clearTimeout(id);
  }, [requested]);

  const togglePump = () => {
    const next = w.pump === "ON" ? "OFF" : "ON";
    setRequested(next);
    set(ref(db, `${W}/pump/command`), next).catch(() => setRequested(null));
  };

  const alertClass = w.alert.includes("FULL") ? "crit" : w.alert.includes("nearing") ? "warn" : "";
  const shown = pending || w.pump;

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Water</h1>
          <p className="muted">Main tank · {w.lastSeen ? (w.online ? "device online" : `last seen ${ago(w.lastSeen, w.now)}`) : "waiting for device"}</p>
        </div>
        <div className="seg" role="tablist">
          {[["live", "Live"], ["history", "History"], ["logs", "Logs"]].map(([id, label]) => (
            <button key={id} className={view === id ? "on" : ""} onClick={() => setView(id)}>{label}</button>
          ))}
        </div>
      </header>

      {view === "live" && (
        <div className="live">
          <section className="gauge-panel">
            <div className="tank" aria-label={`Tank is ${w.level}% full`}>
              <div className="fill" style={{ height: `${w.level}%` }} />
              {[80, 50, 20].map((m) => (
                <span key={m} className="mark" style={{ bottom: `${m}%` }}>{m}</span>
              ))}
            </div>
            <div>
              <div className="gauge-num">{w.level}<small>%</small></div>
              <div className="muted">
                {w.distance !== null ? `${w.distance.toFixed(1)} cm from sensor to water` : "Waiting for sensor data…"}
              </div>
            </div>
          </section>

          <section className="stack">
            <div className="panel pump-row">
              <div>
                <div className="muted">Pump</div>
                <div className={`pump-val ${shown === "ON" ? "on" : ""}`}>
                  {pending ? `Turning ${pending.toLowerCase()}…` : w.pump}
                </div>
                {!isAdmin && <div className="muted small">Only admins can switch the pump.</div>}
              </div>
              <button
                className={`toggle ${w.pump === "ON" ? "on" : ""}`}
                onClick={togglePump}
                disabled={!isAdmin || !!pending}
                aria-label="Toggle pump"
                aria-pressed={w.pump === "ON"}
              >
                <span className="knob" />
              </button>
            </div>

            <div className={`panel alert ${alertClass}`}>
              <div>{w.alert || "No alerts"}</div>
            </div>
          </section>
        </div>
      )}

      {view === "history" && (
        <section className="panel">
          <h2>Level over time</h2>
          <LevelChart />
        </section>
      )}

      {view === "logs" && (
        <section className="panel">
          <h2>Tank log</h2>
          <LogsTable />
        </section>
      )}
    </>
  );
}

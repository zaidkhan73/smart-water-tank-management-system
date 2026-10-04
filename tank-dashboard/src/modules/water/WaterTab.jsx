// src/modules/water/WaterTab.jsx — Smart Water Management
import { useEffect, useState } from "react";
import { ref, set } from "firebase/database";
import { db } from "../../firebase";
import { WATER_PATH as W } from "../../config";
import { useAuth } from "../../auth/useAuth";
import { ago } from "../../useFirebase";
import { useRise, useTween } from "../../useMotion";
import Seg from "../../Seg";
import { useWaterLive } from "./useWater";
import LevelChart from "./LevelChart";
import LogsTable from "./LogsTable";

// The tank itself: water fills up on load, waves drift, number counts up.
// The number is drawn twice (dark on air, white on water) so it is always readable.
function Hero({ level, distance, filling }) {
  const rise = useRise(level);
  const n = useTween(level);
  const readout = (
    <>
      <span className="big">{n}<small>%</small></span>
      <span className="cap">{distance !== null ? `${distance.toFixed(1)} cm to water` : "Waiting for sensor"}</span>
    </>
  );
  return (
    <div className={`hero ${filling ? "filling" : ""}`} role="img" aria-label={`Tank is ${level} percent full`}>
      <div className="readout">{readout}</div>
      <div className={`water ${rise < 2 ? "empty" : ""}`} style={{ height: `${rise}%` }}>
        <i className="wave w1" />
        <i className="wave w2" />
        <div className="body">
          <div className="readout on-water" aria-hidden>{readout}</div>
        </div>
      </div>
    </div>
  );
}

export default function WaterTab() {
  const w = useWaterLive();
  const { isAdmin } = useAuth();
  const [view, setView] = useState("live");
  const [requested, setRequested] = useState(null); // "ON" | "OFF" sent, waiting for the device

  // "Turning on…" ends when the device confirms, or after 8 s
  const pending = requested && w.pump !== requested ? requested : null;
  useEffect(() => {
    if (!requested) return;
    const id = setTimeout(() => setRequested(null), 8000);
    return () => clearTimeout(id);
  }, [requested]);

  const togglePump = () => {
    const next = w.pump === "ON" ? "OFF" : "ON";
    navigator.vibrate?.(12);
    setRequested(next);
    set(ref(db, `${W}/pump/command`), next).catch(() => setRequested(null));
  };

  const tone = w.alert.includes("FULL") ? "crit" : w.alert.includes("nearing") ? "warn" : "ok";
  const status = w.lastSeen ? (w.online ? "Online" : `Last seen ${ago(w.lastSeen, w.now)}`) : "Waiting for device";

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Water</h1>
          <p className="muted">Main tank · {status}</p>
        </div>
        <Seg value={view} onChange={setView} items={[["live", "Live"], ["history", "History"], ["logs", "Logs"]]} />
      </header>

      <div className="view" key={view}>
        {view === "live" && (
          <div className="live">
            <Hero level={w.level} distance={w.distance} filling={w.pump === "ON"} />
            <div className="group">
              <div className="row">
                <div className="row-main">
                  <div className="row-title">Pump</div>
                  <div className="row-sub">
                    {pending ? `Turning ${pending.toLowerCase()}…` : w.pump === "ON" ? "Running" : "Off"}
                    {!isAdmin && " · admins only"}
                  </div>
                </div>
                <button
                  className={`switch ${w.pump === "ON" ? "on" : ""}`}
                  onClick={togglePump}
                  disabled={!isAdmin || !!pending}
                  role="switch"
                  aria-checked={w.pump === "ON"}
                  aria-label="Pump"
                >
                  <span className="knob" />
                </button>
              </div>
              <div className="row">
                <div className="row-main">
                  <div className="row-title">Latest alert</div>
                  <div className="row-sub">{w.alert || "None so far"}</div>
                </div>
                <span className={`dot ${tone}`} />
              </div>
              <div className="row">
                <div className="row-main">
                  <div className="row-title">Device</div>
                  <div className="row-sub">{status}</div>
                </div>
                <span className={`dot ${w.online ? "on" : ""}`} />
              </div>
            </div>
          </div>
        )}

        {view === "history" && (
          <section className="surface">
            <h2>Level over time</h2>
            <LevelChart />
          </section>
        )}

        {view === "logs" && (
          <section className="surface">
            <h2>Tank log</h2>
            <LogsTable />
          </section>
        )}
      </div>
    </>
  );
}

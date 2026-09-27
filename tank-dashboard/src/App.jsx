// src/App.jsx
import { useEffect, useRef, useState } from "react";
import { ref, onValue, set } from "firebase/database";
import { db } from "./firebase";
import "./App.css";

export default function App() {
  const [level, setLevel] = useState(0);
  const [distance, setDistance] = useState(null);
  const [pumpState, setPumpState] = useState("OFF");
  const [alert, setAlert] = useState("");
  const [alertTime, setAlertTime] = useState("");
  const [log, setLog] = useState([]);
  const [connected, setConnected] = useState(false);

  // keep the last alert we've already shown, so we don't re-log on every snapshot
  const lastAlertRef = useRef("");

  useEffect(() => {
    const connRef = ref(db, ".info/connected");
    const unsubConn = onValue(connRef, (snap) => setConnected(snap.val() === true));

    const rootRef = ref(db, "/");
    const unsubRoot = onValue(rootRef, (snap) => {
      const data = snap.val() || {};
      const newLevel = typeof data.level === "number" ? data.level : 0;
      const newDistance = typeof data.distance_cm === "number" ? data.distance_cm : null;
      const newPumpState = (data.pump && data.pump.state) || "OFF";
      const newAlert = data.alert || "";

      setLevel(newLevel);
      setDistance(newDistance);
      setPumpState(newPumpState);

      if (newAlert && newAlert !== lastAlertRef.current) {
        lastAlertRef.current = newAlert;
        const time = new Date().toLocaleTimeString();
        setAlert(newAlert);
        setAlertTime(time);
        setLog((prev) => [{ text: newAlert, time }, ...prev].slice(0, 12));
      }
    });

    return () => {
      unsubConn();
      unsubRoot();
    };
  }, []);

  const togglePump = () => {
    const next = pumpState === "ON" ? "OFF" : "ON";
    set(ref(db, "/pump/command"), next);
  };

  const alertClass =
    alert.indexOf("FULL") !== -1 ? "crit" : alert.indexOf("nearing") !== -1 ? "warn" : "";

  return (
    <div className="wrap">
      <p className="eyebrow">TANK 01</p>
      <h1>Water Level Monitor</h1>

      <div className="tank-row">
        <div className="tank-shell">
          <div className="tank-fill" style={{ height: `${level}%` }} />
          <div className="tank-marks">
            <span></span><span></span><span></span><span></span><span></span>
          </div>
        </div>
        <div className="readout">
          <div className="level-num">
            {level}
            <sup>%</sup>
          </div>
          <div className="level-caption">
            {distance !== null ? `${distance.toFixed(1)} cm to water surface` : "waiting for sensor data…"}
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="pump-row">
          <div>
            <div className="pump-label">Pump</div>
            <div className={`pump-value ${pumpState === "ON" ? "on" : "off"}`}>{pumpState}</div>
          </div>
          <div className={`toggle ${pumpState === "ON" ? "on" : ""}`} onClick={togglePump}>
            <div className="knob" />
          </div>
        </div>
      </div>

      <div className={`panel alert-panel ${alertClass}`}>
        <div className="alert-text">{alert || "No alerts yet"}</div>
        <div className="alert-time">{alertTime || "\u00A0"}</div>
      </div>

      <p className="log-title">RECENT ACTIVITY</p>
      <div>
        {log.map((entry, i) => (
          <div className="log-entry" key={i}>
            {entry.time}  {entry.text}
          </div>
        ))}
      </div>

      <div className="conn">
        <span className={`dot ${connected ? "live" : ""}`}></span>
        <span>{connected ? "live" : "disconnected"}</span>
      </div>
    </div>
  );
}
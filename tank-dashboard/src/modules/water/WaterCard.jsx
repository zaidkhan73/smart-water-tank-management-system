// src/modules/water/WaterCard.jsx — summary shown on the Home page
import { useWaterLive } from "./useWater";
import { ago } from "../../useFirebase";

export default function WaterCard() {
  const w = useWaterLive();
  return (
    <>
      <div className="card-big">
        {w.level}
        <small>%</small>
      </div>
      <div className="card-line">Pump {w.pump}</div>
      <div className="card-line muted">
        {w.lastSeen ? (w.online ? "Device online" : `Last seen ${ago(w.lastSeen, w.now)}`) : "Waiting for device"}
      </div>
    </>
  );
}

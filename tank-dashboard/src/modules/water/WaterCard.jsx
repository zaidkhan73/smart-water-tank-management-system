// src/modules/water/WaterCard.jsx — right-hand side of the Water row on Home
import { useWaterLive } from "./useWater";

export default function WaterCard() {
  const w = useWaterLive();
  return (
    <span className="stat">
      <span className="mini"><i style={{ width: `${w.level}%` }} /></span>
      <span className="val">{w.level}%</span>
      <span className={`dot ${w.online ? "on" : ""}`} title={w.online ? "Device online" : "Device offline"} />
    </span>
  );
}

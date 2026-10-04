// src/modules/water/LevelChart.jsx — dependency-free SVG line chart
import { useLastN } from "../../useFirebase";
import { WATER_PATH as W } from "../../config";

const VB_W = 640, VB_H = 220, PAD = { l: 34, r: 10, t: 10, b: 24 };

export default function LevelChart() {
  const rows = useLastN(`${W}/history`, 120);
  if (rows === undefined) return <div className="empty">Loading history…</div>;
  const pts = rows.filter((r) => typeof r.t === "number" && typeof r.level === "number");
  if (pts.length < 2)
    return <div className="empty">History appears here once the device has logged a few readings.</div>;

  const t0 = pts[0].t, t1 = pts[pts.length - 1].t || t0 + 1;
  const x = (t) => PAD.l + ((t - t0) / (t1 - t0 || 1)) * (VB_W - PAD.l - PAD.r);
  const y = (v) => PAD.t + (1 - v / 100) * (VB_H - PAD.t - PAD.b);
  const line = pts.map((p) => `${x(p.t).toFixed(1)},${y(p.level).toFixed(1)}`).join(" ");
  const area = `${x(t0)},${y(0)} ${line} ${x(t1)},${y(0)}`;
  const fmt = (t) => new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="chart" role="img" aria-label="Water level over time">
      {[0, 25, 50, 75, 100].map((g) => (
        <g key={g}>
          <line x1={PAD.l} x2={VB_W - PAD.r} y1={y(g)} y2={y(g)} className="grid" />
          <text x={PAD.l - 6} y={y(g) + 4} textAnchor="end" className="axis">{g}%</text>
        </g>
      ))}
      <polygon points={area} className="area" />
      <polyline points={line} className="stroke" />
      <text x={PAD.l} y={VB_H - 6} className="axis">{fmt(t0)}</text>
      <text x={VB_W - PAD.r} y={VB_H - 6} textAnchor="end" className="axis">{fmt(t1)}</text>
    </svg>
  );
}

// src/modules/water/LevelChart.jsx — responsive SVG chart, touch/hover to read values
import { useState } from "react";
import { useLastN } from "../../useFirebase";
import { useWidth } from "../../useMotion";
import { WATER_PATH as W } from "../../config";

const H = 220, P = { l: 30, r: 8, t: 10, b: 26 };
const clock = (t) => new Date(t).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
const full = (t) => new Date(t).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });

export default function LevelChart() {
  const rows = useLastN(`${W}/history`, 120);
  const [wrap, w] = useWidth();
  const [hi, setHi] = useState(null);
  const pts = (rows || []).filter((r) => typeof r.t === "number" && typeof r.level === "number");

  let body = null;
  if (rows === undefined) body = <div className="empty">Loading history…</div>;
  else if (pts.length < 2) body = <div className="empty">History shows up after the device logs a few readings.</div>;
  else if (w > 0) {
    const t0 = pts[0].t, t1 = pts[pts.length - 1].t, span = t1 - t0 || 1;
    const x = (t) => P.l + ((t - t0) / span) * (w - P.l - P.r);
    const y = (v) => P.t + (1 - v / 100) * (H - P.t - P.b);
    const line = pts.map((p) => `${x(p.t).toFixed(1)},${y(p.level).toFixed(1)}`).join(" ");
    const cur = pts[hi !== null && hi < pts.length ? hi : pts.length - 1];

    const move = (e) => {
      const px = e.clientX - e.currentTarget.getBoundingClientRect().left;
      let best = 0;
      pts.forEach((p, i) => { if (Math.abs(x(p.t) - px) < Math.abs(x(pts[best].t) - px)) best = i; });
      setHi(best);
    };

    body = (
      <>
        <div className="chart-read">
          <span className="read-num">{cur.level}%</span>
          <span className="muted">{full(cur.t)}</span>
        </div>
        <svg
          width={w} height={H} role="img" aria-label="Water level over time"
          style={{ touchAction: "pan-y" }}
          onPointerMove={move} onPointerDown={move}
          onPointerLeave={(e) => e.pointerType === "mouse" && setHi(null)}
        >
          {[0, 50, 100].map((g) => (
            <g key={g}>
              <line className="grid" x1={P.l} x2={w - P.r} y1={y(g)} y2={y(g)} />
              <text className="axis" x={P.l - 8} y={y(g) + 4} textAnchor="end">{g}</text>
            </g>
          ))}
          <polygon className="area" points={`${x(t0)},${y(0)} ${line} ${x(t1)},${y(0)}`} />
          <polyline className="stroke" pathLength="1" points={line} />
          <line className="cursor" x1={x(cur.t)} x2={x(cur.t)} y1={P.t} y2={H - P.b} />
          <circle className="pt" cx={x(cur.t)} cy={y(cur.level)} r="5" />
          <text className="axis" x={P.l} y={H - 6}>{clock(t0)}</text>
          <text className="axis" x={w - P.r} y={H - 6} textAnchor="end">{clock(t1)}</text>
        </svg>
      </>
    );
  }
  return <div ref={wrap}>{body}</div>;
}

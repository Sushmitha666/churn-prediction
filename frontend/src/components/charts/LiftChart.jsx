import { useState } from "react";
import { motion } from "framer-motion";

const W = 640, H = 340, P = 44;
const x = (v) => P + v * (W - 2 * P);
const y = (v) => H - P - v * (H - 2 * P);
const ticks = [0, 0.25, 0.5, 0.75, 1];

// Share of churners captured vs share of customers contacted. Hover to read any point.
export default function LiftChart({ lift }) {
  const [hover, setHover] = useState(null);
  const line = lift.map((p, i) => `${i ? "L" : "M"}${x(p.contacted)},${y(p.captured)}`).join(" ");
  const area = `${line} L${x(1)},${y(0)} L${x(0)},${y(0)} Z`;
  const p10 = lift[10];

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const vx = ((e.clientX - r.left) / r.width) * W;
    const i = Math.round(((vx - P) / (W - 2 * P)) * 100);
    setHover(Math.max(0, Math.min(100, i)));
  };

  const pt = hover !== null ? lift[hover] : null;
  const tipX = pt ? Math.min(x(pt.contacted) + 12, W - 190) : 0;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label="Lift curve: share of churners captured versus share of customers contacted"
      onMouseMove={onMove}
      onMouseLeave={() => setHover(null)}
    >
      <defs>
        <linearGradient id="liftFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#ffb020" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#ffb020" stopOpacity="0" />
        </linearGradient>
      </defs>

      {ticks.map((t) => (
        <g key={t}>
          <line x1={x(t)} x2={x(t)} y1={y(0)} y2={y(1)} stroke="#232832" />
          <line x1={x(0)} x2={x(1)} y1={y(t)} y2={y(t)} stroke="#232832" />
          <text x={x(t)} y={H - 18} fill="#8b919b" fontSize="11" fontFamily="JetBrains Mono, monospace" textAnchor="middle">
            {t * 100}%
          </text>
          <text x={P - 10} y={y(t) + 4} fill="#8b919b" fontSize="11" fontFamily="JetBrains Mono, monospace" textAnchor="end">
            {t * 100}%
          </text>
        </g>
      ))}
      <text x={W / 2} y={H - 2} fill="#8b919b" fontSize="10" fontFamily="JetBrains Mono, monospace" textAnchor="middle">
        CUSTOMERS CONTACTED (RANKED BY RISK)
      </text>

      <line x1={x(0)} y1={y(0)} x2={x(1)} y2={y(1)} stroke="#8b919b" strokeWidth="1.5" strokeDasharray="6 6" />

      <motion.path d={area} fill="url(#liftFill)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 1 }} />
      <motion.path
        d={line}
        fill="none"
        stroke="#ffb020"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.6, ease: "easeOut" }}
      />

      {/* 10% marker */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
        <line x1={x(0.1)} x2={x(0.1)} y1={y(p10.captured)} y2={y(0)} stroke="#ffb020" strokeDasharray="3 4" opacity="0.7" />
        <circle cx={x(0.1)} cy={y(p10.captured)} r="7" fill="#ffb020" stroke="#07080a" strokeWidth="3" />
      </motion.g>

      {/* hover crosshair */}
      {pt && (
        <g pointerEvents="none">
          <line x1={x(pt.contacted)} x2={x(pt.contacted)} y1={y(1)} y2={y(0)} stroke="#ece8df" opacity="0.25" />
          <circle cx={x(pt.contacted)} cy={y(pt.captured)} r="5" fill="#ece8df" stroke="#07080a" strokeWidth="2" />
          <g transform={`translate(${tipX}, ${Math.max(y(pt.captured) - 52, 8)})`}>
            <rect width="178" height="46" rx="10" fill="#14171d" stroke="#232832" />
            <text x="12" y="19" fill="#ece8df" fontSize="12" fontFamily="JetBrains Mono, monospace">
              Contact {Math.round(pt.contacted * 100)}%
            </text>
            <text x="12" y="36" fill="#ffb020" fontSize="12" fontFamily="JetBrains Mono, monospace">
              → {(pt.captured * 100).toFixed(0)}% of churners
              {pt.contacted > 0 ? ` · ${(pt.captured / pt.contacted).toFixed(1)}×` : ""}
            </text>
          </g>
        </g>
      )}
    </svg>
  );
}

const W = 600, H = 200, P = 28;

// Net value vs decision threshold. Amber dot = current slider, white dot = best threshold.
export default function NetValueChart({ points, current, best }) {
  const vals = points.map((p) => p.net);
  const lo = Math.min(0, ...vals), hi = Math.max(0, ...vals);
  const span = hi - lo || 1;
  const x = (i) => P + (i / (points.length - 1)) * (W - 2 * P);
  const y = (v) => H - P - ((v - lo) / span) * (H - 2 * P);
  const path = points.map((p, i) => `${i ? "L" : "M"}${x(i)},${y(p.net)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Net value by threshold">
      <line x1={P} x2={W - P} y1={y(0)} y2={y(0)} stroke="#3a414d" strokeDasharray="4 4" />
      <text x={P} y={y(0) - 6} fill="#8b919b" fontSize="10" fontFamily="JetBrains Mono, monospace">BREAK-EVEN</text>
      <path d={path} fill="none" stroke="#ffb020" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      <line x1={x(current)} x2={x(current)} y1={P - 8} y2={H - P} stroke="#ffb020" opacity="0.35" />
      <circle cx={x(best)} cy={y(points[best].net)} r="6" fill="#ece8df" stroke="#07080a" strokeWidth="3" />
      <circle cx={x(current)} cy={y(points[current].net)} r="6" fill="#ffb020" stroke="#07080a" strokeWidth="3" />
      <text x={P} y={H - 6} fill="#8b919b" fontSize="10" fontFamily="JetBrains Mono, monospace">THRESHOLD {points[0].t.toFixed(2)}</text>
      <text x={W - P} y={H - 6} fill="#8b919b" fontSize="10" fontFamily="JetBrains Mono, monospace" textAnchor="end">{points[points.length - 1].t.toFixed(2)}</text>
    </svg>
  );
}

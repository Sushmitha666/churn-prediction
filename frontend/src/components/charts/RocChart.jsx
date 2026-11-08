import { motion } from "framer-motion";

const W = 420, H = 320, P = 40;
const x = (v) => P + v * (W - 2 * P);
const y = (v) => H - P - v * (H - 2 * P);
const ticks = [0, 0.5, 1];

export default function RocChart({ roc, models }) {
  const path = (arr) => arr.map((v, i) => `${i ? "L" : "M"}${x(roc.grid[i])},${y(v)}`).join(" ");
  const xgb = models.find((m) => m.model === "XGBoost");
  const lr = models.find((m) => m.model === "Logistic Regression");

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="ROC curves for both models">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={x(t)} x2={x(t)} y1={y(0)} y2={y(1)} stroke="#232832" />
            <line x1={x(0)} x2={x(1)} y1={y(t)} y2={y(t)} stroke="#232832" />
            <text x={x(t)} y={H - 20} fill="#8b919b" fontSize="11" fontFamily="JetBrains Mono, monospace" textAnchor="middle">{t}</text>
            <text x={P - 8} y={y(t) + 4} fill="#8b919b" fontSize="11" fontFamily="JetBrains Mono, monospace" textAnchor="end">{t}</text>
          </g>
        ))}
        <text x={W / 2} y={H - 4} fill="#8b919b" fontSize="10" fontFamily="JetBrains Mono, monospace" textAnchor="middle">FALSE POSITIVE RATE</text>
        <line x1={x(0)} y1={y(0)} x2={x(1)} y2={y(1)} stroke="#8b919b" strokeDasharray="6 6" />
        <motion.path d={path(roc.lr)} fill="none" stroke="#8b919b" strokeWidth="2.5" strokeLinecap="round"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.4 }} />
        <motion.path d={path(roc.xgb)} fill="none" stroke="#ffb020" strokeWidth="3" strokeLinecap="round"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.4, delay: 0.2 }} />
      </svg>
      <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-muted">
        <span className="flex items-center gap-2"><i className="h-0.5 w-5 bg-amber" />XGBoost · AUC {xgb.roc_auc}</span>
        <span className="flex items-center gap-2"><i className="h-0.5 w-5 bg-muted" />Logistic · AUC {lr.roc_auc}</span>
      </div>
    </div>
  );
}

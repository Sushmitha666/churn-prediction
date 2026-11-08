import { motion } from "framer-motion";

// Churn rate inside each 10% slice of customers, riskiest first.
export default function DecileBars({ deciles, base }) {
  const max = Math.max(...deciles.map((d) => d.churn_rate), 0.01);
  return (
    <div>
      <div className="relative flex h-52 items-end gap-1.5">
        <div
          className="absolute inset-x-0 border-t border-dashed border-muted/60"
          style={{ bottom: `${(base / max) * 100}%` }}
        >
          <span className="absolute -top-5 right-0 font-mono text-[10px] text-muted">avg {(base * 100).toFixed(0)}%</span>
        </div>
        {deciles.map((d, i) => (
          <div key={d.decile} className="group relative flex h-full flex-1 flex-col justify-end" title={`Decile ${d.decile}: ${(d.churn_rate * 100).toFixed(0)}% churned`}>
            <span className="mb-1 text-center font-mono text-[10px] text-muted opacity-0 transition-opacity group-hover:opacity-100">
              {(d.churn_rate * 100).toFixed(0)}%
            </span>
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: `${(d.churn_rate / max) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.05, ease: "easeOut" }}
              className="w-full rounded-t-md"
              style={{ background: d.churn_rate > base ? "#ffb020" : "#2a303a", opacity: d.churn_rate > base ? 1 - i * 0.05 : 1 }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-1.5 font-mono text-[10px] text-muted">
        {deciles.map((d) => (
          <span key={d.decile} className="flex-1 text-center">D{d.decile}</span>
        ))}
      </div>
    </div>
  );
}

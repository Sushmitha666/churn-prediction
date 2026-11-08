import { useState } from "react";
import { motion } from "framer-motion";
import { useData } from "../lib/data";
import { CardSpotlight } from "../components/ui/CardSpotlight";
import { PillTabs } from "../components/ui/PillTabs";
import { BentoGrid, Label, PageHeader, Reveal } from "../components/ui/Layout";

const segTabs = [
  { value: "Contract", label: "Contract" },
  { value: "Tenure", label: "Tenure" },
  { value: "Internet", label: "Internet" },
  { value: "Payment", label: "Payment" },
];

export default function Drivers() {
  const { data } = useData();
  const [seg, setSeg] = useState("Contract");
  const maxDriver = Math.max(...data.drivers.map((d) => d.value));
  const rows = data.segments[seg];
  const maxRate = Math.max(...rows.map((r) => r.churn_rate), data.churn_rate);
  const worst = rows.reduce((a, b) => (b.churn_rate > a.churn_rate ? b : a));

  return (
    <>
      <PageHeader
        kicker="02 / Drivers"
        title="What pushes customers out the door."
        sub="Two views: what the model relies on (SHAP), and what the raw data shows when you slice customers by segment."
      />

      <BentoGrid>
        <Reveal className="md:col-span-4">
          <CardSpotlight className="h-full">
            <div className="p-6 sm:p-8">
              <Label>SHAP · mean impact on churn score</Label>
              <h2 className="mb-6 mt-2 font-serif text-3xl font-bold">Top 10 features</h2>

              <div className="mb-6 flex flex-wrap gap-5 font-mono text-xs text-muted">
                <span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-sm bg-danger" />higher value raises churn risk</span>
                <span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-sm bg-ok" />higher value lowers it</span>
              </div>

              <ul className="space-y-3.5">
                {data.drivers.map((d, i) => (
                  <li key={d.feature} className="grid grid-cols-[minmax(0,9.5rem)_1fr_3rem] items-center gap-3 sm:grid-cols-[13rem_1fr_3.5rem]">
                    <span className="truncate text-sm text-ink" title={d.feature}>{d.feature}</span>
                    <div className="h-3 rounded-full bg-surface2">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(d.value / maxDriver) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: i * 0.06, ease: "easeOut" }}
                        className={`h-full rounded-full ${d.direction === "up" ? "bg-danger" : "bg-ok"}`}
                      />
                    </div>
                    <span className="text-right font-mono text-xs text-muted">{d.value.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardSpotlight>
        </Reveal>

        <Reveal className="md:col-span-2" delay={0.08}>
          <CardSpotlight className="h-full">
            <div className="p-6 sm:p-8">
              <Label>How to read this</Label>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                Longer bar = the feature moves the model's prediction more, on average. The colour shows which way
                higher values tend to push the score.
              </p>
              <p className="mt-4 rounded-2xl border border-amber/30 bg-amber/5 p-4 text-sm leading-relaxed text-ink">
                SHAP shows what the model relies on, not what causes customers to leave. Treat it as a map of where to
                investigate, not proof.
              </p>
            </div>
          </CardSpotlight>
        </Reveal>

        <Reveal className="md:col-span-6">
          <CardSpotlight>
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <Label>Segment explorer · all customers</Label>
                  <h2 className="mt-2 font-serif text-3xl font-bold">Churn rate by {seg.toLowerCase()}</h2>
                </div>
                <PillTabs tabs={segTabs} value={seg} onChange={setSeg} id="seg-pill" />
              </div>

              <ul className="mt-8 space-y-4">
                {rows.map((r) => (
                  <li key={r.label} className="grid grid-cols-[minmax(0,8rem)_1fr_4.5rem] items-center gap-3 sm:grid-cols-[14rem_1fr_6rem]">
                    <span className="truncate text-sm text-ink" title={r.label}>{r.label}</span>
                    <div className="relative h-4 rounded-full bg-surface2">
                      <motion.div
                        key={seg + r.label}
                        initial={{ width: 0 }}
                        animate={{ width: `${(r.churn_rate / maxRate) * 100}%` }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className={`h-full rounded-full ${r.label === worst.label ? "bg-amber" : "bg-[#3a414d]"}`}
                      />
                      <span
                        className="absolute -top-1 h-6 w-px border-l border-dashed border-muted"
                        style={{ left: `${(data.churn_rate / maxRate) * 100}%` }}
                        title={`Overall churn ${(data.churn_rate * 100).toFixed(0)}%`}
                      />
                    </div>
                    <span className="text-right font-mono text-sm">
                      {(r.churn_rate * 100).toFixed(0)}%
                      <span className="block text-[10px] text-muted">n={r.count.toLocaleString()}</span>
                    </span>
                  </li>
                ))}
              </ul>

              <p className="mt-6 text-sm text-muted">
                Dashed marker = overall churn rate ({(data.churn_rate * 100).toFixed(0)}%). Highest here:{" "}
                <span className="text-amber">{worst.label}</span> at {(worst.churn_rate * 100).toFixed(0)}%.
              </p>
            </div>
          </CardSpotlight>
        </Reveal>
      </BentoGrid>
    </>
  );
}

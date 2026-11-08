import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useData } from "../lib/data";
import { CardSpotlight } from "../components/ui/CardSpotlight";
import { PillTabs } from "../components/ui/PillTabs";
import { BentoGrid, Label, PageHeader, Reveal } from "../components/ui/Layout";
import NetValueChart from "../components/charts/NetValueChart";
import { cn } from "../lib/utils";

const money = (v) => `${v < 0 ? "-" : ""}$${Math.abs(Math.round(v)).toLocaleString("en-US")}`;

function Slider({ label, value, onChange, min, max, step, format }) {
  return (
    <label className="block">
      <div className="mb-2 flex justify-between font-mono text-xs">
        <span className="uppercase tracking-wider text-muted">{label}</span>
        <span className="text-ink">{format(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(+e.target.value)} className="w-full" />
    </label>
  );
}

function Simulator({ data }) {
  const T = data.thresholds;
  const [idx, setIdx] = useState(() => T.findIndex((t) => t.t === 0.5));
  const [cost, setCost] = useState(25);
  const [value, setValue] = useState(500);
  const [success, setSuccess] = useState(30);

  const { points, best } = useMemo(() => {
    const scale = 1000 / data.meta.n_test;
    const pts = T.map((t) => ({ ...t, net: (t.tp * (success / 100) * value - (t.tp + t.fp) * cost) * scale }));
    const b = pts.reduce((bi, p, i) => (p.net > pts[bi].net ? i : bi), 0);
    return { points: pts, best: b };
  }, [T, cost, value, success, data.meta.n_test]);

  const cur = points[idx];
  const flagged = cur.tp + cur.fp;

  const stats = [
    { l: "Customers flagged", v: `${((flagged / data.meta.n_test) * 100).toFixed(0)}%`, s: `${flagged} of ${data.meta.n_test}` },
    { l: "Churners caught", v: `${(cur.recall * 100).toFixed(0)}%`, s: `${cur.tp} of ${data.meta.n_churners_test}` },
    { l: "Precision", v: `${(cur.precision * 100).toFixed(0)}%`, s: "flagged who churn" },
    { l: "Net value / 1,000", v: money(cur.net), s: cur.net >= 0 ? "profit" : "loss", good: cur.net >= 0 },
  ];

  return (
    <CardSpotlight>
      <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[20rem_1fr]">
        <div className="space-y-6">
          <div>
            <Label>Retention simulator</Label>
            <h2 className="mt-2 font-serif text-3xl font-bold">Pick a threshold.</h2>
            <p className="mt-2 text-sm text-muted">Move the sliders. The chart finds the threshold that earns the most for your costs.</p>
          </div>
          <Slider label="Risk threshold" value={idx} onChange={setIdx} min={0} max={T.length - 1} step={1} format={(i) => T[i].t.toFixed(2)} />
          <Slider label="Cost per offer" value={cost} onChange={setCost} min={5} max={100} step={5} format={(v) => `$${v}`} />
          <Slider label="Value of a saved customer" value={value} onChange={setValue} min={100} max={2000} step={50} format={(v) => `$${v}`} />
          <Slider label="Offer success rate" value={success} onChange={setSuccess} min={5} max={80} step={5} format={(v) => `${v}%`} />
        </div>

        <div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.l} className="rounded-2xl border border-line bg-surface2 p-4">
                <Label>{s.l}</Label>
                <div className={cn("mt-2 font-mono text-2xl", s.good === false && "text-danger", s.good && "text-ok")}>{s.v}</div>
                <div className="mt-1 text-xs text-muted">{s.s}</div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <NetValueChart points={points} current={idx} best={best} />
          </div>
          <p className="mt-2 text-sm text-muted">
            Best threshold for these costs: <span className="text-ink">{T[best].t.toFixed(2)}</span> (white dot), worth{" "}
            <span className="text-ok">{money(points[best].net)}</span> per 1,000 customers. Amber dot = your slider.
            Values are illustrative assumptions applied to the test set.
          </p>
        </div>
      </div>
    </CardSpotlight>
  );
}

const riskColor = (r) => (r >= 0.8 ? "bg-danger" : r >= 0.6 ? "bg-amber" : "bg-[#5b6573]");
const contracts = [
  { value: "All", label: "All" },
  { value: "Month-to-month", label: "Month-to-month" },
  { value: "One year", label: "One year" },
  { value: "Two year", label: "Two year" },
];

function RiskTable({ customers }) {
  const [q, setQ] = useState("");
  const [contract, setContract] = useState("All");
  const [open, setOpen] = useState(null);
  const [limit, setLimit] = useState(20);

  const filtered = customers
    .map((c, i) => ({ ...c, rank: i + 1 }))
    .filter((c) => (contract === "All" || c.contract === contract) && c.id.toLowerCase().includes(q.toLowerCase()));

  return (
    <CardSpotlight>
      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Label>Ranked by predicted risk</Label>
            <h2 className="mt-2 font-serif text-3xl font-bold">Top 100 at-risk customers</h2>
          </div>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search customer ID"
            aria-label="Search customer ID"
            className="w-full rounded-full border border-line bg-surface2 px-5 py-2.5 font-mono text-sm outline-none transition-colors placeholder:text-muted focus:border-amber sm:w-64"
          />
        </div>
        <PillTabs className="mt-5" tabs={contracts} value={contract} onChange={setContract} id="contract-pill" />

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="font-mono text-[11px] uppercase tracking-wider text-muted">
              <tr>
                <th className="pb-3 pr-3 font-medium">#</th>
                <th className="pb-3 pr-3 font-medium">Customer</th>
                <th className="pb-3 pr-3 font-medium">Contract</th>
                <th className="pb-3 pr-3 text-right font-medium">Tenure</th>
                <th className="pb-3 pr-3 text-right font-medium">Monthly</th>
                <th className="pb-3 pr-3 font-medium">Risk</th>
                <th className="pb-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, limit).map((c) => {
                const isOpen = open === c.id;
                return (
                  <FragmentRow key={c.id} c={c} isOpen={isOpen} toggle={() => setOpen(isOpen ? null : c.id)} />
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="py-10 text-center text-muted">No customers match.</p>}
        </div>

        {limit < filtered.length && (
          <button onClick={() => setLimit((l) => l + 20)} className="mt-6 rounded-full border border-line px-5 py-2.5 text-sm text-ink transition-colors hover:border-amber/60">
            Show more ({filtered.length - limit} left)
          </button>
        )}
      </div>
    </CardSpotlight>
  );
}

function FragmentRow({ c, isOpen, toggle }) {
  return (
    <>
      <tr onClick={toggle} className="cursor-pointer border-t border-line transition-colors hover:bg-surface2/60">
        <td className="py-3.5 pr-3 font-mono text-muted">{c.rank}</td>
        <td className="py-3.5 pr-3 font-mono">{c.id}</td>
        <td className="py-3.5 pr-3 text-muted">{c.contract}</td>
        <td className="py-3.5 pr-3 text-right font-mono">{c.tenure} mo</td>
        <td className="py-3.5 pr-3 text-right font-mono">${c.monthly.toFixed(0)}</td>
        <td className="py-3.5 pr-3">
          <div className="flex items-center gap-3">
            <div className="h-2 w-24 rounded-full bg-surface2">
              <div className={`h-full rounded-full ${riskColor(c.risk)}`} style={{ width: `${c.risk * 100}%` }} />
            </div>
            <span className="w-10 font-mono">{(c.risk * 100).toFixed(0)}%</span>
          </div>
        </td>
        <td className="py-3.5 text-right">
          <button aria-expanded={isOpen} aria-label={`Why is ${c.id} at risk?`} className="rounded-full px-2 text-muted">
            <motion.span animate={{ rotate: isOpen ? 90 : 0 }} className="inline-block">›</motion.span>
          </button>
        </td>
      </tr>
      <AnimatePresence initial={false}>
        {isOpen && (
          <tr>
            <td colSpan={7} className="p-0">
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mb-3 rounded-2xl border border-line bg-surface2 p-5">
                  <Label>Why this customer is flagged</Label>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {c.reasons.map((r) => (
                      <span key={r.feature} className="rounded-full border border-line bg-bg px-4 py-2 text-sm">
                        {r.feature}{" "}
                        <b className={cn("ml-1 font-mono", r.impact > 0 ? "text-danger" : "text-ok")}>
                          {r.impact > 0 ? "+" : ""}{r.impact.toFixed(2)}
                        </b>
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-muted">Red pushes the risk score up, green pulls it down (SHAP, log-odds).</p>
                </div>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Customers() {
  const { data } = useData();
  return (
    <>
      <PageHeader
        kicker="03 / Customers"
        title="Who to call first, and whether it pays."
        sub="A ranked list with a reason for every score, plus a simulator that turns the model into a business decision."
      />
      <BentoGrid>
        <Reveal className="md:col-span-6"><Simulator data={data} /></Reveal>
        <Reveal className="md:col-span-6"><RiskTable customers={data.customers} /></Reveal>
      </BentoGrid>
    </>
  );
}

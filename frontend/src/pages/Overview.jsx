import { Link } from "react-router-dom";
import { useData } from "../lib/data";
import { Spotlight } from "../components/ui/Spotlight";
import { GridBackground } from "../components/ui/GridBackground";
import { TextGenerateEffect } from "../components/ui/TextGenerateEffect";
import { CardSpotlight } from "../components/ui/CardSpotlight";
import { Meteors } from "../components/ui/Meteors";
import { NumberTicker } from "../components/ui/NumberTicker";
import { BentoGrid, Kicker, Label, Reveal } from "../components/ui/Layout";
import LiftChart from "../components/charts/LiftChart";
import RocChart from "../components/charts/RocChart";
import DecileBars from "../components/charts/DecileBars";

const steps = ["Clean", "Split first", "Baseline", "XGBoost", "Evaluate", "SHAP", "Rank"];

export default function Overview() {
  const { data } = useData();
  const xgb = data.models.find((m) => m.model === "XGBoost");
  const lr = data.models.find((m) => m.model === "Logistic Regression");
  const top10 = data.top10_capture * 100;
  const liftX = data.top10_capture / 0.1;

  const kpis = [
    { label: "Recall", value: xgb.recall * 100, d: 1, s: "%", hint: "of churners caught at 0.5 threshold" },
    { label: "Precision", value: xgb.precision * 100, d: 1, s: "%", hint: "of flagged customers really churn" },
    { label: "ROC-AUC", value: xgb.roc_auc, d: 3, s: "", hint: "ranking quality, 0.5 = coin flip" },
    { label: "PR-AUC", value: xgb.pr_auc, d: 3, s: "", hint: "quality on the minority class" },
  ];

  const prGap = xgb.pr_auc - lr.pr_auc;
  const rocGap = xgb.roc_auc - lr.roc_auc;
  const insight =
    Math.abs(rocGap) < 0.01
      ? `ROC-AUC is effectively tied (${xgb.roc_auc} vs ${lr.roc_auc}), so the simple baseline is competitive.${
          prGap > 0 ? ` XGBoost leads on PR-AUC by ${prGap.toFixed(3)}.` : ""
        }`
      : `${rocGap > 0 ? "XGBoost" : "Logistic regression"} leads on ROC-AUC by ${Math.abs(rocGap).toFixed(3)}.`;

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden pb-16 pt-36">
        <GridBackground />
        <Spotlight className="-top-40 left-0 md:-top-20 md:left-48" />
        <div className="relative z-10">
          <Kicker>Telco churn · {data.meta.n_customers.toLocaleString()} customers · XGBoost + SHAP</Kicker>
          <h1 className="mt-4 font-serif text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-7xl lg:text-8xl">
            <TextGenerateEffect text="Who is about to leave," delay={0.2} />
            <TextGenerateEffect text="and *why.*" delay={0.9} />
          </h1>
          <p className="mt-6 max-w-xl text-base text-muted sm:text-lg">
            A churn model turned into a ranked contact list a retention team can actually act on, with every score explained.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/customers" className="rounded-full bg-amber px-6 py-3 text-sm font-semibold text-bg transition-transform hover:scale-[1.03]">
              See at-risk customers →
            </Link>
            <Link to="/drivers" className="rounded-full border border-line px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-amber/60">
              Why they leave
            </Link>
          </div>
        </div>
      </section>

      <BentoGrid>
        {/* Hero stat */}
        <Reveal className="md:col-span-6">
          <CardSpotlight className="min-h-[18rem]">
            <Meteors number={14} />
            <div className="flex flex-col justify-between gap-6 p-8 sm:p-12">
              <Label>The one number that matters</Label>
              <p className="max-w-xl text-lg text-muted sm:text-xl">Contact the riskiest 10% of customers and you reach</p>
              <div className="flex flex-wrap items-end gap-x-8 gap-y-2">
                <NumberTicker value={top10} suffix="%" className="font-serif text-[6rem] font-extrabold leading-[0.9] tracking-tighter text-amber sm:text-[10rem]" />
                <div className="pb-3 sm:pb-6">
                  <p className="text-lg text-ink sm:text-xl">of everyone who is about to churn.</p>
                  <p className="font-mono text-sm text-muted">
                    <NumberTicker value={liftX} decimals={1} suffix="×" /> better than picking at random
                  </p>
                </div>
              </div>
            </div>
          </CardSpotlight>
        </Reveal>

        {/* KPIs */}
        {kpis.map((k, i) => (
          <Reveal key={k.label} delay={i * 0.06} className="md:col-span-3 lg:col-span-3">
            <CardSpotlight className="h-full">
              <div className="p-6">
                <Label>{k.label}</Label>
                <div className="mt-3 font-mono text-4xl font-medium sm:text-5xl">
                  <NumberTicker value={k.value} decimals={k.d} suffix={k.s} />
                </div>
                <p className="mt-2 text-sm text-muted">{k.hint}</p>
              </div>
            </CardSpotlight>
          </Reveal>
        ))}

        {/* Lift */}
        <Reveal className="md:col-span-4">
          <CardSpotlight className="h-full">
            <div className="p-6 sm:p-8">
              <Label>Lift curve</Label>
              <h2 className="mb-4 mt-2 font-serif text-3xl font-bold">Aim at the right 10%.</h2>
              <LiftChart lift={data.lift} />
              <p className="mt-2 text-sm text-muted">Dashed line = random targeting. Hover the chart to read any point.</p>
            </div>
          </CardSpotlight>
        </Reveal>

        {/* Deciles */}
        <Reveal className="md:col-span-2" delay={0.08}>
          <CardSpotlight className="h-full">
            <div className="p-6 sm:p-8">
              <Label>Churn by risk decile</Label>
              <h2 className="mb-6 mt-2 font-serif text-2xl font-bold">The ranking works.</h2>
              <DecileBars deciles={data.deciles} base={data.churn_rate} />
              <p className="mt-4 text-sm text-muted">D1 is the riskiest 10% of test customers, D10 the safest.</p>
            </div>
          </CardSpotlight>
        </Reveal>

        {/* ROC */}
        <Reveal className="md:col-span-3">
          <CardSpotlight className="h-full">
            <div className="p-6 sm:p-8">
              <Label>ROC curves</Label>
              <h2 className="mb-4 mt-2 font-serif text-2xl font-bold">Baseline vs XGBoost</h2>
              <RocChart roc={data.roc} models={data.models} />
            </div>
          </CardSpotlight>
        </Reveal>

        {/* Model table */}
        <Reveal className="md:col-span-3" delay={0.08}>
          <CardSpotlight className="h-full">
            <div className="p-6 sm:p-8">
              <Label>Model comparison</Label>
              <h2 className="mb-4 mt-2 font-serif text-2xl font-bold">Held-out test set</h2>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[22rem] text-left font-mono text-sm">
                  <thead className="text-[11px] uppercase tracking-wider text-muted">
                    <tr>
                      <th className="pb-3 font-medium">Model</th>
                      {["Prec", "Recall", "ROC", "PR"].map((h) => (
                        <th key={h} className="pb-3 text-right font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.models.map((m) => (
                      <tr key={m.model} className="border-t border-line">
                        <td className="py-3 pr-2 font-sans text-ink">{m.model}</td>
                        <td className="py-3 text-right">{m.precision.toFixed(3)}</td>
                        <td className="py-3 text-right">{m.recall.toFixed(3)}</td>
                        <td className="py-3 text-right">{m.roc_auc.toFixed(3)}</td>
                        <td className="py-3 text-right">{m.pr_auc.toFixed(3)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-5 rounded-2xl border border-line bg-surface2 p-4 text-sm text-muted">{insight}</p>
            </div>
          </CardSpotlight>
        </Reveal>

        {/* Method */}
        <Reveal className="md:col-span-6">
          <CardSpotlight>
            <div className="p-6 sm:p-8">
              <Label>Method</Label>
              <ol className="mt-4 flex flex-wrap items-center gap-2">
                {steps.map((s, i) => (
                  <li key={s} className="flex items-center gap-2">
                    <span className="rounded-full border border-line bg-surface2 px-4 py-2 font-mono text-xs text-ink">
                      <span className="mr-2 text-amber">{String(i + 1).padStart(2, "0")}</span>
                      {s}
                    </span>
                    {i < steps.length - 1 && <span className="text-muted">→</span>}
                  </li>
                ))}
              </ol>
            </div>
          </CardSpotlight>
        </Reveal>
      </BentoGrid>
    </>
  );
}

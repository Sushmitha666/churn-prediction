import { AnimatePresence, motion } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import { useData } from "./lib/data";
import { FloatingNav } from "./components/ui/FloatingNav";
import { Skeleton } from "./components/ui/Layout";
import Overview from "./pages/Overview";
import Drivers from "./pages/Drivers";
import Customers from "./pages/Customers";
import { AUTHOR, GITHUB_URL } from "./config";

function Loading() {
  return (
    <div className="space-y-4 pt-36">
      <Skeleton className="h-16 w-2/3" />
      <Skeleton className="h-72" />
      <div className="grid gap-4 sm:grid-cols-2"><Skeleton className="h-40" /><Skeleton className="h-40" /></div>
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div className="pt-40">
      <h1 className="font-serif text-4xl font-extrabold">Couldn't load results.json</h1>
      <p className="mt-4 text-muted">({message}) Run <code className="font-mono text-amber">python src/train.py</code> from the
        project root, then refresh. It writes <code className="font-mono">frontend/public/data/results.json</code>.</p>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const { data, error } = useData();

  return (
    <div className="relative min-h-screen">
      <FloatingNav />
      <main className="mx-auto max-w-6xl px-5 pb-24">
        {error ? (
          <ErrorState message={error} />
        ) : !data ? (
          <Loading />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              <Routes location={location}>
                <Route path="/" element={<Overview />} />
                <Route path="/drivers" element={<Drivers />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="*" element={<Overview />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-8 font-mono text-xs text-muted">
          <span>Built by {AUTHOR} · Python, XGBoost, SHAP, React, Tailwind, Framer Motion</span>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="transition-colors hover:text-amber">Source on GitHub ↗</a>
        </div>
      </footer>
    </div>
  );
}

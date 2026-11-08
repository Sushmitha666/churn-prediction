import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

// Aceternity "Tabs" pill (the sliding highlight), without the stacked-card effect.
export function PillTabs({ tabs, value, onChange, id = "pill", className }) {
  return (
    <div
      role="tablist"
      className={cn(
        "flex w-fit max-w-full gap-1 overflow-x-auto rounded-full border border-line bg-surface p-1 [scrollbar-width:none]",
        className
      )}
    >
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.value)}
            className={cn(
              "relative whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-amber",
              active ? "text-bg" : "text-muted hover:text-ink"
            )}
          >
            {active && (
              <motion.span
                layoutId={id}
                transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                className="absolute inset-0 rounded-full bg-amber"
              />
            )}
            <span className="relative z-10">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

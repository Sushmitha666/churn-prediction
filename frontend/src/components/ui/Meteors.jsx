import { useMemo } from "react";
import { cn } from "../../lib/utils";

// Deterministic pseudo-random so the layout is stable between renders.
const rnd = (n) => {
  const x = Math.sin(n * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

// Aceternity "Meteors".
export function Meteors({ number = 16, className }) {
  const items = useMemo(
    () =>
      Array.from({ length: number }, (_, i) => ({
        left: `${Math.floor(rnd(i + 1) * 100)}%`,
        delay: `${(rnd(i + 11) * 5).toFixed(2)}s`,
        duration: `${(rnd(i + 21) * 4 + 4).toFixed(2)}s`,
      })),
    [number]
  );

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((m, i) => (
        <span
          key={i}
          className={cn(
            "animate-meteor absolute top-0 h-0.5 w-0.5 rotate-[215deg] rounded-full bg-amber shadow-[0_0_0_1px_#ffffff10]",
            className
          )}
          style={{ left: m.left, animationDelay: m.delay, animationDuration: m.duration }}
        >
          <span className="absolute top-1/2 h-px w-[50px] -translate-y-1/2 bg-gradient-to-r from-amber to-transparent" />
        </span>
      ))}
    </div>
  );
}

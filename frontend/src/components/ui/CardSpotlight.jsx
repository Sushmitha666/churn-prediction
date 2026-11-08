import { useRef, useState } from "react";
import { cn } from "../../lib/utils";

// Aceternity "Card Spotlight": a soft glow that follows the cursor.
export function CardSpotlight({
  children,
  className,
  radius = 280,
  color = "rgba(255,176,32,0.13)",
  ...rest
}) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0, o: 0 });

  const move = (e) => {
    const r = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top, o: 1 });
  };

  return (
    <div
      ref={ref}
      onMouseMove={move}
      onMouseLeave={() => setPos((p) => ({ ...p, o: 0 }))}
      className={cn("relative overflow-hidden rounded-3xl border border-line bg-surface", className)}
      {...rest}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: pos.o,
          background: `radial-gradient(${radius}px circle at ${pos.x}px ${pos.y}px, ${color}, transparent 70%)`,
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}

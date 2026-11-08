import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export const Kicker = ({ children, className }) => (
  <span className={cn("font-mono text-[11px] uppercase tracking-[0.16em] text-amber", className)}>{children}</span>
);

export const Label = ({ children, className }) => (
  <span className={cn("font-mono text-[11px] uppercase tracking-[0.12em] text-muted", className)}>{children}</span>
);

export function PageHeader({ kicker, title, sub }) {
  return (
    <header className="pb-10 pt-32">
      <Kicker>{kicker}</Kicker>
      <h1 className="mt-3 max-w-3xl font-serif text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
        {title}
      </h1>
      {sub && <p className="mt-4 max-w-2xl text-base text-muted sm:text-lg">{sub}</p>}
    </header>
  );
}

export const BentoGrid = ({ children, className }) => (
  <div className={cn("grid grid-cols-1 gap-4 md:grid-cols-6", className)}>{children}</div>
);

// Scroll-triggered fade-up wrapper for sections.
export function Reveal({ children, className, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Skeleton({ className }) {
  return <div className={cn("animate-shimmer rounded-3xl bg-surface2", className)} />;
}

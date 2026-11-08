import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { GITHUB_URL } from "../../config";

const links = [
  { to: "/", label: "Overview" },
  { to: "/drivers", label: "Drivers" },
  { to: "/customers", label: "Customers" },
];

// Aceternity "Floating Navbar" with a sliding active pill.
export function FloatingNav() {
  const { pathname } = useLocation();

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed left-1/2 top-4 z-50 flex max-w-[calc(100vw-24px)] -translate-x-1/2 items-center gap-1 rounded-full border border-line bg-surface/70 p-1.5 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.9)] backdrop-blur-xl"
      aria-label="Main"
    >
      <span className="hidden items-center gap-2 pl-3 pr-3 font-mono text-[11px] uppercase tracking-[0.16em] text-amber sm:flex">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber" />
        Retention
      </span>

      {links.map((l) => {
        const active = l.to === "/" ? pathname === "/" : pathname.startsWith(l.to);
        return (
          <NavLink
            key={l.to}
            to={l.to}
            className={cn(
              "relative rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-amber",
              active ? "text-bg" : "text-muted hover:text-ink"
            )}
          >
            {active && (
              <motion.span
                layoutId="nav-pill"
                transition={{ type: "spring", bounce: 0.25, duration: 0.55 }}
                className="absolute inset-0 rounded-full bg-amber"
              />
            )}
            <span className="relative z-10">{l.label}</span>
          </NavLink>
        );
      })}

      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noreferrer"
        className="ml-1 hidden rounded-full border border-line px-3.5 py-2 text-sm text-muted transition-colors hover:border-amber/60 hover:text-ink sm:block"
      >
        GitHub ↗
      </a>
    </motion.nav>
  );
}

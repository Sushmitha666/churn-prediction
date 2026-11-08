import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

export function NumberTicker({ value, decimals = 0, prefix = "", suffix = "", duration = 1.6, className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [v, setV] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const c = animate(0, value, { duration, ease: "easeOut", onUpdate: setV });
    return () => c.stop();
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

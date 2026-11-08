import { cn } from "../../lib/utils";

// Aceternity "Grid Background" with a radial fade so the edges disappear.
export function GridBackground({ className }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0",
        "[background-size:44px_44px]",
        "[background-image:linear-gradient(to_right,#1a1e26_1px,transparent_1px),linear-gradient(to_bottom,#1a1e26_1px,transparent_1px)]",
        "[mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_72%)]",
        "[-webkit-mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_72%)]",
        className
      )}
    />
  );
}

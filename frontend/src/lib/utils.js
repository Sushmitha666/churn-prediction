import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs) => twMerge(clsx(inputs));
export const pct = (v, d = 0) => `${(v * 100).toFixed(d)}%`;

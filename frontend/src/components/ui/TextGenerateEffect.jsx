import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

const parent = (delay) => ({ h: {}, v: { transition: { staggerChildren: 0.07, delayChildren: delay } } });
const word = {
  h: { opacity: 0, filter: "blur(10px)", y: 10 },
  v: { opacity: 1, filter: "blur(0px)", y: 0, transition: { duration: 0.6 } },
};

// Aceternity "Text Generate Effect": words fade in one by one with a blur.
// Wrap a word in *asterisks* to render it in the accent style.
export function TextGenerateEffect({ text, className, delay = 0 }) {
  const words = text.split(" ");
  return (
    <motion.span className={cn("block", className)} variants={parent(delay)} initial="h" animate="v">
      {words.map((w, i) => {
        const accent = w.startsWith("*") && w.endsWith("*") && w.length > 2;
        return (
          <motion.span
            key={i}
            variants={word}
            className={cn("inline-block whitespace-pre", accent && "italic text-amber")}
          >
            {accent ? w.slice(1, -1) : w}{" "}
          </motion.span>
        );
      })}
    </motion.span>
  );
}

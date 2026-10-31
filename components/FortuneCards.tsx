"use client";

import { motion } from "framer-motion";
import type { Fortune } from "@/data/types";
import { LoveIcon, MoneyIcon, StarShape, WorkIcon } from "./art/icons";
import { Reveal } from "./Reveal";

const categories = [
  { key: "work", label: "การเรียน / งาน", Icon: WorkIcon },
  { key: "money", label: "การเงิน", Icon: MoneyIcon },
  { key: "love", label: "ความรัก", Icon: LoveIcon },
] as const;

export function FortuneCards({ fortune, delay = 0 }: { fortune: Fortune; delay?: number }) {
  return (
    <div className="flex w-full flex-col gap-3 text-left">
      {categories.map(({ key, label, Icon }, i) => {
        const d = delay + i * 0.35;
        return (
          <Reveal key={key} delay={d}>
            <section className="rounded-2xl border border-white/15 bg-white/5 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="flex items-center gap-2 font-semibold text-gold">
                  <Icon size={22} />
                  {label}
                </span>
                <span className="flex" role="img" aria-label={`${fortune.stars[key]} จาก 5 ดาว`}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <motion.span
                      key={n}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: d + 0.3 + n * 0.08, type: "spring", stiffness: 400, damping: 12 }}
                    >
                      <StarShape filled={n <= fortune.stars[key]} size={18} />
                    </motion.span>
                  ))}
                </span>
              </div>
              <p className="leading-relaxed text-foreground/90">{fortune[key]}</p>
            </section>
          </Reveal>
        );
      })}
    </div>
  );
}

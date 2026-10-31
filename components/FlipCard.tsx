"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Card } from "@/data/types";
import { CardBack } from "./art/CardFace";
import { CardTile } from "./CardTile";

// ไพ่คว่ำ → พลิกเปิดหน้าไพ่ พร้อมแสงเรืองรอบๆ
export function FlipCard({ card, reversed }: { card: Card; reversed: boolean }) {
  const reduce = useReducedMotion();
  return (
    <div className="relative w-44" style={{ perspective: 1000 }}>
      <motion.div
        aria-hidden
        className="absolute -inset-6 rounded-full bg-gold/30 blur-2xl"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: [0, 1, 0.5], scale: [0.6, 1.2, 1] }}
        transition={{ delay: reduce ? 0 : 1, duration: 1.4 }}
      />
      <motion.div
        className="relative"
        style={{ transformStyle: "preserve-3d" }}
        initial={{ rotateY: reduce ? 0 : 180 }}
        animate={{ rotateY: 0 }}
        transition={{ delay: reduce ? 0 : 0.5, duration: reduce ? 0 : 1.1, type: "spring", bounce: 0.25 }}
      >
        <div style={{ backfaceVisibility: "hidden" }} className={reversed ? "rotate-180" : ""}>
          <CardTile card={card} selected />
        </div>
        <div style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", position: "absolute", inset: 0 }}>
          <CardBack className="h-full w-full" />
        </div>
      </motion.div>
    </div>
  );
}

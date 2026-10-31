"use client";

import { motion } from "framer-motion";
import type { Card } from "@/data/types";
import { Sparkles } from "./Sparkles";
import { CardTile } from "./CardTile";

// การพลิกไพ่ทำไปแล้วใน PickTransition ที่นี่ไพ่แค่โผล่นุ่มๆ พร้อมแสงเรือง (ใช้ได้กับคนเปิดลิงก์ตรงด้วย)
export function FlipCard({ card, reversed }: { card: Card; reversed: boolean }) {
  return (
    <div className="relative w-44">
      <Sparkles delay={0.3} />
      <motion.div
        aria-hidden
        className="absolute -inset-6 rounded-full bg-gold/30 blur-2xl"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: [0, 1, 0.5], scale: [0.6, 1.2, 1] }}
        transition={{ delay: 0.1, duration: 1.4 }}
      />
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.88, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className={reversed ? "rotate-180" : ""}>
          <CardTile card={card} selected />
        </div>
      </motion.div>
    </div>
  );
}

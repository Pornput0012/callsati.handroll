"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import type { Card } from "@/data/types";
import { CardBack, CardFace } from "./art/CardFace";
import { Sparkles } from "./Sparkles";

const BG_STARS = Array.from({ length: 36 }, (_, i) => ({ x: (i * 53) % 100, y: (i * 37 + 11) % 100, r: 1 + (i % 3), d: (i % 7) * 0.3 }));
const TOTAL = 2.7; // วินาทีก่อนเข้าหน้าคำทำนาย

// หลังกดเลือกไพ่: ไพ่คว่ำลอยขึ้น สั่นเล็กน้อย แล้วพลิกเผยหน้าไพ่ + ประกายก่อนไปหน้าคำทำนาย
export function PickTransition({ card, reversed, onDone }: { card: Card; reversed: boolean; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, TOTAL * 1000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      role="dialog"
      aria-label={`เปิดไพ่ ${card.name}`}
      onClick={onDone}
      className="fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center overflow-hidden bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {BG_STARS.map((s, i) => (
        <span
          key={i}
          className="art-twinkle absolute rounded-full bg-[#fff3c4]"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.r, height: s.r, animationDelay: `${s.d}s` }}
        />
      ))}
      <motion.div
        aria-hidden
        className="absolute h-72 w-72 rounded-full bg-gold/30 blur-3xl"
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: [0.4, 1, 1.6], opacity: [0, 0.6, 0.9] }}
        transition={{ duration: TOTAL, ease: "easeOut" }}
      />

      <div className="relative" style={{ perspective: 1000 }}>
        <Sparkles delay={1.5} />
        <motion.div
          aria-hidden
          className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gold"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: [0.5, 3.2], opacity: [0.9, 0] }}
          transition={{ delay: 1.5, duration: 0.9, ease: "easeOut" }}
        />
        <motion.div
          className="w-48"
          initial={{ y: 140, scale: 0.6, opacity: 0 }}
          animate={{ y: 0, scale: [0.6, 1, 1.12], opacity: 1 }}
          transition={{ duration: 1.8, ease: "easeOut", times: [0, 0.4, 1] }}
        >
          <motion.div
            style={{ transformStyle: "preserve-3d" }}
            initial={{ rotateY: 180 }}
            animate={{ rotateY: [180, 168, 192, 180, 0] }}
            transition={{ duration: 1.9, times: [0, 0.2, 0.4, 0.55, 1], ease: "easeInOut" }}
          >
            <div style={{ backfaceVisibility: "hidden" }} className={reversed ? "rotate-180" : ""}>
              <CardFace card={card} className="block aspect-[2/3] w-full drop-shadow-[0_0_24px_rgba(242,193,78,0.6)]" />
            </div>
            <div style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", position: "absolute", inset: 0 }}>
              <CardBack className="h-full w-full" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.p
        className="relative mt-8 text-lg text-gold"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.7, duration: 0.5 }}
      >
        ไพ่ของคุณคือ {card.name}
        {reversed ? " (Reversed)" : ""}
      </motion.p>
    </motion.div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Card } from "@/data/types";
import { CardBack, CardFace } from "./art/CardFace";
import { Sparkles } from "./Sparkles";
import { FoolWalker } from "./FoolWalker";
import { playCardFlip, playSparkleReveal } from "@/lib/sound";

const BG_STARS = Array.from({ length: 36 }, (_, i) => ({ x: (i * 53) % 100, y: (i * 37 + 11) % 100, r: 1 + (i % 3), d: (i % 7) * 0.3 }));
const WALK = 1.8; // The Fool เดินโหลด
const GAP = 0.35; // เฟดสลับฉาก
const REVEAL = 4.2; // ไพ่ลอยขึ้น พลิกเผยหน้า แล้วค่อยเข้าหน้าคำทำนาย (กดข้ามได้ทุกจังหวะ)

// หลังกดเลือกไพ่: The Fool เดินโหลดสั้นๆ → ไพ่คว่ำลอยขึ้น แล้วพลิกเผยหน้าไพ่ + ประกายก่อนไปหน้าคำทำนาย
export function PickTransition({ card, reversed, onDone }: { card: Card; reversed: boolean; onDone: () => void }) {
  const [phase, setPhase] = useState<"walk" | "reveal">("walk");
  const doneRef = useRef(onDone);
  useEffect(() => {
    doneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("reveal"), WALK * 1000);
    const tFlip = setTimeout(() => playCardFlip(), (WALK + GAP + 1.3) * 1000);
    const tSparkle = setTimeout(() => playSparkleReveal(), (WALK + GAP + 2.2) * 1000);
    const t2 = setTimeout(() => doneRef.current(), (WALK + GAP + REVEAL) * 1000);
    return () => {
      clearTimeout(t1);
      clearTimeout(tFlip);
      clearTimeout(tSparkle);
      clearTimeout(t2);
    };
  }, []);

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
        className="absolute h-[28rem] w-[28rem] rounded-full will-change-transform"
        style={{ background: "radial-gradient(circle, rgba(242,193,78,0.38) 0%, rgba(242,193,78,0) 65%)" }}
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: [0.4, 1, 1.6], opacity: [0, 0.6, 0.9] }}
        transition={{ duration: WALK + REVEAL, ease: "easeOut" }}
      />

      <AnimatePresence mode="wait">
        {phase === "walk" ? (
          <motion.div
            key="walk"
            className="relative"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: GAP }}
          >
            <FoolWalker duration={WALK} />
          </motion.div>
        ) : (
          <motion.div
            key="reveal"
            className="relative flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: GAP }}
          >
            <div className="relative" style={{ perspective: 1000 }}>
              <Sparkles delay={2.2} />
              <motion.div
                aria-hidden
                className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gold will-change-transform"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: [0.5, 3.2], opacity: [0.9, 0] }}
                transition={{ delay: 2.2, duration: 1, ease: "easeOut" }}
              />
              <motion.div
                className="relative w-56 will-change-transform sm:w-64 md:w-72"
                initial={{ y: 160, scale: 0.7, opacity: 0 }}
                animate={{ y: [160, 0, 0], scale: [0.7, 1.05, 1], opacity: 1 }}
                transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1], times: [0, 0.5, 1] }}
              >
                {/* แสงรอบไพ่แยกเป็นชั้นนิ่ง ไม่ใส่ drop-shadow บนหน้าไพ่ที่กำลังหมุน 3D (ทำให้กระตุก) */}
                <div
                  aria-hidden
                  className="absolute -inset-6 rounded-3xl"
                  style={{ background: "radial-gradient(closest-side, rgba(242,193,78,0.45), rgba(242,193,78,0))" }}
                />
                <motion.div
                  className="relative will-change-transform"
                  style={{ transformStyle: "preserve-3d" }}
                  initial={{ rotateY: 180 }}
                  animate={{ rotateY: [180, 180, 0] }}
                  transition={{ duration: 2.4, times: [0, 0.35, 1], ease: [0.65, 0, 0.35, 1] }}
                >
                  <div style={{ backfaceVisibility: "hidden" }} className={reversed ? "rotate-180" : ""}>
                    <CardFace card={card} className="block aspect-[2/3] w-full" />
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
              transition={{ delay: 2.4, duration: 0.6 }}
            >
              ไพ่ของคุณคือ {card.name}
              {reversed ? " (Reversed)" : ""}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { CardBack } from "./art/CardFace";

const floaters = [
  { x: -90, rot: -14, delay: 0 },
  { x: 0, rot: 0, delay: 0.4 },
  { x: 90, rot: 14, delay: 0.8 },
];

export function Hero() {
  const reduce = useReducedMotion();
  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-8 overflow-hidden px-6 py-16 text-center">
      <div className="relative h-52 w-full max-w-xs">
        {floaters.map((f, i) => (
          <motion.div
            key={i}
            aria-hidden
            className="absolute left-1/2 top-1/2 h-44 w-28"
            style={{ marginLeft: -56 + f.x, marginTop: -88, rotate: f.rot, zIndex: i === 1 ? 2 : 1 }}
            initial={{ opacity: 0, y: 40 }}
            animate={reduce ? { opacity: 1, y: 0 } : { opacity: 1, y: [0, -12, 0] }}
            transition={
              reduce
                ? { duration: 0.3 }
                : { opacity: { duration: 0.6, delay: f.delay }, y: { duration: 3, repeat: Infinity, delay: f.delay, ease: "easeInOut" } }
            }
          >
            <CardBack className="h-full w-full drop-shadow-[0_0_14px_rgba(242,193,78,0.35)]" />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7 }}
        className="flex flex-col items-center gap-4"
      >
        <p className="text-sm tracking-[0.3em] text-gold">HANDROLL × TAROT</p>
        <h1 className="text-4xl font-bold leading-tight">
          ไพ่ที่จั่วได้ <span className="text-gold">บอกอะไรเกี่ยวกับคุณ?</span>
        </h1>
        <p className="max-w-sm text-foreground/80">
          บอกเราว่าจั่วได้ไพ่ใบไหน แล้วรับคำทำนาย character ประจำตัว และซอสที่เหมาะกับดวงวันนี้
        </p>
        <motion.div whileHover={{ scale: reduce ? 1 : 1.05 }} whileTap={{ scale: 0.97 }}>
          <Link href="/pick" className="inline-block rounded-full bg-gold px-8 py-3 font-semibold text-background shadow-[0_0_30px_rgba(242,193,78,0.4)]">
            เลือกไพ่ที่ได้
          </Link>
        </motion.div>
        <Link href="/characters" className="text-sm text-gold underline">
          ดู character ทั้ง 22 ตัว
        </Link>
      </motion.div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { CardBack } from "./art/CardFace";
import { playTap } from "@/lib/sound";

const floaters = [
  { x: -90, rot: -12, delay: 0 },
  { x: 0, rot: 0, delay: 0.4 },
  { x: 90, rot: 12, delay: 0.8 },
];

export function Hero() {
  const reduce = useReducedMotion();
  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-8 md:gap-10 overflow-hidden px-6 py-12 md:py-20 text-center">
      <div className="relative h-56 md:h-72 w-full max-w-xs md:max-w-md">
        {floaters.map((f, i) => (
          // กล่องนอกจัดกึ่งกลางด้วย CSS, กล่องใน (motion) ใช้ x/rotate/y เท่านั้น จึงไม่ชนกับ translate
          <div
            key={i}
            aria-hidden
            className="absolute left-1/2 top-1/2 -ml-16 -mt-24 h-48 w-32 md:-ml-20 md:-mt-[7.5rem] md:h-60 md:w-40"
            style={{ zIndex: i === 1 ? 2 : 1 }}
          >
            <motion.div
              className="h-full w-full"
              style={{ x: f.x * 1.15, rotate: f.rot }}
              initial={{ opacity: 0, y: 40 }}
              animate={reduce ? { opacity: 1, y: 0 } : { opacity: 1, y: [0, -14, 0] }}
              transition={
                reduce
                  ? { duration: 0.4 }
                  : {
                      opacity: { duration: 0.8, delay: f.delay },
                      y: { duration: 4, repeat: Infinity, delay: f.delay, ease: "easeInOut" },
                    }
              }
            >
              <CardBack className="h-full w-full drop-shadow-[0_4px_24px_rgba(242,193,78,0.4)]" />
            </motion.div>
          </div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-4 max-w-lg"
      >
        <p className="text-xs md:text-sm tracking-[0.35em] font-semibold text-gold">
          HANDROLL × TAROT
        </p>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          ไพ่ที่จั่วได้ <span className="text-gold">บอกอะไรเกี่ยวกับคุณ?</span>
        </h1>
        <p className="text-sm md:text-base text-foreground/80 leading-relaxed max-w-md">
          เปิดไพ่ทาโร่ต์เพื่อรับคำทำนาย character ประจำตัว และซอสที่เหมาะกับดวงของคุณวันนี้
        </p>
        <motion.div
          whileHover={{ scale: reduce ? 1 : 1.04 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 220, damping: 20 }}
          className="mt-2"
        >
          <Link
            href="/play"
            onClick={() => playTap()}
            className="inline-block rounded-full bg-gold px-12 py-4 text-base md:text-lg font-semibold text-background shadow-[0_0_30px_rgba(242,193,78,0.4)] transition-all hover:shadow-[0_0_50px_rgba(242,193,78,0.65)]"
          >
            เริ่ม
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { playTap } from "@/lib/sound";

export default function PlayModePage() {
  const reduce = useReducedMotion();

  const cardVariants = {
    hover: {
      scale: reduce ? 1 : 1.02,
      y: reduce ? 0 : -4,
      transition: { type: "spring" as const, stiffness: 200, damping: 22 },
    },
    tap: { scale: 0.98, transition: { duration: 0.1 } },
  };

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-8 md:py-16">
      <div className="w-full max-w-md md:max-w-3xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xs md:text-sm font-semibold tracking-[0.25em] text-gold"
        >
          SELECT MODE
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-2 text-3xl md:text-4xl font-bold tracking-tight text-foreground"
        >
          เลือกวิธีดูดวง
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-2 text-sm md:text-base text-foreground/70"
        >
          เลือกโหมดตามความสะดวกที่ร้านวันนี้
        </motion.p>

        <div className="mt-8 md:mt-10 flex flex-col md:grid md:grid-cols-2 gap-5 md:gap-6">
          {/* Option 1: จั่วบนเว็บ */}
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            whileTap="tap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="h-full"
          >
            <Link
              href="/draw"
              onClick={() => playTap()}
              className="group flex h-full flex-col justify-between rounded-2xl border border-gold/30 bg-foreground/5 p-6 md:p-8 text-left transition-all duration-300 hover:border-gold hover:bg-gold/10 hover:shadow-[0_0_36px_rgba(242,193,78,0.2)]"
            >
              <div>
                <div className="flex w-full items-center justify-between">
                  <span className="rounded-full bg-gold/20 px-3 py-1 text-xs md:text-sm font-medium text-gold">
                    ✨ แนะนำเมื่อไม่มีไพ่จริง
                  </span>
                  <span className="text-xl md:text-2xl text-gold transition-transform duration-300 group-hover:translate-x-1.5">
                    →
                  </span>
                </div>
                <h2 className="mt-5 text-xl md:text-2xl font-bold text-foreground group-hover:text-gold transition-colors">
                  จั่วบนเว็บ
                </h2>
                <p className="mt-2 text-sm md:text-base leading-relaxed text-foreground/75">
                  สับสำรับและแตะเลือกไพ่บนหน้าจอได้ทันที เว็บจะสุ่มไพ่และท่ากลับหัวให้อัตโนมัติ
                </p>
              </div>
              <div className="mt-6 text-xs text-gold/80 font-medium">
                เข้าสู่โหมดจั่วบนหน้าจอ ➔
              </div>
            </Link>
          </motion.div>

          {/* Option 2: เลือกไพ่จริง */}
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            whileTap="tap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="h-full"
          >
            <Link
              href="/pick"
              onClick={() => playTap()}
              className="group flex h-full flex-col justify-between rounded-2xl border border-foreground/15 bg-foreground/5 p-6 md:p-8 text-left transition-all duration-300 hover:border-gold/60 hover:bg-gold/5"
            >
              <div>
                <div className="flex w-full items-center justify-between">
                  <span className="rounded-full bg-foreground/10 px-3 py-1 text-xs md:text-sm font-medium text-foreground/80">
                    🃏 สำหรับจั่วไพ่จริงที่โต๊ะ
                  </span>
                  <span className="text-xl md:text-2xl text-foreground/50 transition-transform duration-300 group-hover:translate-x-1.5 group-hover:text-gold">
                    →
                  </span>
                </div>
                <h2 className="mt-5 text-xl md:text-2xl font-bold text-foreground group-hover:text-gold transition-colors">
                  เลือกไพ่ที่จั่วจริง
                </h2>
                <p className="mt-2 text-sm md:text-base leading-relaxed text-foreground/75">
                  ผู้จัดสับไพ่จริงให้ลูกค้าจั่ว แล้วค้นหาไพ่ใบที่ได้จากกริด 22 ใบ พร้อมสวิตช์ไพ่กลับหัว
                </p>
              </div>
              <div className="mt-6 text-xs text-foreground/60 font-medium group-hover:text-gold transition-colors">
                เข้าสู่โหมดค้นหาไพ่ ➔
              </div>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.45 }}
          className="mt-8"
        >
          <Link
            href="/"
            className="text-xs text-foreground/50 transition-colors hover:text-foreground"
          >
            ← กลับหน้าแรก
          </Link>
        </motion.div>
      </div>
    </main>
  );
}


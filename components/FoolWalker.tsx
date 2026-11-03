"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { playFootstep } from "@/lib/sound";

const GOLD = "#f2c14e";
const LIGHT = "#f6ecff";
const PALE = "#fff3c4";
const stroke = { stroke: GOLD, strokeWidth: 2.5, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

// The Fool เดินอยู่กับที่ พื้นเลื่อนผ่านใต้เท้า ใช้เป็นจังหวะ "กำลังโหลด" ก่อนเปิดไพ่
export function FoolWalker({ duration }: { duration: number }) {
  // เสียงก้าวเท้าทุก 0.35 วิ ตรงกับจังหวะขาในแอนิเมชัน (.fool-leg รอบละ 0.7 วิ สลับข้าง)
  useEffect(() => {
    const id = setInterval(playFootstep, 350);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative h-60 w-80 overflow-hidden" aria-hidden>
        {/* ตัวละคร (viewBox 120x160 ปลายเท้าอยู่ y≈148) */}
        <svg viewBox="0 0 120 160" className="absolute left-1/2 top-0 h-56 w-[168px] -translate-x-1/2">
          <g className="fool-hop">
            {/* ไม้สะพายถุงผ้า */}
            <path d="M62 78 L98 52" stroke={GOLD} strokeWidth="3" strokeLinecap="round" />
            <circle cx="100" cy="50" r="9" fill="#3b1d70" stroke={GOLD} strokeWidth="2.5" />
            {/* ลำตัว + หัว */}
            <path d="M58 70 L40 112 L76 112 Z" fill={LIGHT} {...stroke} />
            <circle cx="58" cy="54" r="13" fill={PALE} {...stroke} />
            <path d="M46 47 q12 -19 24 0" fill={GOLD} stroke={GOLD} strokeWidth="2" />
            <path d="M68 40 q10 -10 18 -6" stroke={LIGHT} strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <circle cx="62" cy="55" r="1.6" fill="#3b1d70" />
          </g>
          {/* ขา 2 ข้างแกว่งสลับกันจากสะโพก */}
          <g className="fool-leg" style={{ transformOrigin: "52px 112px" }}>
            <path d="M52 112 V146 h9" fill="none" {...stroke} />
          </g>
          <g className="fool-leg fool-leg-b" style={{ transformOrigin: "64px 112px" }}>
            <path d="M64 112 V146 h9" fill="none" {...stroke} />
          </g>
        </svg>

        {/* พื้น: จุดประเลื่อนซ้ายวนต่อเนื่อง กว้างกว่ากรอบ 48px (= 1 รอบ) */}
        <div className="absolute inset-x-0 bottom-3 h-3 overflow-hidden">
          <div
            className="fool-ground absolute left-0 top-1/2 h-1 w-[calc(100%+48px)] -translate-y-1/2"
            style={{ backgroundImage: `radial-gradient(circle, ${GOLD} 2px, transparent 2.5px)`, backgroundSize: "24px 4px", opacity: 0.7 }}
          />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-background to-transparent" />
      </div>

      <p className="text-lg text-gold">กำลังเปิดไพ่ของคุณ…</p>

      {/* แถบความคืบหน้าบางๆ ใช้ scaleX เพื่อให้ลื่น */}
      <div className="h-1 w-40 overflow-hidden rounded-full bg-white/10" aria-hidden>
        <motion.div
          className="h-full origin-left rounded-full bg-gold"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}

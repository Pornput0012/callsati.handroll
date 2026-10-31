"use client";

import { motion } from "framer-motion";

const N = 14;

// ประกายพุ่งออกรอบไพ่ตอนพลิกเปิด
export function Sparkles({ delay }: { delay: number }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center motion-reduce:hidden">
      {Array.from({ length: N }, (_, i) => {
        const a = (i / N) * Math.PI * 2;
        const d = 110 + (i % 3) * 24;
        return (
          <motion.span
            key={i}
            className="absolute h-2 w-2 rounded-full bg-gold"
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={{ x: Math.cos(a) * d, y: Math.sin(a) * d, opacity: [0, 1, 0], scale: [0, 1.4, 0] }}
            transition={{ delay, duration: 1.1, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}

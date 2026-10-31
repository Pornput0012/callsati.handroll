"use client";

import { motion } from "framer-motion";

// ค่อยๆ โผล่ขึ้นตามลำดับ (ลดเหลือ fade เมื่อผู้ใช้ปิดแอนิเมชัน)
export function Reveal({ delay = 0, children, className }: { delay?: number; children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

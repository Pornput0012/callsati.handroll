"use client";

import { motion } from "framer-motion";

// หยดซอสสีประจำตัว หยดลงมาแล้วเด้งเบาๆ
export function SauceDrop({ color, delay = 0 }: { color: string; delay?: number }) {
  return (
    <motion.svg
      viewBox="0 0 40 56"
      className="mx-auto mb-2 h-12 w-9"
      aria-hidden
      initial={{ y: -40, opacity: 0, scaleY: 1.4 }}
      animate={{ y: 0, opacity: 1, scaleY: 1 }}
      transition={{ delay, type: "spring", stiffness: 260, damping: 12 }}
    >
      <path d="M20 2 C20 2 4 24 4 36 a16 16 0 0 0 32 0 C36 24 20 2 20 2 Z" fill={color} stroke="#f6ecff" strokeWidth="2" />
      <ellipse cx="14" cy="34" rx="3" ry="6" fill="#ffffff" opacity="0.45" />
    </motion.svg>
  );
}

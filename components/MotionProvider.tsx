"use client";

import { MotionConfig } from "framer-motion";

// ให้ Framer Motion ปิดแอนิเมชันที่เป็นการเคลื่อนที่เองเมื่อผู้ใช้เปิด reduced-motion
// (ไม่ต้องเช็กในแต่ละคอมโพเนนต์ ซึ่งทำให้ HTML ฝั่งเซิร์ฟเวอร์กับเบราว์เซอร์ไม่ตรงกัน)
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

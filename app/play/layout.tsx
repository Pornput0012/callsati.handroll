import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "เลือกวิธีดูดวง | Handroll Tarot",
  description: "เลือกโหมดจั่วไพ่บนเว็บ หรือเลือกไพ่จากสำรับจริงที่ร้าน",
};

export default function PlayLayout({ children }: { children: React.ReactNode }) {
  return children;
}


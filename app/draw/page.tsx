import type { Metadata } from "next";
import { DeckShuffleFan } from "@/components/DeckShuffleFan";

export const metadata: Metadata = {
  title: "จั่วไพ่บนเว็บ | Handroll Tarot",
  description: "สับสำรับและแตะเลือกไพ่ทาโร่ต์บนเว็บร้านแฮนโรลเพื่อรับคำทำนายและซอสประจำตัว",
};

export default function DrawPage() {
  return (
    <main className="flex flex-1 flex-col">
      <DeckShuffleFan />
    </main>
  );
}


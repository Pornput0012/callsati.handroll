import Link from "next/link";
import { CharacterGrid } from "@/components/CharacterGrid";

export const metadata = { title: "Character ทั้งหมด | แฮนโรล" };

export default function CharactersPage() {
  return (
    <main className="flex-1">
      <header className="px-4 pb-6 pt-10 text-center">
        <h1 className="text-3xl font-bold text-gold">รู้จัก character ทั้ง 22 ตัว</h1>
        <p className="mt-2 text-foreground/70">ไพ่หนึ่งใบ ตัวละครหนึ่งตัว คุณจะได้เป็นใคร?</p>
        <Link href="/pick" className="mt-4 inline-block rounded-full bg-gold px-6 py-2 font-semibold text-background">
          เลือกไพ่ของฉัน
        </Link>
      </header>
      <CharacterGrid />
    </main>
  );
}

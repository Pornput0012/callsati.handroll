import Link from "next/link";
import type { Card, Character } from "@/data/types";
import { CardFace } from "./art/CardFace";

export function CharacterCard({ character, card }: { character: Character; card: Card }) {
  return (
    <Link
      href={`/reading/${card.id}`}
      className="group flex items-center gap-4 rounded-2xl border p-4 text-left transition-transform hover:-translate-y-1"
      style={{ borderColor: character.color, background: `linear-gradient(160deg, ${character.color}44, transparent)` }}
    >
      <CardFace card={card} className="w-24 shrink-0 drop-shadow-[0_0_12px_rgba(242,193,78,0.3)] transition-transform group-hover:rotate-2 group-hover:scale-105" />
      <span className="flex flex-col gap-1">
        <span className="text-xs text-gold">
          {card.number} · {card.name}
        </span>
        <span className="text-xl font-bold">{character.name}</span>
        <span className="text-sm text-foreground/80">{character.tagline}</span>
        <span className="text-xs text-foreground/50">{character.personality}</span>
        <span className="mt-1 text-xs text-gold opacity-70 group-hover:opacity-100">ดูคำทำนายไพ่ใบนี้ →</span>
      </span>
    </Link>
  );
}

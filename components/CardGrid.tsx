"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cards } from "@/data/cards";
import { CardTile } from "./CardTile";

export function CardGrid() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [reversed, setReversed] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);

  const q = query.trim().toLowerCase();
  const shown = cards.filter((c) => !q || c.name.toLowerCase().includes(q));

  function pick(id: string) {
    setPicked(id);
    router.push(`/reading/${id}${reversed ? "/reversed" : ""}`);
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-10">
      <div className="sticky my-8 rounded-xl top-0 z-10 -mx-4 flex flex-col gap-3 bg-background/90 px-4 py-4 backdrop-blur">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search card name"
          aria-label="ค้นหาชื่อไพ่"
          className="w-full rounded-full border border-white/20 bg-white/10 px-4 py-2 outline-none focus:border-gold"
        />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={reversed} onChange={(e) => setReversed(e.target.checked)} />
          ไพ่ที่ได้เป็นท่ากลับหัว
        </label>
      </div>
      {shown.length === 0 && <p className="py-10 text-center text-foreground/60">ไม่พบไพ่ที่ค้นหา</p>}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {shown.map((card, i) => (
          <motion.button
            key={card.id}
            type="button"
            onClick={() => pick(card.id)}
            aria-label={`เลือกไพ่ ${card.name}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.03, 0.5) }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.96 }}
          >
            <CardTile card={card} selected={picked === card.id} />
          </motion.button>
        ))}
      </div>
    </div>
  );
}

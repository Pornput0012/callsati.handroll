"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cards } from "@/data/cards";
import { CardTile } from "./CardTile";
import { PickTransition } from "./PickTransition";
import { playCardSelect, playTap } from "@/lib/sound";

export function CardGrid() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [reversed, setReversed] = useState(false);
  const reduce = useReducedMotion();
  const [picked, setPicked] = useState<string | null>(null);

  // cacheComponents เก็บหน้า /pick ไว้ตอนออกไปหน้าอื่น (Activity) → ล้างไพ่ที่เลือกเมื่อหน้าถูกซ่อน กันแอนิเมชันเล่นซ้ำตอนกลับมา
  useEffect(() => () => setPicked(null), []);

  const q = query.trim().toLowerCase();
  const shown = cards.filter((c) => !q || c.name.toLowerCase().includes(q));

  const path = (id: string) => `/reading/${id}${reversed ? "/reversed" : ""}`;
  const go = useCallback(() => {
    if (picked) router.push(path(picked));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [picked, reversed, router]);

  function pick(id: string) {
    if (picked) return; // กันกดซ้ำระหว่างเล่นแอนิเมชัน
    playCardSelect();
    router.prefetch(path(id));
    if (reduce) router.push(path(id));
    else setPicked(id);
  }

  return (
    <div className="mx-auto w-full max-w-3xl md:max-w-5xl px-4 pb-12">
      <AnimatePresence>
        {picked && <PickTransition card={cards.find((c) => c.id === picked)!} reversed={reversed} onDone={go} />}
      </AnimatePresence>
      <div className="sticky my-6 md:my-8 rounded-2xl top-2 z-10 -mx-2 md:-mx-4 flex flex-col gap-3 border border-white/10 bg-background/90 px-4 md:px-6 py-4 shadow-xl shadow-black/40 backdrop-blur-md">
        <div className="flex items-center justify-between text-xs md:text-sm text-foreground/70">
          <span className="font-medium text-gold/90">โหมดเลือกจากไพ่จริง</span>
          <Link href="/play" className="text-gold transition-colors hover:underline">
            ← เปลี่ยนวิธีดูดวง
          </Link>
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ค้นหาชื่อไพ่ (เช่น The Fool, The Sun...)"
          aria-label="ค้นหาชื่อไพ่"
          className="w-full rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm md:text-base outline-none transition-colors focus:border-gold focus:ring-1 focus:ring-gold"
        />
        <label className="flex cursor-pointer items-center gap-3 text-sm md:text-base">
          <input
            type="checkbox"
            role="switch"
            checked={reversed}
            onChange={(e) => {
              playTap();
              setReversed(e.target.checked);
            }}
            className="peer sr-only"
          />
          <span
            aria-hidden
            className="relative h-6 w-11 shrink-0 rounded-full bg-white/20 transition-colors peer-checked:bg-gold peer-focus-visible:ring-2 peer-focus-visible:ring-gold peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background peer-checked:[&>span]:translate-x-5"
          >
            <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform" />
          </span>
          ไพ่ที่ได้เป็นท่ากลับหัว (Reversed)
        </label>
      </div>
      {shown.length === 0 && <p className="py-12 text-center text-foreground/60">ไม่พบไพ่ที่ค้นหา</p>}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
        {shown.map((card, i) => (
          <motion.button
            key={card.id}
            type="button"
            onClick={() => pick(card.id)}
            aria-label={`เลือกไพ่ ${card.name}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              opacity: { duration: 0.35, delay: Math.min(i * 0.02, 0.4) },
              y: { type: "spring", stiffness: 200, damping: 22 },
            }}
            whileHover={{ y: -6, scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-xl"
          >
            <CardTile card={card} selected={picked === card.id} />
          </motion.button>
        ))}
      </div>
    </div>
  );
}

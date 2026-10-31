"use client";

import { motion } from "framer-motion";
import { cards } from "@/data/cards";
import { characters } from "@/data/characters";
import { CharacterCard } from "./CharacterCard";

export function CharacterGrid() {
  return (
    <div className="mx-auto grid w-full max-w-3xl grid-cols-1 gap-4 px-4 pb-12 sm:grid-cols-2">
      {characters.map((ch, i) => {
        const card = cards.find((c) => c.id === ch.cardId)!;
        return (
          <motion.div
            key={ch.cardId}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: (i % 2) * 0.08, duration: 0.5 }}
          >
            <CharacterCard character={ch} card={card} />
          </motion.div>
        );
      })}
    </div>
  );
}

import type { Card } from "@/data/types";
import { CardFace } from "./art/CardFace";

export function CardTile({ card, selected }: { card: Card; selected: boolean }) {
  return (
    <div className={`aspect-[2/3] rounded-2xl transition-shadow ${selected ? "shadow-[0_0_24px_rgba(242,193,78,0.55)]" : ""}`}>
      <CardFace card={card} className="h-full w-full" />
    </div>
  );
}

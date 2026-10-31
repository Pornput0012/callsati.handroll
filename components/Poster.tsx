import type { Reading } from "@/data/types";
import { CardFace } from "./art/CardFace";
import { LoveIcon, MoneyIcon, StarShape, WorkIcon } from "./art/icons";

export const POSTER_W = 1080;
export const POSTER_H = 1920;
const SAFE = 250; // เว้นพื้นที่ UI ของ IG story ด้านบน/ล่าง

// ภาพ character จริง (character.image) จะเพิ่มทีหลังเมื่อมีภาพจากเจ้าของร้าน
const STARS = Array.from({ length: 40 }, (_, i) => ({ x: (i * 137) % 1000 + 40, y: (i * 251) % 1700 + 100, r: 3 + (i % 4) * 2 }));

export function Poster({ reading }: { reading: Reading }) {
  const { card, character, sauce, fortune, reversed, reason } = reading;
  const rows = [
    { label: "การเรียน / งาน", Icon: WorkIcon, n: fortune.stars.work },
    { label: "การเงิน", Icon: MoneyIcon, n: fortune.stars.money },
    { label: "ความรัก", Icon: LoveIcon, n: fortune.stars.love },
  ];
  return (
    <div
      style={{
        width: POSTER_W,
        height: POSTER_H,
        padding: `${SAFE}px 80px`,
        background: `linear-gradient(160deg, ${character.color} 0%, #140a24 70%)`,
        color: "#f6ecff",
        fontFamily: "var(--font-noto-thai), sans-serif",
      }}
      className="relative flex flex-col items-center justify-between overflow-hidden text-center"
    >
      {STARS.map((st, i) => (
        <span key={i} style={{ position: "absolute", left: st.x, top: st.y, width: st.r, height: st.r, borderRadius: "50%", background: "#f2c14e", opacity: 0.5 }} />
      ))}
      <p style={{ fontSize: 40, letterSpacing: 6, color: "#f2c14e" }}>YOUR TAROT CHARACTER</p>

      <div className="flex flex-col items-center" style={{ gap: 14 }}>
        <div style={{ width: 250, transform: reversed ? "rotate(180deg)" : undefined, filter: "drop-shadow(0 0 40px rgba(242,193,78,0.5))" }}>
          <CardFace card={card} className="block h-auto w-full" />
        </div>
        <p style={{ fontSize: 56 }}>
          {card.name}
          {reversed ? " (Reversed)" : ""}
        </p>
        <h1 style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.15 }}>{character.name}</h1>
        <p style={{ fontSize: 44, color: "#f2c14e" }}>{character.tagline}</p>
      </div>

      <div style={{ width: "100%" }}>
        <p style={{ fontSize: 36, lineHeight: 1.5, maxHeight: 110, overflow: "hidden", marginBottom: 22 }}>{fortune.general}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {rows.map(({ label, Icon, n }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 30px", borderRadius: 28, background: "rgba(0,0,0,0.3)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 36 }}>
                <Icon size={44} />
                {label}
              </span>
              <span style={{ display: "flex", gap: 6 }}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <StarShape key={i} filled={i <= n} size={44} />
                ))}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{ width: "100%", padding: "24px 40px", borderRadius: 40, background: "rgba(0,0,0,0.35)", border: `6px solid ${sauce.color}` }}
      >
        <p style={{ fontSize: 34, opacity: 0.7 }}>ซอสประจำตัวของคุณ</p>
        <p style={{ fontSize: 72, fontWeight: 700, color: sauce.color === "#6f4518" ? "#d9a066" : sauce.color }}>{sauce.name}</p>
        <p style={{ fontSize: 36 }}>{reason}</p>
      </div>
    </div>
  );
}

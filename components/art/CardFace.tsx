import type { Card } from "@/data/types";
import { FallbackSymbol, symbols } from "./symbols";

const ROMAN = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI"];

// หน้าไพ่: กรอบทอง + ตัวเลขโรมัน + สัญลักษณ์ + ชื่อไพ่ (viewBox 200x300 = สัดส่วน 2:3)
export function CardFace({ card, className }: { card: Card; className?: string }) {
  const Symbol = symbols[card.id] ?? FallbackSymbol;
  const gid = `bg-${card.id}`;
  const name = card.name.toUpperCase();
  return (
    <svg viewBox="0 0 200 300" role="img" aria-label={card.name} className={className}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b1d70" />
          <stop offset="1" stopColor="#140a24" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="196" height="296" rx="14" fill={`url(#${gid})`} stroke="#f2c14e" strokeWidth="3" />
      <rect x="10" y="10" width="180" height="280" rx="9" fill="none" stroke="#f2c14e" strokeWidth="1" opacity="0.6" />
      {[[18, 18], [182, 18], [18, 282], [182, 282]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="2.5" fill="#f2c14e" />
      ))}
      <text x="100" y="42" textAnchor="middle" fontSize="16" fill="#f2c14e" fontFamily="serif" letterSpacing="3">
        {ROMAN[card.number]}
      </text>
      <Symbol />
      <line x1="50" y1="252" x2="150" y2="252" stroke="#f2c14e" strokeWidth="1" opacity="0.6" />
      <text
        x="100"
        y="274"
        textAnchor="middle"
        fontSize={name.length > 14 ? 10 : 13}
        fill="#f6ecff"
        fontFamily="serif"
        letterSpacing={name.length > 14 ? 0.5 : 1.5}
        textLength={name.length > 18 ? 160 : undefined}
        lengthAdjust="spacingAndGlyphs"
      >
        {name}
      </text>
    </svg>
  );
}

export function CardBack({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 300" aria-hidden className={className}>
      <rect x="2" y="2" width="196" height="296" rx="14" fill="#2b1250" stroke="#f2c14e" strokeWidth="3" />
      <rect x="12" y="12" width="176" height="276" rx="8" fill="none" stroke="#f2c14e" strokeWidth="1" opacity="0.6" />
      <g stroke="#f2c14e" strokeWidth="1" fill="none" opacity="0.5">
        <circle cx="100" cy="150" r="60" />
        <circle cx="100" cy="150" r="40" />
        <path d="M100 90 L100 210 M40 150 L160 150 M58 108 L142 192 M142 108 L58 192" />
      </g>
      <polygon points="100,120 107,143 130,150 107,157 100,180 93,157 70,150 93,143" fill="#f2c14e" />
    </svg>
  );
}

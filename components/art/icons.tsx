// ไอคอนหมวดคำทำนาย (SVG ใช้ได้ทั้งหน้าเว็บและโปสเตอร์ ไม่พึ่งอีโมจิที่แต่ละเครื่องวาดไม่เหมือนกัน)
type P = { size?: number; color?: string };
const base = (size: number, color: string) => ({ width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const });

export function WorkIcon({ size = 28, color = "#f2c14e" }: P) {
  return (
    <svg {...base(size, color)} aria-hidden>
      <rect x="3" y="8" width="18" height="12" rx="2" />
      <path d="M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18" />
    </svg>
  );
}

export function MoneyIcon({ size = 28, color = "#f2c14e" }: P) {
  return (
    <svg {...base(size, color)} aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M14.5 9.2c-.6-.8-1.5-1.2-2.5-1.2-1.4 0-2.5.8-2.5 2s1 1.6 2.5 2 2.5.8 2.5 2-1.1 2-2.5 2c-1 0-1.9-.4-2.5-1.2M12 6v2M12 16v2" />
    </svg>
  );
}

export function LoveIcon({ size = 28, color = "#f2c14e" }: P) {
  return (
    <svg {...base(size, color)} aria-hidden>
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
    </svg>
  );
}

export function StarShape({ filled, size = 20, color = "#f2c14e" }: { filled: boolean; size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z" fill={filled ? color : "none"} stroke={color} strokeWidth="1.6" strokeLinejoin="round" opacity={filled ? 1 : 0.35} />
    </svg>
  );
}

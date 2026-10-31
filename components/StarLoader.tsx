"use client";

import { useEffect, useState } from "react";

const messages = ["กำลังอ่านดวงดาว…", "ไพ่กำลังกระซิบ…", "รอสักครู่ ดวงชะตากำลังเรียงตัว…", "ซอสประจำตัวกำลังมา…"];

// จุดดาวของกลุ่มดาวเชื่อมเส้น (viewBox 120x120)
const stars: [number, number][] = [[20, 80], [42, 40], [70, 56], [94, 22], [100, 90], [60, 100]];
const lines = [[0, 1], [1, 2], [2, 3], [2, 4], [4, 5], [5, 0]];

export function StarLoader({ fullScreen = false }: { fullScreen?: boolean }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % messages.length), 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center gap-6 ${fullScreen ? "fixed inset-0 z-50 bg-background" : "flex-1 py-20"}`}
    >
      <div className="relative h-32 w-32">
        <svg viewBox="0 0 120 120" className="art-spin absolute inset-0 h-full w-full" style={{ transformOrigin: "60px 60px", animationDuration: "14s" }} aria-hidden>
          <circle cx="60" cy="60" r="56" fill="none" stroke="#f2c14e" strokeWidth="0.8" strokeDasharray="2 6" opacity="0.5" />
          {lines.map(([a, b]) => (
            <line key={`${a}-${b}`} x1={stars[a][0]} y1={stars[a][1]} x2={stars[b][0]} y2={stars[b][1]} stroke="#f2c14e" strokeWidth="1" opacity="0.45" />
          ))}
          {stars.map(([x, y], n) => (
            <circle key={n} cx={x} cy={y} r={n % 2 ? 3 : 4} fill="#fff3c4" className="art-twinkle" style={{ animationDelay: `${n * 0.3}s` }} />
          ))}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-3xl text-gold art-twinkle">✦</div>
      </div>
      <p className="text-gold">{messages[i]}</p>
    </div>
  );
}

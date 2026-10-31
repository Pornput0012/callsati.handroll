"use client";

import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import type { Reading } from "@/data/types";
import { Poster, POSTER_H, POSTER_W } from "./Poster";

export function PosterActions({ reading }: { reading: Reading }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const posterRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.25);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(el.clientWidth / POSTER_W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  async function render() {
    await document.fonts.ready;
    // เรนเดอร์ 2 รอบ กันฟอนต์/รูปไม่ทันรอบแรก (พบบ่อยบน Safari)
    await toPng(posterRef.current!, { width: POSTER_W, height: POSTER_H, pixelRatio: 1, style: { transform: "none" } });
    return toPng(posterRef.current!, { width: POSTER_W, height: POSTER_H, pixelRatio: 1, style: { transform: "none" } });
  }

  async function run(action: (dataUrl: string) => Promise<void>) {
    setBusy(true);
    setError("");
    try {
      await action(await render());
    } catch (e) {
      if ((e as Error).name !== "AbortError") setError("สร้างโปสเตอร์ไม่สำเร็จ ลองใหม่อีกครั้ง");
    } finally {
      setBusy(false);
    }
  }

  const filename = `tarot-${reading.card.id}.png`;

  const download = () =>
    run(async (url) => {
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
    });

  const share = () =>
    run(async (url) => {
      const file = new File([await (await fetch(url)).blob()], filename, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file] });
      else {
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
      }
    });

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div ref={boxRef} className="w-full max-w-[280px] overflow-hidden rounded-xl" style={{ aspectRatio: `${POSTER_W}/${POSTER_H}` }}>
        <div style={{ width: POSTER_W, height: POSTER_H, transform: `scale(${scale})`, transformOrigin: "top left" }}>
          <div ref={posterRef}>
            <Poster reading={reading} />
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={share} disabled={busy} className="rounded-full bg-gold px-6 py-2 font-semibold text-background disabled:opacity-50">
          {busy ? "กำลังสร้าง..." : "แชร์ลง IG story"}
        </button>
        <button onClick={download} disabled={busy} className="rounded-full border border-gold px-6 py-2 text-gold disabled:opacity-50">
          ดาวน์โหลด
        </button>
      </div>
      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
    </div>
  );
}

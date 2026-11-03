"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  getSoundServerSnapshot,
  getSoundSnapshot,
  playTap,
  subscribeSound,
  toggleSound,
} from "@/lib/sound";

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // ตรวจสอบและซิงค์สถานะเสียงผ่าน useSyncExternalStore (React 19 / Next.js 16)
  const soundOn = useSyncExternalStore(
    subscribeSound,
    getSoundSnapshot,
    getSoundServerSnapshot,
  );

  // ปิดเมนูเมื่อ pathname เปลี่ยนโดยปรับ state ระหว่าง render (ตาม React guidelines)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  // ปิดเมนูเมื่อกด Escape หรือคลิกพื้นที่ภายนอก
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    function handleClickOutside(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleSoundToggle = () => {
    toggleSound();
  };

  return (
    <nav className="relative z-20 flex items-center justify-between px-4 py-3 text-sm">
      <Link
        href="/"
        onClick={() => playTap()}
        className="font-semibold tracking-wide text-gold transition-colors hover:text-gold/80"
        aria-label="หน้าแรก Handroll Tarot"
      >
        ✦ Handroll Tarot
      </Link>

      <div className="flex items-center gap-2">
        {/* ปุ่มเปิด/ปิดเสียงเอฟเฟกต์ */}
        <button
          type="button"
          onClick={handleSoundToggle}
          aria-label={soundOn ? "ปิดเสียงเอฟเฟกต์" : "เปิดเสียงเอฟเฟกต์"}
          title={soundOn ? "ปิดเสียง" : "เปิดเสียง"}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-foreground/80 transition-colors hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          {soundOn ? (
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
            </svg>
          ) : (
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l4-4m0 0l-4-4m4 4H13" />
            </svg>
          )}
        </button>

        {/* ปุ่มเปิดเมนูมุมจอ */}
        <div className="relative">
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-haspopup="true"
            aria-label={open ? "ปิดเมนู" : "เปิดเมนูหลัก"}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-foreground/90 transition-colors hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <span className="sr-only">เมนู</span>
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                ref={menuRef}
                role="menu"
                aria-label="เมนูนำทาง"
                initial={{ opacity: 0, scale: 0.95, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -8 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl border border-gold/30 bg-background/95 p-2 shadow-2xl shadow-black/80 backdrop-blur-md"
              >
                <div className="flex flex-col gap-1 text-sm">
                  <Link
                    href="/play"
                    role="menuitem"
                    onClick={() => {
                      playTap();
                      setOpen(false);
                    }}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-foreground/90 transition-colors hover:bg-gold/15 hover:text-gold focus-visible:outline-none focus-visible:bg-gold/15 focus-visible:text-gold"
                  >
                    <span className="text-gold">✦</span>
                    <span>เริ่มดูดวง</span>
                  </Link>

                  <Link
                    href="/characters"
                    role="menuitem"
                    onClick={() => {
                      playTap();
                      setOpen(false);
                    }}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-foreground/90 transition-colors hover:bg-gold/15 hover:text-gold focus-visible:outline-none focus-visible:bg-gold/15 focus-visible:text-gold"
                  >
                    <span className="text-gold">👥</span>
                    <span>Character ทั้ง 22 ตัว</span>
                  </Link>

                  <div className="my-1 border-t border-white/10" />

                  <Link
                    href="/"
                    role="menuitem"
                    onClick={() => {
                      playTap();
                      setOpen(false);
                    }}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-foreground/60 transition-colors hover:bg-white/5 hover:text-foreground focus-visible:outline-none focus-visible:bg-white/5"
                  >
                    <span>🏠</span>
                    <span>กลับหน้าแรก</span>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}

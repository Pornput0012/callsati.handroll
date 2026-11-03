"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CardBack } from "./art/CardFace";
import { PickTransition } from "./PickTransition";
import { createShuffledDeck, type ShuffledDeckCard } from "@/data/draw";
import {
  playCardArm,
  playCardDisarm,
  playCardSelect,
  playFanSpread,
  playShuffle,
} from "@/lib/sound";

type Stage = "idle" | "shuffling" | "fanned" | "picking" | "selected";

// Smooth easing curves for luxurious feel
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
const EASE_IN_OUT_CUBIC = [0.65, 0, 0.35, 1] as const;

function subscribeTabletQuery(callback: () => void) {
  const mq = window.matchMedia("(min-width: 768px)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getTabletSnapshot() {
  return window.matchMedia("(min-width: 768px)").matches;
}

function getTabletServerSnapshot() {
  return false;
}

export function DeckShuffleFan() {
  const router = useRouter();
  const reduce = useReducedMotion();

  // ตรวจจับหน้าจอ iPad / Tablet ผ่าน useSyncExternalStore ตาม React standards
  const isTablet = useSyncExternalStore(
    subscribeTabletQuery,
    getTabletSnapshot,
    getTabletServerSnapshot,
  );

  // สำรับไพ่ที่สับลำดับแล้ว (เก็บใน state ฝั่ง client เท่านั้น)
  const [deck, setDeck] = useState<ShuffledDeckCard[]>([]);
  const [stage, setStage] = useState<Stage>("idle");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  // ไพ่ที่แตะ "เล็ง" ไว้แต่ยังไม่ยืนยัน (กันกดผิด: ต้องกดปุ่มยืนยันอีกครั้งก่อนเปิดไพ่)
  const [armedIndex, setArmedIndex] = useState<number | null>(null);

  const confirmBarRef = useRef<HTMLDivElement>(null);
  const stopShuffleSoundRef = useRef<(() => void) | null>(null);
  const shuffleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pickTimerRef = useRef<NodeJS.Timeout | null>(null);

  // ล้าง timer และรีเซ็ตสถานะเมื่อ unmount หรือถูกซ่อนโดย Activity Cache
  useEffect(() => {
    return () => {
      if (shuffleTimerRef.current) clearTimeout(shuffleTimerRef.current);
      if (pickTimerRef.current) clearTimeout(pickTimerRef.current);
      stopShuffleSoundRef.current?.();
      setSelectedIndex(null);
      setArmedIndex(null);
      setStage("idle");
    };
  }, []);

  // เล็งไพ่แล้ว → เลื่อนให้เห็นปุ่มยืนยันเสมอ (จอมือถือเตี้ยอาจตกขอบล่าง)
  useEffect(() => {
    if (armedIndex !== null) confirmBarRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [armedIndex]);

  // เมื่อผู้ใช้เลือกสับไพ่
  const startShuffle = useCallback(() => {
    const newDeck = createShuffledDeck();
    setDeck(newDeck);
    setSelectedIndex(null);
    setHoveredIndex(null);
    setArmedIndex(null);

    if (reduce) {
      setStage("fanned");
      return;
    }

    stopShuffleSoundRef.current = playShuffle();
    setStage("shuffling");
    // แอนิเมชันสับไพ่ที่นุ่มนวลและเป็นจังหวะ ~2.4 วินาที (กดข้ามได้ตลอดเวลา)
    shuffleTimerRef.current = setTimeout(() => {
      setStage("fanned");
      playFanSpread();
    }, 2400);
  }, [reduce]);

  // ฟังก์ชันข้ามไปยังพัดไพ่ทันที
  const skipToFan = useCallback(() => {
    if (shuffleTimerRef.current) clearTimeout(shuffleTimerRef.current);
    stopShuffleSoundRef.current?.(); // กดข้าม → เสียงสับที่ยังไม่เล่นต้องหยุดด้วย
    stopShuffleSoundRef.current = null;
    setStage("fanned");
    playFanSpread();
  }, []);

  // แตะไพ่ในพัด = เล็งไพ่ใบนั้น (ยกขึ้นให้ดู) แตะใบอื่นเพื่อเปลี่ยน แตะใบเดิมซ้ำเพื่อยกเลิก
  const armCard = useCallback(
    (index: number) => {
      if (stage !== "fanned") return;
      if (armedIndex === index) playCardDisarm();
      else playCardArm();
      setArmedIndex((prev) => (prev === index ? null : index));
    },
    [stage, armedIndex],
  );

  // กดยืนยัน → เปิดไพ่ที่เล็งไว้
  const confirmCard = useCallback(() => {
    if (armedIndex === null || selectedIndex !== null || stage !== "fanned") return;
    const target = deck[armedIndex];
    if (!target) return;

    playCardSelect();
    const path = `/reading/${target.card.id}${target.reversed ? "/reversed" : ""}`;
    router.prefetch(path);

    if (reduce) {
      router.push(path);
      return;
    }

    setSelectedIndex(armedIndex);
    setStage("picking");

    // ให้ไพ่ที่เลือกค่อยๆ ลอยเด่นขึ้นมาจากพัดอย่างสง่างาม 700ms ก่อนเข้าสู่ PickTransition เต็มจอ
    pickTimerRef.current = setTimeout(() => {
      setStage("selected");
    }, 700);
  }, [armedIndex, deck, reduce, router, selectedIndex, stage]);

  const selectedCard = useMemo(() => {
    if (selectedIndex === null) return null;
    return deck[selectedIndex] ?? null;
  }, [deck, selectedIndex]);

  const handleTransitionDone = useCallback(() => {
    if (!selectedCard) return;
    const path = `/reading/${selectedCard.card.id}${selectedCard.reversed ? "/reversed" : ""}`;
    router.push(path);
  }, [router, selectedCard]);

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-4 md:py-6 select-none">
      {/* PickTransition แบบเต็มจอเมื่อจังหวะลอยตัวเสร็จสิ้น */}
      <AnimatePresence>
        {stage === "selected" && selectedCard && (
          <PickTransition
            card={selectedCard.card}
            reversed={selectedCard.reversed}
            onDone={handleTransitionDone}
          />
        )}
      </AnimatePresence>

      {/* Header bar: สลับโหมด (ปรับขนาดเหมาะสำหรับ iPad) */}
      <div className="mb-4 md:mb-6 flex w-full max-w-lg md:max-w-2xl items-center justify-between text-xs md:text-sm text-foreground/70">
        <span className="flex items-center gap-1.5 font-medium text-gold/90">
          <span className="inline-block h-2 w-2 rounded-full bg-gold animate-pulse" />
          โหมดจั่วบนเว็บ
        </span>
        <Link
          href="/play"
          className="rounded-full border border-gold/30 bg-gold/5 px-3 py-1 text-gold/90 transition-all hover:border-gold hover:bg-gold/15 hover:text-gold"
        >
          ← เปลี่ยนวิธีดูดวง
        </Link>
      </div>

      {/* คำแนะนำขั้นตอน */}
      <div className="mb-3 md:mb-4 text-center min-h-[72px] flex items-center justify-center">
        {stage === "idle" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            className="flex flex-col items-center gap-1.5"
          >
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              พร้อมเปิดดวงชะตา
            </h1>
            <p className="text-sm md:text-base text-foreground/70 max-w-md">
              ตั้งสมาธิ แล้วแตะสำรับหรือกดปุ่มเพื่อเริ่มสับไพ่
            </p>
          </motion.div>
        )}

        {stage === "shuffling" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="flex items-center gap-2">
              <span className="text-xl md:text-2xl text-gold animate-spin">✦</span>
              <h1 className="text-2xl md:text-3xl font-bold text-gold">
                กำลังสับสำรับ...
              </h1>
            </div>
            <p className="text-xs md:text-sm text-foreground/60">
              แตะที่ใดก็ได้เพื่อข้ามไปเลือกไพ่ทันที
            </p>
          </motion.div>
        )}

        {(stage === "fanned" || stage === "picking") && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            className="flex flex-col items-center gap-1.5"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              เลือกไพ่ของคุณ <span className="text-gold">1 ใบ</span>
            </h1>
            <p className="text-sm md:text-base text-foreground/70">
              {stage === "picking"
                ? "กำลังนำพาพลังงานแห่งไพ่สู่การทำนาย..."
                : "แตะไพ่ใบที่ดึงดูดใจ แล้วกดยืนยันเพื่อเปิดไพ่"}
            </p>
          </motion.div>
        )}
      </div>

      {/* STAGE 0: IDLE (สำรับคว่ำ 1 กอง หนาสง่างาม) */}
      {stage === "idle" && (
        <div className="flex flex-col items-center justify-center gap-8 py-8 md:py-12">
          <motion.button
            type="button"
            onClick={startShuffle}
            whileHover={{ scale: reduce ? 1 : 1.03, y: -6 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 180, damping: 20 }}
            className="group relative h-60 w-40 md:h-72 md:w-48 cursor-pointer focus:outline-none"
            aria-label="แตะเพื่อสับสำรับไพ่"
          >
            {/* เงาเรืองแสงรอบสำรับ */}
            <div className="absolute -inset-4 rounded-3xl bg-gold/15 blur-2xl transition-opacity duration-500 group-hover:opacity-100 opacity-60" />

            {/* เลเยอร์ความหนาของสำรับ 4 ชั้น สวยงาม มิติสมจริง */}
            {[3, 2, 1, 0].map((layer) => (
              <motion.div
                key={layer}
                aria-hidden
                className="absolute inset-0 rounded-2xl"
                style={{
                  transform: `translate(${layer * 2.5}px, ${-layer * 3.5}px)`,
                  zIndex: 10 - layer,
                }}
                animate={
                  reduce
                    ? undefined
                    : {
                        y: [0, -4, 0],
                      }
                }
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: layer * 0.15,
                }}
              >
                <CardBack className="h-full w-full drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)]" />
              </motion.div>
            ))}
          </motion.button>

          <motion.button
            type="button"
            onClick={startShuffle}
            whileHover={{ scale: reduce ? 1 : 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            className="rounded-full bg-gold px-10 py-3.5 text-base md:text-lg font-semibold text-background shadow-[0_0_30px_rgba(242,193,78,0.4)] transition-all hover:shadow-[0_0_45px_rgba(242,193,78,0.6)]"
          >
            สับไพ่
          </motion.button>
        </div>
      )}

      {/* STAGE 1: SHUFFLING (แอนิเมชันสับไพ่ Riffle & Cascade สวยงาม นุ่มนวล) */}
      {stage === "shuffling" && (
        <div
          role="button"
          tabIndex={0}
          onClick={skipToFan}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") skipToFan();
          }}
          className="relative flex h-80 md:h-96 w-full max-w-lg md:max-w-2xl cursor-pointer items-center justify-center overflow-hidden rounded-3xl"
          aria-label="กำลังสับไพ่ แตะเพื่อข้าม"
        >
          {/* แสงประกายกึ่งกลางสำรับตอนสลับไพ่ */}
          <motion.div
            aria-hidden
            className="absolute h-48 w-48 rounded-full bg-gold/25 blur-3xl pointer-events-none"
            animate={{
              scale: [0.8, 1.3, 0.9, 1.4, 1],
              opacity: [0.3, 0.7, 0.4, 0.8, 0.5],
            }}
            transition={{ duration: 2.2, ease: "easeInOut" }}
          />

          {/* ปีกซ้าย: ไพ่ซ้อน 6 ใบ แยกตัวและสลับลงตรงกลาง */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={`riffle-left-${i}`}
              aria-hidden
              className="absolute h-48 w-32 md:h-64 md:w-44"
              style={{
                left: "50%",
                marginLeft: isTablet ? -88 : -64,
              }}
              initial={{ x: 0, rotate: 0, opacity: 1 }}
              animate={{
                // Phase 1: แยกออกซ้าย -> Phase 2: ค่อยๆ ซ้อนสลับตกสู่กลาง -> Phase 3: รวมเป็นกองเดียว
                x: [0, -85 - i * 4, -85 - i * 4, 0],
                rotate: [0, -12 - i * 1.5, -6, 0],
                y: [0, -12 - i * 2, i * 4, 0],
                scale: [1, 0.98, 1, 1],
              }}
              transition={{
                duration: 2.3,
                times: [0, 0.28, 0.65 + i * 0.05, 1],
                ease: EASE_IN_OUT_CUBIC,
                delay: i * 0.04,
              }}
            >
              <CardBack className="h-full w-full drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]" />
            </motion.div>
          ))}

          {/* ปีกขวา: ไพ่ซ้อน 6 ใบ แยกตัวและสลับลงตรงกลาง */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={`riffle-right-${i}`}
              aria-hidden
              className="absolute h-48 w-32 md:h-64 md:w-44"
              style={{
                left: "50%",
                marginLeft: isTablet ? -88 : -64,
              }}
              initial={{ x: 0, rotate: 0, opacity: 1 }}
              animate={{
                // Phase 1: แยกออกขวา -> Phase 2: ค่อยๆ ซ้อนสลับตกสู่กลาง -> Phase 3: รวมเป็นกองเดียว
                x: [0, 85 + i * 4, 85 + i * 4, 0],
                rotate: [0, 12 + i * 1.5, 6, 0],
                y: [0, -12 - i * 2, i * 4, 0],
                scale: [1, 0.98, 1, 1],
              }}
              transition={{
                duration: 2.3,
                times: [0, 0.28, 0.68 + i * 0.05, 1],
                ease: EASE_IN_OUT_CUBIC,
                delay: 0.08 + i * 0.04,
              }}
            >
              <CardBack className="h-full w-full drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]" />
            </motion.div>
          ))}

          {/* ปุ่มข้ามแอนิเมชัน */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              skipToFan();
            }}
            className="absolute bottom-4 rounded-full border border-gold/40 bg-background/85 px-5 py-2 text-xs md:text-sm text-gold backdrop-blur-md transition-all hover:bg-gold/15 hover:border-gold hover:shadow-[0_0_20px_rgba(242,193,78,0.3)]"
          >
            ข้ามแอนิเมชัน ⏭
          </button>
        </div>
      )}

      {/* STAGE 2 & 3: FANNED & PICKING (พัดไพ่ 22 ใบ กว้าง สง่างาม เหมาะกับ iPad) */}
      {(stage === "fanned" || stage === "picking") && (
        <div className="relative flex w-full max-w-xl md:max-w-3xl flex-col items-center pt-0 md:pt-2 pb-6">
          {/* คอนเทนเนอร์แสดงพัดไพ่ (ความสูงปรับตาม iPad เพื่อรองรับการยกขึ้น) */}
          <div
            className="relative flex h-72 sm:h-80 md:h-80 w-full items-end justify-center overflow-visible"
            style={{ perspective: 1200 }}
          >
            {deck.map((_, index) => {
              const offset = index - 10.5; // -10.5 ถึง +10.5

              // คำนวณองศาและความโค้งให้พัดกระจายสวยงาม ไม่ชันเกินไป
              const rotation = offset * 2.85; // เอียงพอเหมาะ นุ่มตา
              const xPos = offset * (isTablet ? 21.5 : 12.5);
              // ความโค้งรูปพัด
              const yCurve = Math.pow(Math.abs(offset), 1.5) * (isTablet ? 2.6 : 2.0);

              const isHovered = hoveredIndex === index && armedIndex === null; // เล็งไพ่อยู่ → ปิด hover กันสับสนว่าใบไหนคือใบที่เลือก
              const isPicked = selectedIndex === index;
              const isArmed = armedIndex === index && selectedIndex === null;
              const hasSomeonePicked = selectedIndex !== null;

              return (
                <motion.button
                  key={`fan-card-${index}`}
                  type="button"
                  onClick={() => armCard(index)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onFocus={() => setHoveredIndex(index)}
                  onBlur={() => setHoveredIndex(null)}
                  disabled={hasSomeonePicked}
                  aria-label={`ไพ่ใบที่ ${index + 1}`}
                  aria-pressed={isArmed}
                  initial={{ opacity: 0, y: 80, scale: 0.8 }}
                  animate={{
                    // เมื่อมีไพ่ถูกเลือก: ใบอื่นค่อยๆ หรี่และเลื่อนลงเบาๆ
                    opacity: isPicked ? 1 : hasSomeonePicked ? 0.35 : 1,
                    x: isPicked ? 0 : xPos,
                    // ความสูง: เมื่อ hover ยกขึ้นนุ่มๆ ตามมุมเดิม / เมื่อ pick ลอยขึ้นสู่กึ่งกลาง
                    y: isPicked ? -110 : isArmed ? yCurve - (isTablet ? 56 : 44) : isHovered ? yCurve - (isTablet ? 48 : 34) : yCurve,
                    // รักษาการเอียงตามองศาพัดไว้ตอน hover ไม่หมุนกระตุกกลับเป็น 0! หมุนกลับ 0 เฉพาะตอนที่ถูกเลือก (pick) ลอยขึ้นตรงกลางเท่านั้น
                    rotate: isPicked ? 0 : isArmed ? rotation * 0.4 : isHovered ? rotation * 0.92 : rotation,
                    // ขนาดขยาย
                    scale: isPicked ? 1.28 : isArmed ? 1.18 : isHovered ? 1.1 : 1,
                    zIndex: isPicked ? 100 : isArmed ? 90 : isHovered ? 60 : index + 10,
                  }}
                  transition={
                    reduce
                      ? { duration: 0.1 }
                      : isPicked
                      ? {
                          duration: 0.65,
                          ease: EASE_OUT_EXPO,
                        }
                      : {
                          opacity: { duration: 0.45, delay: Math.min(index * 0.015, 0.35) },
                          // สปริงที่นุ่มนวล หรูหรา ไม่กระตุกหรือเร็วเกินไป (ตามที่ user ระบุ)
                          y: { type: "spring", stiffness: 140, damping: 18, mass: 0.8 },
                          scale: { type: "spring", stiffness: 160, damping: 19, mass: 0.8 },
                          rotate: { type: "spring", stiffness: 140, damping: 18, mass: 0.8 },
                          x: { type: "spring", stiffness: 140, damping: 18, mass: 0.8 },
                        }
                  }
                  className={`absolute bottom-4 h-40 w-24 sm:h-48 sm:w-32 md:h-60 md:w-36 origin-bottom cursor-pointer rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold transition-shadow duration-300 ${
                    hasSomeonePicked && !isPicked ? "pointer-events-none" : ""
                  }`}
                  style={{
                    left: "50%",
                    marginLeft: isTablet ? -72 : -48,
                    touchAction: "manipulation",
                  }}
                >
                  <CardBack
                    className={`h-full w-full rounded-xl transition-all duration-300 ${
                      isPicked || isArmed
                        ? "drop-shadow-[0_16px_36px_rgba(242,193,78,0.7)] ring-2 ring-gold"
                        : isHovered
                        ? "drop-shadow-[0_12px_28px_rgba(242,193,78,0.45)] ring-1 ring-gold/60"
                        : "drop-shadow-[0_4px_14px_rgba(0,0,0,0.65)]"
                    }`}
                  />
                </motion.button>
              );
            })}
          </div>

          {/* แถบยืนยัน: กันกดผิด ไพ่จะไม่เปิดจนกว่าจะกดยืนยัน (สูงคงที่ กัน layout กระโดด) */}
          <div ref={confirmBarRef} className="mt-14 flex min-h-[104px] w-full flex-col items-center justify-start gap-3" aria-live="polite">
            {stage === "picking" ? (
              <p className="text-xs text-foreground/50 tracking-wide md:text-sm">✨ กำลังเปิดเผยชะตาของคุณ...</p>
            ) : armedIndex === null ? (
              <p className="text-xs text-foreground/50 tracking-wide md:text-sm">
                แตะไพ่เพื่อเล็งก่อน ยังไม่เปิดจนกว่าจะกดยืนยัน
              </p>
            ) : (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
                className="flex flex-col items-center gap-3"
              >
                <p className="text-sm text-foreground/80">
                  เลือกไพ่ใบที่ <span className="font-semibold text-gold">{armedIndex + 1}</span> ใช่ไหม?
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      playCardDisarm();
                      setArmedIndex(null);
                    }}
                    className="min-h-11 rounded-full border border-gold/40 px-6 text-sm text-gold transition-colors hover:bg-gold/10"
                  >
                    เลือกใหม่
                  </button>
                  <button
                    type="button"
                    onClick={confirmCard}
                    className="min-h-11 rounded-full bg-gold px-8 text-sm font-semibold text-background shadow-[0_0_24px_rgba(242,193,78,0.4)]"
                  >
                    ยืนยัน เปิดไพ่
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

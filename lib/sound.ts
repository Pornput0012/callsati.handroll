"use client";

// Web Audio API synthesizer สำหรับเสียงเอฟเฟกต์ในเว็บดูดวง
// สังเคราะห์สดทั้งหมด ไม่ต้องมีไฟล์เสียง โหลดทันที และทำงานบน iPad / iOS Safari ได้

const STORAGE_KEY = "handroll_sound_enabled";

let audioCtx: AudioContext | null = null;
let master: GainNode | null = null;
let echoSend: GainNode | null = null;
let noiseBuffer: AudioBuffer | null = null;
let soundEnabled = true;
const soundListeners = new Set<() => void>();

// อ่านสถานะเสียงจาก localStorage (Safari โหมดส่วนตัวอาจ throw จึงครอบ try/catch)
if (typeof window !== "undefined") {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) soundEnabled = saved === "true";
  } catch {
    /* ใช้ค่าเริ่มต้น */
  }
}

export function subscribeSound(callback: () => void): () => void {
  soundListeners.add(callback);
  return () => {
    soundListeners.delete(callback);
  };
}

export function getSoundSnapshot(): boolean {
  return soundEnabled;
}

export function getSoundServerSnapshot(): boolean {
  return true;
}

/**
 * ดึงหรือสร้าง AudioContext (ต้องเรียกจาก user gesture เพื่อผ่าน autoplay policy ของ iOS)
 * พร้อมต่อสายหลัก: เสียง → master gain → compressor → ลำโพง
 * และ echo bus เบาๆ ไว้ให้เสียงกระดิ่งมีหางเสียง
 */
export function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;

  if (!audioCtx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    audioCtx = new Ctor();

    // compressor กันเสียงแตกเวลาหลายเสียงซ้อนกัน (เช่น ไพ่สับ + กระดิ่ง)
    const comp = audioCtx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.knee.value = 24;
    comp.ratio.value = 4;
    comp.attack.value = 0.003;
    comp.release.value = 0.2;
    comp.connect(audioCtx.destination);

    master = audioCtx.createGain();
    master.gain.value = 0.85;
    master.connect(comp);

    // echo: delay + feedback + low-pass ให้หางเสียงนุ่ม
    const delay = audioCtx.createDelay(0.5);
    delay.delayTime.value = 0.19;
    const fb = audioCtx.createGain();
    fb.gain.value = 0.32;
    const lp = audioCtx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 3200;
    echoSend = audioCtx.createGain();
    echoSend.gain.value = 1;
    echoSend.connect(delay);
    delay.connect(lp);
    lp.connect(fb);
    fb.connect(delay);
    lp.connect(master);

    // พักเสียงเมื่อสลับแท็บ/ล็อกจอ กันเสียงค้าง
    document.addEventListener("visibilitychange", () => {
      if (!audioCtx) return;
      if (document.hidden) audioCtx.suspend();
      else if (soundEnabled) audioCtx.resume();
    });
  }

  if (audioCtx.state === "suspended" && !document.hidden) audioCtx.resume();
  return audioCtx;
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
  try {
    localStorage.setItem(STORAGE_KEY, String(enabled));
  } catch {
    /* เก็บค่าไม่ได้ก็ใช้ในหน่วยความจำต่อ */
  }
  soundListeners.forEach((fn) => fn());
}

export function toggleSound(): boolean {
  const next = !soundEnabled;
  setSoundEnabled(next);
  if (next) playTap();
  return next;
}

// ---------- ตัวช่วย ----------

// นอยส์ขาว 1 วินาที สร้างครั้งเดียวแล้วใช้ซ้ำ (เดิมสร้างบัฟเฟอร์ใหม่ทุกครั้งที่ไพ่กระทบกัน)
function getNoise(ctx: AudioContext): AudioBuffer {
  if (!noiseBuffer || noiseBuffer.sampleRate !== ctx.sampleRate) {
    const size = Math.floor(ctx.sampleRate);
    noiseBuffer = ctx.createBuffer(1, size, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1;
  }
  return noiseBuffer;
}

type Out = AudioNode;
const dest = (): Out => master as GainNode;

// envelope: ไต่ขึ้นเร็ว (attack) แล้วไหลลงแบบ exponential ไม่เริ่มที่ค่าเต็มทันที จึงไม่เกิดเสียง "แป๊ก"
function envelope(g: GainNode, t: number, peak: number, attack: number, release: number) {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + release);
}

function pan(ctx: AudioContext, value: number): AudioNode | null {
  if (!ctx.createStereoPanner) return null;
  const p = ctx.createStereoPanner();
  p.pan.value = value;
  return p;
}

interface NoiseOpts {
  t: number;
  dur: number;
  peak: number;
  filter: BiquadFilterType;
  freq: number;
  freqEnd?: number;
  q?: number;
  attack?: number;
  panValue?: number;
  out?: Out;
}

// เสียงนอยส์ผ่านฟิลเตอร์ + envelope = เสียงสัมผัสกระดาษไพ่
function noiseBurst(ctx: AudioContext, o: NoiseOpts) {
  const src = ctx.createBufferSource();
  src.buffer = getNoise(ctx);
  const f = ctx.createBiquadFilter();
  f.type = o.filter;
  f.frequency.setValueAtTime(o.freq, o.t);
  if (o.freqEnd) f.frequency.exponentialRampToValueAtTime(o.freqEnd, o.t + o.dur);
  f.Q.value = o.q ?? 1;
  const g = ctx.createGain();
  envelope(g, o.t, o.peak, o.attack ?? 0.004, Math.max(o.dur - (o.attack ?? 0.004), 0.01));

  src.connect(f);
  f.connect(g);
  const p = o.panValue ? pan(ctx, o.panValue) : null;
  if (p) {
    g.connect(p);
    p.connect(o.out ?? dest());
  } else {
    g.connect(o.out ?? dest());
  }
  src.start(o.t, Math.random() * 0.8); // เริ่มจากจุดสุ่มในบัฟเฟอร์ ให้แต่ละครั้งไม่ซ้ำกัน
  src.stop(o.t + o.dur + 0.02);
}

interface ToneOpts {
  t: number;
  freq: number;
  dur: number;
  peak: number;
  type?: OscillatorType;
  freqEnd?: number;
  attack?: number;
  echo?: number; // ส่งเข้า echo bus กี่ส่วน (0–1)
  out?: Out;
}

function tone(ctx: AudioContext, o: ToneOpts) {
  const osc = ctx.createOscillator();
  osc.type = o.type ?? "sine";
  osc.frequency.setValueAtTime(o.freq, o.t);
  if (o.freqEnd) osc.frequency.exponentialRampToValueAtTime(o.freqEnd, o.t + o.dur);
  const g = ctx.createGain();
  const attack = o.attack ?? 0.006;
  envelope(g, o.t, o.peak, attack, Math.max(o.dur - attack, 0.01));
  osc.connect(g);
  g.connect(o.out ?? dest());
  if (o.echo && echoSend) {
    const send = ctx.createGain();
    send.gain.value = o.echo;
    g.connect(send);
    send.connect(echoSend);
  }
  osc.start(o.t);
  osc.stop(o.t + o.dur + 0.05);
}

// ---------- เสียงทั่วไป ----------

/** กดปุ่มทั่วไป (เสียงไม้เบาๆ) */
export function playTap(): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  tone(ctx, { t, freq: 340, freqEnd: 120, dur: 0.07, peak: 0.16, attack: 0.003 });
  noiseBurst(ctx, { t, dur: 0.025, peak: 0.03, filter: "highpass", freq: 2200 });
}

/**
 * เสียงสับไพ่ ออกแบบให้ตรงกับแอนิเมชัน ~2.3 วินาที
 *  0.00–0.55  แยกสำรับเป็นสองฝั่ง (เสียงกรีดเบาๆ)
 *  0.55–1.85  riffle ไพ่ตกสลับซ้าย/ขวา เร่งขึ้นเรื่อยๆ
 *  ~2.15      รวมกองกระแทกเบาๆ
 * คืนฟังก์ชันยกเลิก (ใช้ตอนผู้ใช้กดข้าม) จะ fade เสียงที่ยังไม่เล่นทิ้งใน 60ms
 */
export function playShuffle(): () => void {
  if (!soundEnabled) return () => {};
  const ctx = getAudioContext();
  if (!ctx) return () => {};

  const t0 = ctx.currentTime + 0.02;
  const bus = ctx.createGain();
  bus.gain.value = 1;
  bus.connect(dest());

  // แยกสำรับ
  noiseBurst(ctx, { t: t0, dur: 0.5, peak: 0.07, filter: "bandpass", freq: 500, freqEnd: 1600, q: 1.5, attack: 0.12, out: bus });

  // riffle: ช่วงห่างระหว่างครั้งสั้นลงเรื่อยๆ (เร่งความเร็ว) สลับหูซ้าย/ขวา
  const hits = 22;
  const start = 0.55;
  const span = 1.3;
  for (let i = 0; i < hits; i++) {
    const p = i / (hits - 1);
    const at = t0 + start + Math.pow(p, 0.85) * span;
    const side = i % 2 ? 0.45 : -0.45;
    const vol = 0.07 + Math.random() * 0.04;
    noiseBurst(ctx, {
      t: at,
      dur: 0.04,
      peak: vol,
      filter: "bandpass",
      freq: 900 + Math.random() * 1100,
      q: 2.5,
      panValue: side,
      out: bus,
    });
    // "ติ๊ก" เล็กๆ ของมุมไพ่ ให้ได้เสียงกระดาษแข็ง ไม่ใช่แค่ฟู่
    if (i % 3 === 0) tone(ctx, { t: at, freq: 1800 + Math.random() * 600, dur: 0.018, peak: 0.02, type: "triangle", attack: 0.002, out: bus });
  }

  // รวมกอง
  const g = t0 + 2.12;
  tone(ctx, { t: g, freq: 170, freqEnd: 58, dur: 0.14, peak: 0.2, type: "triangle", attack: 0.004, out: bus });
  noiseBurst(ctx, { t: g, dur: 0.08, peak: 0.07, filter: "lowpass", freq: 900, out: bus });

  return () => {
    const now = ctx.currentTime;
    bus.gain.cancelScheduledValues(now);
    bus.gain.setValueAtTime(bus.gain.value, now);
    bus.gain.linearRampToValueAtTime(0, now + 0.06);
    setTimeout(() => bus.disconnect(), 120);
  };
}

/** แผ่พัดไพ่ (เสียงกรีดกระจายออกเป็นพัด) */
export function playFanSpread(): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  noiseBurst(ctx, { t, dur: 0.55, peak: 0.11, filter: "bandpass", freq: 600, freqEnd: 2400, q: 2, attack: 0.15 });
  // ไพ่ใบสุดท้ายตกเข้าที่
  tone(ctx, { t: t + 0.5, freq: 220, freqEnd: 110, dur: 0.07, peak: 0.07, type: "triangle", attack: 0.003 });
}

let lastHover = 0;
/** เลื่อนผ่านไพ่ (จำกัดไม่ให้ถี่เกิน 70ms กันรัวเวลาลากนิ้วผ่านพัด) */
export function playCardHover(): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  if (t - lastHover < 0.07) return;
  lastHover = t;
  noiseBurst(ctx, { t, dur: 0.025, peak: 0.035, filter: "highpass", freq: 1500 });
}

/** แตะเล็งไพ่ในพัด: ไพ่ยกขึ้น + กระดิ่งเบามาก */
export function playCardArm(): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  noiseBurst(ctx, { t, dur: 0.1, peak: 0.1, filter: "bandpass", freq: 1500, freqEnd: 2600, q: 2, attack: 0.02 });
  tone(ctx, { t: t + 0.03, freq: 880, dur: 0.35, peak: 0.035, echo: 0.4 });
}

/** ยกเลิกการเล็ง / เลือกใหม่: เสียงสั้นต่ำลง */
export function playCardDisarm(): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  noiseBurst(ctx, { t, dur: 0.08, peak: 0.07, filter: "bandpass", freq: 2200, freqEnd: 900, q: 2, attack: 0.01 });
}

/** ยืนยันเลือกไพ่: ไพ่ถูกดึงออก + กระดิ่งเวทมนตร์สองโน้ตขึ้น */
export function playCardSelect(): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  noiseBurst(ctx, { t, dur: 0.12, peak: 0.13, filter: "bandpass", freq: 1400, freqEnd: 2400, q: 2.5, attack: 0.015 });
  tone(ctx, { t: t + 0.02, freq: 587.33, dur: 0.55, peak: 0.07, echo: 0.5 }); // D5
  tone(ctx, { t: t + 0.12, freq: 880, dur: 0.7, peak: 0.06, echo: 0.5 }); // A5
}

/** ก้าวเท้าของ The Fool ตอนเดินโหลด สลับเสียงสูง/ต่ำเล็กน้อยให้เหมือนก้าวซ้ายขวา */
let stepFlip = false;
export function playFootstep(): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  stepFlip = !stepFlip;
  tone(ctx, { t, freq: stepFlip ? 150 : 128, freqEnd: 70, dur: 0.09, peak: 0.07, attack: 0.004 });
  noiseBurst(ctx, { t, dur: 0.05, peak: 0.025, filter: "lowpass", freq: 1200, panValue: stepFlip ? 0.15 : -0.15 });
}

/** พลิกหน้าไพ่ (swish) ยาวพอดีกับช่วงที่ไพ่หมุนผ่านขอบ */
export function playCardFlip(): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  const d = 0.38;
  noiseBurst(ctx, { t, dur: d, peak: 0.17, filter: "bandpass", freq: 450, freqEnd: 2600, q: 2, attack: 0.12 });
  // ไพ่แตะพื้นผิวตอนพลิกเสร็จ
  tone(ctx, { t: t + d - 0.02, freq: 190, freqEnd: 90, dur: 0.08, peak: 0.07, type: "triangle", attack: 0.003 });
}

/**
 * กระดิ่งเวทมนตร์ตอนไพ่เผยหน้า: โน้ตเพนทาโทนิกไล่ขึ้น
 * แต่ละโน้ตมีโอเวอร์โทน (x2 เบาๆ) และส่งเข้า echo ให้มีหางเสียง
 */
export function playSparkleReveal(): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  const notes = [587.33, 739.99, 880.0, 1108.73, 1318.51]; // D5 F#5 A5 C#6 E6
  notes.forEach((freq, i) => {
    const at = t + i * 0.09;
    const peak = 0.07 - i * 0.004;
    tone(ctx, { t: at, freq, dur: 0.9, peak, echo: 0.55 });
    tone(ctx, { t: at, freq: freq * 2, dur: 0.5, peak: peak * 0.3, echo: 0.55 });
  });
  // พื้นเสียงนุ่มต่ำให้เสียงกระดิ่งมีน้ำหนัก
  tone(ctx, { t, freq: 293.66, dur: 1.4, peak: 0.04, attack: 0.08 });
}

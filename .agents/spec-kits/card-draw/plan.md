# Plan: แผนสถาปัตยกรรมและการพัฒนาโหมดจั่วไพ่บนเว็บ
(Technical Architecture & Implementation Blueprint)

- **Feature**: โหมดจั่วไพ่บนเว็บ + ปรับปรุงระบบนำทาง
- **Status**: Ready for Execution
- **Target Spec**: [`.agents/spec-kits/card-draw/spec.md`](./spec.md)

---

## 1. ภาพรวมสถาปัตยกรรม (System Architecture)

```
[ User Flow ]

Landing (/)
    │  (คลิก "เริ่ม")
    ▼
Mode Select (/play)
   ├───▶ จั่วบนเว็บ (/draw) ──▶ สับไพ่ (<=1.5s) ──▶ พัดไพ่ 22 ใบ ──▶ แตะเลือก 1 ใบ ──┐
   │                                                                               │
   └───▶ ไพ่จริง (/pick) ──────▶ ค้นหา / เลือกไพ่ 22 ใบ (เดิม) ───────────────────────┤
                                                                                   │
                                                                                   ▼
                                                                     PickTransition (เดิม)
                                                                                   │
                                                                                   ▼
                                                                     Reading Page (/reading/...)
                                                                       - แชร์ / ดาวน์โหลด
                                                                       - เล่นใหม่ (กลับไป /play)
```

---

## 2. การเปลี่ยนแปลงโครงสร้างไฟล์ (File Structure Map)

| ไฟล์ | สถานะ | หน้าที่ความรับผิดชอบ |
|---|---|---|
| `data/draw.ts` | **สร้างใหม่** | Pure domain logic: ค่าคงที่อัตราสุ่มกลับหัว 30%, ฟังก์ชันสับไพ่ Fisher–Yates, ฟังก์ชันเตรียมสำรับ |
| `data/draw.test.ts` | **สร้างใหม่** | Vitest unit tests: ทดสอบความถูกต้องของการสับไพ่ 22 ใบ, อัตรากลับหัว, และการ inject RNG |
| `app/play/page.tsx` | **สร้างใหม่** | หน้าเลือกโหมด (จั่วบนเว็บ vs ไพ่จริง) |
| `app/draw/page.tsx` | **สร้างใหม่** | Route สำหรับโหมดจั่วไพ่บนเว็บ |
| `components/DeckShuffleFan.tsx` | **สร้างใหม่** | คอมโพเนนต์หลักของโหมดจั่วไพ่: สำรับคว่ำ, แอนิเมชันสับไพ่ Riffle, พัดไพ่ 22 ใบ, และการเชื่อมต่อ `PickTransition` |
| `components/Hero.tsx` | **แก้ไข** | ปรับปุ่ม Landing ให้เหลือปุ่ม "เริ่ม" เพียงปุ่มเดียว ชี้ไปที่ `/play` |
| `components/SiteNav.tsx` | **แก้ไข** | ตัดลิงก์ `/pick` ออก, ย้ายลิงก์ `/characters` เข้าสู่ Dropdown/Corner Menu ที่เข้าถึงง่าย |
| `components/CardGrid.tsx` | **แก้ไข** | เพิ่มลิงก์เปลี่ยนโหมด ("เปลี่ยนโหมด" -> `/play`) ด้านบนของกริดไพ่จริง |
| `components/ReadingView.tsx` | **แก้ไข** | ปรับปุ่ม "เลือกไพ่ใหม่" ให้เป็น "เล่นใหม่" ชี้ไปยัง `/play` |
| `AGENTS.md` / `CLAUDE.md` | **แก้ไข** | ปรับปรุงเอกสารบริบท อัปเดต User Flow 2 โหมด และเส้นทางใหม่ |

---

## 3. รายละเอียดการออกแบบเชิงเทคนิค (Detailed Technical Design)

### 3.1 Domain Layer (`data/draw.ts`)
- **Constants**:
  ```ts
  export const REVERSED_PROBABILITY = 0.3; // 30% chance according to shop owner spec
  ```
- **Type Definitions**:
  ```ts
  export interface ShuffledDeckCard {
    card: TarotCard;
    reversed: boolean;
  }
  ```
- **Pure Functions**:
  - `createShuffledDeck(cards: TarotCard[], rng?: () => number): ShuffledDeckCard[]`
    - นำไพ่ 22 ใบมา clone แล้วสับด้วย Fisher–Yates algorithm
    - แต่ละใบคำนวณ `reversed: rng() < REVERSED_PROBABILITY`
    - รองรับการส่ง `rng` เข้ามาเพื่อให้ unit test ทำงานแบบ deterministic ได้

### 3.2 Component: `DeckShuffleFan.tsx`
- **State Machine**:
  ```
  [IDLE] ──(กดสับสำรับ)──▶ [SHUFFLING] ──(จบลูป <=1.5s หรือกดข้าม)──▶ [FANNED] ──(แตะไพ่)──▶ [SELECTED / PickTransition]
  ```
- **Performance & Constraints**:
  - ช่วง `SHUFFLING`: ใช้ div หลอกจำนวน 8–10 ใบ สลับซ้าย-ขวา (Riffle) โดยขยับเฉพาะ `transform: translateX/translateY/rotate` และ `opacity`
  - กดที่หน้าจอที่ใดก็ได้ หรือกดปุ่ม "ข้าม" -> กระโดดไปที่ state `FANNED` ทันที
  - ผู้ใช้ที่มี `prefers-reduced-motion` -> เริ่มต้นที่ `FANNED` ทันที
- **Fan Layout (พัด 22 ใบ)**:
  - ใช้สูตรการกระจายมุม: แต่ละใบมี `angle = (index - 10.5) * stepAngle` (ปรับ `stepAngle` ตามขนาดจอ เช่น จอมือถือ 3.5°–4.5°)
  - กราฟิกหลังไพ่: ใช้ `<CardBack />` จาก `components/art/CardFace.tsx`
  - DOM Hygiene: DOM attribute มีเพียง `aria-label={`ไพ่ใบที่ ${index + 1}`}`, `tabIndex={0}`, และ `key={`fan-card-${index}`}` **ไม่มีการเปิดเผย cardId หรือชื่อไพ่ใดๆ**
- **Next.js 16 Activity & Cache**:
  - ติดตั้ง listener หรือ reset hook เมื่อ component mount หรือกลับมาจากการนำทาง เพื่อให้สำรับถูกรีเซ็ตเป็นกองใหม่เสมอ

### 3.3 Site Navigation & Mobile Menu (`SiteNav.tsx`)
- โลโก้แบรนด์ชี้ไปที่ `/`
- มุมขวามีปุ่มเมนู (เช่น ไอคอน ☰ หรือ ✦ เมนู)
- เมื่อกดเปิด: แสดงแผงเมนูลอยแบบเบา (Lightweight dropdown/modal) ที่มีลิงก์ไปยัง:
  - "ดู Character ทั้ง 22 ตัว" (`/characters`)
  - "เกี่ยวกับร้าน Handroll Tarot" / ลิงก์หน้าแรก
- มีปุ่มปิดชัดเจน รองรับการกด Esc และแตะพื้นที่รอบนอกเพื่อปิด

---

## 4. กลยุทธ์การทดสอบและเกณฑ์คุณภาพ (Testing Strategy)

1. **Unit Testing (`data/draw.test.ts`)**:
   - ตรวจสอบว่า `createShuffledDeck` คืนค่าครบ 22 ใบพอดี และไม่มีไพ่ใบใดซ้ำกัน
   - ตรวจสอบการกระจายตัวของ Fisher–Yates ด้วย mock RNG
   - ตรวจสอบอัตราสุ่มกลับหัว (Reversed rate) ในการทดลองสุ่มขนาดใหญ่ (เช่น 1,000 ครั้ง) ให้อยู่ในช่วง 30% ± 5%
2. **Regression Testing**:
   - รันเทสต์เดิมทั้งหมดใน `data/reading.test.ts` เพื่อให้มั่นใจว่า logic เดิมไม่ถูกกระทบ
3. **Lint & Type Check**:
   - รัน `npm run lint` ตรวจสอบข้อผิดพลาดของ TypeScript และ ESLint
4. **Manual & Interactive Inspection**:
   - ทดสอบเปิดใน Responsive Mode (375px, 414px, 768px, Desktop)
   - ตรวจสอบการกดข้ามแอนิเมชัน และการสุ่มได้ทั้งไพ่ตรงและไพ่กลับหัวจริง


# Tasks: รายการงานสำหรับการพัฒนาโหมดจั่วไพ่บนเว็บ
(Implementation Task Checklist)

- **Feature**: โหมดจั่วไพ่บนเว็บ + จัดระเบียบปุ่มนำทาง
- **Spec**: [`.agents/spec-kits/card-draw/spec.md`](./spec.md)
- **Plan**: [`.agents/spec-kits/card-draw/plan.md`](./plan.md)

---

## Phase 1: Pure Domain Layer & Unit Tests (TDD)

- [x] **Task 1.1**: สร้างไฟล์ `data/draw.ts`
  - กำหนดค่าคงที่ `REVERSED_PROBABILITY = 0.3`
  - สร้าง type `ShuffledDeckCard`
  - พัฒนาฟังก์ชัน `createShuffledDeck(cards: TarotCard[], rng?: () => number)` โดยใช้ Fisher–Yates Shuffle
  - รองรับการสุ่มท่ากลับหัว (30%) อัตโนมัติ
- [x] **Task 1.2**: สร้างไฟล์เทสต์ `data/draw.test.ts`
  - เทสต์ความครบถ้วน 22 ใบ ไม่ซ้ำ และครอบคลุม Major Arcana
  - เทสต์การทำงานของ Fisher–Yates ด้วย Deterministic Mock RNG
  - เทสต์อัตราสุ่มกลับหัว 30% ทางสถิติ
  - เทสต์กรณี edge cases (เช่น สำรับว่างเปล่า)
- [x] **Task 1.3**: รัน Vitest ตรวจสอบผลการทดสอบ
  - คำสั่ง: `npm test -- data/draw.test.ts`
  - เกณฑ์: ผ่าน 100% (5/5 tests passed)

---

## Phase 2: Mode Selection (`/play`) & Button Cleanup

- [x] **Task 2.1**: สร้างหน้าเลือกโหมด `app/play/page.tsx` และ `app/play/layout.tsx`
  - มีการ์ด/ปุ่มตัวเลือก 2 โหมด:
    1. "จั่วบนเว็บ" (ชี้ไปที่ `/draw`)
    2. "เลือกไพ่ที่จั่วจริง" (ชี้ไปที่ `/pick`)
  - ออกแบบเป็นมิตรกับมือถือ มีคำอธิบายสั้นๆ ชัดเจน
- [x] **Task 2.2**: ปรับหน้า Landing `components/Hero.tsx`
  - ปรับปุ่มหลักให้เหลือปุ่ม "เริ่ม" เพียงปุ่มเดียว (ชี้ไปที่ `/play`)
  - ตัดปุ่ม "ดู character ทั้ง 22 ตัว" ออกจากหน้าแรก
- [x] **Task 2.3**: ปรับหน้าไพ่จริง `components/CardGrid.tsx`
  - เพิ่มลิงก์ "เปลี่ยนโหมด" เล็กๆ ด้านบน พาผู้ใช้กลับไปที่ `/play`
- [x] **Task 2.4**: ปรับหน้าคำทำนาย `components/ReadingView.tsx`
  - เปลี่ยนลิงก์ "เลือกไพ่ใหม่" เป็นปุ่ม/ลิงก์ "เล่นใหม่" พาผู้ใช้กลับไปที่ `/play`
  - จัด layout ให้มี 2 ปุ่มหลักคือ "แชร์/ดาวน์โหลด" และ "เล่นใหม่"

---

## Phase 3: Site Navigation Redesign (`components/SiteNav.tsx`)

- [x] **Task 3.1**: ปรับแต่ง `components/SiteNav.tsx`
  - โลโก้ "✦ Handroll Tarot" คลิกแล้วกลับหน้าแรก `/`
  - ลบลิงก์ซ้ำ "เลือกไพ่" (`/pick`) ออกจาก Navbar
  - ทำปุ่มเมนูมุมขวาบน (Hamburger / Menu button) พร้อม dropdown สำหรับหน้า "ดู Character ทั้ง 22 ตัว" (`/characters`)
  - รองรับ accessibility (focus-visible, aria-expanded, aria-label, กด Esc เพื่อปิด)
  - รองรับการใช้งานมือเดียวบนสมาร์ทโฟน

---

## Phase 4: Web Card Draw Feature & Shuffle Animation (`/draw`)

- [x] **Task 4.1**: พัฒนาคอมโพเนนต์ `components/DeckShuffleFan.tsx`
  - รองรับ 4 สถานะ: `IDLE` (กองสำรับพร้อมสับ) -> `SHUFFLING` (แอนิเมชันสับ) -> `FANNED` (พัดไพ่ 22 ใบ) -> `SELECTED` (เรียก `PickTransition`)
  - มีปุ่ม/พื้นที่ให้แตะเพื่อเริ่มสับสำรับ
- [x] **Task 4.2**: สร้างแอนิเมชันสับสำรับ (Riffle & Gather)
  - แอนิเมชันแยกกอง ซ้อนไพ่ 8-10 ใบ และรวมกอง ด้วย Framer Motion
  - ควบคุมเวลาให้รวมไม่เกิน 1.4 วินาที (<= 1.5 วินาที)
  - แตะที่ใดก็ได้หรือกดปุ่ม "ข้าม" เพื่อข้ามไปยังพัดไพ่ทันที
  - รองรับ `prefers-reduced-motion` โดยข้ามไปที่พัดไพ่ทันที
- [x] **Task 4.3**: สร้างพัดไพ่ 22 ใบ (Interactive Fan)
  - วางไพ่คว่ำ 22 ใบกระจายเป็นพัดโค้งสวยงาม รองรับขนาดหน้าจอมือถือ
  - ไพ่แต่ละใบยกตัวขึ้นเมื่อ hover หรือ active
  - รองรับ keyboard focus (`tabIndex={0}`) และ `aria-label="ไพ่ใบที่ N"`
  - ป้องกันการเปิดเผย `cardId` หรือชื่อไพ่ใน DOM attributes
- [x] **Task 4.4**: เชื่อมต่อกับการเปิดไพ่ (`PickTransition`)
  - เมื่อผู้ใช้แตะไพ่ 1 ใบ ส่งผลลัพธ์ไพ่และท่ากลับหัวเข้าสู่ `PickTransition` เดิม
  - ล็อกไม่ให้กดซ้ำระหว่างแสดง `PickTransition`
  - นำทางไปยัง `/reading/[cardId]` (หรือ `/reversed`) เมื่อแอนิเมชันจบ
- [x] **Task 4.5**: จัดการ Next.js 16 Activity / Cache Reset
  - เมื่อกลับมาหน้านี้ (จากปุ่ม Back หรือ Activity Cache) ให้สำรับถูกรีเซ็ตเป็นกองใหม่ที่ยังไม่ได้สับ
- [x] **Task 4.6**: สร้าง Route `app/draw/page.tsx`
  - เรียกใช้ `DeckShuffleFan` พร้อมกำหนด Metadata และ Page Container

---

## Phase 5: Documentation & Project Rules Update

- [x] **Task 5.1**: อัปเดต `AGENTS.md`
  - เพิ่มเส้นทาง `/play` และ `/draw` ในหัวข้อ User Flow และ Architecture
  - ปรับคำอธิบายเรื่องการสุ่มไพ่: "โหมดไพ่จริงเว็บไม่สุ่ม ส่วนโหมดจั่วบนเว็บเว็บเป็นผู้สุ่มไพ่"
- [x] **Task 5.2**: อัปเดต `CLAUDE.md` (ตรวจสอบว่า route ไปที่ `AGENTS.md` อย่างสมบูรณ์)

---

## Phase 6: End-to-End Verification & Quality Gates

- [x] **Task 6.1**: รันชุดทดสอบทั้งหมด
  - คำสั่ง: `npm test`
  - เกณฑ์: ผ่านทุกไฟล์รวมถึง `data/reading.test.ts` และ `data/draw.test.ts` (9/9 passed)
- [x] **Task 6.2**: รัน Linter ตรวจสอบโค้ด
  - คำสั่ง: `npm run lint`
  - เกณฑ์: ESLint ผ่าน 0 errors, 0 warnings
- [x] **Task 6.3**: ตรวจสอบ Acceptance Criteria ครบทั้ง 10 ข้อ
  - ตรวจสอบความถูกต้องของ UI ทุกหน้าบน Responsive View

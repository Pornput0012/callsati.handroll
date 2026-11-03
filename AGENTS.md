<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project Commands

- `npm run dev` - start the Next.js development server.
- `npm run build` - create a production build.
- `npm run start` - serve the production build.
- `npm run lint` - run ESLint.
- `npm test` - run the Vitest suite once.
- `npm test -- data/reading.test.ts` - run the data/reading tests only.
- `npm test -- data/reading.test.ts -t "getReading"` - run one Vitest test group by name.

## Workflows & Slash Commands

Existing project-specific workflows are documented in `.claude/commands/`:
- `/add-character` - เพิ่ม character ใหม่ลง `data/characters.ts` และหน้าแนะนำ character
- `/add-sauce` - เพิ่มหรือแก้ซอสและการจับคู่ไพ่→ซอสใน `data/sauces.ts`
- `/add-animation` - เพิ่มหรือปรับแอนิเมชันด้วย Framer Motion
- `/check-poster` - ตรวจสอบความถูกต้องและ safe zone ของโปสเตอร์ IG Story (1080×1920)

---

## ภาพรวม & กิมมิคของร้าน (Overview & Business Concept)

เว็บดูดวงไพ่ทาโร่ต์ร้านแฮนโรล (Callsati Handroll Tarot Reading):
- ร้านขายแฮนโรลที่มีกิมมิคเปิดไพ่ทาโร่ต์ให้ลูกค้า:
  - ได้ **ไพ่ดี** → ได้ซอส **รสตรงข้าม** (จัด/เผ็ด) เพื่อเตือนสติไม่ให้ประมาท
  - ได้ **ไพ่แย่** → ได้ซอส **รสดีปลอบประโลม** (หวาน/นุ่ม)
- **วัตถุประสงค์**: รองรับการใช้งาน 2 โหมด:
  1. **โหมดไพ่จริง (`/pick`)**: ลูกค้าจั่วไพ่จริงกับหมอดูที่ร้านแล้วมาเลือกบนเว็บว่าได้ใบไหน (เว็บไม่สุ่มไพ่)
  2. **โหมดจั่วบนเว็บ (`/draw`)**: สำหรับกรณีไม่มีไพ่จริงที่โต๊ะ หรือลูกค้าเล่นเอง เว็บจะสับสำรับและสุ่มไพ่พร้อมท่ากลับหัว (~30%) ให้อัตโนมัติ
- จากนั้นลูกค้าอ่านคำทำนายเองบนเว็บ และได้รับโปสเตอร์ character (ฟีล "what character are you") พร้อมซอสที่เหมาะกับตัวเอง
- สามารถแชร์/บันทึกภาพลง IG Story ได้ และมีเมนูแนะนำ character ทั้งหมด

---

## User Flow

1. **Landing (`/`)**: ลูกเล่นต้อนรับ พร้อมปุ่มหลัก "เริ่ม" นำทางไปหน้าเลือกวิธีดูดวง
2. **เลือกวิธีดูดวง (`/play`)**: เลือกระหว่าง "จั่วบนเว็บ" (`/draw`) หรือ "เลือกไพ่ที่จั่วจริง" (`/pick`)
3. **การเลือกไพ่**:
   - **โหมดจั่วบนเว็บ (`/draw`)**: สับสำรับด้วยแอนิเมชัน Riffle (<= 1.5s, กดข้ามได้) → แผ่พัด 22 ใบ → แตะเลือก 1 ใบ (สุ่มกลับหัว ~30% อัตโนมัติ)
   - **โหมดไพ่จริง (`/pick`)**: กริดไพ่ Major Arcana 22 ใบ + ระบบค้นหาชื่อไพ่ + สวิตช์สลับไพ่กลับหัว (reversed) + ลิงก์เปลี่ยนวิธีดูดวง
4. **แอนิเมชันเปิดไพ่เต็มจอ (`PickTransition`)**: ไพ่คว่ำลอยขึ้น พลิกเผยหน้าไพ่ + ประกาย (~2.7 วินาที) กดข้ามได้ และหากผู้ใช้เปิด reduced-motion จะข้ามทันที
5. **คำทำนาย (`/reading/[cardId]` หรือ `/reading/[cardId]/reversed`)**: ภาพรวม + 3 หมวด (การเรียน/งาน, การเงิน, ความรัก) แต่ละหมวดมีข้อความและดาว 1–5 (`data/fortunes.ts`)
6. **โปสเตอร์ Character + ซอสที่เหมาะ**: โปสเตอร์พร้อมสรุปไอคอน 3 หมวดและดาวแบบย่อ + ซอสที่จับคู่
7. **แชร์ / ดาวน์โหลด และเล่นใหม่**: ส่งออกเป็นภาพโปสเตอร์ IG Story (1080×1920) หรือกดปุ่ม "เล่นใหม่" เพื่อกลับไปยังหน้าเลือกวิธีดูดวง (`/play`)
8. **เมนูมุมจอ (SiteNav)**: เมนู Dropdown มุมขวาบนสำหรับดู Character ทั้ง 22 ตัว (`/characters`) และกลับหน้าแรก

---

## โครงสร้างข้อมูลและโมเดล (Data & Domain Model)

ข้อมูลทั้งหมดต้องอยู่ใน `data/` พร้อม TypeScript types ห้าม hardcode กฎใน UI component

### 1. ไพ่ทาโร่ต์ (Cards)
- ใช้ไพ่ Major Arcana 22 ใบ (Rider-Waite) **ตายตัว ห้ามเพิ่ม/ลด/เปลี่ยนชื่อ**
- ชื่อและความหมายตามมาตรฐานไพ่ทาโร่ต์
- ทุกใบ (รวมทั้งท่ากลับหัว reversed) กำหนด tone: `good` | `neutral` | `bad`
- *TODO(เจ้าของร้าน)*: รีวิวการให้คะแนน tone ของแต่ละใบ

### 2. ซอส (Sauces - 4 ตัว)
| ซอส | ประเภท | ใช้กับ |
|---|---|---|
| พริกศรีราชา | เตือนสติ (จัดสุด) | ไพ่ดีมาก |
| สไปซี่มาโย | เตือนสติ | ไพ่ดีทั่วไป / ไพ่กลางที่เอียงดี |
| เทอริยากิ | ปลอบใจ | ไพ่แย่ทั่วไป / ไพ่กลางที่เอียงแย่ |
| มายองเนส | ปลอบใจ (นุ่มสุด) | ไพ่แย่มาก |

- **กฎเหล็ก**: ไพ่ดี → ซอสเตือนสติ, ไพ่แย่ → ซอสปลอบใจ (ห้ามสลับ)
- ตาราง mapping ไพ่→ซอสอยู่ใน `data/` (`sauces.ts` / `reading.ts`) เท่านั้น เจ้าของร้านปรับได้ ห้าม hardcode ใน UI component

### 3. Character
- อัตราส่วน: 1 character ต่อไพ่ 1 ใบ (22 ตัว, map 1:1)
- *TODO(เจ้าของร้าน)*: ยืนยันจำนวนและบุคลิก
- แต่ละตัวมี: id, ชื่อ, บุคลิก, สีประจำตัว, path ภาพ, ข้อความบนโปสเตอร์, ไพ่ที่ผูก

---

## สถาปัตยกรรมและโครงสร้างไฟล์ (Architecture & Code Structure)

Tech Stack: Next.js 16 (App Router) + TypeScript + Tailwind CSS + Framer Motion

```
app/                    Route-level composition
  page.tsx              Landing page (ปุ่มเริ่ม)
  play/                 หน้าเลือกวิธีดูดวง (จั่วบนเว็บ vs ไพ่จริง)
  draw/                 หน้าโหมดจั่วไพ่บนเว็บ (สับ + พัด 22 ใบ)
  pick/                 หน้าเลือกไพ่ 22 ใบ (โหมดไพ่จริง)
  reading/[cardId]/     หน้าแสดงคำทำนายและผลลัพธ์ (ปกติ / reversed)
  characters/           หน้าแสดง character ทั้งหมด
  loading.tsx           Loading UI กลาง (ใช้ StarLoader)
  template.tsx          Route-entry transitions
components/             UI & Interactive Components
  CardGrid.tsx          ค้นหา, จัดการ state ไพ่กลับหัว, prefetching, และ pick transition
  DeckShuffleFan.tsx    สำรับสับ Riffle, พัดไพ่ 22 ใบ, และ pick transition โหมดจั่วบนเว็บ
  ReadingView.tsx       ประกอบไพ่ คำทำนาย character ซอส ปุ่มแชร์ และปุ่มเล่นใหม่
  SiteNav.tsx           Navbar พร้อมเมนู Dropdown มุมขวาบน
  Poster.tsx            เรนเดอร์โปสเตอร์ IG Story 1080×1920
  PosterActions.tsx     จัดการ capture ภาพ (html-to-image) และแชร์/ดาวน์โหลด
  MotionProvider.tsx    Framer Motion reducedMotion wrapper
  StarLoader.tsx        แอนิเมชันกลุ่มดาวหมุนระหว่างโหลด
data/                   Domain layer และ Single Source of Truth
  cards.ts              ข้อมูลไพ่ 22 ใบ (id, name, tone, keywords, ฯลฯ)
  characters.ts         ข้อมูล 22 characters
  draw.ts               ฟังก์ชันสับไพ่ Fisher–Yates และสุ่มกลับหัว (30%)
  fortunes.ts           คำทำนาย 3 หมวด (งาน/เรียน, เงิน, รัก)
  sauces.ts             ข้อมูลซอส 4 ชนิด และ mapping rules
  reading.ts            ฟังก์ชันเชื่อมโยงไพ่ character ซอส และคำนวณผล reversed
  types.ts              TypeScript interfaces/types ทั้งหมด
.agents/spec-kits/      เอกสาร Spec-Kit สำหรับฟีเจอร์ต่างๆ
public/                 รูปไพ่, รูป character, ฟอนต์ภาษาไทย
.claude/commands/       สคริปต์ workflow สำหรับ agent
```

---

## กฎแอนิเมชัน (Animation Guidelines - จุดขายของเว็บ)

- ใช้ **Framer Motion** เป็นหลัก
- ทุกขั้นตอนสำคัญต้องมี transition: การเข้าหน้าเว็บ, hover/คลิกเลือกไพ่, พลิกไพ่, reveal คำทำนาย, การแสดงโปสเตอร์, ซอสเด้ง
- **Performance**: animate เฉพาะ `transform` และ `opacity` เพื่อความลื่นไหลบนอุปกรณ์พกพา
- **Accessibility**: รองรับ `prefers-reduced-motion` ผ่าน `MotionProvider` (`MotionConfig reducedMotion="user"`) เสมอ **ห้าม** เช็ก `useReducedMotion` ใน `initial` value ของ SSR component เพื่อป้องกัน hydration mismatch
- **Loading UI**: ใช้ `StarLoader` (กลุ่มดาวหมุน) ทั้งใน `app/loading.tsx` และ fallback ของหน้าอ่านคำทำนาย
- **Timing & UX**: แอนิเมชันแต่ละสเต็ปไม่ควรเกิน ~1.5 วินาที (ยกเว้นแอนิเมชันเปิดไพ่ `PickTransition` ~2.7 วินาที) และ **ต้องไม่บล็อกการกดข้าม (skippable)**

---

## แนวทางการเขียนเนื้อหา (Content & Tone Guidelines)

- โทนเสียง: อบอุ่น สนุกสนาน เป็นกันเอง และเพื่อความบันเทิงเท่านั้น
- **ข้อห้าม**: ห้ามฟันธงหรือให้คำแนะนำด้านการแพทย์ สุขภาพ การเงิน/การลงทุน หรือเรื่องร้ายแรงเด็ดขาด
- คำทำนายไพ่แย่: ต้องลงท้ายด้วยการปลอบใจและให้กำลังใจเสมอ
- คำทำนายไพ่ดี: ต้องมีข้อคิดเตือนสติเบา ๆ ให้สอดคล้องกับซอสรสจัด
- คะแนนดาว (1–5 ดาว): สอดคล้องกับ tone ของไพ่ (ไพ่แย่ได้ดาวน้อย แต่ข้อความต้องให้กำลังใจ)

---

## ข้อกำหนดโปสเตอร์ (Poster Requirements)

- เรนเดอร์ฝั่ง client ด้วย `html-to-image` ขนาดตายตัว **1080×1920 px** (IG Story format)
- **Safe Zone**: เว้นระยะขอบบนและล่างประมาณ 250px เพื่อไม่ให้ UI ของ Instagram Story บัง
- โหลดฟอนต์ภาษาไทยให้เสร็จสมบูรณ์ก่อนบันทึกภาพ
- รองรับข้อความยาวสุดของไพ่และคำทำนาย โดยวรรณยุกต์ไม่ซ้อนทับและข้อความไม่ล้นกรอบ

---

## กฎการเขียนโค้ดและข้อตกลงในโปรเจกต์ (Coding Standards & Conventions)

- **Mobile-first**: ออกแบบสำหรับลูกค้าที่เปิดผ่านการสแกน QR code จากสมาร์ทโฟน
- **Accessibility**: รองรับ alt text ภาษาไทย, keyboard focus styles, และ readable contrast
- **Next.js 16**: อ่านเอกสารใน `node_modules/next/dist/docs/` ก่อนเขียนโค้ด ให้ความสำคัญกับ deprecation notices
- ทำงานเฉพาะขอบเขตที่ได้รับมอบหมาย ไม่เพิ่ม dependency หรือ abstraction ที่ไม่จำเป็น

---
description: เพิ่มหรือปรับแอนิเมชันด้วย Framer Motion ตามกฎใน CLAUDE.md
argument-hint: <ขั้นตอน/คอมโพเนนต์ และลูกเล่นที่ต้องการ>
---

ทำแอนิเมชัน: $ARGUMENTS

ขั้นตอน:
1. อ่านหัวข้อ "แอนิเมชัน" ใน CLAUDE.md และดูคอมโพเนนต์/variants ที่มีอยู่ใน `components/` เพื่อใช้ซ้ำ
2. ใช้ Framer Motion, animate เฉพาะ transform/opacity, ไม่เกิน ~1.5 วินาที, ผู้ใช้กดข้ามได้
3. รองรับ `prefers-reduced-motion` (ใช้ `useReducedMotion` ให้เหลือ fade)
4. ลูกเล่นต้องเข้ากับธีมร้าน (ไพ่ ซอส ความสนุกอบอุ่น)
5. รัน `npm run lint` และ `npm run build` แล้วรายงานผล

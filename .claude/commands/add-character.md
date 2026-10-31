---
description: เพิ่ม character ใหม่ลง data/characters.ts และหน้าแนะนำ character
argument-hint: <ชื่อ character> [ไพ่ที่ผูก]
---

เพิ่ม character: $ARGUMENTS

ขั้นตอน:
1. อ่าน CLAUDE.md และ `data/characters.ts` เพื่อดูสคีมาและสไตล์ที่มีอยู่
2. เพิ่ม entry: id, ชื่อ, บุคลิก, สีประจำตัว, path ภาพ, ข้อความบนโปสเตอร์ (โทนตามกฎเนื้อหาใน CLAUDE.md), ไพ่ที่ผูก (1:1)
3. ถ้าผูกกับไพ่ ให้ตรวจว่าไพ่ครบ 22 ใบยังมี character ครอบคลุม
4. ตรวจว่าหน้าแนะนำ character แสดงตัวใหม่ได้ (ใช้ข้อมูลจาก data ไม่ hardcode)
5. ถ้าไม่มีภาพ ให้ใส่ placeholder และแจ้งผู้ใช้ว่าต้องเพิ่มภาพ
6. รัน `npm run lint`

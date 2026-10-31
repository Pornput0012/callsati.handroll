import type { Card } from "./types";
import { fortunes } from "./fortunes";

// TODO(เจ้าของร้าน): รีวิว score และคำทำนาย (ร่างตั้งต้น ปรับได้)
type Seed = [id: string, number: number, name: string, th: string, score: Card["score"], kw: string[]];

const seeds: Seed[] = [
  ["fool", 0, "The Fool", "คนโง่", 1, ["เริ่มต้นใหม่", "อิสระ", "กล้าเสี่ยง"]],
  ["magician", 1, "The Magician", "นักเวทย์", 2, ["พลังสร้างสรรค์", "ความสามารถ"]],
  ["high-priestess", 2, "The High Priestess", "สตรีนักบวช", 0, ["สัญชาตญาณ", "ความลับ"]],
  ["empress", 3, "The Empress", "จักรพรรดินี", 2, ["ความอุดมสมบูรณ์", "ความรัก"]],
  ["emperor", 4, "The Emperor", "จักรพรรดิ", 1, ["อำนาจ", "ความมั่นคง"]],
  ["hierophant", 5, "The Hierophant", "สังฆราช", 0, ["ประเพณี", "คำแนะนำ"]],
  ["lovers", 6, "The Lovers", "คนรัก", 2, ["ความรัก", "การเลือก"]],
  ["chariot", 7, "The Chariot", "รถศึก", 1, ["ชัยชนะ", "มุ่งมั่น"]],
  ["strength", 8, "Strength", "พลัง", 1, ["ความกล้า", "ใจเย็น"]],
  ["hermit", 9, "The Hermit", "ฤๅษี", 0, ["ทบทวนตัวเอง", "สงบ"]],
  ["wheel-of-fortune", 10, "Wheel of Fortune", "กงล้อแห่งโชคชะตา", 1, ["โชค", "จังหวะชีวิต"]],
  ["justice", 11, "Justice", "ความยุติธรรม", 0, ["สมดุล", "ความจริง"]],
  ["hanged-man", 12, "The Hanged Man", "ชายถูกแขวน", -1, ["รอคอย", "มองมุมใหม่"]],
  ["death", 13, "Death", "ความตาย", -1, ["การเปลี่ยนแปลง", "จบเพื่อเริ่ม"]],
  ["temperance", 14, "Temperance", "ความพอดี", 1, ["สมดุล", "เยียวยา"]],
  ["devil", 15, "The Devil", "ปีศาจ", -2, ["พันธนาการ", "ความอยาก"]],
  ["tower", 16, "The Tower", "หอคอย", -2, ["พลิกผัน", "ความตกใจ"]],
  ["star", 17, "The Star", "ดวงดาว", 2, ["ความหวัง", "แรงบันดาลใจ"]],
  ["moon", 18, "The Moon", "พระจันทร์", -1, ["ความไม่ชัดเจน", "ความกังวล"]],
  ["sun", 19, "The Sun", "พระอาทิตย์", 2, ["ความสุข", "ความสำเร็จ"]],
  ["judgement", 20, "Judgement", "การพิพากษา", 0, ["ตื่นรู้", "ตัดสินใจ"]],
  ["world", 21, "The World", "โลก", 2, ["สำเร็จ", "ครบวงจร"]],
];

export const cards: Card[] = seeds.map(([id, number, name, nameTh, score, keywords]) => ({
  id,
  number,
  name,
  nameTh,
  keywords,
  score,
  upright: fortunes[id].upright,
  reversed: fortunes[id].reversed,
}));

export const getCard = (id: string) => cards.find((c) => c.id === id);

import type { Character } from "./types";
import { cards } from "./cards";

// TODO(เจ้าของร้าน): ชื่อ/บุคลิก/ภาพ character (ร่างตั้งต้น 1:1 ตามไพ่)
const names: Record<string, [string, string]> = {
  "fool": ["น้องฟูล", "นักผจญภัยใจกล้า"],
  "magician": ["น้องเมจิ", "จอมเวทย์ทำได้ทุกอย่าง"],
  "high-priestess": ["น้องพริสตี้", "ผู้รู้ใจเงียบๆ"],
  "empress": ["น้องเอมม่า", "ราชินีสายอบอุ่น"],
  "emperor": ["น้องเอมเพอร์", "ผู้นำสายแพลน"],
  "hierophant": ["น้องฮีโร่ฟ", "ที่ปรึกษาใจดี"],
  "lovers": ["น้องเลิฟ", "สายรักหัวใจฟู"],
  "chariot": ["น้องชาริ", "นักวิ่งไม่ยอมแพ้"],
  "strength": ["น้องสตรอง", "ใจนุ่มแต่แกร่ง"],
  "hermit": ["น้องเฮอร์", "นักคิดผู้ถือตะเกียง"],
  "wheel-of-fortune": ["น้องวีล", "เจ้าแห่งจังหวะชีวิต"],
  "justice": ["น้องจัส", "ผู้ตัดสินใจเที่ยงตรง"],
  "hanged-man": ["น้องแฮง", "นักมองโลกกลับหัว"],
  "death": ["น้องเดธ", "ผู้เปิดบทใหม่"],
  "temperance": ["น้องเทมป์", "เชฟแห่งความพอดี"],
  "devil": ["น้องเดวิล", "เจ้าแห่งความอยาก"],
  "tower": ["น้องทาวเวอร์", "คนผ่านพายุมาแล้ว"],
  "star": ["น้องสตาร์", "ดาวแห่งความหวัง"],
  "moon": ["น้องมูน", "นักฝันยามค่ำ"],
  "sun": ["น้องซัน", "ตัวแทนความสดใส"],
  "judgement": ["น้องจัดจ์", "ผู้ตื่นรู้"],
  "world": ["น้องเวิลด์", "ผู้พิชิตครบวงจร"],
};

const palette = ["#7b2cbf", "#e85d75", "#3a86ff", "#2a9d8f", "#f4a261", "#e76f51"];

export const characters: Character[] = cards.map((c, i) => ({
  cardId: c.id,
  name: names[c.id][0],
  tagline: names[c.id][1],
  personality: c.keywords.join(" · "),
  color: palette[i % palette.length],
  image: `/characters/${c.id}.png`,
}));

export const getCharacter = (cardId: string) => characters.find((c) => c.cardId === cardId);

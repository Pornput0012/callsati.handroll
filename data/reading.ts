import type { Reading, Tone } from "./types";
import { getCard } from "./cards";
import { getCharacter } from "./characters";
import { sauces } from "./sauces";

// กฎกลางของร้าน: ไพ่ดี → ซอสเตือนสติ (จัด) / ไพ่แย่ → ซอสปลอบใจ (นุ่ม)
// ท่ากลับหัวสลับด้านดี↔แย่ (ไพ่กลางยังกลาง) — TODO(เจ้าของร้าน): ยืนยันกฎ
export function getReading(cardId: string, reversed = false): Reading | undefined {
  const card = getCard(cardId);
  const character = getCharacter(cardId);
  if (!card || !character) return undefined;

  const score = reversed ? -card.score : card.score;
  const tone: Tone = score > 0 ? "good" : score < 0 ? "bad" : "neutral";
  const sauce =
    score >= 2 ? sauces.sriracha : score === 1 ? sauces.spicyMayo : score === -2 ? sauces.mayo : sauces.teriyaki;

  const reason =
    tone === "good"
      ? "ดวงดีขนาดนี้ ขอซอสรสจัดไว้เตือนสติ อย่าเพิ่งลอย"
      : tone === "bad"
        ? "วันนี้ใจอาจเหนื่อย ขอซอสนุ่มๆ ไว้ปลอบใจ"
        : "ดวงกลางๆ ได้ซอสกลมกล่อมไว้เป็นกำลังใจ";

  return { card, reversed, tone, character, sauce, fortune: reversed ? card.reversed : card.upright, reason };
}

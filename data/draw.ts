import type { Card } from "./types";
import { cards } from "./cards";

/**
 * อัตราความน่าจะเป็นที่ไพ่จะออกในท่ากลับหัว (30%)
 * ตามข้อกำหนดที่เจ้าของร้านเลือก
 */
export const REVERSED_PROBABILITY = 0.3;

export interface ShuffledDeckCard {
  card: Card;
  reversed: boolean;
}

/**
 * สร้างสำรับไพ่ที่สับลำดับด้วย Fisher–Yates Shuffle และสุ่มท่ากลับหัว
 * @param cardList รายการไพ่ทั้งหมด (ค่าเริ่มต้นคือ Major Arcana 22 ใบ)
 * @param rng ตัวสร้างเลขสุ่ม 0 ถึง 1 (ค่าเริ่มต้นคือ Math.random รองรับการ mock สำหรับ testing)
 */
export function createShuffledDeck(
  cardList: Card[] = cards,
  rng: () => number = Math.random,
): ShuffledDeckCard[] {
  const deck = [...cardList];

  // Fisher–Yates Shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }

  return deck.map((card) => ({
    card,
    reversed: rng() < REVERSED_PROBABILITY,
  }));
}

/**
 * ดึงไพ่ 1 ใบจากสำรับตาม index
 */
export function drawCard(
  deck: ShuffledDeckCard[],
  index: number,
): ShuffledDeckCard | undefined {
  if (index < 0 || index >= deck.length) return undefined;
  return deck[index];
}


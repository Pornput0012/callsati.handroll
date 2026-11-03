import { describe, expect, it } from "vitest";
import { cards } from "./cards";
import { createShuffledDeck, drawCard, REVERSED_PROBABILITY } from "./draw";

describe("createShuffledDeck", () => {
  it("คืนค่าสำรับครบ 22 ใบพอดี และเป็นไพ่ที่ไม่ซ้ำกัน", () => {
    const deck = createShuffledDeck();
    expect(deck).toHaveLength(22);

    const ids = deck.map((d) => d.card.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(22);

    for (const d of deck) {
      expect(typeof d.reversed).toBe("boolean");
      expect(d.card.name).toBeDefined();
    }
  });

  it("ทำงานแบบ Deterministic ตาม Mock RNG", () => {
    // กำหนด mock RNG ที่คืนค่าเรียงตามลำดับ
    let callCount = 0;
    const mockRng = () => {
      callCount++;
      return 0.1; // < REVERSED_PROBABILITY ทำให้ทุกใบเป็น reversed: true
    };

    const deck = createShuffledDeck(cards.slice(0, 3), mockRng);
    expect(deck).toHaveLength(3);
    for (const item of deck) {
      expect(item.reversed).toBe(true);
    }
    expect(callCount).toBeGreaterThan(0);
  });

  it("สุ่มกลับหัวได้ทั้งสองแบบและอัตราเฉลี่ยอยู่ที่ประมาณ 30%", () => {
    const iterations = 1000;
    let reversedCount = 0;

    for (let i = 0; i < iterations; i++) {
      const deck = createShuffledDeck();
      if (deck[0].reversed) reversedCount++;
    }

    const rate = reversedCount / iterations;
    // ตรวจสอบว่าอยู่ในช่วง 20% ถึง 40% (expected 30%)
    expect(rate).toBeGreaterThanOrEqual(0.2);
    expect(rate).toBeLessThanOrEqual(0.4);
    expect(REVERSED_PROBABILITY).toBe(0.3);
  });
});

describe("drawCard", () => {
  it("ดึงไพ่ตาม index ได้ถูกต้อง", () => {
    const deck = createShuffledDeck();
    const first = drawCard(deck, 0);
    expect(first).toBeDefined();
    expect(first).toBe(deck[0]);

    const last = drawCard(deck, 21);
    expect(last).toBeDefined();
    expect(last).toBe(deck[21]);
  });

  it("index เกินขอบเขตคืน undefined", () => {
    const deck = createShuffledDeck();
    expect(drawCard(deck, -1)).toBeUndefined();
    expect(drawCard(deck, 22)).toBeUndefined();
    expect(drawCard(deck, 99)).toBeUndefined();
  });
});


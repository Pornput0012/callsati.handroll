import { describe, expect, it } from "vitest";
import { cards } from "./cards";
import { characters } from "./characters";
import { getReading } from "./reading";

describe("data", () => {
  it("มีไพ่ Major Arcana 22 ใบ และ character 1:1", () => {
    expect(cards).toHaveLength(22);
    expect(characters).toHaveLength(22);
  });
});

describe("getReading", () => {
  it("ทุกใบ ทั้งสองท่า ได้ซอสถูกประเภท", () => {
    for (const c of cards) {
      for (const r of [false, true]) {
        const reading = getReading(c.id, r)!;
        expect(reading.character.cardId).toBe(c.id);
        if (reading.tone === "good") expect(reading.sauce.kind).toBe("warning");
        if (reading.tone === "bad") expect(reading.sauce.kind).toBe("comfort");
      }
    }
  });
  it("ไพ่ไม่มีอยู่ → undefined", () => {
    expect(getReading("nope")).toBeUndefined();
  });
});

describe("fortunes", () => {
  it("ทุกใบ ทั้งสองท่า มีคำทำนายครบ 4 หมวด และดาว 1–5", () => {
    for (const c of cards) {
      for (const f of [c.upright, c.reversed]) {
        for (const text of [f.general, f.work, f.money, f.love]) {
          expect(text.trim().length).toBeGreaterThan(10);
          expect(text).not.toMatch(/TODO/);
        }
        for (const s of Object.values(f.stars)) expect(s >= 1 && s <= 5).toBe(true);
      }
    }
  });
});

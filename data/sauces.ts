import type { Sauce } from "./types";

export const sauces: Record<string, Sauce> = {
  sriracha: { id: "sriracha", name: "พริกศรีราชา", kind: "warning", intensity: 3, color: "#d62828", blurb: "จัดจ้านปลุกสติ ดวงดีแล้วอย่าเพิ่งลอย" },
  spicyMayo: { id: "spicyMayo", name: "สไปซี่มาโย", kind: "warning", intensity: 2, color: "#f77f00", blurb: "เผ็ดนุ่มๆ เตือนเบาๆ ว่าอย่าประมาท" },
  teriyaki: { id: "teriyaki", name: "เทอริยากิ", kind: "comfort", intensity: 1, color: "#6f4518", blurb: "หวานมันกลมกล่อม ปลอบใจให้อุ่นขึ้น" },
  mayo: { id: "mayo", name: "มายองเนส", kind: "comfort", intensity: 1, color: "#f4e9c1", blurb: "นุ่มละมุนที่สุด กอดใจวันที่เหนื่อย" },
};

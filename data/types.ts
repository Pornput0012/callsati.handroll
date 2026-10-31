export type Tone = "good" | "neutral" | "bad";
export type SauceKind = "warning" | "comfort";

export type Card = {
  id: string;
  number: number;
  name: string;
  nameTh: string;
  keywords: string[];
  // TODO(เจ้าของร้าน): รีวิวคะแนน -2 (แย่มาก) ถึง 2 (ดีมาก)
  score: -2 | -1 | 0 | 1 | 2;
  upright: string;
  reversed: string;
};

export type Character = {
  cardId: string;
  name: string;
  tagline: string;
  personality: string;
  color: string;
  image: string;
};

export type Sauce = {
  id: string;
  name: string;
  kind: SauceKind;
  intensity: 1 | 2 | 3;
  color: string;
  blurb: string;
};

export type Reading = {
  card: Card;
  reversed: boolean;
  tone: Tone;
  character: Character;
  sauce: Sauce;
  message: string;
  reason: string;
};

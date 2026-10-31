import Link from "next/link";
import { notFound } from "next/navigation";
import { getReading } from "@/data/reading";
import { FortuneCards } from "@/components/FortuneCards";
import { FlipCard } from "@/components/FlipCard";
import { PosterActions } from "@/components/PosterActions";
import { SauceDrop } from "@/components/SauceDrop";
import { StarLoader } from "@/components/StarLoader";
import { Reveal } from "@/components/Reveal";

export function ReadingView({ cardId, reversed: flip }: { cardId: string; reversed: boolean }) {
  const reading = getReading(cardId, flip);
  if (!reading) notFound();

  const { card, character, sauce, fortune, reversed, reason } = reading;

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center gap-6 px-6 py-10 text-center">
      <FlipCard card={card} reversed={reversed} />

      <Reveal delay={1.6}>
        <h1 className="text-2xl font-bold text-gold">
          {card.name} {reversed && "(Reversed)"}
        </h1>
        <p className="mt-3 leading-relaxed text-foreground/90">{fortune.general}</p>
      </Reveal>

      <FortuneCards fortune={fortune} delay={2.1} />

      <Reveal delay={3.3} className="w-full">
        <section className="rounded-2xl border p-4" style={{ borderColor: character.color, background: `${character.color}22` }}>
          <p className="text-sm text-foreground/60">วันนี้คุณคือ</p>
          <p className="text-2xl font-semibold">{character.name}</p>
          <p className="text-foreground/80">{character.tagline}</p>
        </section>
      </Reveal>

      <Reveal delay={3.8} className="w-full">
        <section className="rounded-2xl border p-4" style={{ borderColor: sauce.color, background: `${sauce.color}22` }}>
          <SauceDrop color={sauce.color} delay={4} />
          <p className="text-sm text-foreground/60">ซอสประจำตัวของคุณ</p>
          <p className="text-2xl font-semibold" style={{ color: sauce.color }}>
            {sauce.name}
          </p>
          <p className="mt-1 text-foreground/80">{reason}</p>
        </section>
      </Reveal>

      <Reveal delay={4.3} className="w-full">
        <PosterActions reading={reading} />
      </Reveal>

      <Reveal delay={4.6}>
        <Link href="/pick" className="text-sm text-gold underline">
          เลือกไพ่ใหม่
        </Link>
      </Reveal>
    </main>
  );
}

export function ReadingFallback() {
  return <StarLoader />;
}

import { Suspense } from "react";
import { cards } from "@/data/cards";
import { ReadingFallback, ReadingView } from "@/components/ReadingView";

export function generateStaticParams() {
  return cards.map((c) => ({ cardId: c.id }));
}

async function Reading({ params }: { params: Promise<{ cardId: string }> }) {
  const { cardId } = await params;
  return <ReadingView cardId={cardId} reversed={false} />;
}

export default function ReadingPage(props: PageProps<"/reading/[cardId]">) {
  return (
    <Suspense fallback={<ReadingFallback />}>
      <Reading params={props.params} />
    </Suspense>
  );
}

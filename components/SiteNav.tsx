import Link from "next/link";

export function SiteNav() {
  return (
    <nav className="flex items-center justify-between px-4 py-3 text-sm">
      <Link href="/" className="font-semibold text-gold">
        ✦ Handroll Tarot
      </Link>
      <div className="flex gap-4 text-foreground/80">
        <Link href="/pick" className="hover:text-gold">เลือกไพ่</Link>
        <Link href="/characters" className="hover:text-gold">Character</Link>
      </div>
    </nav>
  );
}

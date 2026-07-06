import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative z-10 flex min-h-svh flex-col items-center justify-center gap-8 px-5 text-center">
      <p className="voice-mono-bright">SİNYAL KAYBI // SIGNAL LOST</p>
      <h1 className="voice-display text-ink text-[clamp(6rem,28vw,18rem)] leading-none">
        4<span className="glow-pulse">0</span>4
      </h1>
      <p className="voice-mono max-w-md leading-relaxed normal-case tracking-[0.08em]">
        Bu derinlikte aradığın rota yok. Akıntıyı takip et ve yüzeye dön.
      </p>
      <Link href="/" className="finale-link border border-line rounded-full px-6 py-3">
        ← YOLCULUĞA DÖN
      </Link>
    </main>
  );
}

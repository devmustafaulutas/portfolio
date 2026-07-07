import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative z-10 flex min-h-svh flex-col items-center justify-center gap-8 px-5 text-center">
      <p className="type-mono-bright">SİNYAL KAYBI — SIGNAL LOST</p>
      <h1 className="type-display text-[clamp(6rem,28vw,18rem)] leading-none">
        404
      </h1>
      <p className="type-mono max-w-md normal-case leading-relaxed tracking-[0.08em]">
        Bu koordinatta yalnızca saf siyah var. Işığın olduğu yere dön.
      </p>
      <Link href="/" className="magnetic-btn">
        ← ANA SAYFAYA DÖN
      </Link>
    </main>
  );
}

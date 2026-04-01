import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Sayfa Bulunamadı",
};

export default function NotFound() {
  return (
    <div className="container-site flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <div
        aria-hidden="true"
        className="mb-6 text-[6rem] font-black leading-none tracking-tight
                   text-gradient select-none"
      >
        404
      </div>

      <h1 className="text-heading text-2xl text-[hsl(var(--foreground))] mb-3">
        Sayfa bulunamadı
      </h1>
      <p className="text-body text-sm mb-8 max-w-[36ch]">
        Aradığınız sayfa taşınmış, silinmiş ya da hiç var olmamış olabilir.
      </p>

      <div className="flex gap-3">
        <Link href="/" className="btn btn-primary btn-sm">
          Ana sayfaya dön
        </Link>
        <Link href="/blog" className="btn btn-secondary btn-sm">
          Yazılara bak
        </Link>
      </div>
    </div>
  );
}

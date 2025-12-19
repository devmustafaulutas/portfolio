import { cn } from "@/src/lib/cn";

export function AuroraBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
    >
      {/* blur aurora blobs */}
      <div className="absolute -top-40 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute top-10 left-[-120px] h-[380px] w-[380px] rounded-full bg-sky-400/20 blur-3xl dark:bg-sky-400/10" />
      <div className="absolute bottom-[-140px] right-[-140px] h-[520px] w-[520px] rounded-full bg-fuchsia-400/20 blur-3xl dark:bg-fuchsia-400/10" />

      {/* subtle noise */}
      <div
        className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage:
            "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22240%22 height=%22240%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22240%22 height=%22240%22 filter=%22url(%23n)%22 opacity=%220.4%22/%3E%3C/svg%3E')",
        }}
      />
    </div>
  );
}

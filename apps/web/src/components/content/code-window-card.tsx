import { cn } from "@/src/lib/cn";

export function CodeWindowCard({
  title,
  children,
  className,
}: {
  title?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-[#011522] text-slate-100 shadow-sm",
        "ring-1 ring-white/5",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#ff605c]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd44]" />
          <span className="h-3 w-3 rounded-full bg-[#00ca4e]" />
        </div>
        {title ? (
          <div className="truncate text-xs text-slate-300">{title}</div>
        ) : (
          <div />
        )}
      </div>

      <div className="p-4">
        <div className="rounded-xl bg-black/20 p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

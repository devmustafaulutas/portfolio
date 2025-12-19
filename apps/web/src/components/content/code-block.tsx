import React from "react";
import { highlight } from "@/src/lib/shiki";
import { CopyButton } from "@/src/components/content/copy-button";

export async function CodeBlock({
  code,
  lang,
  filename,
}: {
  code: string;
  lang: "ts" | "tsx" | "js" | "json" | "bash" | "csharp" | "sql" | "md" | "css" | "html" ;
  filename?: string;
}) {
  const html = await highlight(code, lang);

  return (
    <div className="not-prose overflow-hidden rounded-2xl border bg-[#07121f] text-slate-100 shadow-sm ring-1 ring-white/5">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#ff605c]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd44]" />
          <span className="h-3 w-3 rounded-full bg-[#00ca4e]" />
        </div>

        <div className="flex items-center gap-3">
          {filename ? <div className="text-xs text-slate-300">{filename}</div> : null}
          <CopyButton code={code} />
        </div>
      </div>

      <div className="p-4">
        <div className="overflow-x-auto rounded-xl bg-black/25 p-4">
          <div
            className="shiki-wrap text-xs leading-6"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </div>
  );
}

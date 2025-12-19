import "server-only";

type Lang =
  | "ts"
  | "tsx"
  | "js"
  | "json"
  | "bash"
  | "csharp"
  | "sql"
  | "md"
  | "css"
  | "html";

const highlighterPromise: Promise<any> =
  (globalThis as any).__pp_shiki_highlighter ??
  ((globalThis as any).__pp_shiki_highlighter = (async () => {
    const { createHighlighter } = await import("shiki");
    return createHighlighter({
      themes: ["github-light", "github-dark"],
      langs: ["ts", "tsx", "js", "json", "bash", "csharp", "sql", "md", "css", "html"],
    });
  })());

export async function highlight(code: string, lang: Lang) {
  const highlighter = await highlighterPromise;

  return highlighter.codeToHtml(code, {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  });
}

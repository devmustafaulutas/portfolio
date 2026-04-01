import { codeToHtml } from "shiki";
import { CopyCodeButton } from "./copy-button";

type CodeBlockProps = {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
};

// Map display language names to Shiki language IDs
const LANG_MAP: Record<string, string> = {
  TypeScript: "typescript",
  JavaScript: "javascript",
  "C#": "csharp",
  Shell: "bash",
  YAML: "yaml",
  JSON: "json",
  SQL: "sql",
  Rust: "rust",
  Go: "go",
  Python: "python",
  HTML: "html",
  CSS: "css",
  MDX: "mdx",
};

export async function CodeBlock({
  code,
  language = "TypeScript",
  filename,
  showLineNumbers = false,
}: CodeBlockProps) {
  const shikiLang = LANG_MAP[language] ?? language.toLowerCase();

  let html = "";
  try {
    html = await codeToHtml(code.trim(), {
      lang: shikiLang,
      themes: {
        dark: "github-dark-default",
        light: "github-light-default",
      },
      defaultColor: false,
    });
  } catch {
    // Fallback: plain pre/code if shiki fails
    html = `<pre><code>${escapeHtml(code.trim())}</code></pre>`;
  }

  return (
    <div className="code-block-wrapper not-prose">
      {/* Header */}
      <div className="code-block-header">
        <div className="flex items-center gap-2">
          {/* Traffic lights decoration */}
          <div className="flex gap-1.5" aria-hidden="true">
            <div className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--border))]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--border))]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--border))]" />
          </div>
          {filename && (
            <span className="code-block-filename">{filename}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="badge text-[10px]">{language}</span>
          <CopyCodeButton code={code} />
        </div>
      </div>

      {/* Body */}
      <div
        className="code-block-body"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted shiki output
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

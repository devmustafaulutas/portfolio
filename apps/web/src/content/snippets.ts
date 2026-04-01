// ============================================================
// Snippets Content Model
// ============================================================

export type SnippetMeta = {
  slug: string;
  title: string;
  description: string;
  language: string;
  tags: string[];
  featured?: boolean;
  updatedAt?: string;
};

export type SnippetDetail = SnippetMeta & {
  code: string;
  notes?: string;
  usage?: string;
};

// ---- Loaders -------------------------------------------------------

export async function getAllSnippets(): Promise<SnippetMeta[]> {
  return snippets;
}

export async function getSnippet(slug: string): Promise<SnippetDetail | null> {
  return snippetDetails.find((s) => s.slug === slug) ?? null;
}

export async function getFeaturedSnippets(): Promise<SnippetMeta[]> {
  return snippets.filter((s) => s.featured).slice(0, 3);
}

export function getAllLanguages(): string[] {
  return [...new Set(snippets.map((s) => s.language))].sort();
}

export function getSnippetSlugs(): { slug: string }[] {
  return snippets.map((s) => ({ slug: s.slug }));
}

// ---- Mock data -----------------------------------------------------

export const snippets: SnippetMeta[] = [
  {
    slug: "typed-fetcher",
    title: "Typed HTTP Fetcher",
    description: "Generic, type-safe fetch wrapper with error handling ve retry desteği.",
    language: "TypeScript",
    tags: ["http", "fetch", "types", "utility"],
    featured: true,
  },
  {
    slug: "use-debounce",
    title: "useDebounce Hook",
    description: "Değeri geciktiren minimal React hook. Input filtreleme ve arama için ideal.",
    language: "TypeScript",
    tags: ["react", "hooks", "performance"],
    featured: true,
  },
  {
    slug: "efcore-migrations-cli",
    title: "EF Core CLI (Clean Setup)",
    description:
      "Clean Architecture'da EF Core migration komutları — startup project ve design-time factory.",
    language: "Shell",
    tags: ["efcore", "dotnet", "migrations", "cli"],
    featured: true,
  },
  {
    slug: "cn-utility",
    title: "cn() Utility",
    description: "clsx + tailwind-merge kombinasyonu. Tailwind sınıflarını güvenle birleştir.",
    language: "TypeScript",
    tags: ["tailwind", "utility", "clsx"],
    featured: false,
  },
  {
    slug: "dotnet-result-type",
    title: ".NET Result<T> Pattern",
    description: "Exception yerine discriminated union tabanlı hata yönetimi.",
    language: "C#",
    tags: ["dotnet", "patterns", "error-handling"],
    featured: false,
  },
  {
    slug: "postgres-docker-compose",
    title: "PostgreSQL + pgAdmin Docker Compose",
    description: "Yerel geliştirme için minimal docker-compose.yml şablonu.",
    language: "YAML",
    tags: ["docker", "postgres", "devops"],
    featured: false,
  },
];

export const snippetDetails: SnippetDetail[] = [
  {
    ...snippets[0],
    code: `type FetchError = {
  status: number;
  message: string;
};

type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: FetchError };

export async function get<T>(
  url: string,
  init?: RequestInit
): Promise<Result<T>> {
  try {
    const res = await fetch(url, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });

    if (!res.ok) {
      return {
        ok: false,
        error: { status: res.status, message: await res.text() },
      };
    }

    return { ok: true, data: (await res.json()) as T };
  } catch (err) {
    return {
      ok: false,
      error: { status: 0, message: (err as Error).message },
    };
  }
}`,
    notes: "Sunucu ve istemci tarafında güvenle kullanılabilir. Next.js Server Components ile de çalışır.",
    usage: `const result = await get<User[]>("/api/users");
if (!result.ok) {
  console.error(result.error.message);
  return;
}
// result.data → User[]`,
  },
  {
    ...snippets[1],
    code: `import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}`,
    usage: `const [query, setQuery] = useState("");
const debouncedQuery = useDebounce(query, 400);

// debouncedQuery sadece 400ms sonra güncellenir`,
  },
  {
    ...snippets[2],
    code: `# Infrastructure projesinden migration ekle
dotnet ef migrations add Initial \\
  --project src/Infrastructure \\
  --startup-project src/Api \\
  --output-dir Persistence/Migrations

# Tüm migration'ları uygula
dotnet ef database update \\
  --project src/Infrastructure \\
  --startup-project src/Api

# Son migration'ı geri al
dotnet ef migrations remove \\
  --project src/Infrastructure \\
  --startup-project src/Api`,
    notes:
      "IDesignTimeDbContextFactory<AppDbContext> implemente etmeyi unutma — startup project'in appsettings.Development.json bağlantısını okuması için.",
  },
  {
    ...snippets[3],
    code: `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}`,
    usage: `// Koşullu class birleştirme
<div className={cn(
  "base-class",
  isActive && "active-class",
  variant === "ghost" && "ghost-class"
)} />`,
  },
  {
    ...snippets[4],
    code: `public class Result<T>
{
    public bool IsSuccess { get; private set; }
    public T? Value { get; private set; }
    public string? Error { get; private set; }

    private Result(bool success, T? value, string? error)
    {
        IsSuccess = success;
        Value = value;
        Error = error;
    }

    public static Result<T> Ok(T value) =>
        new(true, value, null);

    public static Result<T> Fail(string error) =>
        new(false, default, error);

    public TOut Match<TOut>(
        Func<T, TOut> onSuccess,
        Func<string, TOut> onFailure) =>
        IsSuccess ? onSuccess(Value!) : onFailure(Error!);
}`,
    usage: `var result = await userService.GetByIdAsync(id);
return result.Match(
    user => Ok(user),
    error => NotFound(error)
);`,
  },
  {
    ...snippets[5],
    code: `version: "3.9"

services:
  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: devpass
      POSTGRES_DB: appdb
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  pgadmin:
    image: dpage/pgadmin4:latest
    restart: unless-stopped
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@local.dev
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "5050:80"
    depends_on:
      - postgres

volumes:
  pgdata:`,
    usage: "docker compose up -d",
  },
];

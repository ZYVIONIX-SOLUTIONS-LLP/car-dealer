import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pagination({
  page,
  pageCount,
  buildHref,
}: {
  page: number;
  pageCount: number;
  buildHref: (page: number) => string;
}) {
  if (pageCount <= 1) return null;

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === pageCount || Math.abs(p - page) <= 1
  );

  return (
    <nav className="flex items-center justify-center gap-2">
      <Link
        href={buildHref(Math.max(1, page - 1))}
        aria-disabled={page === 1}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full border border-border-strong text-muted hover:text-foreground",
          page === 1 && "pointer-events-none opacity-40"
        )}
      >
        <ChevronLeft className="h-4 w-4" />
      </Link>

      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-2">
          {i > 0 && pages[i - 1] !== p - 1 && <span className="text-muted-foreground">…</span>}
          <Link
            href={buildHref(p)}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium",
              p === page ? "bg-accent text-accent-foreground" : "text-muted hover:bg-card-hover hover:text-foreground"
            )}
          >
            {p}
          </Link>
        </span>
      ))}

      <Link
        href={buildHref(Math.min(pageCount, page + 1))}
        aria-disabled={page === pageCount}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full border border-border-strong text-muted hover:text-foreground",
          page === pageCount && "pointer-events-none opacity-40"
        )}
      >
        <ChevronRight className="h-4 w-4" />
      </Link>
    </nav>
  );
}

"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { LayoutGrid, List } from "lucide-react";
import { Select } from "@/components/ui/field";
import { cn } from "@/lib/utils";

export function InventoryToolbar({ total, view }: { total: number; view: "grid" | "list" }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    if (key !== "page") params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4">
      <p className="text-sm text-muted">
        <span className="font-semibold text-foreground">{total}</span> vehicles found
      </p>
      <div className="flex items-center gap-3">
        <Select
          className="!h-10 w-44"
          value={searchParams.get("sort") ?? "newest"}
          onChange={(e) => setParam("sort", e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="year-desc">Year: Newest</option>
          <option value="mileage-asc">Mileage: Lowest</option>
        </Select>
        <div className="flex items-center rounded-xl border border-border-strong p-1">
          <button
            onClick={() => setParam("view", "grid")}
            className={cn("rounded-lg p-2", view === "grid" ? "bg-accent text-accent-foreground" : "text-muted")}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setParam("view", "list")}
            className={cn("rounded-lg p-2", view === "list" ? "bg-accent text-accent-foreground" : "text-muted")}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

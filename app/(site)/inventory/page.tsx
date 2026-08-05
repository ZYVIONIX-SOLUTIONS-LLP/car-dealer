import type { Metadata } from "next";
import { getVehicles, getBrands, getCategories, getFilterOptions } from "@/lib/data";
import type { InventoryFilters as Filters } from "@/lib/data";
import { InventoryFilters } from "@/components/site/inventory-filters";
import { InventoryToolbar } from "@/components/site/inventory-toolbar";
import { VehicleCard } from "@/components/site/vehicle-card";
import { VehicleRow } from "@/components/site/vehicle-row";
import { Pagination } from "@/components/site/pagination";
import { RecentlyViewedStrip } from "@/components/site/recently-viewed";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Inventory",
  description: "Browse our full inventory of verified pre-owned vehicles across every budget.",
};

type SearchParams = { [key: string]: string | string[] | undefined };

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const str = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;

  const filters: Filters = {
    q: str(sp.q),
    brand: str(sp.brand),
    category: str(sp.category),
    fuelType: str(sp.fuelType),
    transmission: str(sp.transmission),
    bodyType: str(sp.bodyType),
    location: str(sp.location),
    minPrice: str(sp.minPrice) ? Number(sp.minPrice) : undefined,
    maxPrice: str(sp.maxPrice) ? Number(sp.maxPrice) : undefined,
    minYear: str(sp.minYear) ? Number(sp.minYear) : undefined,
    maxYear: str(sp.maxYear) ? Number(sp.maxYear) : undefined,
    maxMileage: str(sp.maxMileage) ? Number(sp.maxMileage) : undefined,
    sort: (str(sp.sort) as Filters["sort"]) ?? "newest",
    page: str(sp.page) ? Number(sp.page) : 1,
  };
  const view = str(sp.view) === "list" ? "list" : "grid";

  const [{ items, total, page, pageCount }, brands, categories, filterOptions] = await Promise.all([
    getVehicles(filters),
    getBrands(),
    getCategories(),
    getFilterOptions(),
  ]);

  function buildHref(p: number) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(sp)) {
      if (typeof value === "string" && value) params.set(key, value);
    }
    params.set("page", String(p));
    return `/inventory?${params.toString()}`;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Full Inventory"
        title="Every Car, Every Budget"
        description="Filter by brand, body type, budget, and more to find exactly what you're looking for."
      />

      <div className="mt-8">
        <RecentlyViewedStrip />
      </div>

      <div className="mt-4 grid gap-8 lg:grid-cols-[280px_1fr]">
        <div className="space-y-4">
          <InventoryFilters
            brands={brands}
            categories={categories}
            fuelTypes={filterOptions.fuelTypes}
            transmissions={filterOptions.transmissions}
            bodyTypes={filterOptions.bodyTypes}
            locations={filterOptions.locations}
            bounds={filterOptions}
          />
        </div>

        <div className="space-y-6">
          <InventoryToolbar total={total} view={view} />

          {items.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-16 text-center">
              <p className="text-lg font-semibold text-foreground">No vehicles match your filters</p>
              <p className="mt-2 text-sm text-muted">Try widening your search criteria.</p>
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((v) => (
                <VehicleCard key={v.id} vehicle={v} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((v) => (
                <VehicleRow key={v.id} vehicle={v} />
              ))}
            </div>
          )}

          <Pagination page={page} pageCount={pageCount} buildHref={buildHref} />
        </div>
      </div>
    </div>
  );
}

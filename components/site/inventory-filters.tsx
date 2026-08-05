"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Select, Input, Label } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

type Option = { slug: string; name: string };

export function InventoryFilters({
  brands,
  categories,
  fuelTypes,
  transmissions,
  bodyTypes,
  locations,
  bounds,
}: {
  brands: Option[];
  categories: Option[];
  fuelTypes: string[];
  transmissions: string[];
  bodyTypes: string[];
  locations: string[];
  bounds: { minPrice: number; maxPrice: number; minYear: number; maxYear: number };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const get = (key: string) => searchParams.get(key) ?? "";

  const [form, setForm] = useState({
    q: get("q"),
    brand: get("brand"),
    category: get("category"),
    fuelType: get("fuelType"),
    transmission: get("transmission"),
    bodyType: get("bodyType"),
    location: get("location"),
    minPrice: get("minPrice"),
    maxPrice: get("maxPrice"),
    minYear: get("minYear"),
    maxYear: get("maxYear"),
    maxMileage: get("maxMileage"),
  });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function apply(overrides: Partial<typeof form> = {}) {
    const merged = { ...form, ...overrides };
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(merged)) {
      if (value) params.set(key, value);
    }
    const sort = searchParams.get("sort");
    if (sort) params.set("sort", sort);
    const view = searchParams.get("view");
    if (view) params.set("view", view);
    router.push(`${pathname}?${params.toString()}`);
    setMobileOpen(false);
  }

  function clearAll() {
    setForm({
      q: "",
      brand: "",
      category: "",
      fuelType: "",
      transmission: "",
      bodyType: "",
      location: "",
      minPrice: "",
      maxPrice: "",
      minYear: "",
      maxYear: "",
      maxMileage: "",
    });
    router.push(pathname);
    setMobileOpen(false);
  }

  const body = (
    <div className="space-y-5">
      <div>
        <Label htmlFor="q">Search</Label>
        <Input
          id="q"
          placeholder="Search model, brand..."
          value={form.q}
          onChange={(e) => update("q", e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && apply()}
        />
      </div>
      <div>
        <Label htmlFor="brand">Brand</Label>
        <Select id="brand" value={form.brand} onChange={(e) => apply({ brand: e.target.value })}>
          <option value="">All Brands</option>
          {brands.map((b) => (
            <option key={b.slug} value={b.slug}>{b.name}</option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="category">Body Type</Label>
        <Select id="category" value={form.category} onChange={(e) => apply({ category: e.target.value })}>
          <option value="">All Types</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="bodyType">Body Style</Label>
        <Select id="bodyType" value={form.bodyType} onChange={(e) => apply({ bodyType: e.target.value })}>
          <option value="">Any</option>
          {bodyTypes.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="fuelType">Fuel Type</Label>
        <Select id="fuelType" value={form.fuelType} onChange={(e) => apply({ fuelType: e.target.value })}>
          <option value="">Any Fuel</option>
          {fuelTypes.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="transmission">Transmission</Label>
        <Select id="transmission" value={form.transmission} onChange={(e) => apply({ transmission: e.target.value })}>
          <option value="">Any</option>
          {transmissions.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Select id="location" value={form.location} onChange={(e) => apply({ location: e.target.value })}>
          <option value="">Any Location</option>
          {locations.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </Select>
      </div>

      <div>
        <Label>
          Price Range ({formatPrice(bounds.minPrice)} – {formatPrice(bounds.maxPrice)})
        </Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={form.minPrice}
            onChange={(e) => update("minPrice", e.target.value)}
            onBlur={() => apply()}
          />
          <Input
            type="number"
            placeholder="Max"
            value={form.maxPrice}
            onChange={(e) => update("maxPrice", e.target.value)}
            onBlur={() => apply()}
          />
        </div>
      </div>

      <div>
        <Label>
          Year ({bounds.minYear} – {bounds.maxYear})
        </Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="From"
            value={form.minYear}
            onChange={(e) => update("minYear", e.target.value)}
            onBlur={() => apply()}
          />
          <Input
            type="number"
            placeholder="To"
            value={form.maxYear}
            onChange={(e) => update("maxYear", e.target.value)}
            onBlur={() => apply()}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="maxMileage">Max Mileage (km)</Label>
        <Input
          id="maxMileage"
          type="number"
          placeholder="e.g. 50000"
          value={form.maxMileage}
          onChange={(e) => update("maxMileage", e.target.value)}
          onBlur={() => apply()}
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button className="flex-1" onClick={() => apply()}>Apply Filters</Button>
        <Button variant="outline" onClick={clearAll}>Clear</Button>
      </div>
    </div>
  );

  return (
    <>
      <div className="lg:hidden">
        <Button variant="secondary" className="w-full" onClick={() => setMobileOpen(true)}>
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="relative ml-auto flex h-full w-80 max-w-full flex-col overflow-y-auto bg-background-secondary p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-foreground">Filters</h3>
              <button onClick={() => setMobileOpen(false)} aria-label="Close">
                <X className="h-5 w-5 text-muted" />
              </button>
            </div>
            {body}
          </div>
        </div>
      )}

      <aside className="hidden rounded-2xl border border-border bg-card p-5 lg:block">
        <h3 className="mb-4 font-display text-lg font-semibold text-foreground">Filters</h3>
        {body}
      </aside>
    </>
  );
}

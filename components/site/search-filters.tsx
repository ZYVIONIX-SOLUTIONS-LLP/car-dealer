"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

type Option = { slug: string; name: string };

export function SearchFilters({
  brands,
  categories,
  fuelTypes,
  transmissions,
}: {
  brands: Option[];
  categories: Option[];
  fuelTypes: string[];
  transmissions: string[];
}) {
  const router = useRouter();
  const [values, setValues] = useState({ brand: "", category: "", fuelType: "", transmission: "" });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (values.brand) params.set("brand", values.brand);
    if (values.category) params.set("category", values.category);
    if (values.fuelType) params.set("fuelType", values.fuelType);
    if (values.transmission) params.set("transmission", values.transmission);
    router.push(`/inventory${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <section className="relative z-10 mx-auto -mt-8 max-w-6xl px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={submit}
        className="glass grid grid-cols-2 gap-3 rounded-2xl border border-border p-4 shadow-2xl shadow-black/40 sm:grid-cols-3 lg:grid-cols-5 lg:items-end lg:gap-4 lg:p-5"
      >
        <Field label="Brand">
          <Select value={values.brand} onChange={(e) => setValues((v) => ({ ...v, brand: e.target.value }))}>
            <option value="">All Brands</option>
            {brands.map((b) => (
              <option key={b.slug} value={b.slug}>
                {b.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Body Type">
          <Select value={values.category} onChange={(e) => setValues((v) => ({ ...v, category: e.target.value }))}>
            <option value="">All Types</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Fuel Type">
          <Select value={values.fuelType} onChange={(e) => setValues((v) => ({ ...v, fuelType: e.target.value }))}>
            <option value="">Any Fuel</option>
            {fuelTypes.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Transmission">
          <Select
            value={values.transmission}
            onChange={(e) => setValues((v) => ({ ...v, transmission: e.target.value }))}
          >
            <option value="">Any</option>
            {transmissions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </Field>
        <Button type="submit" className="col-span-2 w-full sm:col-span-1 lg:col-span-1">
          <Search className="h-4 w-4" />
          Search
        </Button>
      </form>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted">{label}</span>
      {children}
    </label>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { GitCompareArrows, X } from "lucide-react";
import { useCollection } from "@/lib/collections";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { formatMileage, formatPrice } from "@/lib/utils";
import type { VehicleDetail } from "@/lib/data";

const ROWS: { label: string; render: (v: VehicleDetail) => React.ReactNode }[] = [
  { label: "Price", render: (v) => formatPrice(v.price) },
  { label: "Year", render: (v) => v.year },
  { label: "Mileage", render: (v) => formatMileage(v.mileage) },
  { label: "Fuel Type", render: (v) => v.fuelType },
  { label: "Transmission", render: (v) => v.transmission },
  { label: "Body Type", render: (v) => v.bodyType },
  { label: "Engine", render: (v) => v.engine },
  { label: "Horsepower", render: (v) => `${v.horsepower} bhp` },
  { label: "Exterior Color", render: (v) => v.exteriorColor },
  { label: "Owners", render: (v) => v.ownerCount },
  { label: "Location", render: (v) => v.location },
];

export function CompareClient() {
  const compare = useCollection("compare");
  const [vehicles, setVehicles] = useState<VehicleDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const isEmpty = compare.ids.length === 0;

  useEffect(() => {
    if (isEmpty) return;
    fetch(`/api/vehicles?ids=${compare.ids.join(",")}`)
      .then((r) => r.json())
      .then((data) => setVehicles(data.vehicles))
      .finally(() => setLoading(false));
  }, [compare.ids, isEmpty]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Side by Side" title="Compare Vehicles" />

      {isEmpty || (!loading && vehicles.length === 0) ? (
        <div className="mt-10 flex flex-col items-center rounded-3xl border border-border bg-card p-16 text-center">
          <GitCompareArrows className="h-10 w-10 text-muted-foreground" />
          <p className="mt-4 text-lg font-semibold text-foreground">No vehicles selected</p>
          <p className="mt-2 text-sm text-muted">Add cars from the inventory to compare them side by side.</p>
          <ButtonLink href="/inventory" className="mt-6">Browse Inventory</ButtonLink>
        </div>
      ) : (
        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[640px] border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="w-40" />
                {vehicles.map((v) => (
                  <th key={v.id} className="min-w-[220px] rounded-t-2xl border border-border bg-card p-4 text-left align-top">
                    <button
                      onClick={() => compare.remove(v.id)}
                      className="mb-2 flex h-7 w-7 items-center justify-center rounded-full border border-border-strong text-muted hover:text-accent"
                      aria-label="Remove"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-background-secondary">
                      {v.images[0] && <Image src={v.images[0].url} alt={v.model} fill sizes="220px" className="object-cover" />}
                    </div>
                    <Link href={`/inventory/${v.slug}`} className="mt-3 block font-display text-sm font-semibold text-foreground hover:text-accent">
                      {v.brand.name} {v.model} {v.variant}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => (
                <tr key={row.label}>
                  <td className={`border-x border-border bg-background-secondary p-4 text-xs font-semibold uppercase tracking-wider text-muted ${i === ROWS.length - 1 ? "rounded-bl-2xl border-b" : ""}`}>
                    {row.label}
                  </td>
                  {vehicles.map((v) => (
                    <td key={v.id} className={`border-x border-border bg-card p-4 text-sm text-foreground ${i === ROWS.length - 1 ? "border-b" : ""}`}>
                      {row.render(v)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

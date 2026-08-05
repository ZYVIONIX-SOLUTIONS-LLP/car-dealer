import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { VehicleRowActions } from "@/components/admin/vehicle-row-actions";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Vehicles" };

export default async function AdminVehiclesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const vehicles = await db.vehicle.findMany({
    where: q
      ? {
          OR: [
            { model: { contains: q } },
            { variant: { contains: q } },
            { brand: { name: { contains: q } } },
          ],
        }
      : undefined,
    include: { brand: true, images: { orderBy: { order: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Vehicles</h1>
          <p className="mt-1 text-sm text-muted">{vehicles.length} listings in your inventory.</p>
        </div>
        <div className="flex items-center gap-3">
          <form className="hidden sm:block">
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search vehicles..."
              className="h-11 w-64 rounded-full border border-border-strong bg-background-secondary px-4 text-sm text-foreground outline-none focus:border-accent"
            />
          </form>
          <Link
            href="/admin/vehicles/new"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-medium text-accent-foreground hover:bg-accent-hover"
          >
            <Plus className="h-4 w-4" />
            Add Vehicle
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3 font-medium">Vehicle</th>
              <th className="px-5 py-3 font-medium">Price</th>
              <th className="px-5 py-3 font-medium">Year</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => (
              <tr key={v.id} className="border-b border-border last:border-0">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-background-secondary">
                      {v.images[0] && <Image src={v.images[0].url} alt="" fill sizes="64px" className="object-cover" />}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{v.brand.name} {v.model}</p>
                      <p className="text-xs text-muted-foreground">{v.variant}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-foreground">{formatPrice(v.price)}</td>
                <td className="px-5 py-3 text-muted">{v.year}</td>
                <td className="px-5 py-3">
                  <div className="flex gap-1.5">
                    {v.featured && <Badge tone="accent">Featured</Badge>}
                    {v.sold ? <Badge tone="success">Sold</Badge> : <Badge tone="neutral">In Stock</Badge>}
                  </div>
                </td>
                <td className="px-5 py-3">
                  <VehicleRowActions id={v.id} featured={v.featured} sold={v.sold} />
                </td>
              </tr>
            ))}
            {vehicles.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-16 text-center text-muted">
                  No vehicles found. <Link href="/admin/vehicles/new" className="text-accent">Add your first vehicle</Link>.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

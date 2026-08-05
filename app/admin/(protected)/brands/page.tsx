import type { Metadata } from "next";
import { db } from "@/lib/db";
import { Input, Label } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/delete-button";
import { createBrand, deleteBrand } from "@/app/actions/catalog";

export const metadata: Metadata = { title: "Brands" };

export default async function AdminBrandsPage() {
  const brands = await db.brand.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { vehicles: true } } },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground">Brands</h1>
        <p className="mt-1 text-sm text-muted">Manufacturers available across your inventory.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <form action={createBrand} className="h-fit space-y-4 rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display text-base font-semibold text-foreground">Add Brand</h3>
          <div>
            <Label htmlFor="b-name">Brand Name</Label>
            <Input id="b-name" name="name" placeholder="e.g. Kia" required />
          </div>
          <Button type="submit" className="w-full">Add Brand</Button>
        </form>

        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 font-medium">Brand</th>
                <th className="px-5 py-3 font-medium">Listings</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((b) => (
                <tr key={b.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3 font-medium text-foreground">{b.name}</td>
                  <td className="px-5 py-3 text-muted">{b._count.vehicles}</td>
                  <td className="px-5 py-3">
                    <DeleteButton
                      action={deleteBrand}
                      id={b.id}
                      confirmMessage="Delete this brand?"
                      disabled={b._count.vehicles > 0}
                      disabledTitle="Reassign or remove vehicles first"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

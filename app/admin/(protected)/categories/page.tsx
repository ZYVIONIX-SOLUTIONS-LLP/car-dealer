import type { Metadata } from "next";
import { db } from "@/lib/db";
import { Input, Label, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/delete-button";
import { createCategory, deleteCategory } from "@/app/actions/catalog";

export const metadata: Metadata = { title: "Categories" };

const ICONS = ["wallet", "car", "car-front", "truck", "users", "zap", "leaf", "gem", "crown", "flag"];

export default async function AdminCategoriesPage() {
  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { vehicles: true } } },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground">Categories</h1>
        <p className="mt-1 text-sm text-muted">Body-style and lifestyle categories shown on the homepage.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <form action={createCategory} className="h-fit space-y-4 rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display text-base font-semibold text-foreground">Add Category</h3>
          <div>
            <Label htmlFor="c-name">Category Name</Label>
            <Input id="c-name" name="name" placeholder="e.g. Convertibles" required />
          </div>
          <div>
            <Label htmlFor="c-icon">Icon</Label>
            <Select id="c-icon" name="icon" defaultValue="car">
              {ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
            </Select>
          </div>
          <Button type="submit" className="w-full">Add Category</Button>
        </form>

        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Listings</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3 font-medium text-foreground">{c.name}</td>
                  <td className="px-5 py-3 text-muted">{c._count.vehicles}</td>
                  <td className="px-5 py-3">
                    <DeleteButton
                      action={deleteCategory}
                      id={c.id}
                      confirmMessage="Delete this category?"
                      disabled={c._count.vehicles > 0}
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

import type { Metadata } from "next";
import { db } from "@/lib/db";
import { VehicleForm } from "@/components/admin/vehicle-form";
import { createVehicle } from "@/app/actions/vehicles";

export const metadata: Metadata = { title: "Add Vehicle" };

export default async function NewVehiclePage() {
  const [brands, categories] = await Promise.all([
    db.brand.findMany({ orderBy: { name: "asc" } }),
    db.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground">Add Vehicle</h1>
        <p className="mt-1 text-sm text-muted">Create a new listing for your inventory.</p>
      </div>
      <VehicleForm action={createVehicle} brands={brands} categories={categories} />
    </div>
  );
}

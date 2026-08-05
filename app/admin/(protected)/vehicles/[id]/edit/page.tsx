import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { vehicleDetailInclude } from "@/lib/data";
import { VehicleForm } from "@/components/admin/vehicle-form";
import { updateVehicle } from "@/app/actions/vehicles";

export const metadata: Metadata = { title: "Edit Vehicle" };

export default async function EditVehiclePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [vehicle, brands, categories] = await Promise.all([
    db.vehicle.findUnique({ where: { id }, include: vehicleDetailInclude }),
    db.brand.findMany({ orderBy: { name: "asc" } }),
    db.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!vehicle) notFound();

  const boundAction = updateVehicle.bind(null, id);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Edit {vehicle.brand.name} {vehicle.model}
        </h1>
        <p className="mt-1 text-sm text-muted">Update listing details and photos.</p>
      </div>
      <VehicleForm action={boundAction} brands={brands} categories={categories} vehicle={vehicle} />
    </div>
  );
}

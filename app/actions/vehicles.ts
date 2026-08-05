"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/dal";
import { slugify } from "@/lib/utils";
import { VehicleSchema, type VehicleFormState } from "@/lib/definitions";

function parseFeatures(raw: string | null) {
  if (!raw) return [];
  return raw
    .split(",")
    .map((f) => f.trim())
    .filter(Boolean);
}

function parseImages(raw: string | null) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as string[]).filter((u) => typeof u === "string") : [];
  } catch {
    return [];
  }
}

export async function createVehicle(_prevState: VehicleFormState, formData: FormData): Promise<VehicleFormState> {
  await verifySession();

  const raw = Object.fromEntries(formData.entries());
  const validated = VehicleSchema.safeParse(raw);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, message: "Please fix the errors below." };
  }

  const data = validated.data;
  const images = parseImages(formData.get("images") as string | null);
  const features = parseFeatures(data.features ?? null);

  const baseSlug = slugify(`${data.model}-${data.variant}-${data.year}`);
  let slug = baseSlug;
  let suffix = 1;
  while (await db.vehicle.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${suffix++}`;
  }

  const vehicle = await db.vehicle.create({
    data: {
      slug,
      brandId: data.brandId,
      categoryId: data.categoryId,
      model: data.model,
      variant: data.variant,
      year: data.year,
      price: data.price,
      originalPrice: data.originalPrice || null,
      mileage: data.mileage,
      fuelType: data.fuelType,
      transmission: data.transmission,
      bodyType: data.bodyType,
      engine: data.engine,
      horsepower: data.horsepower,
      exteriorColor: data.exteriorColor,
      interiorColor: data.interiorColor,
      vin: data.vin,
      registrationYear: data.registrationYear,
      ownerCount: data.ownerCount,
      serviceHistory: data.serviceHistory,
      inspectionStatus: data.inspectionStatus,
      location: data.location,
      description: data.description,
      discountLabel: data.discountLabel || null,
      featured: !!data.featured,
      sold: !!data.sold,
      images: { create: images.map((url, order) => ({ url, order })) },
      features: { create: features.map((label) => ({ label })) },
    },
  });

  revalidatePath("/admin/vehicles");
  revalidatePath("/inventory");
  revalidatePath("/");
  redirect(`/admin/vehicles/${vehicle.id}/edit?created=1`);
}

export async function updateVehicle(
  id: string,
  _prevState: VehicleFormState,
  formData: FormData
): Promise<VehicleFormState> {
  await verifySession();

  const raw = Object.fromEntries(formData.entries());
  const validated = VehicleSchema.safeParse(raw);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, message: "Please fix the errors below." };
  }

  const data = validated.data;
  const images = parseImages(formData.get("images") as string | null);
  const features = parseFeatures(data.features ?? null);

  await db.vehicle.update({
    where: { id },
    data: {
      brandId: data.brandId,
      categoryId: data.categoryId,
      model: data.model,
      variant: data.variant,
      year: data.year,
      price: data.price,
      originalPrice: data.originalPrice || null,
      mileage: data.mileage,
      fuelType: data.fuelType,
      transmission: data.transmission,
      bodyType: data.bodyType,
      engine: data.engine,
      horsepower: data.horsepower,
      exteriorColor: data.exteriorColor,
      interiorColor: data.interiorColor,
      vin: data.vin,
      registrationYear: data.registrationYear,
      ownerCount: data.ownerCount,
      serviceHistory: data.serviceHistory,
      inspectionStatus: data.inspectionStatus,
      location: data.location,
      description: data.description,
      discountLabel: data.discountLabel || null,
      featured: !!data.featured,
      sold: !!data.sold,
      images: { deleteMany: {}, create: images.map((url, order) => ({ url, order })) },
      features: { deleteMany: {}, create: features.map((label) => ({ label })) },
    },
  });

  revalidatePath("/admin/vehicles");
  revalidatePath("/inventory");
  revalidatePath("/");
  return { message: "Vehicle updated successfully." };
}

export async function deleteVehicle(formData: FormData) {
  await verifySession();
  const id = formData.get("id") as string;
  await db.vehicle.delete({ where: { id } });
  revalidatePath("/admin/vehicles");
  revalidatePath("/inventory");
  revalidatePath("/");
}

export async function toggleVehicleFlag(formData: FormData) {
  await verifySession();
  const id = formData.get("id") as string;
  const field = formData.get("field") as "featured" | "sold";
  const value = formData.get("value") === "true";
  await db.vehicle.update({ where: { id }, data: { [field]: value } });
  revalidatePath("/admin/vehicles");
  revalidatePath("/inventory");
  revalidatePath("/");
}

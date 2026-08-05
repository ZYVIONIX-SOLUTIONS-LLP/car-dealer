"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/dal";
import { slugify } from "@/lib/utils";

export async function createBrand(formData: FormData) {
  await verifySession();
  const name = (formData.get("name") as string)?.trim();
  if (!name) return;
  const slug = slugify(name);
  await db.brand.upsert({
    where: { slug },
    update: {},
    create: { name, slug, logoUrl: "" },
  });
  revalidatePath("/admin/brands");
  revalidatePath("/");
  revalidatePath("/inventory");
}

export async function deleteBrand(formData: FormData) {
  await verifySession();
  const id = formData.get("id") as string;
  const count = await db.vehicle.count({ where: { brandId: id } });
  if (count > 0) return;
  await db.brand.delete({ where: { id } });
  revalidatePath("/admin/brands");
  revalidatePath("/");
}

export async function createCategory(formData: FormData) {
  await verifySession();
  const name = (formData.get("name") as string)?.trim();
  const icon = (formData.get("icon") as string) || "car";
  if (!name) return;
  const slug = slugify(name);
  await db.category.upsert({
    where: { slug },
    update: {},
    create: { name, slug, icon },
  });
  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidatePath("/inventory");
}

export async function deleteCategory(formData: FormData) {
  await verifySession();
  const id = formData.get("id") as string;
  const count = await db.vehicle.count({ where: { categoryId: id } });
  if (count > 0) return;
  await db.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
  revalidatePath("/");
}

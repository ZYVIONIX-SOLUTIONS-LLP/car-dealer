"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/dal";

export async function createTestimonial(formData: FormData) {
  await verifySession();
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const quote = formData.get("quote") as string;
  const rating = Number(formData.get("rating")) || 5;

  if (!name || !role || !quote) return;

  await db.testimonial.create({
    data: { name, role, quote, rating, avatarUrl: "", featured: true },
  });

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

export async function deleteTestimonial(formData: FormData) {
  await verifySession();
  const id = formData.get("id") as string;
  await db.testimonial.delete({ where: { id } });
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

export async function toggleTestimonialFeatured(formData: FormData) {
  await verifySession();
  const id = formData.get("id") as string;
  const value = formData.get("value") === "true";
  await db.testimonial.update({ where: { id }, data: { featured: value } });
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

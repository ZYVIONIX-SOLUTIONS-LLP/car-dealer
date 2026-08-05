"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/dal";
import { EnquirySchema, type EnquiryFormState } from "@/lib/definitions";

export async function submitEnquiry(
  _prevState: EnquiryFormState,
  formData: FormData
): Promise<EnquiryFormState> {
  const validated = EnquirySchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email") ?? "",
    vehicleId: formData.get("vehicleId") ?? "",
    budget: formData.get("budget") ?? "",
    message: formData.get("message") ?? "",
    type: formData.get("type") || "general",
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: "Please check the fields below.",
    };
  }

  const { name, phone, email, vehicleId, budget, message, type } = validated.data;

  const carBrand = formData.get("carBrand");
  const carModel = formData.get("carModel");
  const carYear = formData.get("carYear");
  const carKm = formData.get("carKm");
  const carDetails = [
    carBrand ? `Brand: ${carBrand}` : null,
    carModel ? `Model: ${carModel}` : null,
    carYear ? `Year: ${carYear}` : null,
    carKm ? `Odometer: ${carKm} km` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const finalMessage = [carDetails, message].filter(Boolean).join("\n");

  await db.enquiry.create({
    data: {
      name,
      phone,
      email: email || undefined,
      vehicleId: vehicleId || undefined,
      budget: budget || undefined,
      message: finalMessage || undefined,
      type,
    },
  });

  revalidatePath("/admin/enquiries");
  revalidatePath("/admin/dashboard");
  return { success: true, message: "Thanks! Our team will reach out to you shortly." };
}

export async function updateEnquiryStatus(formData: FormData) {
  await verifySession();
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;
  await db.enquiry.update({ where: { id }, data: { status } });
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin/dashboard");
}

export async function deleteEnquiry(formData: FormData) {
  await verifySession();
  const id = formData.get("id") as string;
  await db.enquiry.delete({ where: { id } });
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin/dashboard");
}

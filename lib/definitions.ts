import * as z from "zod";

export const EnquirySchema = z.object({
  name: z.string().trim().min(2, "Enter your full name"),
  phone: z.string().trim().min(7, "Enter a valid phone number"),
  email: z.email("Enter a valid email").optional().or(z.literal("")),
  vehicleId: z.string().optional().or(z.literal("")),
  budget: z.string().optional().or(z.literal("")),
  message: z.string().optional().or(z.literal("")),
  type: z.enum(["general", "callback", "test-drive", "valuation"]).default("general"),
});

export type EnquiryFormState = {
  errors?: Partial<Record<keyof z.infer<typeof EnquirySchema>, string[]>>;
  success?: boolean;
  message?: string;
} | undefined;

export const LoginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormState = {
  error?: string;
} | undefined;

export const VehicleSchema = z.object({
  brandId: z.string().min(1, "Select a brand"),
  categoryId: z.string().min(1, "Select a category"),
  model: z.string().trim().min(1, "Model is required"),
  variant: z.string().trim().min(1, "Variant is required"),
  year: z.coerce.number().int().min(1980).max(new Date().getFullYear() + 1),
  price: z.coerce.number().int().min(1),
  originalPrice: z.coerce.number().int().optional(),
  mileage: z.coerce.number().int().min(0),
  fuelType: z.string().min(1),
  transmission: z.string().min(1),
  bodyType: z.string().min(1),
  engine: z.string().min(1),
  horsepower: z.coerce.number().int().min(0),
  exteriorColor: z.string().min(1),
  interiorColor: z.string().min(1),
  vin: z.string().min(1),
  registrationYear: z.coerce.number().int().min(1980),
  ownerCount: z.coerce.number().int().min(1),
  serviceHistory: z.string().min(1),
  inspectionStatus: z.string().min(1),
  location: z.string().min(1),
  description: z.string().min(1),
  discountLabel: z.string().optional(),
  featured: z.coerce.boolean().optional(),
  sold: z.coerce.boolean().optional(),
  features: z.string().optional(),
});

export type VehicleFormState = {
  errors?: Record<string, string[]>;
  message?: string;
} | undefined;

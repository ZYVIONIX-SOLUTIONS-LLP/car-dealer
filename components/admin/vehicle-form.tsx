"use client";

import { useActionState } from "react";
import { Input, Textarea, Select, Label } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/admin/image-uploader";
import type { VehicleFormState } from "@/lib/definitions";
import type { VehicleDetail } from "@/lib/data";

type Option = { id: string; name: string };

const FUEL_TYPES = ["Petrol", "Diesel", "Electric", "Petrol Hybrid", "Diesel Hybrid", "CNG"];
const TRANSMISSIONS = ["Manual", "Automatic"];
const BODY_TYPES = ["Hatchback", "Sedan", "SUV", "MPV", "Pickup Truck", "Coupe", "Convertible"];

export function VehicleForm({
  action,
  brands,
  categories,
  vehicle,
}: {
  action: (state: VehicleFormState, formData: FormData) => Promise<VehicleFormState>;
  brands: Option[];
  categories: Option[];
  vehicle?: VehicleDetail;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const err = (key: string) => state?.errors?.[key]?.[0];

  return (
    <form action={formAction} className="space-y-8">
      <Section title="Photos">
        <ImageUploader initialImages={vehicle?.images.map((i) => i.url) ?? []} />
      </Section>

      <Section title="Basic Details">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Brand" error={err("brandId")}>
            <Select name="brandId" defaultValue={vehicle?.brandId} required>
              <option value="">Select brand</option>
              {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </Select>
          </Field>
          <Field label="Category" error={err("categoryId")}>
            <Select name="categoryId" defaultValue={vehicle?.categoryId} required>
              <option value="">Select category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </Field>
          <Field label="Body Type" error={err("bodyType")}>
            <Select name="bodyType" defaultValue={vehicle?.bodyType} required>
              <option value="">Select body type</option>
              {BODY_TYPES.map((b) => <option key={b} value={b}>{b}</option>)}
            </Select>
          </Field>
          <Field label="Model" error={err("model")}>
            <Input name="model" defaultValue={vehicle?.model} placeholder="e.g. Creta" required />
          </Field>
          <Field label="Variant" error={err("variant")}>
            <Input name="variant" defaultValue={vehicle?.variant} placeholder="e.g. SX(O)" required />
          </Field>
          <Field label="Year" error={err("year")}>
            <Input name="year" type="number" defaultValue={vehicle?.year} required />
          </Field>
        </div>
      </Section>

      <Section title="Pricing">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Price (₹)" error={err("price")}>
            <Input name="price" type="number" defaultValue={vehicle?.price} required />
          </Field>
          <Field label="Original Price (₹, optional)">
            <Input name="originalPrice" type="number" defaultValue={vehicle?.originalPrice ?? undefined} />
          </Field>
          <Field label="Discount Label (optional)">
            <Input name="discountLabel" defaultValue={vehicle?.discountLabel ?? undefined} placeholder="e.g. Hot Deal" />
          </Field>
        </div>
      </Section>

      <Section title="Specifications">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Mileage (km)" error={err("mileage")}>
            <Input name="mileage" type="number" defaultValue={vehicle?.mileage} required />
          </Field>
          <Field label="Fuel Type" error={err("fuelType")}>
            <Select name="fuelType" defaultValue={vehicle?.fuelType} required>
              <option value="">Select fuel type</option>
              {FUEL_TYPES.map((f) => <option key={f} value={f}>{f}</option>)}
            </Select>
          </Field>
          <Field label="Transmission" error={err("transmission")}>
            <Select name="transmission" defaultValue={vehicle?.transmission} required>
              <option value="">Select transmission</option>
              {TRANSMISSIONS.map((t) => <option key={t} value={t}>{t}</option>)}
            </Select>
          </Field>
          <Field label="Engine" error={err("engine")}>
            <Input name="engine" defaultValue={vehicle?.engine} placeholder="e.g. 1.5L Turbo" required />
          </Field>
          <Field label="Horsepower" error={err("horsepower")}>
            <Input name="horsepower" type="number" defaultValue={vehicle?.horsepower} required />
          </Field>
          <Field label="Exterior Color" error={err("exteriorColor")}>
            <Input name="exteriorColor" defaultValue={vehicle?.exteriorColor} required />
          </Field>
          <Field label="Interior Color" error={err("interiorColor")}>
            <Input name="interiorColor" defaultValue={vehicle?.interiorColor} required />
          </Field>
          <Field label="VIN" error={err("vin")}>
            <Input name="vin" defaultValue={vehicle?.vin} required />
          </Field>
          <Field label="Registration Year" error={err("registrationYear")}>
            <Input name="registrationYear" type="number" defaultValue={vehicle?.registrationYear} required />
          </Field>
          <Field label="Owner Count" error={err("ownerCount")}>
            <Input name="ownerCount" type="number" defaultValue={vehicle?.ownerCount ?? 1} required />
          </Field>
          <Field label="Location" error={err("location")}>
            <Input name="location" defaultValue={vehicle?.location} placeholder="e.g. Mumbai, MH" required />
          </Field>
          <Field label="Inspection Status" error={err("inspectionStatus")}>
            <Input name="inspectionStatus" defaultValue={vehicle?.inspectionStatus ?? "Passed 150-Point Inspection"} required />
          </Field>
        </div>
        <Field label="Service History" error={err("serviceHistory")} className="mt-4">
          <Input name="serviceHistory" defaultValue={vehicle?.serviceHistory} required />
        </Field>
      </Section>

      <Section title="Description & Features">
        <Field label="Description" error={err("description")}>
          <Textarea name="description" rows={4} defaultValue={vehicle?.description} required />
        </Field>
        <Field label="Features (comma-separated)" className="mt-4">
          <Textarea
            name="features"
            rows={3}
            defaultValue={vehicle?.features.map((f) => f.label).join(", ")}
            placeholder="Sunroof, Leather Seats, Cruise Control"
          />
        </Field>
      </Section>

      <Section title="Status">
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" name="featured" value="true" defaultChecked={vehicle?.featured} className="h-4 w-4 accent-[#ff6a00]" />
            Featured Listing
          </label>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" name="sold" value="true" defaultChecked={vehicle?.sold} className="h-4 w-4 accent-[#ff6a00]" />
            Mark as Sold
          </label>
        </div>
      </Section>

      {state?.message && (
        <p className={`text-sm ${state.errors ? "text-red-400" : "text-success"}`}>{state.message}</p>
      )}

      <div className="flex gap-3">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Saving..." : vehicle ? "Save Changes" : "Create Vehicle"}
        </Button>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="mb-5 font-display text-base font-semibold text-foreground">{title}</h3>
      {children}
    </div>
  );
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { getVehicleBySlug, getRelatedVehicles } from "@/lib/data";
import { ImageGallery } from "@/components/site/image-gallery";
import { VehicleSpecs } from "@/components/site/vehicle-specs";
import { FinanceCalculator } from "@/components/site/finance-calculator";
import { VehicleEnquiryForm } from "@/components/site/vehicle-enquiry-form";
import { VehicleGridSection } from "@/components/site/vehicle-grid-section";
import { RecentlyViewedTracker } from "@/components/site/recently-viewed";
import { Badge } from "@/components/ui/badge";
import { formatMileage, formatPrice } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) return { title: "Vehicle Not Found" };
  return {
    title: `${vehicle.brand.name} ${vehicle.model} ${vehicle.variant} (${vehicle.year})`,
    description: vehicle.description,
  };
}

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) notFound();

  const related = await getRelatedVehicles(vehicle, 3);
  const name = `${vehicle.brand.name} ${vehicle.model} ${vehicle.variant}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <RecentlyViewedTracker
        vehicle={{
          id: vehicle.id,
          slug: vehicle.slug,
          brand: vehicle.brand.name,
          model: vehicle.model,
          variant: vehicle.variant,
          price: vehicle.price,
          image: vehicle.images[0]?.url,
        }}
      />

      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/inventory" className="hover:text-foreground">Inventory</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap gap-2">
                {vehicle.featured && <Badge tone="accent">Featured</Badge>}
                {vehicle.discountLabel && <Badge tone="success">{vehicle.discountLabel}</Badge>}
                <Badge tone="outline">{vehicle.year}</Badge>
              </div>
              <h1 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">{name}</h1>
              <p className="mt-1 text-sm text-muted">
                {formatMileage(vehicle.mileage)} · {vehicle.fuelType} · {vehicle.transmission} · {vehicle.location}
              </p>
            </div>
            <div className="text-right">
              {vehicle.originalPrice && (
                <p className="text-sm text-muted-foreground line-through">{formatPrice(vehicle.originalPrice)}</p>
              )}
              <p className="font-display text-3xl font-bold text-accent">{formatPrice(vehicle.price)}</p>
            </div>
          </div>

          <ImageGallery images={vehicle.images} alt={name} />

          <div className="mt-10">
            <h2 className="font-display text-xl font-semibold text-foreground">Overview</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{vehicle.description}</p>
          </div>

          <div className="mt-8">
            <h2 className="mb-4 font-display text-xl font-semibold text-foreground">Specifications</h2>
            <VehicleSpecs vehicle={vehicle} />
          </div>

          {vehicle.features.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-4 font-display text-xl font-semibold text-foreground">Features</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {vehicle.features.map((f) => (
                  <div key={f.id} className="flex items-center gap-2 text-sm text-muted">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" />
                    {f.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8">
            <FinanceCalculator price={vehicle.price} />
          </div>
        </div>

        <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <VehicleEnquiryForm vehicleId={vehicle.id} vehicleName={name} price={formatPrice(vehicle.price)} />
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-display text-base font-semibold text-foreground">Dealer Information</h3>
            <p className="mt-2 text-sm text-muted">Velocity Motors — Certified Pre-Owned Dealer</p>
            <p className="mt-1 text-sm text-muted-foreground">12 Marine Drive, Mumbai, MH 400001</p>
            <p className="mt-1 text-sm text-muted-foreground">Open Mon–Sun, 9 AM – 8 PM</p>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <VehicleGridSection
          eyebrow="You Might Also Like"
          title="Related Vehicles"
          vehicles={related}
        />
      </div>
    </div>
  );
}

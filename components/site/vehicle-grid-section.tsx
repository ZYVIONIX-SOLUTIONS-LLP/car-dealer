import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { VehicleCard } from "@/components/site/vehicle-card";
import type { VehicleCard as VehicleCardType } from "@/lib/data";

export function VehicleGridSection({
  eyebrow,
  title,
  description,
  vehicles,
  viewAllHref,
  tinted,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  vehicles: VehicleCardType[];
  viewAllHref?: string;
  tinted?: boolean;
}) {
  if (vehicles.length === 0) return null;

  return (
    <section className={tinted ? "border-y border-border bg-background-secondary py-20" : "py-20"}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading eyebrow={eyebrow} title={title} description={description} />
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-hover"
            >
              View All Vehicles <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </div>
    </section>
  );
}

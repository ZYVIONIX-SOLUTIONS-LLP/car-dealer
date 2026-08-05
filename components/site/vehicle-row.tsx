"use client";

import Image from "next/image";
import Link from "next/link";
import { Gauge, Fuel, Cog, MapPin, Heart, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { useCollection } from "@/lib/collections";
import { cn, formatMileage, formatPrice } from "@/lib/utils";
import type { VehicleCard as VehicleCardType } from "@/lib/data";

export function VehicleRow({ vehicle }: { vehicle: VehicleCardType }) {
  const wishlist = useCollection("wishlist");
  const image = vehicle.images[0];

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-border-strong sm:flex-row">
      <Link href={`/inventory/${vehicle.slug}`} className="relative block h-48 shrink-0 overflow-hidden rounded-xl bg-background-secondary sm:h-auto sm:w-64">
        {image && (
          <Image src={image.url} alt={vehicle.model} fill sizes="256px" className="object-cover" />
        )}
        <div className="absolute left-2 top-2 flex gap-2">
          {vehicle.featured && <Badge tone="accent">Featured</Badge>}
          {vehicle.discountLabel && <Badge tone="success">{vehicle.discountLabel}</Badge>}
        </div>
      </Link>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">{vehicle.brand.name}</p>
            <Link href={`/inventory/${vehicle.slug}`}>
              <h3 className="mt-1 font-display text-xl font-semibold text-foreground hover:text-accent">
                {vehicle.model} {vehicle.variant} · {vehicle.year}
              </h3>
            </Link>
          </div>
          <button
            onClick={() => wishlist.toggle(vehicle.id)}
            aria-label="Toggle wishlist"
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border",
              wishlist.has(vehicle.id) ? "border-accent bg-accent/10 text-accent" : "border-border-strong text-muted"
            )}
          >
            <Heart className={cn("h-4 w-4", wishlist.has(vehicle.id) && "fill-current")} />
          </button>
        </div>

        <p className="mt-2 line-clamp-2 text-sm text-muted">{vehicle.description}</p>

        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted">
          <span className="flex items-center gap-1"><Gauge className="h-3.5 w-3.5" />{formatMileage(vehicle.mileage)}</span>
          <span className="flex items-center gap-1"><Fuel className="h-3.5 w-3.5" />{vehicle.fuelType}</span>
          <span className="flex items-center gap-1"><Cog className="h-3.5 w-3.5" />{vehicle.transmission}</span>
          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{vehicle.location}</span>
          <span className="flex items-center gap-1 text-success"><ShieldCheck className="h-3.5 w-3.5" />Verified</span>
        </div>

        <div className="mt-auto flex items-end justify-between pt-4">
          <div>
            {vehicle.originalPrice && (
              <p className="text-xs text-muted-foreground line-through">{formatPrice(vehicle.originalPrice)}</p>
            )}
            <p className="font-display text-2xl font-bold text-foreground">{formatPrice(vehicle.price)}</p>
          </div>
          <ButtonLink href={`/inventory/${vehicle.slug}`} size="sm" className="px-6">
            View Details
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

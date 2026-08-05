"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, GitCompareArrows, Gauge, Fuel, Cog, MapPin, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCollection } from "@/lib/collections";
import { cn, formatMileage, formatPrice } from "@/lib/utils";
import type { VehicleCard as VehicleCardType } from "@/lib/data";

export function VehicleCard({ vehicle, className }: { vehicle: VehicleCardType; className?: string }) {
  const wishlist = useCollection("wishlist");
  const compare = useCollection("compare");
  const image = vehicle.images[0];

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-2xl hover:shadow-black/40",
        className
      )}
    >
      <Link href={`/inventory/${vehicle.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-background-secondary">
        {image && (
          <Image
            src={image.url}
            alt={`${vehicle.brand.name} ${vehicle.model} ${vehicle.variant}`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        )}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <div className="flex flex-wrap gap-2">
            {vehicle.featured && <Badge tone="accent">Featured</Badge>}
            {vehicle.discountLabel && <Badge tone="success">{vehicle.discountLabel}</Badge>}
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
      </Link>

      <button
        onClick={() => wishlist.toggle(vehicle.id)}
        aria-label="Toggle wishlist"
        className={cn(
          "absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-colors",
          wishlist.has(vehicle.id) ? "bg-accent text-accent-foreground" : "bg-black/40 text-white hover:bg-black/60"
        )}
      >
        <Heart className={cn("h-4 w-4", wishlist.has(vehicle.id) && "fill-current")} />
      </button>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">{vehicle.brand.name}</p>
          <Link href={`/inventory/${vehicle.slug}`}>
            <h3 className="mt-1 truncate font-display text-lg font-semibold text-foreground group-hover:text-accent">
              {vehicle.model} {vehicle.variant}
            </h3>
          </Link>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted">
          <span className="flex items-center gap-1"><Gauge className="h-3.5 w-3.5" />{formatMileage(vehicle.mileage)}</span>
          <span className="flex items-center gap-1"><Fuel className="h-3.5 w-3.5" />{vehicle.fuelType}</span>
          <span className="flex items-center gap-1"><Cog className="h-3.5 w-3.5" />{vehicle.transmission}</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          {vehicle.location}
          <span className="mx-1">·</span>
          <ShieldCheck className="h-3.5 w-3.5 text-success" />
          Verified
        </div>

        <div className="mt-auto flex items-end justify-between border-t border-border pt-4">
          <div>
            {vehicle.originalPrice && (
              <p className="text-xs text-muted-foreground line-through">{formatPrice(vehicle.originalPrice)}</p>
            )}
            <p className="font-display text-xl font-bold text-foreground">{formatPrice(vehicle.price)}</p>
          </div>
          <button
            onClick={() => compare.toggle(vehicle.id)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full border transition-colors",
              compare.has(vehicle.id)
                ? "border-accent bg-accent/10 text-accent"
                : "border-border-strong text-muted hover:border-accent hover:text-accent"
            )}
            aria-label="Add to compare"
          >
            <GitCompareArrows className="h-4 w-4" />
          </button>
        </div>

        <Link
          href={`/inventory/${vehicle.slug}`}
          className="inline-flex h-10 items-center justify-center rounded-full bg-background-secondary text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

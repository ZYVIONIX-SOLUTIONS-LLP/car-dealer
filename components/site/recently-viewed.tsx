"use client";

import { useEffect, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  addRecentlyViewed,
  getRecentlyViewed,
  subscribeRecentlyViewed,
  type RecentVehicle,
} from "@/lib/recently-viewed";
import { formatPrice } from "@/lib/utils";

const EMPTY: RecentVehicle[] = [];

export function RecentlyViewedTracker({ vehicle }: { vehicle: RecentVehicle }) {
  useEffect(() => {
    addRecentlyViewed(vehicle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicle.id]);
  return null;
}

export function RecentlyViewedStrip({ excludeId }: { excludeId?: string }) {
  const allItems = useSyncExternalStore(subscribeRecentlyViewed, getRecentlyViewed, () => EMPTY);
  const items = allItems.filter((v) => v.id !== excludeId);

  if (items.length === 0) return null;

  return (
    <div className="mb-10">
      <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-muted">
        Recently Viewed
      </h3>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {items.map((v) => (
          <Link
            key={v.id}
            href={`/inventory/${v.slug}`}
            className="flex w-56 shrink-0 flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-accent"
          >
            <div className="relative aspect-[4/3] bg-background-secondary">
              {v.image && <Image src={v.image} alt={v.model} fill sizes="224px" className="object-cover" />}
            </div>
            <div className="p-3">
              <p className="truncate text-xs font-medium text-muted">{v.brand}</p>
              <p className="truncate text-sm font-semibold text-foreground">
                {v.model} {v.variant}
              </p>
              <p className="mt-1 text-sm font-bold text-accent">{formatPrice(v.price)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useCollection } from "@/lib/collections";
import { VehicleCard } from "@/components/site/vehicle-card";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import type { VehicleDetail } from "@/lib/data";

export function WishlistClient() {
  const wishlist = useCollection("wishlist");
  const [vehicles, setVehicles] = useState<VehicleDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const isEmpty = wishlist.ids.length === 0;

  useEffect(() => {
    if (isEmpty) return;
    fetch(`/api/vehicles?ids=${wishlist.ids.join(",")}`)
      .then((r) => r.json())
      .then((data) => setVehicles(data.vehicles))
      .finally(() => setLoading(false));
  }, [wishlist.ids, isEmpty]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Your Saved Cars" title="Wishlist" />

      {isEmpty || (!loading && vehicles.length === 0) ? (
        <div className="mt-10 flex flex-col items-center rounded-3xl border border-border bg-card p-16 text-center">
          <Heart className="h-10 w-10 text-muted-foreground" />
          <p className="mt-4 text-lg font-semibold text-foreground">Your wishlist is empty</p>
          <p className="mt-2 text-sm text-muted">Save cars you love and find them here later.</p>
          <ButtonLink href="/inventory" className="mt-6">Browse Inventory</ButtonLink>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      )}
    </div>
  );
}

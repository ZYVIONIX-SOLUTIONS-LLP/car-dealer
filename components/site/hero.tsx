"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, Wallet, RefreshCw } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import type { VehicleCard } from "@/lib/data";

const BADGES = [
  { icon: CheckCircle2, label: "1000+ Cars Sold" },
  { icon: ShieldCheck, label: "100% Verified Vehicles" },
  { icon: Wallet, label: "Finance Available" },
  { icon: RefreshCw, label: "Trade-ins Accepted" },
];

export function Hero({ vehicles }: { vehicles: VehicleCard[] }) {
  const [index, setIndex] = useState(0);
  const featured = vehicles.slice(0, 5);

  useEffect(() => {
    if (featured.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % featured.length), 5000);
    return () => clearInterval(id);
  }, [featured.length]);

  const active = featured[index];

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-accent/20 blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:pb-24 lg:pt-20">
        <div className="animate-fade-up">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border-strong px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent">
            Movement. Freedom. Every Budget.
          </p>
          <h1 className="text-balance font-display text-5xl font-bold leading-[1.05] text-foreground sm:text-6xl">
            Find Your <span className="text-accent">Perfect</span> Used Car
          </h1>
          <p className="mt-6 max-w-lg text-balance text-lg text-muted">
            Browse hundreds of quality pre-owned vehicles — from affordable everyday cars to
            premium luxury models — all inspected and ready to drive.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <ButtonLink href="/inventory" size="lg">
              Browse Inventory
            </ButtonLink>
            <ButtonLink href="/sell-your-car" variant="secondary" size="lg">
              Sell Your Car
            </ButtonLink>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {BADGES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="h-5 w-5 shrink-0 text-accent" />
                <span className="text-xs font-medium text-muted">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative aspect-[4/3] w-full animate-fade-up [animation-delay:150ms]">
          <div className="absolute inset-0 rounded-3xl border border-border bg-card">
            <AnimatePresence mode="wait">
              {active && (
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                  className="absolute inset-0 overflow-hidden rounded-3xl"
                >
                  {active.images[0] && (
                    <Image
                      src={active.images[0].url}
                      alt={`${active.brand.name} ${active.model}`}
                      fill
                      priority
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                      {active.brand.name}
                    </p>
                    <h3 className="mt-1 font-display text-2xl font-bold text-white">
                      {active.model} {active.variant}
                    </h3>
                    <p className="mt-1 text-lg font-semibold text-white/90">{formatPrice(active.price)}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {featured.length > 1 && (
            <div className="absolute -bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
              {featured.map((v, i) => (
                <button
                  key={v.id}
                  onClick={() => setIndex(i)}
                  aria-label={`Show vehicle ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? "w-8 bg-accent" : "w-1.5 bg-border-strong"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

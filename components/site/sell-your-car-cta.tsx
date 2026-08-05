import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

const POINTS = ["Free instant valuation", "No obligation to sell", "Same-day payment"];

export function SellYourCarCta() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1800&q=80"
            alt="Sell your car"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        </div>
        <div className="relative flex flex-col gap-6 p-10 sm:p-14 lg:max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Sell Your Car</p>
          <h2 className="text-balance font-display text-3xl font-semibold text-foreground sm:text-4xl">
            Get a Fair Price for Your Car in Minutes
          </h2>
          <p className="text-base text-muted">
            Skip the hassle of listing and negotiating. Tell us about your car and get an
            instant, no-obligation valuation from our team.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {POINTS.map((p) => (
              <li key={p} className="flex items-center gap-2 text-sm text-foreground">
                <CheckCircle2 className="h-4 w-4 text-accent" />
                {p}
              </li>
            ))}
          </ul>
          <div>
            <ButtonLink href="/sell-your-car" size="lg">
              Get Free Valuation
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

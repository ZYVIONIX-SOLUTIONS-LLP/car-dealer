import type { Metadata } from "next";
import { Zap, ShieldCheck, Wallet } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { SellCarForm } from "@/components/site/sell-car-form";

export const metadata: Metadata = {
  title: "Sell Your Car",
  description: "Get a free, no-obligation valuation for your car in minutes.",
};

const POINTS = [
  { icon: Zap, title: "Instant Valuation", desc: "Get a fair market estimate within minutes of submitting your details." },
  { icon: ShieldCheck, title: "No Obligation", desc: "Free inspection and quote — you decide if you want to proceed." },
  { icon: Wallet, title: "Same-Day Payment", desc: "Accept our offer and get paid the same day, no waiting around." },
];

export default function SellYourCarPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Sell Your Car"
        title="Get a Fair Price for Your Car in Minutes"
        description="Skip the hassle of listing and negotiating. Tell us about your car and get an instant, no-obligation valuation from our team."
        align="center"
        className="mx-auto"
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
        <div className="space-y-6">
          {POINTS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
                <p className="mt-1 text-sm text-muted">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <SellCarForm />
      </div>
    </div>
  );
}

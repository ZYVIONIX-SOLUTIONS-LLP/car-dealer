import {
  ShieldCheck,
  ReceiptText,
  Landmark,
  Repeat,
  FileCheck2,
  BadgeCheck,
  Truck,
  Headset,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

const REASONS = [
  { icon: ShieldCheck, title: "Verified Vehicle Inspection", desc: "Every car passes a rigorous 150-point inspection before it's listed." },
  { icon: ReceiptText, title: "Transparent Pricing", desc: "No hidden fees. The price you see is the price you pay." },
  { icon: Landmark, title: "Finance Assistance", desc: "Flexible loan options with partner banks and fast approvals." },
  { icon: Repeat, title: "Trade-In Support", desc: "Trade in your current car and roll the value straight into your next one." },
  { icon: FileCheck2, title: "Insurance Assistance", desc: "We help you find the right cover at the right price, hassle-free." },
  { icon: BadgeCheck, title: "Extended Warranty", desc: "Optional extended warranty plans for total peace of mind." },
  { icon: Truck, title: "Nationwide Delivery", desc: "We deliver your new car to your doorstep, anywhere in the country." },
  { icon: Headset, title: "After-Sales Support", desc: "Our team stays reachable long after you drive away." },
];

export function WhyChooseUs() {
  return (
    <section id="why-us" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.4fr] lg:items-start">
        <div>
          <SectionHeading
            eyebrow="Why Choose Velocity"
            title="We Create Your Ideal Automotive Experience"
            description="We offer more than just cars — confidence in every kilometer. Reliability, transparency, and premium-grade service, no matter your budget."
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {REASONS.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-accent"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-base font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm text-muted">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

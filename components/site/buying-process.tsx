import { Search, CalendarCheck, KeyRound, Landmark, FileSignature, Car } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

const STEPS = [
  { icon: Search, title: "Browse Inventory", desc: "Explore hundreds of verified listings and shortlist your favorites." },
  { icon: CalendarCheck, title: "Schedule Inspection", desc: "Book a free professional inspection at a time that suits you." },
  { icon: KeyRound, title: "Test Drive", desc: "Feel the car for yourself before making a decision." },
  { icon: Landmark, title: "Finance Approval", desc: "Get pre-approved financing with our banking partners." },
  { icon: FileSignature, title: "Documentation", desc: "We handle the paperwork, RC transfer, and insurance." },
  { icon: Car, title: "Drive Home", desc: "Take delivery of your car — inspected, insured, and ready." },
];

export function BuyingProcess() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="How It Works" title="Your Journey to a New Car, Simplified" align="center" />
      <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-6">
        {STEPS.map(({ icon: Icon, title, desc }, i) => (
          <div key={title} className="relative flex flex-col items-center text-center">
            {i < STEPS.length - 1 && (
              <span className="absolute left-1/2 top-7 hidden h-px w-full bg-border lg:block" />
            )}
            <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-border-strong bg-card text-accent">
              <Icon className="h-6 w-6" />
            </span>
            <span className="mt-4 text-xs font-semibold text-accent">Step {i + 1}</span>
            <h3 className="mt-1 font-display text-sm font-semibold text-foreground">{title}</h3>
            <p className="mt-2 text-xs text-muted">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

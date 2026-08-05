import { Landmark, Calculator, Percent } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

const STEPS = [
  { icon: Landmark, title: "Choose Your Bank Partner", desc: "Compare offers from our network of trusted lending partners." },
  { icon: Calculator, title: "Calculate Your EMI", desc: "Use our calculator to plan a monthly payment that fits your budget." },
  { icon: Percent, title: "Get Approved Fast", desc: "Most applications are approved within 24-48 hours." },
];

export function FinanceTeaser() {
  return (
    <section className="border-y border-border bg-background-secondary py-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <div>
          <SectionHeading
            eyebrow="Financing Made Simple"
            title="Drive Today, Pay Comfortably Over Time"
            description="We partner with leading banks and NBFCs to offer competitive interest rates, flexible tenures, and fast approvals — for every credit profile."
          />
          <div className="mt-8 flex flex-wrap gap-4">
            <ButtonLink href="/finance">Apply for Finance</ButtonLink>
            <ButtonLink href="/finance#calculator" variant="secondary">
              Calculate EMI
            </ButtonLink>
          </div>
        </div>
        <div className="grid gap-4">
          {STEPS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
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
      </div>
    </section>
  );
}

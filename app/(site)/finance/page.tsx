import type { Metadata } from "next";
import { Landmark, ShieldCheck, Clock3, Percent } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { LoanCalculator } from "@/components/site/loan-calculator";

export const metadata: Metadata = {
  title: "Financing",
  description: "Flexible car loans and EMI calculator for every budget.",
};

const STEPS = [
  { title: "Choose Your Car", desc: "Pick any vehicle from our verified inventory." },
  { title: "Submit Application", desc: "Share basic income and identity details online." },
  { title: "Get Approved", desc: "Our banking partners respond within 24-48 hours." },
  { title: "Drive Away", desc: "Sign the paperwork and take delivery of your car." },
];

const PARTNERS = ["HDFC Bank", "ICICI Bank", "Axis Bank", "SBI", "Bajaj Finserv", "Tata Capital"];

export default function FinancePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Financing"
        title="Drive Today, Pay Comfortably Over Time"
        description="We partner with leading banks and NBFCs to offer competitive interest rates, flexible tenures, and fast approvals — for every credit profile."
        align="center"
        className="mx-auto"
      />

      <div className="mt-8 flex justify-center gap-4">
        <ButtonLink href="/contact" size="lg">Apply for Finance</ButtonLink>
        <ButtonLink href="#calculator" variant="secondary" size="lg">Calculate EMI</ButtonLink>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Percent, title: "Competitive Rates", desc: "Interest rates starting at 8.5% p.a." },
          { icon: Clock3, title: "Fast Approval", desc: "Most loans approved within 24-48 hours." },
          { icon: Landmark, title: "Multiple Lenders", desc: "Compare offers from 6+ banking partners." },
          { icon: ShieldCheck, title: "Zero Hidden Fees", desc: "Transparent terms, no surprise charges." },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="rounded-2xl border border-border bg-card p-6 text-center">
            <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-display text-base font-semibold text-foreground">{title}</h3>
            <p className="mt-2 text-sm text-muted">{desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <SectionHeading eyebrow="EMI Calculator" title="Plan Your Monthly Budget" align="center" className="mx-auto mb-10" />
        <LoanCalculator />
      </div>

      <div className="mt-20">
        <SectionHeading eyebrow="How Financing Works" title="Four Simple Steps to Approval" align="center" className="mx-auto mb-12" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <div key={s.title} className="rounded-2xl border border-border bg-card p-6">
              <span className="text-xs font-semibold text-accent">Step {i + 1}</span>
              <h3 className="mt-2 font-display text-base font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm text-muted">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20 rounded-3xl border border-border bg-background-secondary p-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">Our Lending Partners</p>
        <div className="mt-6 flex flex-wrap justify-center gap-x-10 gap-y-4">
          {PARTNERS.map((p) => (
            <span key={p} className="font-display text-lg font-semibold text-muted">{p}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

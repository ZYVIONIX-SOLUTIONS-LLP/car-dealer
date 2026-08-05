import { Star } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Avatar } from "@/components/ui/avatar";
import type { Testimonial } from "@prisma/client";

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Customer Reviews" title="Trusted by Thousands of Buyers & Sellers" align="center" />
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <div key={t.id} className="flex flex-col rounded-2xl border border-border bg-card p-6">
            <div className="flex gap-1 text-accent">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < t.rating ? "fill-current" : "text-border-strong"}`} />
              ))}
            </div>
            <p className="mt-4 flex-1 text-sm text-muted">&ldquo;{t.quote}&rdquo;</p>
            <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
              <Avatar name={t.name} />
              <div>
                <p className="text-sm font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

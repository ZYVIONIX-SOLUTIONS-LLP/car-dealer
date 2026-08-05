import type { Metadata } from "next";
import { Star } from "lucide-react";
import { db } from "@/lib/db";
import { Avatar } from "@/components/ui/avatar";
import { Input, Textarea, Select, Label } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "@/components/admin/delete-button";
import { createTestimonial, deleteTestimonial, toggleTestimonialFeatured } from "@/app/actions/testimonials";

export const metadata: Metadata = { title: "Testimonials" };

export default async function AdminTestimonialsPage() {
  const testimonials = await db.testimonial.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground">Testimonials</h1>
        <p className="mt-1 text-sm text-muted">Manage customer reviews shown on the homepage.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        <form action={createTestimonial} className="h-fit space-y-4 rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display text-base font-semibold text-foreground">Add Testimonial</h3>
          <div>
            <Label htmlFor="t-name">Customer Name</Label>
            <Input id="t-name" name="name" required />
          </div>
          <div>
            <Label htmlFor="t-role">Role / Purchase</Label>
            <Input id="t-role" name="role" placeholder="e.g. Bought a Hyundai Creta" required />
          </div>
          <div>
            <Label htmlFor="t-rating">Rating</Label>
            <Select id="t-rating" name="rating" defaultValue="5">
              {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Stars</option>)}
            </Select>
          </div>
          <div>
            <Label htmlFor="t-quote">Quote</Label>
            <Textarea id="t-quote" name="quote" rows={4} required />
          </div>
          <Button type="submit" className="w-full">Add Testimonial</Button>
        </form>

        <div className="space-y-4">
          {testimonials.map((t) => (
            <div key={t.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar name={t.name} />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {t.featured ? <Badge tone="accent">Live</Badge> : <Badge tone="neutral">Hidden</Badge>}
                  <DeleteButton action={deleteTestimonial} id={t.id} confirmMessage="Delete this testimonial?" />
                </div>
              </div>
              <div className="mt-3 flex gap-0.5 text-accent">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-3.5 w-3.5 ${i < t.rating ? "fill-current" : "text-border-strong"}`} />
                ))}
              </div>
              <p className="mt-2 text-sm text-muted">&ldquo;{t.quote}&rdquo;</p>
              <form action={toggleTestimonialFeatured} className="mt-3">
                <input type="hidden" name="id" value={t.id} />
                <input type="hidden" name="value" value={String(!t.featured)} />
                <button type="submit" className="text-xs font-medium text-accent hover:text-accent-hover">
                  {t.featured ? "Hide from homepage" : "Show on homepage"}
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

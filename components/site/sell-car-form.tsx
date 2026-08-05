"use client";

import { useActionState } from "react";
import { submitEnquiry } from "@/app/actions/enquiries";
import { Input, Label } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

export function SellCarForm() {
  const [state, action, pending] = useActionState(submitEnquiry, undefined);

  return (
    <form action={action} className="space-y-4 rounded-3xl border border-border bg-card p-8">
      <input type="hidden" name="type" value="valuation" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="sc-name">Name</Label>
          <Input id="sc-name" name="name" placeholder="Your name" required />
        </div>
        <div>
          <Label htmlFor="sc-phone">Phone</Label>
          <Input id="sc-phone" name="phone" placeholder="+91 00000 00000" required />
        </div>
      </div>
      <div>
        <Label htmlFor="sc-email">Email</Label>
        <Input id="sc-email" name="email" type="email" placeholder="you@example.com" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="sc-brand">Car Brand</Label>
          <Input id="sc-brand" name="carBrand" placeholder="e.g. Hyundai" required />
        </div>
        <div>
          <Label htmlFor="sc-model">Car Model</Label>
          <Input id="sc-model" name="carModel" placeholder="e.g. Creta" required />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="sc-year">Year of Purchase</Label>
          <Input id="sc-year" name="carYear" type="number" placeholder="2020" required />
        </div>
        <div>
          <Label htmlFor="sc-km">Kilometers Driven</Label>
          <Input id="sc-km" name="carKm" type="number" placeholder="45000" required />
        </div>
      </div>
      <div>
        <Label htmlFor="sc-budget">Expected Price (optional)</Label>
        <Input id="sc-budget" name="budget" placeholder="e.g. 8,00,000" />
      </div>

      {state?.message && (
        <p className={`text-sm ${state.success ? "text-success" : "text-red-400"}`}>{state.message}</p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Submitting..." : "Get Free Valuation"}
      </Button>
    </form>
  );
}

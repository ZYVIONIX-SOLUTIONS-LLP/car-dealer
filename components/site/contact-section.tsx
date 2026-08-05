"use client";

import { useActionState, useRef } from "react";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { submitEnquiry } from "@/app/actions/enquiries";
import { SectionHeading } from "@/components/ui/section-heading";
import { Input, Textarea, Label } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

export function ContactSection() {
  const [state, action, pending] = useActionState(submitEnquiry, undefined);
  const typeRef = useRef<HTMLInputElement>(null);

  return (
    <section id="contact" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid gap-12 rounded-3xl border border-border bg-card p-8 sm:p-12 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <SectionHeading
            eyebrow="Get In Touch"
            title="We'll Find the Car of Your Dreams"
            description="Leave your details and our expert will connect with you at the earliest — with zero obligation."
          />
          <ul className="mt-8 space-y-4 text-sm text-muted">
            <li className="flex items-center gap-3"><Phone className="h-4 w-4 text-accent" /> +91 12345 67890</li>
            <li className="flex items-center gap-3"><Mail className="h-4 w-4 text-accent" /> hello@velocitymotors.example</li>
            <li className="flex items-center gap-3"><MapPin className="h-4 w-4 text-accent" /> 12 Marine Drive, Mumbai, MH</li>
            <li className="flex items-center gap-3"><Clock className="h-4 w-4 text-accent" /> Mon–Sun, 9 AM – 8 PM</li>
          </ul>
        </div>

        <form action={action} className="space-y-4">
          <input ref={typeRef} type="hidden" name="type" defaultValue="general" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="Your name" required />
              {state?.errors?.name && <p className="mt-1 text-xs text-red-400">{state.errors.name[0]}</p>}
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" placeholder="+91 00000 00000" required />
              {state?.errors?.phone && <p className="mt-1 text-xs text-red-400">{state.errors.phone[0]}</p>}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" />
            </div>
            <div>
              <Label htmlFor="budget">Budget</Label>
              <Input id="budget" name="budget" placeholder="e.g. 10-15 Lakh" />
            </div>
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" name="message" rows={4} placeholder="Tell us what you're looking for..." />
          </div>

          {state?.message && (
            <p className={`text-sm ${state.success ? "text-success" : "text-red-400"}`}>{state.message}</p>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              type="submit"
              variant="secondary"
              disabled={pending}
              onClick={() => {
                if (typeRef.current) typeRef.current.value = "callback";
              }}
            >
              Request Callback
            </Button>
            <Button
              type="submit"
              disabled={pending}
              onClick={() => {
                if (typeRef.current) typeRef.current.value = "test-drive";
              }}
            >
              Schedule Test Drive
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}

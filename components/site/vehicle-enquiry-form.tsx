"use client";

import { useActionState, useRef } from "react";
import { Phone, MessageCircle } from "lucide-react";
import { submitEnquiry } from "@/app/actions/enquiries";
import { Input, Textarea, Label } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

export function VehicleEnquiryForm({
  vehicleId,
  vehicleName,
  price,
}: {
  vehicleId: string;
  vehicleName: string;
  price: string;
}) {
  const [state, action, pending] = useActionState(submitEnquiry, undefined);
  const typeRef = useRef<HTMLInputElement>(null);
  const waMessage = encodeURIComponent(`Hi, I'm interested in the ${vehicleName} (${price}) listed on Velocity Motors.`);

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="font-display text-lg font-semibold text-foreground">Interested in this car?</h3>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <a
          href={`https://wa.me/911234567890?text=${waMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#25D366] text-sm font-medium text-black transition-opacity hover:opacity-90"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
        <a
          href="tel:+911234567890"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border-strong text-sm font-medium text-foreground hover:border-accent hover:text-accent"
        >
          <Phone className="h-4 w-4" />
          Call Dealer
        </a>
      </div>

      <form action={action} className="mt-5 space-y-3">
        <input type="hidden" name="vehicleId" value={vehicleId} />
        <input ref={typeRef} type="hidden" name="type" defaultValue="general" />
        <div>
          <Label htmlFor="ef-name">Name</Label>
          <Input id="ef-name" name="name" placeholder="Your name" required />
        </div>
        <div>
          <Label htmlFor="ef-phone">Phone</Label>
          <Input id="ef-phone" name="phone" placeholder="+91 00000 00000" required />
        </div>
        <div>
          <Label htmlFor="ef-message">Message</Label>
          <Textarea id="ef-message" name="message" rows={3} placeholder="I'd like to know more about..." />
        </div>

        {state?.message && (
          <p className={`text-sm ${state.success ? "text-success" : "text-red-400"}`}>{state.message}</p>
        )}

        <div className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-2">
          <Button
            type="submit"
            variant="secondary"
            disabled={pending}
            onClick={() => typeRef.current && (typeRef.current.value = "callback")}
          >
            Book Inspection
          </Button>
          <Button
            type="submit"
            disabled={pending}
            onClick={() => typeRef.current && (typeRef.current.value = "test-drive")}
          >
            Book Test Drive
          </Button>
        </div>
      </form>
    </div>
  );
}

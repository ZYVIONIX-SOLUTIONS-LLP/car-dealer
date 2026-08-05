"use client";

import { useRef } from "react";
import Link from "next/link";
import { Pencil, Trash2, Star, CheckCircle2 } from "lucide-react";
import { deleteVehicle, toggleVehicleFlag } from "@/app/actions/vehicles";
import { cn } from "@/lib/utils";

export function VehicleRowActions({
  id,
  featured,
  sold,
}: {
  id: string;
  featured: boolean;
  sold: boolean;
}) {
  const deleteFormRef = useRef<HTMLFormElement>(null);

  return (
    <div className="flex items-center gap-1.5">
      <form action={toggleVehicleFlag}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="field" value="featured" />
        <input type="hidden" name="value" value={String(!featured)} />
        <button
          type="submit"
          title="Toggle Featured"
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg border border-border-strong",
            featured ? "bg-accent/10 text-accent" : "text-muted hover:text-accent"
          )}
        >
          <Star className={cn("h-3.5 w-3.5", featured && "fill-current")} />
        </button>
      </form>

      <form action={toggleVehicleFlag}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="field" value="sold" />
        <input type="hidden" name="value" value={String(!sold)} />
        <button
          type="submit"
          title="Toggle Sold"
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg border border-border-strong",
            sold ? "bg-success/10 text-success" : "text-muted hover:text-success"
          )}
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
        </button>
      </form>

      <Link
        href={`/admin/vehicles/${id}/edit`}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-strong text-muted hover:text-foreground"
        title="Edit"
      >
        <Pencil className="h-3.5 w-3.5" />
      </Link>

      <form
        ref={deleteFormRef}
        action={deleteVehicle}
        onSubmit={(e) => {
          if (!confirm("Delete this vehicle? This cannot be undone.")) e.preventDefault();
        }}
      >
        <input type="hidden" name="id" value={id} />
        <button
          type="submit"
          title="Delete"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-strong text-muted hover:border-red-400 hover:text-red-400"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  );
}

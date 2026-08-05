import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

type Tone = "accent" | "neutral" | "success" | "outline";

const toneClasses: Record<Tone, string> = {
  accent: "bg-accent text-accent-foreground",
  neutral: "bg-card-hover text-foreground",
  success: "bg-success/15 text-success",
  outline: "border border-border-strong text-muted",
};

export function Badge({
  className,
  tone = "neutral",
  ...props
}: ComponentProps<"span"> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide",
        toneClasses[tone],
        className
      )}
      {...props}
    />
  );
}

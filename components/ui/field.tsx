import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

const fieldBase =
  "w-full rounded-xl border border-border-strong bg-background-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-accent";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(fieldBase, className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(fieldBase, "resize-none", className)} {...props} />;
}

export function Select({ className, ...props }: ComponentProps<"select">) {
  return (
    <select
      className={cn(fieldBase, "appearance-none cursor-pointer", className)}
      {...props}
    />
  );
}

export function Label({ className, ...props }: ComponentProps<"label">) {
  return (
    <label
      className={cn("mb-2 block text-xs font-medium uppercase tracking-wider text-muted", className)}
      {...props}
    />
  );
}

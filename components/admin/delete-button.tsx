"use client";

import { Trash2 } from "lucide-react";

export function DeleteButton({
  action,
  id,
  confirmMessage,
  disabled,
  disabledTitle,
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  confirmMessage: string;
  disabled?: boolean;
  disabledTitle?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmMessage)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={disabled}
        title={disabled ? disabledTitle : "Delete"}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-strong text-muted hover:border-red-400 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </form>
  );
}

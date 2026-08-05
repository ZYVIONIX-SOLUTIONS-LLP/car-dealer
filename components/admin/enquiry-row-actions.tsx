"use client";

import { useRef } from "react";
import { Trash2 } from "lucide-react";
import { updateEnquiryStatus, deleteEnquiry } from "@/app/actions/enquiries";

export function EnquiryRowActions({ id, status }: { id: string; status: string }) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="flex items-center gap-2">
      <form
        ref={formRef}
        action={updateEnquiryStatus}
        onChange={() => formRef.current?.requestSubmit()}
      >
        <input type="hidden" name="id" value={id} />
        <select
          name="status"
          defaultValue={status}
          className="h-8 rounded-lg border border-border-strong bg-background-secondary px-2 text-xs text-foreground outline-none focus:border-accent"
        >
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="closed">Closed</option>
        </select>
      </form>
      <form
        action={deleteEnquiry}
        onSubmit={(e) => {
          if (!confirm("Delete this enquiry?")) e.preventDefault();
        }}
      >
        <input type="hidden" name="id" value={id} />
        <button
          type="submit"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-strong text-muted hover:border-red-400 hover:text-red-400"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  );
}

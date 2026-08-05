import type { Metadata } from "next";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { EnquiryRowActions } from "@/components/admin/enquiry-row-actions";
import { timeAgo } from "@/lib/utils";

export const metadata: Metadata = { title: "Enquiries" };

export default async function AdminEnquiriesPage() {
  const enquiries = await db.enquiry.findMany({
    orderBy: { createdAt: "desc" },
    include: { vehicle: { select: { model: true, variant: true, slug: true } } },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground">Enquiries</h1>
        <p className="mt-1 text-sm text-muted">{enquiries.length} total enquiries from customers.</p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3 font-medium">Contact</th>
              <th className="px-5 py-3 font-medium">Vehicle</th>
              <th className="px-5 py-3 font-medium">Type</th>
              <th className="px-5 py-3 font-medium">Message</th>
              <th className="px-5 py-3 font-medium">Received</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map((e) => (
              <tr key={e.id} className="border-b border-border align-top last:border-0">
                <td className="px-5 py-3">
                  <p className="font-medium text-foreground">{e.name}</p>
                  <p className="text-xs text-muted-foreground">{e.phone}</p>
                  {e.email && <p className="text-xs text-muted-foreground">{e.email}</p>}
                </td>
                <td className="px-5 py-3 text-muted">
                  {e.vehicle ? `${e.vehicle.model} ${e.vehicle.variant}` : "—"}
                </td>
                <td className="px-5 py-3">
                  <Badge tone="outline" className="capitalize">{e.type}</Badge>
                </td>
                <td className="px-5 py-3 max-w-xs whitespace-pre-line text-xs text-muted">
                  {e.message || "—"}
                  {e.budget && <div className="mt-1 text-muted-foreground">Budget: {e.budget}</div>}
                </td>
                <td className="px-5 py-3 text-xs text-muted-foreground">{timeAgo(e.createdAt)}</td>
                <td className="px-5 py-3">
                  <EnquiryRowActions id={e.id} status={e.status} />
                </td>
              </tr>
            ))}
            {enquiries.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center text-muted">No enquiries yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

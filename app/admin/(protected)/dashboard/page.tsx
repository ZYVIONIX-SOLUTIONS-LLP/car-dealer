import Link from "next/link";
import type { Metadata } from "next";
import { Car, Star, Mail, CheckCircle2, TrendingUp, ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { StatCard } from "@/components/admin/stat-card";
import { formatPrice, timeAgo } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const [totalVehicles, featuredCount, soldCount, newEnquiries, totalEnquiries, recentEnquiries, inventoryValue] =
    await Promise.all([
      db.vehicle.count(),
      db.vehicle.count({ where: { featured: true } }),
      db.vehicle.count({ where: { sold: true } }),
      db.enquiry.count({ where: { status: "new" } }),
      db.enquiry.count(),
      db.enquiry.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
        include: { vehicle: { select: { model: true, variant: true } } },
      }),
      db.vehicle.aggregate({ _sum: { price: true }, where: { sold: false } }),
    ]);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-1 text-sm text-muted">Overview of your dealership&apos;s performance.</p>
        </div>
        <Link
          href="/admin/vehicles/new"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-medium text-accent-foreground hover:bg-accent-hover"
        >
          + Add Vehicle
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Car} label="Total Vehicles" value={totalVehicles} hint={`${totalVehicles - soldCount} in stock`} />
        <StatCard icon={Star} label="Featured Listings" value={featuredCount} />
        <StatCard icon={Mail} label="New Enquiries" value={newEnquiries} hint={`${totalEnquiries} total`} />
        <StatCard icon={CheckCircle2} label="Cars Sold" value={soldCount} />
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 text-sm text-muted">
          <TrendingUp className="h-4 w-4 text-accent" />
          Total Active Inventory Value
        </div>
        <p className="mt-2 font-display text-3xl font-bold text-foreground">
          {formatPrice(inventoryValue._sum.price ?? 0)}
        </p>
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-foreground">Recent Enquiries</h2>
          <Link href="/admin/enquiries" className="flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-hover">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Vehicle</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">When</th>
              </tr>
            </thead>
            <tbody>
              {recentEnquiries.map((e) => (
                <tr key={e.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3">
                    <p className="font-medium text-foreground">{e.name}</p>
                    <p className="text-xs text-muted-foreground">{e.phone}</p>
                  </td>
                  <td className="px-5 py-3 text-muted">
                    {e.vehicle ? `${e.vehicle.model} ${e.vehicle.variant}` : "General"}
                  </td>
                  <td className="px-5 py-3 capitalize text-muted">{e.type}</td>
                  <td className="px-5 py-3">
                    <Badge tone={e.status === "new" ? "accent" : e.status === "closed" ? "success" : "neutral"}>
                      {e.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{timeAgo(e.createdAt)}</td>
                </tr>
              ))}
              {recentEnquiries.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-muted">No enquiries yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

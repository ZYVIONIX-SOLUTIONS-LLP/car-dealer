"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  Mail,
  Star,
  Building2,
  LayoutGrid,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { logout } from "@/app/actions/auth";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/vehicles", label: "Vehicles", icon: Car },
  { href: "/admin/enquiries", label: "Enquiries", icon: Mail },
  { href: "/admin/testimonials", label: "Testimonials", icon: Star },
  { href: "/admin/brands", label: "Brands", icon: Building2 },
  { href: "/admin/categories", label: "Categories", icon: LayoutGrid },
];

export function Sidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-border bg-background-secondary">
      <div className="flex h-20 items-center border-b border-border px-6">
        <Link href="/admin/dashboard" className="font-display text-lg font-bold text-foreground">
          VELOCITY<span className="text-accent">.</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-6">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-accent text-accent-foreground" : "text-muted hover:bg-card hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-border p-3">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted hover:bg-card hover:text-foreground"
        >
          <ExternalLink className="h-4 w-4" />
          View Site
        </a>
        <div className="flex items-center justify-between px-3 py-2">
          <p className="truncate text-xs text-muted-foreground">{adminName}</p>
          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-1.5 text-xs font-medium text-muted hover:text-accent"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}

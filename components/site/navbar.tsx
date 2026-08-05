"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Heart, GitCompareArrows, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
import { useCollection } from "@/lib/collections";

const LINKS = [
  { href: "/inventory", label: "Inventory" },
  { href: "/finance", label: "Finance" },
  { href: "/sell-your-car", label: "Sell Your Car" },
  { href: "/#why-us", label: "Why Us" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menuPathname, setMenuPathname] = useState<string | null>(null);
  const pathname = usePathname();
  const wishlist = useCollection("wishlist");
  const compare = useCollection("compare");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu when navigation changes the route, computed during
  // render (per React docs) instead of an effect, to avoid an extra render pass.
  if (menuPathname !== pathname) {
    setMenuPathname(pathname);
    if (open) setOpen(false);
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "glass border-b border-border" : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-xl font-bold tracking-tight text-foreground">
            VELOCITY<span className="text-accent">.</span>
          </span>
          <span className="hidden text-[10px] font-semibold uppercase tracking-[0.3em] text-muted sm:inline">
            Motors
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <Link
            href="/compare"
            className="relative text-muted transition-colors hover:text-foreground"
            aria-label="Compare"
          >
            <GitCompareArrows className="h-5 w-5" />
            {compare.ids.length > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                {compare.ids.length}
              </span>
            )}
          </Link>
          <Link
            href="/wishlist"
            className="relative text-muted transition-colors hover:text-foreground"
            aria-label="Wishlist"
          >
            <Heart className="h-5 w-5" />
            {wishlist.ids.length > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                {wishlist.ids.length}
              </span>
            )}
          </Link>
          <a
            href="tel:+911234567890"
            className="flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground"
          >
            <Phone className="h-4 w-4" />
            +91 12345 67890
          </a>
          <ButtonLink href="/inventory" size="sm">
            Browse Inventory
          </ButtonLink>
        </div>

        <button
          className="text-foreground lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="glass border-t border-border px-4 pb-6 pt-2 lg:hidden">
          <nav className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-3 text-sm font-medium text-muted hover:bg-card hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/wishlist"
              className="rounded-lg px-3 py-3 text-sm font-medium text-muted hover:bg-card hover:text-foreground"
            >
              Wishlist ({wishlist.ids.length})
            </Link>
            <Link
              href="/compare"
              className="rounded-lg px-3 py-3 text-sm font-medium text-muted hover:bg-card hover:text-foreground"
            >
              Compare ({compare.ids.length})
            </Link>
          </nav>
          <ButtonLink href="/inventory" className="mt-4 w-full">
            Browse Inventory
          </ButtonLink>
        </div>
      )}
    </header>
  );
}

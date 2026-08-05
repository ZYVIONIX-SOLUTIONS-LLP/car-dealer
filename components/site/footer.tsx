import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon, YoutubeIcon, LinkedinIcon } from "@/components/ui/social-icons";

const COLUMNS = [
  {
    title: "Company",
    links: [
      { href: "/#why-us", label: "About Us" },
      { href: "/inventory", label: "Inventory" },
      { href: "/finance", label: "Finance" },
      { href: "/sell-your-car", label: "Sell Your Car" },
    ],
  },
  {
    title: "Services",
    links: [
      { href: "/finance", label: "Financing" },
      { href: "/sell-your-car", label: "Trade-In" },
      { href: "/contact", label: "Book Test Drive" },
      { href: "/contact", label: "Extended Warranty" },
    ],
  },
  {
    title: "Information",
    links: [
      { href: "/contact", label: "FAQs" },
      { href: "/contact", label: "Privacy Policy" },
      { href: "/contact", label: "Terms of Service" },
      { href: "/contact", label: "Contact Us" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background-secondary">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="font-display text-xl font-bold text-foreground">
              VELOCITY<span className="text-accent">.</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted">
              A trusted used car marketplace offering verified vehicles across every price
              range — from affordable daily drivers to premium and luxury cars.
            </p>
            <div className="mt-6 flex gap-3">
              {[FacebookIcon, InstagramIcon, YoutubeIcon, LinkedinIcon].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border-strong text-muted transition-colors hover:border-accent hover:text-accent"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-foreground">{col.title}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link, i) => (
                  <li key={i}>
                    <Link href={link.href} className="text-sm text-muted hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-sm font-semibold text-foreground">Contact</h4>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                +91 12345 67890
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                hello@velocitymotors.example
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                12 Marine Drive, Mumbai, MH 400001
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Velocity Motors. All rights reserved.</p>
          <p>Every Car. Every Budget. Verified.</p>
        </div>
      </div>
    </footer>
  );
}

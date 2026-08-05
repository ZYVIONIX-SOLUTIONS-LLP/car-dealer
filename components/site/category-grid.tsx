import Link from "next/link";
import {
  Wallet,
  Car,
  CarFront,
  Truck,
  Users,
  Zap,
  Leaf,
  Gem,
  Crown,
  Flag,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

const ICONS: Record<string, LucideIcon> = {
  wallet: Wallet,
  car: Car,
  "car-front": CarFront,
  truck: Truck,
  users: Users,
  zap: Zap,
  leaf: Leaf,
  gem: Gem,
  crown: Crown,
  flag: Flag,
};

export function CategoryGrid({
  categories,
}: {
  categories: { slug: string; name: string; icon: string; _count: { vehicles: number } }[];
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Browse by Category" title="A Car for Every Lifestyle" />
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((cat) => {
          const Icon = ICONS[cat.icon] ?? Car;
          return (
            <Link
              key={cat.slug}
              href={`/inventory?category=${cat.slug}`}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center transition-all hover:-translate-y-1 hover:border-accent"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-background-secondary text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-medium text-foreground">{cat.name}</span>
              <span className="text-xs text-muted-foreground">{cat._count.vehicles} cars</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

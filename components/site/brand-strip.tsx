import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";

export function BrandStrip({
  brands,
}: {
  brands: { slug: string; name: string; _count: { vehicles: number } }[];
}) {
  const withStock = brands.filter((b) => b._count.vehicles > 0);

  return (
    <section className="border-y border-border bg-background-secondary py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Browse by Brand" title="Every Major Manufacturer, One Marketplace" align="center" />
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {withStock.map((brand) => (
            <Link
              key={brand.slug}
              href={`/inventory?brand=${brand.slug}`}
              className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 py-8 text-center transition-all hover:-translate-y-1 hover:border-accent"
            >
              <span className="font-display text-lg font-bold tracking-tight text-foreground group-hover:text-accent">
                {brand.name}
              </span>
              <span className="text-xs text-muted-foreground">{brand._count.vehicles} listed</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

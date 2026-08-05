import {
  getFeaturedVehicles,
  getDealVehicles,
  getBrands,
  getCategories,
  getTestimonials,
  getFilterOptions,
} from "@/lib/data";
import { Hero } from "@/components/site/hero";
import { SearchFilters } from "@/components/site/search-filters";
import { VehicleGridSection } from "@/components/site/vehicle-grid-section";
import { CategoryGrid } from "@/components/site/category-grid";
import { BrandStrip } from "@/components/site/brand-strip";
import { WhyChooseUs } from "@/components/site/why-choose-us";
import { Testimonials } from "@/components/site/testimonials";
import { FinanceTeaser } from "@/components/site/finance-teaser";
import { SellYourCarCta } from "@/components/site/sell-your-car-cta";
import { BuyingProcess } from "@/components/site/buying-process";
import { ContactSection } from "@/components/site/contact-section";

export default async function HomePage() {
  const [featured, deals, brands, categories, testimonials, filterOptions] = await Promise.all([
    getFeaturedVehicles(6),
    getDealVehicles(4),
    getBrands(),
    getCategories(),
    getTestimonials(),
    getFilterOptions(),
  ]);

  return (
    <>
      <Hero vehicles={featured} />
      <SearchFilters
        brands={brands}
        categories={categories}
        fuelTypes={filterOptions.fuelTypes}
        transmissions={filterOptions.transmissions}
      />
      <VehicleGridSection
        eyebrow="Handpicked For You"
        title="Featured Inventory"
        description="A curated mix of our best-value listings across every category."
        vehicles={featured}
        viewAllHref="/inventory"
      />
      <CategoryGrid categories={categories} />
      <BrandStrip brands={brands} />
      <WhyChooseUs />
      <VehicleGridSection
        eyebrow="Limited Time"
        title="Featured Deals"
        description="Special pricing on selected vehicles — while stocks last."
        vehicles={deals}
        viewAllHref="/inventory"
        tinted
      />
      <Testimonials testimonials={testimonials} />
      <FinanceTeaser />
      <SellYourCarCta />
      <BuyingProcess />
      <ContactSection />
    </>
  );
}

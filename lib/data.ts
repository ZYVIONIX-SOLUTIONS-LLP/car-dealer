import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export const vehicleCardInclude = {
  brand: true,
  category: true,
  images: { orderBy: { order: "asc" as const } },
} satisfies Prisma.VehicleInclude;

export const vehicleDetailInclude = {
  brand: true,
  category: true,
  images: { orderBy: { order: "asc" as const } },
  features: true,
} satisfies Prisma.VehicleInclude;

export type VehicleCard = Prisma.VehicleGetPayload<{ include: typeof vehicleCardInclude }>;
export type VehicleDetail = Prisma.VehicleGetPayload<{ include: typeof vehicleDetailInclude }>;

export type InventoryFilters = {
  brand?: string;
  category?: string;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  maxMileage?: number;
  location?: string;
  q?: string;
  sort?: "price-asc" | "price-desc" | "year-desc" | "mileage-asc" | "newest";
  page?: number;
  pageSize?: number;
};

function buildWhere(filters: InventoryFilters): Prisma.VehicleWhereInput {
  const where: Prisma.VehicleWhereInput = { sold: false };

  if (filters.brand) where.brand = { slug: filters.brand };
  if (filters.category) where.category = { slug: filters.category };
  if (filters.fuelType) where.fuelType = filters.fuelType;
  if (filters.transmission) where.transmission = filters.transmission;
  if (filters.bodyType) where.bodyType = filters.bodyType;
  if (filters.location) where.location = filters.location;

  if (filters.minPrice || filters.maxPrice) {
    where.price = {
      ...(filters.minPrice ? { gte: filters.minPrice } : {}),
      ...(filters.maxPrice ? { lte: filters.maxPrice } : {}),
    };
  }
  if (filters.minYear || filters.maxYear) {
    where.year = {
      ...(filters.minYear ? { gte: filters.minYear } : {}),
      ...(filters.maxYear ? { lte: filters.maxYear } : {}),
    };
  }
  if (filters.maxMileage) {
    where.mileage = { lte: filters.maxMileage };
  }
  if (filters.q) {
    where.OR = [
      { model: { contains: filters.q } },
      { variant: { contains: filters.q } },
      { brand: { name: { contains: filters.q } } },
      { description: { contains: filters.q } },
    ];
  }

  return where;
}

function buildOrderBy(sort?: InventoryFilters["sort"]): Prisma.VehicleOrderByWithRelationInput {
  switch (sort) {
    case "price-asc":
      return { price: "asc" };
    case "price-desc":
      return { price: "desc" };
    case "year-desc":
      return { year: "desc" };
    case "mileage-asc":
      return { mileage: "asc" };
    default:
      return { createdAt: "desc" };
  }
}

export async function getVehicles(filters: InventoryFilters = {}) {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 12;
  const where = buildWhere(filters);

  const [items, total] = await Promise.all([
    db.vehicle.findMany({
      where,
      include: vehicleCardInclude,
      orderBy: buildOrderBy(filters.sort),
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.vehicle.count({ where }),
  ]);

  return { items, total, page, pageSize, pageCount: Math.max(1, Math.ceil(total / pageSize)) };
}

export async function getFeaturedVehicles(take = 6) {
  return db.vehicle.findMany({
    where: { featured: true, sold: false },
    include: vehicleCardInclude,
    orderBy: { createdAt: "desc" },
    take,
  });
}

export async function getDealVehicles(take = 4) {
  return db.vehicle.findMany({
    where: { sold: false, discountLabel: { not: null } },
    include: vehicleCardInclude,
    orderBy: { createdAt: "desc" },
    take,
  });
}

export async function getVehicleBySlug(slug: string) {
  return db.vehicle.findUnique({ where: { slug }, include: vehicleDetailInclude });
}

export async function getRelatedVehicles(vehicle: VehicleDetail, take = 4) {
  return db.vehicle.findMany({
    where: {
      id: { not: vehicle.id },
      sold: false,
      OR: [{ categoryId: vehicle.categoryId }, { brandId: vehicle.brandId }],
    },
    include: vehicleCardInclude,
    orderBy: { createdAt: "desc" },
    take,
  });
}

export async function getBrands() {
  return db.brand.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { vehicles: { where: { sold: false } } } } },
  });
}

export async function getCategories() {
  return db.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { vehicles: { where: { sold: false } } } } },
  });
}

export async function getTestimonials() {
  return db.testimonial.findMany({ where: { featured: true }, orderBy: { createdAt: "desc" } });
}

export async function getFilterOptions() {
  const vehicles = await db.vehicle.findMany({
    where: { sold: false },
    select: { fuelType: true, transmission: true, bodyType: true, price: true, year: true, location: true },
  });
  const uniq = (arr: string[]) => Array.from(new Set(arr)).sort();
  return {
    fuelTypes: uniq(vehicles.map((v) => v.fuelType)),
    transmissions: uniq(vehicles.map((v) => v.transmission)),
    bodyTypes: uniq(vehicles.map((v) => v.bodyType)),
    locations: uniq(vehicles.map((v) => v.location)),
    minPrice: vehicles.length ? Math.min(...vehicles.map((v) => v.price)) : 0,
    maxPrice: vehicles.length ? Math.max(...vehicles.map((v) => v.price)) : 0,
    minYear: vehicles.length ? Math.min(...vehicles.map((v) => v.year)) : 2000,
    maxYear: vehicles.length ? Math.max(...vehicles.map((v) => v.year)) : new Date().getFullYear(),
  };
}

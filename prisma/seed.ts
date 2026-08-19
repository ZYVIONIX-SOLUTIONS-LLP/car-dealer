import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Deterministic pseudo-random generator so re-seeding produces stable data.
function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hashSeed(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (Math.imul(31, h) + input.charCodeAt(i)) | 0;
  }
  return h;
}
function pick<T>(rng: () => number, arr: T[]) {
  return arr[Math.floor(rng() * arr.length)];
}
function pickMany<T>(rng: () => number, arr: T[], count: number) {
  const pool = [...arr];
  const out: T[] = [];
  for (let i = 0; i < count && pool.length; i++) {
    const idx = Math.floor(rng() * pool.length);
    out.push(pool.splice(idx, 1)[0]);
  }
  return out;
}

const CATEGORIES = [
  { name: "Budget Cars", slug: "budget-cars", icon: "wallet" },
  { name: "Hatchbacks", slug: "hatchbacks", icon: "car" },
  { name: "Sedans", slug: "sedans", icon: "car-front" },
  { name: "SUVs", slug: "suvs", icon: "truck" },
  { name: "MPVs", slug: "mpvs", icon: "users" },
  { name: "Pickup Trucks", slug: "pickup-trucks", icon: "truck" },
  { name: "Electric Vehicles", slug: "electric-vehicles", icon: "zap" },
  { name: "Hybrid Cars", slug: "hybrid-cars", icon: "leaf" },
  { name: "Premium Cars", slug: "premium-cars", icon: "gem" },
  { name: "Luxury Cars", slug: "luxury-cars", icon: "crown" },
  { name: "Sports Cars", slug: "sports-cars", icon: "flag" },
] as const;

const BRAND_NAMES = [
  "Maruti Suzuki",
  "Hyundai",
  "Toyota",
  "Renault",
  "Honda",
  "Volkswagen",
  "Skoda",
  "Ford",
  "Jeep",
  "Mahindra",
  "Tata",
  "MG",
  "Nissan",
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Volvo",
  "Land Rover",
  "Jaguar",
  "Porsche",
  "Lexus",
  "Lamborghini",
  "Ferrari",
  "Bentley",
  "Rolls-Royce",
];

const IMAGE_IDS = [
  "photo-1503376780353-7e6692767b70",
  "photo-1533473359331-0135ef1b58bf",
  "photo-1552519507-da3b142c6e3d",
  "photo-1494976388531-d1058494cdd8",
  "photo-1541899481282-d53bffe3c35d",
  "photo-1580273916550-e323be2ae537",
  "photo-1605559424843-9e4c228bf1c2",
  "photo-1511919884226-fd3cad34687c",
  "photo-1542362567-b07e54358753",
  "photo-1553440569-bcc63803a83d",
  "photo-1502877338535-766e1452684a",
  "photo-1612544409744-e83b9f55bd1e", // car – replaced non-car image
  "photo-1571607388263-1044f9ea01dd",
  "photo-1518987048-93e29699e79a",
  "photo-1560958089-b8a1929cea89",
  "photo-1606664515524-ed2f786a0bd6", // car – replaced pool resort image
  "photo-1494905998402-395d579af36f",
  "photo-1583121274602-3e2820c69888",
  "photo-1493238792000-8113da705763",
  "photo-1526726538690-5cbf956ae2fd",
  "photo-1580414057403-c5f451f30e1c",
  "photo-1567818735868-e71b99932e29",
  "photo-1547245324-d777c6f05e80",
  "photo-1619767886558-efdc259cde1a", // car – replaced pool/resort image
  "photo-1554744512-d6c603f27c54",
  "photo-1541447271487-09612b3f49f7",
  "photo-1632245889029-e406faaa34cd",
  "photo-1544636331-e26879cd4d9b", // car – replaced second non-car image
  "photo-1571019613454-1cb2f99b2d8b",
  "photo-1617469767053-d3b523a0b982",
  "photo-1617814076367-b759c7d7e738",
];


function imageUrl(id: string) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=80`;
}

const FEATURE_POOL = [
  "Sunroof",
  "Leather Seats",
  "Alloy Wheels",
  "Rear View Camera",
  "360° Camera",
  "Cruise Control",
  "Adaptive Cruise Control",
  "Climate Control",
  "Touchscreen Infotainment",
  "Apple CarPlay",
  "Android Auto",
  "ABS with EBD",
  "6 Airbags",
  "Keyless Entry",
  "Push Button Start",
  "Ventilated Seats",
  "Panoramic Sunroof",
  "Premium Sound System",
  "Heads-Up Display",
  "Parking Sensors",
  "Wireless Charging",
  "Heated Seats",
  "Power Tailgate",
  "Lane Keep Assist",
];

const COLORS = [
  "Pearl White",
  "Midnight Black",
  "Storm Grey",
  "Racing Red",
  "Ocean Blue",
  "Silver Metallic",
  "Champagne Gold",
  "Forest Green",
];

const INTERIOR_COLORS = ["Black", "Beige", "Tan", "Charcoal", "Ivory"];

type VehicleSeed = {
  brand: string;
  category: string;
  model: string;
  variant: string;
  year: number;
  price: number;
  originalPrice?: number;
  fuelType: string;
  transmission: string;
  bodyType: string;
  engine: string;
  horsepower: number;
  featured?: boolean;
  discountLabel?: string;
  description: string;
};

const VEHICLES: VehicleSeed[] = [
  { brand: "Maruti Suzuki", category: "hatchbacks", model: "Swift", variant: "VXI", year: 2022, price: 620000, fuelType: "Petrol", transmission: "Manual", bodyType: "Hatchback", engine: "1.2L K-Series", horsepower: 89, featured: true, description: "A peppy, fuel-efficient city hatchback with a spirited drive and famously low running costs." },
  { brand: "Hyundai", category: "budget-cars", model: "Grand i10 Nios", variant: "Magna", year: 2021, price: 480000, fuelType: "Petrol", transmission: "Manual", bodyType: "Hatchback", engine: "1.2L Kappa", horsepower: 82, description: "An easy first car with a spacious cabin, low maintenance, and dependable Hyundai reliability." },
  { brand: "Toyota", category: "hatchbacks", model: "Glanza", variant: "V CVT", year: 2023, price: 780000, fuelType: "Petrol", transmission: "Automatic", bodyType: "Hatchback", engine: "1.2L Dual VVT-i", horsepower: 90, description: "Toyota build quality in a compact, automatic-friendly hatch built for daily city commutes." },
  { brand: "Renault", category: "budget-cars", model: "Kwid", variant: "Climber", year: 2020, price: 380000, fuelType: "Petrol", transmission: "Manual", bodyType: "Hatchback", engine: "1.0L", horsepower: 68, discountLabel: "Price Drop", description: "SUV-styled micro hatch that's easy on fuel and even easier on the wallet." },
  { brand: "Honda", category: "sedans", model: "City", variant: "VX CVT", year: 2022, price: 1250000, fuelType: "Petrol", transmission: "Automatic", bodyType: "Sedan", engine: "1.5L i-VTEC", horsepower: 121, featured: true, description: "The segment benchmark sedan — refined, spacious, and effortless to drive every day." },
  { brand: "Hyundai", category: "sedans", model: "Verna", variant: "SX Turbo", year: 2023, price: 1450000, fuelType: "Petrol", transmission: "Automatic", bodyType: "Sedan", engine: "1.0L Turbo GDi", horsepower: 118, description: "A sharply styled turbo-petrol sedan loaded with tech and a genuinely engaging drive." },
  { brand: "Volkswagen", category: "sedans", model: "Virtus", variant: "GT Plus", year: 2023, price: 1550000, fuelType: "Petrol", transmission: "Automatic", bodyType: "Sedan", engine: "1.5L TSI EVO", horsepower: 148, featured: true, description: "German-engineered sedan with a punchy turbo engine and rock-solid highway manners." },
  { brand: "Skoda", category: "sedans", model: "Slavia", variant: "AMT Style", year: 2022, price: 1350000, fuelType: "Petrol", transmission: "Automatic", bodyType: "Sedan", engine: "1.0L TSI", horsepower: 115, description: "Understated European styling with a driver-focused chassis and premium cabin feel." },
  { brand: "Toyota", category: "mpvs", model: "Innova Crysta", variant: "GX", year: 2022, price: 2150000, fuelType: "Diesel", transmission: "Manual", bodyType: "MPV", engine: "2.4L D-4D", horsepower: 148, featured: true, description: "The gold standard family MPV — bulletproof reliability, huge cabin, effortless long drives." },
  { brand: "Maruti Suzuki", category: "mpvs", model: "Ertiga", variant: "ZXI+", year: 2022, price: 1150000, fuelType: "Petrol", transmission: "Manual", bodyType: "MPV", engine: "1.5L K-Series", horsepower: 103, description: "A practical 7-seater with a smart third row, ideal for growing families." },
  { brand: "Hyundai", category: "suvs", model: "Creta", variant: "SX(O)", year: 2023, price: 1950000, fuelType: "Petrol", transmission: "Automatic", bodyType: "SUV", engine: "1.5L Smartstream", horsepower: 115, featured: true, description: "India's favourite compact SUV — bold looks, a tech-loaded cabin, and a commanding driving position." },
  { brand: "Toyota", category: "suvs", model: "Fortuner", variant: "4x4 AT", year: 2022, price: 3850000, fuelType: "Diesel", transmission: "Automatic", bodyType: "SUV", engine: "2.8L D-4D", horsepower: 201, featured: true, description: "A full-size body-on-frame SUV built to go anywhere with unmatched road presence." },
  { brand: "Ford", category: "suvs", model: "Endeavour", variant: "Titanium+ 4x4", year: 2021, price: 3550000, fuelType: "Diesel", transmission: "Automatic", bodyType: "SUV", engine: "2.0L Bi-Turbo", horsepower: 213, description: "A muscular, capable off-roader with a torque-rich diesel and a genuinely premium interior." },
  { brand: "Jeep", category: "suvs", model: "Compass", variant: "Model S", year: 2023, price: 2650000, fuelType: "Diesel", transmission: "Automatic", bodyType: "SUV", engine: "2.0L Multijet", horsepower: 170, description: "American SUV heritage with genuine 4x4 capability and a European-tuned ride." },
  { brand: "Mahindra", category: "suvs", model: "Thar", variant: "LX Hard Top", year: 2023, price: 1650000, fuelType: "Diesel", transmission: "Manual", bodyType: "SUV", engine: "2.2L mHawk", horsepower: 130, discountLabel: "Hot Deal", description: "An off-road icon reborn — go-anywhere capability with modern comfort and safety." },
  { brand: "Toyota", category: "pickup-trucks", model: "Hilux", variant: "High 4x4 AT", year: 2023, price: 4350000, fuelType: "Diesel", transmission: "Automatic", bodyType: "Pickup Truck", engine: "2.8L GD", horsepower: 201, description: "The world's toughest pickup — built to work hard and tow harder, in comfort." },
  { brand: "Ford", category: "pickup-trucks", model: "Ranger", variant: "Wildtrak 4x4", year: 2021, price: 3250000, fuelType: "Diesel", transmission: "Automatic", bodyType: "Pickup Truck", engine: "2.0L Bi-Turbo", horsepower: 213, description: "A lifestyle pickup with serious off-road chops and a genuinely comfortable cabin." },
  { brand: "Tata", category: "electric-vehicles", model: "Nexon EV", variant: "Max XZ+", year: 2023, price: 1650000, fuelType: "Electric", transmission: "Automatic", bodyType: "SUV", engine: "40.5 kWh Battery", horsepower: 143, featured: true, description: "India's best-selling EV — a long-range compact SUV with zero tailpipe emissions." },
  { brand: "MG", category: "electric-vehicles", model: "ZS EV", variant: "Exclusive", year: 2022, price: 2150000, fuelType: "Electric", transmission: "Automatic", bodyType: "SUV", engine: "50.3 kWh Battery", horsepower: 174, description: "A tech-forward electric SUV with a genuinely usable real-world range." },
  { brand: "Hyundai", category: "electric-vehicles", model: "Kona Electric", variant: "Premium", year: 2021, price: 2350000, fuelType: "Electric", transmission: "Automatic", bodyType: "SUV", engine: "39.2 kWh Battery", horsepower: 134, description: "One of the earliest mainstream EVs in India, still delivering silent, efficient miles." },
  { brand: "Toyota", category: "hybrid-cars", model: "Camry", variant: "Hybrid", year: 2022, price: 4650000, fuelType: "Petrol Hybrid", transmission: "Automatic", bodyType: "Sedan", engine: "2.5L Hybrid", horsepower: 218, description: "A whisper-quiet, self-charging hybrid flagship sedan built for effortless comfort." },
  { brand: "Honda", category: "hybrid-cars", model: "City", variant: "e:HEV", year: 2023, price: 2050000, fuelType: "Petrol Hybrid", transmission: "Automatic", bodyType: "Sedan", engine: "1.5L e:HEV", horsepower: 126, description: "Honda's clever two-motor hybrid system delivers EV-like smoothness with no plug required." },
  { brand: "BMW", category: "premium-cars", model: "3 Series", variant: "330i M Sport", year: 2022, price: 5250000, fuelType: "Petrol", transmission: "Automatic", bodyType: "Sedan", engine: "2.0L TwinPower Turbo", horsepower: 258, featured: true, description: "The benchmark sports sedan, tuned for a perfectly balanced, driver-first experience." },
  { brand: "Mercedes-Benz", category: "premium-cars", model: "C-Class", variant: "C300", year: 2023, price: 5850000, fuelType: "Petrol", transmission: "Automatic", bodyType: "Sedan", engine: "2.0L Turbo", horsepower: 258, description: "Effortless luxury with class-leading cabin tech and a serene, cosseting ride." },
  { brand: "Audi", category: "premium-cars", model: "Q5", variant: "45 TFSI Quattro", year: 2022, price: 6250000, fuelType: "Petrol", transmission: "Automatic", bodyType: "SUV", engine: "2.0L TFSI", horsepower: 249, description: "A confident, all-weather premium SUV with Audi's celebrated quattro all-wheel drive." },
  { brand: "Volvo", category: "premium-cars", model: "XC60", variant: "Inscription", year: 2021, price: 5450000, fuelType: "Petrol", transmission: "Automatic", bodyType: "SUV", engine: "2.0L Turbo", horsepower: 250, description: "Scandinavian design and class-leading safety in a supremely comfortable SUV." },
  { brand: "BMW", category: "luxury-cars", model: "X5", variant: "xDrive40i", year: 2022, price: 8950000, fuelType: "Petrol", transmission: "Automatic", bodyType: "SUV", engine: "3.0L Turbo I6", horsepower: 335, featured: true, description: "A commanding luxury SUV that blends genuine off-road ability with first-class comfort." },
  { brand: "Land Rover", category: "luxury-cars", model: "Range Rover Sport", variant: "HSE", year: 2022, price: 11500000, fuelType: "Diesel", transmission: "Automatic", bodyType: "SUV", engine: "3.0L Ingenium", horsepower: 300, description: "Peerless off-road pedigree wrapped in one of the most opulent cabins on sale." },
  { brand: "Mercedes-Benz", category: "luxury-cars", model: "S-Class", variant: "S450", year: 2023, price: 14800000, fuelType: "Petrol", transmission: "Automatic", bodyType: "Sedan", engine: "3.0L Inline-6 Turbo", horsepower: 367, featured: true, description: "The world's benchmark luxury sedan — a rolling first-class cabin for those who arrive in style." },
  { brand: "Lexus", category: "luxury-cars", model: "ES", variant: "300h", year: 2021, price: 6350000, fuelType: "Petrol Hybrid", transmission: "Automatic", bodyType: "Sedan", engine: "2.5L Hybrid", horsepower: 215, description: "Understated luxury with legendary Lexus reliability and a hushed, hybrid-smooth ride." },
  { brand: "Rolls-Royce", category: "luxury-cars", model: "Ghost", variant: "Standard Wheelbase", year: 2021, price: 42500000, fuelType: "Petrol", transmission: "Automatic", bodyType: "Sedan", engine: "6.75L V12", horsepower: 563, featured: true, description: "The pinnacle of automotive luxury — handcrafted, silent, and utterly effortless." },
  { brand: "Jaguar", category: "sports-cars", model: "F-Type", variant: "R-Dynamic", year: 2022, price: 9850000, fuelType: "Petrol", transmission: "Automatic", bodyType: "Coupe", engine: "3.0L Supercharged V6", horsepower: 380, description: "A snarling British sports car with a soundtrack as thrilling as its performance." },
  { brand: "Porsche", category: "sports-cars", model: "911", variant: "Carrera S", year: 2022, price: 18500000, fuelType: "Petrol", transmission: "Automatic", bodyType: "Coupe", engine: "3.0L Twin-Turbo Flat-6", horsepower: 443, featured: true, description: "The definitive sports car — 60 years of engineering distilled into pure driving joy." },
  { brand: "Lamborghini", category: "sports-cars", model: "Huracan", variant: "EVO", year: 2021, price: 38500000, fuelType: "Petrol", transmission: "Automatic", bodyType: "Coupe", engine: "5.2L V10", horsepower: 630, description: "A naturally-aspirated V10 supercar that turns every drive into an event." },
  { brand: "Ferrari", category: "sports-cars", model: "Portofino", variant: "M", year: 2022, price: 42500000, fuelType: "Petrol", transmission: "Automatic", bodyType: "Convertible", engine: "3.9L Twin-Turbo V8", horsepower: 611, featured: true, description: "A grand tourer with unmistakable Ferrari drama, equally at home on the track or the coast." },
];

const TESTIMONIALS = [
  { name: "Arjun Mehta", role: "Bought a Hyundai Creta", quote: "The whole process was transparent from the first call to driving off the lot. No pressure, no surprises — just a fair deal.", rating: 5 },
  { name: "Priya Nair", role: "Bought a Maruti Swift", quote: "First car buying experience and they made it painless. The inspection report gave me total confidence in the purchase.", rating: 5 },
  { name: "Rohan Kapoor", role: "Bought a BMW 3 Series", quote: "Even for a premium car, the paperwork and financing were sorted in under a week. Genuinely impressed with the service.", rating: 5 },
  { name: "Sana Sheikh", role: "Sold her Honda City", quote: "Got a fair valuation instantly and payment landed the same day I dropped the car off. Couldn't have been easier.", rating: 4 },
  { name: "Vikram Singh", role: "Bought a Toyota Fortuner", quote: "Test drove three SUVs in one afternoon with zero hassle. The team actually knew the cars inside out.", rating: 5 },
  { name: "Neha Joshi", role: "Bought a Tata Nexon EV", quote: "Loved that they specialize in every price range, not just luxury. Found exactly the EV I wanted at a fair price.", rating: 5 },
];

async function main() {
  console.log("Seeding admin user...");
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await db.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: { email: adminEmail, name: "Dealership Admin", passwordHash },
  });

  console.log("Seeding categories...");
  const categoryBySlug = new Map<string, string>();
  for (const c of CATEGORIES) {
    const row = await db.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, icon: c.icon },
      create: c,
    });
    categoryBySlug.set(c.slug, row.id);
  }

  console.log("Seeding brands...");
  const brandByName = new Map<string, string>();
  for (const name of BRAND_NAMES) {
    const slug = slugify(name);
    const row = await db.brand.upsert({
      where: { slug },
      update: { name },
      create: { name, slug, logoUrl: "" },
    });
    brandByName.set(name, row.id);
  }

  console.log("Clearing existing vehicles...");
  await db.vehicle.deleteMany();

  console.log("Seeding vehicles...");
  for (let i = 0; i < VEHICLES.length; i++) {
    const v = VEHICLES[i];
    const rng = mulberry32(hashSeed(`${v.brand}-${v.model}-${v.variant}-${v.year}`));
    const slug = slugify(`${v.brand}-${v.model}-${v.variant}-${v.year}-${i}`);
    const mileage = Math.floor(8000 + rng() * 62000);
    const ownerCount = 1 + Math.floor(rng() * 3);
    const registrationYear = v.year;
    const vin = `MA${Math.floor(rng() * 9)}${v.model.slice(0, 2).toUpperCase()}${1000000 + Math.floor(rng() * 8999999)}`;
    const images = pickMany(rng, IMAGE_IDS, 4 + Math.floor(rng() * 2));
    const features = pickMany(rng, FEATURE_POOL, 6 + Math.floor(rng() * 4));

    await db.vehicle.create({
      data: {
        slug,
        brandId: brandByName.get(v.brand)!,
        categoryId: categoryBySlug.get(v.category)!,
        model: v.model,
        variant: v.variant,
        year: v.year,
        price: v.price,
        originalPrice: v.discountLabel ? Math.round(v.price * 1.08) : null,
        mileage,
        fuelType: v.fuelType,
        transmission: v.transmission,
        bodyType: v.bodyType,
        engine: v.engine,
        horsepower: v.horsepower,
        exteriorColor: pick(rng, COLORS),
        interiorColor: pick(rng, INTERIOR_COLORS),
        vin,
        registrationYear,
        ownerCount,
        serviceHistory: ownerCount === 1 ? "Full service history, single owner" : "Complete service records available",
        inspectionStatus: "Passed 150-Point Inspection",
        location: pick(rng, ["Mumbai, MH", "Delhi, DL", "Bengaluru, KA", "Pune, MH", "Chennai, TN", "Hyderabad, TG"]),
        description: v.description,
        featured: !!v.featured,
        discountLabel: v.discountLabel,
        images: {
          create: images.map((id, order) => ({ url: imageUrl(id), order })),
        },
        features: {
          create: features.map((label) => ({ label })),
        },
      },
    });
  }

  // Override the Rolls-Royce Ghost's first image with the actual car photo.
  console.log("Patching Rolls-Royce Ghost image...");
  const ghost = await db.vehicle.findFirst({
    where: { model: "Ghost", variant: "Standard Wheelbase" },
    include: { images: { orderBy: { order: "asc" } } },
  });
  if (ghost?.images[0]) {
    await db.vehicleImage.update({
      where: { id: ghost.images[0].id },
      data: { url: "/images/rr-ghost.jpg" },
    });
  }

  console.log("Seeding testimonials...");
  await db.testimonial.deleteMany();
  for (const t of TESTIMONIALS) {
    await db.testimonial.create({
      data: { ...t, avatarUrl: "", featured: true },
    });
  }

  console.log("Seeding sample enquiries...");
  await db.enquiry.deleteMany();
  const vehicles = await db.vehicle.findMany({ select: { id: true, model: true } });
  const sampleEnquiries = [
    { name: "Karan Malhotra", phone: "+91 98765 43210", email: "karan.m@example.com", type: "general", status: "new", message: "Interested in an SUV under 20 lakh, looking to buy this month." },
    { name: "Divya Rao", phone: "+91 91234 56780", email: "divya.rao@example.com", type: "test-drive", status: "contacted", message: "Would like to schedule a test drive this weekend." },
    { name: "Aman Gupta", phone: "+91 99887 66554", type: "callback", status: "new", message: "Please call back after 6 PM." },
    { name: "Ishita Bansal", phone: "+91 90909 12345", email: "ishita.b@example.com", type: "valuation", status: "closed", message: "Want to sell my current sedan and trade in." },
    { name: "Farhan Ali", phone: "+91 98080 11223", type: "general", status: "new", budget: "10-15 Lakh", message: "Looking for a reliable family sedan." },
  ];
  for (let i = 0; i < sampleEnquiries.length; i++) {
    const e = sampleEnquiries[i];
    await db.enquiry.create({
      data: {
        ...e,
        vehicleId: vehicles[i % vehicles.length]?.id,
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  // Find the Rolls-Royce Ghost vehicle
  const vehicle = await db.vehicle.findFirst({
    where: {
      model: "Ghost",
      variant: "Standard Wheelbase",
      brand: { name: "Rolls-Royce" },
    },
    include: {
      images: { orderBy: { order: "asc" } },
    },
  });

  if (!vehicle) {
    console.error("Rolls-Royce Ghost not found in database.");
    process.exit(1);
  }

  console.log(`Found vehicle: ${vehicle.model} ${vehicle.variant} (id: ${vehicle.id})`);
  console.log(`Current images: ${vehicle.images.map((i) => i.url).join(", ")}`);

  const newUrl = "/images/rr-ghost.jpg";

  const firstImage = vehicle.images[0];
  if (!firstImage) {
    console.error("No images found for this vehicle.");
    process.exit(1);
  }

  await db.vehicleImage.update({
    where: { id: firstImage.id },
    data: { url: newUrl },
  });

  console.log(`Updated first image to: ${newUrl}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());

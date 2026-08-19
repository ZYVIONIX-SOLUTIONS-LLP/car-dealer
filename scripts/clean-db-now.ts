import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const BAD_PATTERNS = [
    "photo-1547245324",
    "photo-1541447271",
    "photo-1596436889",
    "photo-1544829099",
    "photo-1520031441",
    "photo-1615840287"
  ];
  
  const REPLACEMENT_CAR = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1600&q=80";

  const allImages = await db.vehicleImage.findMany({
    include: { vehicle: true }
  });

  let count = 0;
  for (const img of allImages) {
    if (BAD_PATTERNS.some(pattern => img.url.includes(pattern))) {
      console.log(`Replacing bad image for vehicle [${img.vehicle.model} ${img.vehicle.variant}] (order ${img.order}): ${img.url}`);
      await db.vehicleImage.update({
        where: { id: img.id },
        data: { url: REPLACEMENT_CAR }
      });
      count++;
    }
  }

  console.log(`\nTOTAL BAD IMAGES REPLACED DIRECTLY IN DB: ${count}`);
  await db.$disconnect();
}

main().catch(console.error);

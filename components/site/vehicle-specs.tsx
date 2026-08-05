import {
  Calendar,
  Gauge,
  Fuel,
  Cog,
  CarFront,
  Zap,
  Paintbrush,
  Armchair,
  Hash,
  UserCheck,
  Wrench,
  ClipboardCheck,
} from "lucide-react";
import type { VehicleDetail } from "@/lib/data";
import { formatMileage } from "@/lib/utils";

export function VehicleSpecs({ vehicle }: { vehicle: VehicleDetail }) {
  const specs = [
    { icon: Calendar, label: "Year", value: vehicle.year },
    { icon: Gauge, label: "Mileage", value: formatMileage(vehicle.mileage) },
    { icon: Fuel, label: "Fuel Type", value: vehicle.fuelType },
    { icon: Cog, label: "Transmission", value: vehicle.transmission },
    { icon: CarFront, label: "Body Type", value: vehicle.bodyType },
    { icon: Zap, label: "Engine", value: `${vehicle.engine} · ${vehicle.horsepower} bhp` },
    { icon: Paintbrush, label: "Exterior Color", value: vehicle.exteriorColor },
    { icon: Armchair, label: "Interior Color", value: vehicle.interiorColor },
    { icon: Hash, label: "VIN", value: vehicle.vin },
    { icon: UserCheck, label: "Owners", value: `${vehicle.ownerCount} Owner${vehicle.ownerCount > 1 ? "s" : ""}` },
    { icon: Wrench, label: "Service History", value: vehicle.serviceHistory },
    { icon: ClipboardCheck, label: "Inspection", value: vehicle.inspectionStatus },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {specs.map(({ icon: Icon, label, value }) => (
        <div key={label} className="rounded-xl border border-border bg-background-secondary p-4">
          <Icon className="h-4 w-4 text-accent" />
          <p className="mt-2 text-xs text-muted-foreground">{label}</p>
          <p className="mt-0.5 truncate text-sm font-semibold text-foreground" title={String(value)}>
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}

import type { Metadata } from "next";
import { CompareClient } from "@/components/site/compare-client";

export const metadata: Metadata = { title: "Compare Vehicles" };

export default function ComparePage() {
  return <CompareClient />;
}

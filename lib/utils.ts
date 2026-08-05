import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatPrice(value: number) {
  return inr.format(value);
}

export function formatMileage(value: number) {
  return `${new Intl.NumberFormat("en-IN").format(value)} km`;
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}

export function timeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const ranges: [number, string][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
    [4.345, "week"],
    [12, "month"],
    [Number.POSITIVE_INFINITY, "year"],
  ];
  let unitValue = seconds;
  let unitName = "second";
  let divisor = 1;
  for (const [range, name] of ranges) {
    if (unitValue < range) {
      unitName = name;
      break;
    }
    unitValue = unitValue / range;
    divisor *= range;
  }
  const value = Math.floor(seconds / divisor) || 0;
  if (value <= 1 && unitName === "second") return "just now";
  return `${value} ${unitName}${value !== 1 ? "s" : ""} ago`;
}

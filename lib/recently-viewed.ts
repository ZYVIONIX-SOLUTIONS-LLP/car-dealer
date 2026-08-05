"use client";

const KEY = "recently-viewed";
const EVENT = "recently-viewed-change";
const MAX = 8;
const EMPTY: RecentVehicle[] = [];

let cacheRaw: string | null = null;
let cacheParsed: RecentVehicle[] = EMPTY;

export type RecentVehicle = {
  id: string;
  slug: string;
  brand: string;
  model: string;
  variant: string;
  price: number;
  image?: string;
};

export function getRecentlyViewed(): RecentVehicle[] {
  if (typeof window === "undefined") return EMPTY;
  const raw = window.localStorage.getItem(KEY);
  if (raw === cacheRaw) return cacheParsed;

  try {
    cacheParsed = raw ? (JSON.parse(raw) as RecentVehicle[]) : EMPTY;
  } catch {
    cacheParsed = EMPTY;
  }
  cacheRaw = raw;
  return cacheParsed;
}

export function addRecentlyViewed(vehicle: RecentVehicle) {
  const current = getRecentlyViewed().filter((v) => v.id !== vehicle.id);
  const next = [vehicle, ...current].slice(0, MAX);
  window.localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function subscribeRecentlyViewed(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

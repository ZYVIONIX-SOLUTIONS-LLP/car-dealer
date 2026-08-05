"use client";

import { useCallback, useSyncExternalStore } from "react";

const EVENT_PREFIX = "collection-change:";
const cache = new Map<string, { raw: string | null; ids: string[] }>();
const EMPTY: string[] = [];

function read(key: string): string[] {
  if (typeof window === "undefined") return EMPTY;
  const raw = window.localStorage.getItem(key);
  const cached = cache.get(key);
  if (cached && cached.raw === raw) return cached.ids;

  let ids: string[] = EMPTY;
  try {
    ids = raw ? (JSON.parse(raw) as string[]) : EMPTY;
  } catch {
    ids = EMPTY;
  }
  cache.set(key, { raw, ids });
  return ids;
}

function write(key: string, ids: string[]) {
  window.localStorage.setItem(key, JSON.stringify(ids));
  window.dispatchEvent(new CustomEvent(EVENT_PREFIX + key));
}

function subscribe(key: string, callback: () => void) {
  window.addEventListener(EVENT_PREFIX + key, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT_PREFIX + key, callback);
    window.removeEventListener("storage", callback);
  };
}

export function useCollection(key: "wishlist" | "compare") {
  const ids = useSyncExternalStore(
    (callback) => subscribe(key, callback),
    () => read(key),
    () => EMPTY
  );

  const toggle = useCallback(
    (id: string) => {
      const current = read(key);
      const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
      write(key, next);
    },
    [key]
  );

  const remove = useCallback(
    (id: string) => {
      write(key, read(key).filter((x) => x !== id));
    },
    [key]
  );

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  return { ids, toggle, remove, has };
}

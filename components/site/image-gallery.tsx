"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function ImageGallery({ images, alt }: { images: { url: string }[]; alt: string }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const total = images.length;

  function go(delta: number) {
    setActive((i) => (i + delta + total) % total);
  }

  if (total === 0) {
    return <div className="aspect-[16/10] rounded-2xl bg-background-secondary" />;
  }

  return (
    <div>
      <div className="group relative aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-background-secondary">
        <Image
          src={images[active].url}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover"
        />
        {total > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
        <button
          onClick={() => setLightbox(true)}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white"
          aria-label="Expand image"
        >
          <Expand className="h-4 w-4" />
        </button>
        <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs text-white">
          {active + 1} / {total}
        </span>
      </div>

      {total > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                "relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2",
                i === active ? "border-accent" : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <Image src={img.url} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-6"
          onClick={() => setLightbox(false)}
        >
          <button
            className="absolute right-6 top-6 text-white"
            onClick={() => setLightbox(false)}
            aria-label="Close"
          >
            <X className="h-7 w-7" />
          </button>
          <div className="relative h-full w-full max-w-5xl">
            <Image src={images[active].url} alt={alt} fill sizes="100vw" className="object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}

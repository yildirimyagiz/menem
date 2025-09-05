"use client";

import Image from "next/image";
import React from "react";

export interface HeroPhoto {
  src: string;
  alt: string;
}

export default function HeroMosaic({ photos, onOpenLightbox, tours = 0, videos = 0 }: { photos: HeroPhoto[]; onOpenLightbox?: (startIndex?: number) => void; tours?: number; videos?: number }) {
  const items = photos.slice(0, 5);
  const large = items[0];
  const small = items.slice(1);
  const moreCount = Math.max(0, photos.length - items.length);

  return (
    <div className="relative group">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {/* Large left */}
        <button
          type="button"
          onClick={() => onOpenLightbox?.(0)}
          className="relative aspect-[4/3] overflow-hidden rounded-xl border border-black/5 md:col-span-2 shadow-sm"
          aria-label={large?.alt ?? "Photo"}
        >
          {large ? (
            <Image src={large.src} alt={large.alt} fill className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.01]" />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-xl bg-gray-100 text-gray-500">No image</div>
          )}
          {/* subtle gradient at bottom for legibility if we later add captions */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/15 to-transparent" />
        </button>

        {/* Right 2x2 */}
        <div className="grid grid-cols-2 gap-3">
          {small.map((p, i) => {
            const isLast = i === small.length - 1;
            return (
              <button
                key={i}
                type="button"
                onClick={() => onOpenLightbox?.(i + 1)}
                className="relative aspect-[4/3] overflow-hidden rounded-xl border border-black/5 shadow-sm"
                aria-label={p.alt}
              >
                <Image src={p.src} alt={p.alt} fill className="object-cover transition-transform duration-300 ease-out hover:scale-[1.02]" />
                {isLast && moreCount > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/35 backdrop-blur-[1px]">
                    <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-foreground shadow-sm">+{moreCount}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Counters pill */}
      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 md:top-3 md:right-3 md:left-auto md:bottom-auto md:translate-x-0">
        <div className="flex items-center gap-3 rounded-full bg-white/95 px-3 py-1 text-xs text-foreground shadow-sm ring-1 ring-black/5">
          <span className="font-medium">{photos.length} Photos</span>
          {tours > 0 && <span className="text-muted-foreground">{tours} 3D Tours</span>}
          {videos > 0 && <span className="text-muted-foreground">{videos} Videos</span>}
        </div>
      </div>
    </div>
  );
}

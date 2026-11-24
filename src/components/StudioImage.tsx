"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";

// Known existing physical assets in public/ directory
const KNOWN_AVAILABLE_IMAGES = new Set([
  // Banners
  "/images/banners/editorial-creatine.jpg",
  "/images/banners/editorial-preworkout.jpg",
  "/images/banners/editorial-whey.jpg",
  "/images/banners/hero-main.jpg",
  "/images/banners/hero-vault.jpg",
  "/images/banners/hero-verify.jpg",
  "/images/banners/promo-scanner.jpg",
  // Categories
  "/images/categories/accessories.png",
  "/images/categories/amino.png",
  "/images/categories/bcaa.png",
  "/images/categories/creatine.png",
  "/images/categories/fat-burner.png",
  "/images/categories/mass-gainer.png",
  "/images/categories/multivitamins.png",
  "/images/categories/pre-workout.png",
  "/images/categories/whey-protein.png",
  // Products
  "/images/products/anabolic-mass.png",
  "/images/products/animal-pak.png",
  "/images/products/c4-ultimate.png",
  "/images/products/ghost-legend.png",
  "/images/products/gold-standard-isolate.png",
  "/images/products/iso100-hydrolyzed.png",
  "/images/products/king-mass-xl.png",
  "/images/products/platinum-creatine.png",
]);

function isAssetAvailable(src?: string): boolean {
  if (!src) return false;
  // External URLs or inline data URIs are handled dynamically
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:")) {
    return true;
  }
  const cleanPath = src.split("?")[0].split("#")[0];
  const normalized = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
  return KNOWN_AVAILABLE_IMAGES.has(normalized);
}

interface StudioImageProps {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  unoptimized?: boolean;
  objectFit?: "contain" | "cover";
  objectPosition?: "center" | "right" | "top" | "bottom" | "left" | "top right" | "top left";
  fallbackLabel?: string;
}

export default function StudioImage({
  src,
  alt,
  className = "",
  imageClassName = "",
  fill = false,
  width,
  height,
  sizes,
  priority = false,
  unoptimized = true,
  objectFit = "contain",
  objectPosition = "center",
  fallbackLabel,
}: StudioImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const isAvailable = isAssetAvailable(src);

  const positionClass =
    objectPosition === "right"
      ? "object-right"
      : objectPosition === "top"
      ? "object-top"
      : objectPosition === "bottom"
      ? "object-bottom"
      : objectPosition === "left"
      ? "object-left"
      : objectPosition === "top right"
      ? "object-right-top"
      : objectPosition === "top left"
      ? "object-left-top"
      : "object-center";

  // If the image is known to not exist or failed during load, render sleek studio placeholder directly
  // This completely eliminates /_next/image 404 console errors
  if (hasError || !isAvailable) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center bg-[#0D0D10] border border-white/8 text-zinc-500 p-3 select-none ${
          fill ? "w-full h-full absolute inset-0" : ""
        } ${className}`}
      >
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/[0.04] border border-white/8 flex items-center justify-center mb-1.5 shrink-0">
          <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E2C275]/70" />
        </div>
        <span className="text-[9px] sm:text-[10px] font-mono tracking-wider text-zinc-300 uppercase text-center line-clamp-1 px-1">
          {fallbackLabel || alt}
        </span>
        <span className="text-[7px] sm:text-[8px] font-mono text-zinc-600 mt-0.5 line-clamp-1">
          {src ? src.replace("/images/", "") : "AURA STUDIO ASSET"}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${
        fill ? "w-full h-full" : ""
      } ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        sizes={sizes || (fill ? "100vw" : undefined)}
        priority={priority}
        unoptimized={unoptimized}
        onError={() => setHasError(true)}
        onLoad={() => setIsLoaded(true)}
        className={`transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-90"
        } ${
          objectFit === "contain" ? "object-contain" : "object-cover"
        } ${positionClass} ${imageClassName}`}
      />
    </div>
  );
}

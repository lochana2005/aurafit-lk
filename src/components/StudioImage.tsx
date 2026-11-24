"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";

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
  objectFit = "contain",
  objectPosition = "center",
  fallbackLabel,
}: StudioImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

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

  if (hasError) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center bg-[#0D0D10] border border-white/8 text-zinc-500 p-4 select-none ${
          fill ? "w-full h-full absolute inset-0" : ""
        } ${className}`}
      >
        <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/8 flex items-center justify-center mb-2">
          <Camera className="w-4 h-4 text-[#E2C275]/70" />
        </div>
        <span className="text-[10px] font-mono tracking-wider text-zinc-300 uppercase text-center line-clamp-1">
          {fallbackLabel || alt}
        </span>
        <span className="text-[8px] font-mono text-zinc-600 mt-0.5">
          {src.replace("/images/", "")}
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
        sizes={sizes}
        priority={priority}
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

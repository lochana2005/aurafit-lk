"use client";

import React from "react";
import Link from "next/link";
import { Plus, Minus, Trash2, ShieldCheck } from "lucide-react";
import { CartItem } from "@/context/CartContext";
import StudioImage from "@/components/StudioImage";

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export default function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemRowProps) {
  const { product, quantity, selectedFlavor } = item;
  const lineTotal = product.price * quantity;

  return (
    <div className="bg-[#141418] rounded-2xl border border-white/8 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 hover:border-white/15 transition-all shadow-lg">
      {/* Left: Thumbnail & Details */}
      <div className="flex items-center gap-4 sm:gap-5 flex-1 min-w-0">
        {/* Product Studio Thumbnail */}
        <Link
          href={`/shop/${product.slug}`}
          className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-[#0D0D10] border border-white/8 p-2 shrink-0 overflow-hidden group/thumb cursor-pointer"
        >
          <StudioImage
            src={product.image}
            alt={product.name}
            fill
            sizes="96px"
            objectFit="contain"
            fallbackLabel={product.name}
            className="group-hover/thumb:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Product Information */}
        <div className="flex-1 min-w-0 space-y-1">
          {/* Brand */}
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#E2C275] font-heading block">
            {product.brand}
          </span>

          {/* Title */}
          <Link
            href={`/shop/${product.slug}`}
            className="text-sm sm:text-base font-bold text-white font-heading hover:text-[#E2C275] transition-colors line-clamp-1 block"
          >
            {product.name}
          </Link>

          {/* Variant pills & QR verified badge */}
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            {/* Weight pill */}
            <span className="px-2 py-0.5 rounded-md bg-[#1C1C22] border border-white/10 text-[11px] font-mono text-zinc-300">
              {product.weight}
            </span>

            {/* Flavor pill */}
            {selectedFlavor && (
              <span className="px-2 py-0.5 rounded-md bg-[#1C1C22] border border-white/10 text-[11px] text-zinc-300 truncate max-w-[150px]">
                {selectedFlavor}
              </span>
            )}

            {/* Ice Cyan QR Verified tag */}
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-sky-400 bg-sky-950/40 border border-sky-400/20 px-2 py-0.5 rounded-full">
              <ShieldCheck className="w-3 h-3 text-sky-400" />
              <span>QR Verified</span>
            </span>
          </div>

          {/* Unit Price */}
          <p className="text-xs text-zinc-400 pt-0.5">
            Rs. {product.price.toLocaleString()}{" "}
            <span className="text-zinc-500">/ unit</span>
          </p>
        </div>
      </div>

      {/* Right: Quantity Stepper, Line Total & Remove Action */}
      <div className="flex items-center justify-between sm:justify-end gap-5 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/8 shrink-0">
        {/* Quantity Stepper */}
        <div className="flex items-center rounded-xl bg-[#1C1C22] border border-white/10 px-2 py-1">
          <button
            type="button"
            onClick={() => onUpdateQuantity(product.id, quantity - 1)}
            aria-label="Decrease quantity"
            className="p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="px-3 text-xs sm:text-sm font-bold text-white font-mono">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => onUpdateQuantity(product.id, quantity + 1)}
            aria-label="Increase quantity"
            className="p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Line Total */}
        <div className="text-right min-w-[100px]">
          <span className="text-sm sm:text-base font-extrabold text-white font-sans block">
            Rs. {lineTotal.toLocaleString()}
          </span>
        </div>

        {/* Delete / Remove Button */}
        <button
          type="button"
          onClick={() => onRemove(product.id)}
          aria-label={`Remove ${product.name} from cart`}
          className="p-2 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          title="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}


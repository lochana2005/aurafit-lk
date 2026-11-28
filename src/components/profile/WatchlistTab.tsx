"use client";

import React from "react";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { useWatchlist } from "@/context/WatchlistContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { formatLKR, getKokoInstallment } from "@/lib/pricing";
import StudioImage from "@/components/StudioImage";

export default function WatchlistTab() {
  const { watchlist, watchlistCount, removeFromWatchlist } = useWatchlist();
  const { addToCart, openCart } = useCart();
  const { showToast } = useToast();

  const handleMoveAllToCart = () => {
    if (watchlist.length === 0) return;
    watchlist.forEach((product) => {
      addToCart(product, 1);
    });
    showToast({
      type: "gold",
      title: "Entire Watchlist Added to Cart",
      subtitle: `${watchlist.length} saved ${watchlist.length === 1 ? "supplement" : "supplements"} moved to your cart.`,
      actionLabel: "VIEW CART →",
      onAction: () => openCart(),
    });
  };

  return (
    <div className="bg-[#141418] rounded-2xl border border-white/8 p-6 sm:p-8 shadow-xl space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/8">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-wider text-white font-heading">
            MY SAVED WATCHLIST
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            {watchlistCount} {watchlistCount === 1 ? "supplement" : "supplements"} bookmarked in your vault
          </p>
        </div>

        {watchlist.length > 0 && (
          <button
            type="button"
            onClick={handleMoveAllToCart}
            className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider btn-aurafit-gold inline-flex items-center gap-2 self-start sm:self-auto cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>MOVE ALL TO CART</span>
          </button>
        )}
      </div>

      {/* Watchlist Grid or Empty State */}
      {watchlist.length === 0 ? (
        <div className="py-14 px-6 rounded-2xl bg-[#0E0E12] border border-white/8 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-[#16161C] border border-white/10 flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-[#E2C275]/60" />
          </div>
          <h3 className="text-lg font-bold uppercase tracking-wider text-white font-heading">
            Your Saved Watchlist is Empty
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mt-1.5 leading-relaxed">
            Tap the heart icon on any supplement card or product page to save formulas for your next training block.
          </p>
          <Link
            href="/shop"
            className="mt-6 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider btn-aurafit-gold inline-flex items-center gap-2"
          >
            <span>EXPLORE SUPPLEMENT VAULT</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {watchlist.map((product) => (
            <div
              key={product.id}
              className="rounded-2xl bg-[#16161C] border border-white/10 hover:border-[#E2C275]/40 p-4 flex flex-col justify-between gap-4 transition-colors"
            >
              <div className="flex items-start gap-4">
                <Link
                  href={`/shop/${product.slug}`}
                  className="relative w-20 h-20 rounded-xl bg-[#0D0D10] border border-white/8 p-2 shrink-0 overflow-hidden"
                >
                  <StudioImage
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="80px"
                    objectFit="contain"
                    fallbackLabel={product.name}
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#E2C275] block">
                    {product.brand}
                  </span>
                  <Link
                    href={`/shop/${product.slug}`}
                    className="text-sm sm:text-base font-bold text-white hover:text-[#E2C275] transition-colors leading-snug mt-0.5 block"
                  >
                    {product.name}
                  </Link>
                  <div className="mt-2 flex items-baseline gap-2 flex-wrap">
                    <span className="text-base font-extrabold text-white">
                      {formatLKR(product.price, false)}
                    </span>
                    <span className="text-[11px] text-zinc-300">
                      · KOKO 3× {formatLKR(getKokoInstallment(product.price), false)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-3 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => addToCart(product, 1)}
                  className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider btn-aurafit-gold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>ADD TO CART</span>
                </button>
                <button
                  type="button"
                  data-no-glint
                  onClick={() => removeFromWatchlist(product.id)}
                  className="py-2.5 px-3.5 rounded-xl text-xs font-bold uppercase tracking-wider btn-aurafit-dark flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-zinc-400" />
                  <span>REMOVE</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

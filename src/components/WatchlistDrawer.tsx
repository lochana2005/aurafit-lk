"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X, Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { useWatchlist } from "@/context/WatchlistContext";
import { useCart } from "@/context/CartContext";
import StudioImage from "./StudioImage";

export default function WatchlistDrawer() {
  const pathname = usePathname();
  const {
    watchlist,
    watchlistCount,
    isWatchlistOpen,
    closeWatchlist,
    removeFromWatchlist,
    clearWatchlist,
  } = useWatchlist();
  const { addToCart } = useCart();

  useEffect(() => {
    if (isWatchlistOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isWatchlistOpen]);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <AnimatePresence>
      {isWatchlistOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Dark Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeWatchlist}
            className="fixed inset-0 bg-black/80 cursor-pointer"
          />

          {/* Slide-Over Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="w-screen max-w-md bg-[#111115] border-l border-white/10 shadow-2xl flex flex-col justify-between"
            >
              {/* Header */}
              <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#0E0E12]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#E2C275]/10 border border-[#E2C275]/30 flex items-center justify-center text-[#E2C275]">
                    <Heart className="w-4 h-4 fill-[#E2C275]" />
                  </div>
                  <div>
                    <h2 className="text-base font-black uppercase tracking-wider text-white font-heading">
                      Saved Watchlist
                    </h2>
                    <p className="text-[11px] text-zinc-400">
                      {watchlistCount} {watchlistCount === 1 ? "supplement" : "supplements"} saved
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  data-no-glint
                  onClick={closeWatchlist}
                  aria-label="Close watchlist"
                  className="p-2 rounded-xl text-zinc-400 hover:text-white bg-[#181820] border border-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable List */}
              <div
                data-lenis-prevent
                className="flex-1 overflow-y-auto p-5 divide-y divide-white/8 space-y-4 overscroll-contain"
              >
                {watchlist.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#1C1C22] border border-white/10 flex items-center justify-center mb-4">
                      <Heart className="w-8 h-8 text-[#E2C275]/50" />
                    </div>
                    <h3 className="text-lg font-bold uppercase tracking-wider font-heading text-white">
                      Your Watchlist is Empty
                    </h3>
                    <p className="text-xs text-zinc-400 max-w-xs mt-1.5 leading-relaxed">
                      Tap the heart icon on any supplement card to bookmark formulas for your next stack.
                    </p>
                    <Link
                      href="/shop"
                      onClick={closeWatchlist}
                      className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider btn-aurafit-gold"
                    >
                      <span>Browse Supplements</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ) : (
                  watchlist.map((product) => (
                    <div
                      key={product.id}
                      className="pt-4 first:pt-0 flex items-center gap-3.5"
                    >
                      <Link
                        href={`/shop/${product.slug}`}
                        onClick={closeWatchlist}
                        className="relative w-16 h-16 rounded-xl bg-[#0D0D10] border border-white/8 p-1.5 shrink-0 overflow-hidden"
                      >
                        <StudioImage
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="64px"
                          objectFit="contain"
                          fallbackLabel={product.name}
                        />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] uppercase font-bold text-[#E2C275] block leading-none">
                          {product.brand}
                        </span>
                        <Link
                          href={`/shop/${product.slug}`}
                          onClick={closeWatchlist}
                          className="text-xs sm:text-sm font-bold text-white hover:text-[#E2C275] transition-colors line-clamp-1 mt-0.5 block"
                        >
                          {product.name}
                        </Link>
                        <div className="text-xs font-extrabold text-white mt-1">
                          Rs. {product.price.toLocaleString("en-LK")}
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => {
                              addToCart(product, 1);
                              closeWatchlist();
                            }}
                            className="px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider btn-aurafit-gold inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <ShoppingCart className="w-3 h-3" />
                            <span>Move to Cart</span>
                          </button>

                          <button
                            type="button"
                            data-no-glint
                            onClick={() => removeFromWatchlist(product.id)}
                            aria-label={`Remove ${product.name} from watchlist`}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 bg-[#181820] border border-white/10 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {watchlist.length > 0 && (
                <div className="p-5 bg-[#0E0E12] border-t border-white/10 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    data-no-glint
                    onClick={clearWatchlist}
                    className="text-xs font-semibold text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    Clear Watchlist
                  </button>
                  <Link
                    href="/shop"
                    onClick={closeWatchlist}
                    className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider btn-aurafit-dark inline-flex items-center gap-1.5"
                  >
                    <span>Explore More</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

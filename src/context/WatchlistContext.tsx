"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Product } from "@/data/mockProducts";
import { useToast } from "./ToastContext";

interface WatchlistContextType {
  watchlist: Product[];
  watchlistCount: number;
  isHydrated: boolean;
  isInWatchlist: (id: string) => boolean;
  toggleWatchlist: (product: Product) => void;
  removeFromWatchlist: (id: string) => void;
  clearWatchlist: () => void;
  isWatchlistOpen: boolean;
  openWatchlist: () => void;
  closeWatchlist: () => void;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);
const WATCHLIST_STORAGE_KEY = "aurafit_watchlist";

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const { showToast } = useToast();
  const [watchlist, setWatchlist] = useState<Product[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);

  // Hydrate from localStorage strictly after client mount
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(WATCHLIST_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setWatchlist(parsed);
          }
        }
      } catch {
        // ignore storage errors
      }
      setIsHydrated(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Persist changes only after hydration completes
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(watchlist));
    } catch (e) {
      console.error("Failed to save watchlist to localStorage", e);
    }
  }, [watchlist, isHydrated]);

  const openWatchlist = useCallback(() => setIsWatchlistOpen(true), []);
  const closeWatchlist = useCallback(() => setIsWatchlistOpen(false), []);

  const isInWatchlist = useCallback(
    (id: string) => isHydrated && watchlist.some((item) => item.id === id),
    [watchlist, isHydrated]
  );

  const toggleWatchlist = useCallback(
    (product: Product) => {
      const exists = watchlist.some((item) => item.id === product.id);
      if (exists) {
        setWatchlist((prev) => prev.filter((item) => item.id !== product.id));
        showToast({
          type: "gold",
          title: "Removed from Watchlist",
          subtitle: `${product.name} removed.`,
        });
      } else {
        setWatchlist((prev) => [product, ...prev]);
        showToast({
          type: "gold",
          title: "Saved to Watchlist",
          subtitle: `${product.name} added to your saved stack.`,
          actionLabel: "VIEW WATCHLIST →",
          onAction: () => setIsWatchlistOpen(true),
        });
      }
    },
    [watchlist, showToast]
  );

  const removeFromWatchlist = useCallback(
    (id: string) => {
      const target = watchlist.find((item) => item.id === id);
      setWatchlist((prev) => prev.filter((item) => item.id !== id));
      if (target) {
        showToast({
          type: "gold",
          title: "Removed from Watchlist",
          subtitle: `${target.name} removed.`,
        });
      }
    },
    [watchlist, showToast]
  );

  const clearWatchlist = useCallback(() => {
    setWatchlist([]);
    showToast({
      type: "gold",
      title: "Watchlist Cleared",
      subtitle: "All saved supplements have been removed.",
    });
  }, [showToast]);

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        watchlistCount: isHydrated ? watchlist.length : 0,
        isHydrated,
        isInWatchlist,
        toggleWatchlist,
        removeFromWatchlist,
        clearWatchlist,
        isWatchlistOpen,
        openWatchlist,
        closeWatchlist,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error("useWatchlist must be used within a WatchlistProvider");
  }
  return context;
}

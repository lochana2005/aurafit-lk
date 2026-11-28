"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/data/mockProducts";
import { useToast } from "./ToastContext";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedFlavor?: string;
}

interface CartContextType {
  items: CartItem[];
  isHydrated: boolean;
  addToCart: (product: Product, quantity?: number, selectedFlavor?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "aurafit_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { showToast } = useToast();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Hydrate from localStorage strictly after client mount
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setItems(parsed);
          }
        }
      } catch {
        // ignore storage errors
      }
      setIsHydrated(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Save cart changes to localStorage only after hydration
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [items, isHydrated]);

  const addToCart = (product: Product, quantity = 1, selectedFlavor?: string) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
          selectedFlavor: selectedFlavor || next[existingIndex].selectedFlavor,
        };
        return next;
      }
      return [
        ...prev,
        {
          product,
          quantity,
          selectedFlavor: selectedFlavor || product.flavors?.[0],
        },
      ];
    });
    setIsCartOpen(true);
    const detail = selectedFlavor || product.weightOrServings || product.flavors?.[0];
    showToast({
      type: "gold",
      title: "Added to Supplement Vault",
      subtitle: detail ? `${product.name} (${detail})` : product.name,
      actionLabel: "VIEW CART →",
      onAction: () => setIsCartOpen(true),
    });
  };

  const removeFromCart = (productId: string) => {
    const target = items.find((i) => i.product.id === productId);
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
    if (target) {
      showToast({
        type: "gold",
        title: "Item removed from cart",
        subtitle: `${target.product.name} removed.`,
      });
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    showToast({
      type: "gold",
      title: "Cart cleared",
      subtitle: "All items removed from your supplement vault.",
    });
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const totalItems = isHydrated
    ? items.reduce((acc, item) => acc + item.quantity, 0)
    : 0;
  const subtotal = isHydrated
    ? items.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
    : 0;

  return (
    <CartContext.Provider
      value={{
        items,
        isHydrated,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

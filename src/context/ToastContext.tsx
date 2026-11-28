"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export type ToastType = "gold" | "cyan" | "success" | "error";

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
}

export interface ShowToastOptions {
  type?: ToastType;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastItem[];
  showToast: (options: ShowToastOptions) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((options: ShowToastOptions) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const newToast: ToastItem = {
      id,
      type: options.type || "gold",
      title: options.title,
      subtitle: options.subtitle,
      actionLabel: options.actionLabel,
      onAction: options.onAction,
      duration: options.duration ?? 3500,
    };
    setToasts((prev) => [...prev.slice(-3), newToast]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

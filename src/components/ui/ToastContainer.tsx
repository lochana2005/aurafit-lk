"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import { useToast, ToastItem, ToastType } from "@/context/ToastContext";

const VARIANT_STYLES: Record<
  ToastType,
  {
    border: string;
    pill: string;
    iconBg: string;
    iconColor: string;
    progress: string;
    Icon: React.ComponentType<{ className?: string }>;
  }
> = {
  gold: {
    border: "border-[#E2C275]/35",
    pill: "bg-gradient-to-b from-[#F5DC93] via-[#E2C275] to-[#B68D40]",
    iconBg: "bg-[#E2C275]/12 border-[#E2C275]/30",
    iconColor: "text-[#E2C275]",
    progress: "bg-gradient-to-r from-[#E2C275] via-[#F5DC93] to-[#C9A227]",
    Icon: ShoppingBag,
  },
  cyan: {
    border: "border-[#38BDF8]/35",
    pill: "bg-gradient-to-b from-[#7DD3FC] via-[#38BDF8] to-[#0284C7]",
    iconBg: "bg-[#38BDF8]/12 border-[#38BDF8]/30",
    iconColor: "text-[#38BDF8]",
    progress: "bg-gradient-to-r from-[#38BDF8] via-[#7DD3FC] to-[#0284C7]",
    Icon: Sparkles,
  },
  success: {
    border: "border-emerald-400/35",
    pill: "bg-gradient-to-b from-emerald-300 via-emerald-400 to-emerald-600",
    iconBg: "bg-emerald-500/12 border-emerald-400/30",
    iconColor: "text-emerald-400",
    progress: "bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500",
    Icon: CheckCircle2,
  },
  error: {
    border: "border-red-400/35",
    pill: "bg-gradient-to-b from-red-400 via-red-500 to-red-600",
    iconBg: "bg-red-500/12 border-red-400/30",
    iconColor: "text-red-400",
    progress: "bg-gradient-to-r from-red-400 via-red-500 to-red-600",
    Icon: AlertCircle,
  },
};

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}) {
  const [isPaused, setIsPaused] = useState(false);
  const duration = toast.duration ?? 3500;
  const remainingRef = useRef<number>(duration);
  const lastStartRef = useRef<number>(0);

  useEffect(() => {
    if (isPaused) return;
    lastStartRef.current = Date.now();
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, remainingRef.current);

    return () => {
      clearTimeout(timer);
      const elapsed = Date.now() - lastStartRef.current;
      remainingRef.current = Math.max(0, remainingRef.current - elapsed);
    };
  }, [isPaused, toast.id, onDismiss]);

  const style = VARIANT_STYLES[toast.type];
  const Icon = style.Icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 24, scale: 0.95 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="status"
      aria-live="polite"
      className={`pointer-events-auto bg-[#121217] border ${style.border} rounded-2xl p-4 shadow-[0_16px_40px_rgba(0,0,0,0.85)] relative overflow-hidden`}
    >
      <div className="flex items-start gap-3">
        {/* Left Glowing Accent Pill */}
        <span className={`w-1 self-stretch rounded-full shrink-0 ${style.pill}`} />

        {/* Icon Badge */}
        <div
          className={`w-9 h-9 rounded-xl border ${style.iconBg} flex items-center justify-center shrink-0 mt-0.5`}
        >
          <Icon className={`w-4 h-4 ${style.iconColor}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-5">
          <div className="text-sm font-bold text-white leading-snug font-sans">
            {toast.title}
          </div>
          {toast.subtitle && (
            <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed font-sans line-clamp-2">
              {toast.subtitle}
            </p>
          )}

          {toast.actionLabel && toast.onAction && (
            <button
              type="button"
              data-no-glint
              onClick={() => {
                toast.onAction?.();
                onDismiss(toast.id);
              }}
              className="mt-2 inline-flex items-center text-xs font-bold text-[#E2C275] hover:underline cursor-pointer font-sans"
            >
              {toast.actionLabel}
            </button>
          )}
        </div>

        {/* Close Button */}
        <button
          type="button"
          data-no-glint
          onClick={() => onDismiss(toast.id)}
          aria-label="Dismiss notification"
          className="p-1 rounded-lg text-zinc-400 hover:text-white transition-colors shrink-0 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Shimmering Bottom Progress Bar */}
      <div className="absolute bottom-0 inset-x-0 h-[2px] bg-white/[0.06] overflow-hidden">
        <div
          className={`h-full w-full origin-left ${style.progress}`}
          style={{
            animation: `aurafit-toast-shrink ${duration}ms linear forwards`,
            animationPlayState: isPaused ? "paused" : "running",
          }}
        />
      </div>
    </motion.div>
  );
}

export default function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  return (
    <div className="fixed top-20 right-4 sm:top-auto sm:bottom-5 sm:right-5 z-[120] flex flex-col gap-3 w-[calc(100vw-2rem)] sm:w-[calc(100vw-2.5rem)] max-w-[380px] pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </AnimatePresence>
    </div>
  );
}

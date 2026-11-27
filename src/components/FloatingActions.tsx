"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, MessageCircle, X, Headphones } from "lucide-react";

interface SocialAction {
  name: string;
  href: string;
  x: number;
  y: number;
  hoverClass: string;
  icon: React.ReactNode;
  isInternal?: boolean;
}

const SOCIAL_ACTIONS: SocialAction[] = [
  {
    name: "WhatsApp",
    href: "https://wa.me/94771234567",
    x: 0,
    y: -96,
    hoverClass:
      "hover:text-emerald-400 hover:border-emerald-500/50 hover:shadow-[0_0_16px_rgba(52,211,153,0.45)]",
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://instagram.com/aurafit.lk",
    x: -37,
    y: -89,
    hoverClass:
      "hover:text-pink-400 hover:border-pink-500/50 hover:shadow-[0_0_16px_rgba(244,114,182,0.45)]",
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://facebook.com/aurafit.lk",
    x: -68,
    y: -68,
    hoverClass:
      "hover:text-sky-400 hover:border-sky-500/50 hover:shadow-[0_0_16px_rgba(56,189,248,0.45)]",
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://tiktok.com/@aurafit.lk",
    x: -89,
    y: -37,
    hoverClass:
      "hover:text-cyan-300 hover:border-cyan-400/50 hover:shadow-[0_0_16px_rgba(103,232,249,0.45)]",
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
  {
    name: "Contact Support",
    href: "/contact",
    x: -96,
    y: 0,
    hoverClass:
      "hover:text-[#E2C275] hover:border-[#E2C275]/50 hover:shadow-[0_0_16px_rgba(226,194,117,0.45)]",
    icon: <Headphones className="w-5 h-5 text-[#E2C275]" />,
    isInternal: true,
  },
];

export default function FloatingActions() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Monitor scroll position with passive listener & state update ONLY on threshold change
  useEffect(() => {
    let prevShow = false;
    const handleScroll = () => {
      const currentShow = window.scrollY > 300;
      if (currentShow !== prevShow) {
        prevShow = currentShow;
        setShowScrollTop(currentShow);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close radial menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      const lenis = (
        window as unknown as {
          __lenis?: {
            scrollTo: (
              target: number | string | HTMLElement,
              options?: { duration?: number }
            ) => void;
          };
        }
      ).__lenis;

      if (lenis) {
        lenis.scrollTo(0, { duration: 1.1 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <aside aria-label="Quick Actions" className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 select-none">
      {/* 1. SCROLL-TO-TOP BUTTON (Fades and scales in past 300px scroll) */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.5, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 12 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={scrollToTop}
            aria-label="Scroll to top of page"
            className="w-11 h-11 rounded-full bg-[#141418]/95 text-[#E2C275] hover:bg-[#E2C275] hover:text-[#09090B] btn-aurafit-dark-circle shadow-xl flex items-center justify-center group mb-1 cursor-pointer"
          >
            <ArrowUp className="w-5 h-5 stroke-[2.3] transition-transform duration-200 group-hover:-translate-y-0.5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* 2. RADIAL EXPANDING SOCIAL CONTACT MENU */}
      <div ref={menuRef} className="relative flex items-center justify-center">
        {/* Radial Social Action Buttons (Arcing from 90° straight up to 180° straight left) */}
        <AnimatePresence>
          {isOpen && (
            <>
              {SOCIAL_ACTIONS.map((action, idx) => (
                <motion.div
                  key={action.name}
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={{ opacity: 1, scale: 1, x: action.x, y: action.y }}
                  exit={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 22,
                    delay: idx * 0.035,
                  }}
                  className="absolute top-[6px] left-[6px] z-10"
                >
                  {action.isInternal ? (
                    <Link
                      href={action.href}
                      onClick={() => setIsOpen(false)}
                      aria-label={`Contact AuraFit on ${action.name}`}
                      className={`w-11 h-11 rounded-full bg-[#141418]/95 border border-white/15 ${action.hoverClass} text-white shadow-2xl flex items-center justify-center transition-all duration-200 active:scale-95 group relative`}
                    >
                      {action.icon}

                      {/* Dark Luxury Pill Tooltip */}
                      <span className="absolute right-full mr-2.5 px-2.5 py-1 rounded-md bg-[#09090B]/95 border border-white/10 text-[10px] font-bold tracking-wider text-zinc-200 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap shadow-2xl">
                        {action.name}
                      </span>
                    </Link>
                  ) : (
                    <a
                      href={action.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Contact AuraFit on ${action.name}`}
                      className={`w-11 h-11 rounded-full bg-[#141418]/95 border border-white/15 ${action.hoverClass} text-white shadow-2xl flex items-center justify-center transition-all duration-200 active:scale-95 group relative`}
                    >
                      {action.icon}

                      {/* Dark Luxury Pill Tooltip */}
                      <span className="absolute right-full mr-2.5 px-2.5 py-1 rounded-md bg-[#09090B]/95 border border-white/10 text-[10px] font-bold tracking-wider text-zinc-200 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap shadow-2xl">
                        {action.name}
                      </span>
                    </a>
                  )}
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Pulsing Highlight Ring behind Main FAB when closed */}
        {!isOpen && (
          <span className="absolute -inset-1 rounded-full bg-[#E2C275]/40 animate-ping pointer-events-none -z-10" />
        )}

        {/* Main Trigger FAB */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close social contact menu" : "Open social contact menu"}
          className="w-14 h-14 rounded-full btn-aurafit-gold-circle flex items-center justify-center relative z-20 cursor-pointer"
        >
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="flex items-center justify-center"
          >
            {isOpen ? (
              <X className="w-6 h-6 stroke-[2.6]" />
            ) : (
              <MessageCircle className="w-6 h-6 stroke-[2.3]" />
            )}
          </motion.div>
        </button>
      </div>
    </aside>
  );
}


"use client";

import React, { useState, useEffect, useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Phone,
  Truck,
  ShieldCheck,
  ChevronRight,
  PackageCheck,
  Sparkles,
  Headphones,
  Info,
} from "lucide-react";

const NAV_LINKS = [
  { name: "HOME", href: "/" },
  { name: "SHOP", href: "/shop" },
  { name: "AI COACH", href: "/ai-coach", isPill: true },
  { name: "VERIFY PRODUCT", href: "/verify" },
  { name: "TRACK ORDER", href: "/track-order" },
  { name: "ABOUT US", href: "/about" },
  { name: "CONTACT", href: "/contact" },
];

const emptySubscribe = () => () => {};

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const { totalItems, openCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  // Prevent background scroll when mobile navigation drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleOpenMobileSearch = () => {
    setMobileMenuOpen(true);
    setTimeout(() => {
      mobileSearchInputRef.current?.focus({ preventScroll: true });
    }, 100);
  };

  const isAuthActive = mounted && isAuthenticated && !!user;
  const cartCount = mounted ? totalItems : 0;

  return (
    <>
      {/* =========================================================================
          STICKY HEADER (No transform-gpu / containing-block traps)
          ========================================================================= */}
      <header className="w-full bg-gradient-to-r from-[#C5A059] via-[#E2C275] to-[#B68D40] select-none sticky top-0 z-40 shadow-md">
        {/* 1. TOP METALLIC CHAMPAGNE-GOLD ANNOUNCEMENT STRIP (Responsive & Compact) */}
        <div className="w-full text-[#09090B] px-3 sm:px-6 lg:px-8 py-1.5 sm:py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] sm:text-[13px] font-semibold tracking-wider">
            {/* Left: Hotline & WhatsApp */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Phone className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden xs:inline">HOTLINE:</span>
              <a
                href="tel:+94771234567"
                className="font-bold hover:underline tracking-normal font-sans text-xs sm:text-[13px]"
              >
                +94 77 123 4567
              </a>
            </div>

            {/* Center: Delivery & Authenticity announcements */}
            <div className="flex items-center gap-2 sm:gap-6 uppercase tracking-wider text-[10px] sm:text-[12px]">
              <span className="flex items-center gap-1 font-bold">
                <Truck className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="hidden sm:inline">Islandwide Express Delivery (24-48h)</span>
                <span className="sm:hidden">Islandwide Delivery</span>
              </span>
              <span className="w-1 h-1 rounded-full bg-[#09090B]/40 hidden md:inline" />
              <span className="hidden md:flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                100% Authentic QR Verified
              </span>
            </div>

            {/* Right: Currency / Country Selector Badge */}
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#09090B]/12 border border-[#09090B]/20 text-[10px] sm:text-xs font-extrabold uppercase">
                <span>🇱🇰 LKR (Rs.)</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. CURVED MAIN NAVBAR (Deep Matte Black #09090B with rounded top corners) */}
        <div className="w-full bg-[#09090B] rounded-t-[20px] sm:rounded-t-[28px] border-t border-white/10 shadow-[0_12px_36px_rgba(0,0,0,0.95)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-4">
              {/* Left: Typographic Logo */}
              <Link
                href="/"
                className="flex items-baseline tracking-widest font-heading transition-opacity hover:opacity-90 shrink-0"
              >
                <span className="text-xl sm:text-2xl font-black text-white">
                  AURAFIT
                </span>
                <span className="text-xl sm:text-2xl font-black text-[#E2C275] ml-0.5">
                  .LK
                </span>
              </Link>

              {/* Center: Desktop Navigation Links */}
              <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-[11px] xl:text-xs font-semibold tracking-wider whitespace-nowrap">
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`relative text-[11px] xl:text-xs font-bold tracking-wider uppercase transition-colors py-1 ${
                        isActive
                          ? "text-[#E2C275]"
                          : "text-[#A1A1AA] hover:text-white"
                      } ${
                        link.isPill
                          ? "px-3 py-1 rounded-full bg-sky-400/10 border border-sky-400/30 text-sky-300 hover:bg-sky-400/20 hover:border-sky-400/50 shadow-[0_0_15px_rgba(56,189,248,0.12)] transition-all"
                          : ""
                      }`}
                    >
                      <span>{link.name}</span>
                      {isActive && !link.isPill && (
                        <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#E2C275]" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Right: Search, Account & Cart + Hamburger Menu */}
              <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3">
                {/* Desktop Pill Search Input (lg+) */}
                <form
                  onSubmit={handleSearchSubmit}
                  className="hidden lg:flex relative items-center w-44 xl:w-60"
                >
                  <Search className="absolute left-3.5 w-4 h-4 text-zinc-400 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search supplements..."
                    className="w-full bg-[#141418] border border-white/10 hover:border-white/20 focus:border-[#E2C275]/60 rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors"
                  />
                </form>

                {/* Mobile Search Button (< lg) */}
                <button
                  type="button"
                  onClick={handleOpenMobileSearch}
                  aria-label="Open search"
                  className="lg:hidden p-2 rounded-full text-zinc-300 hover:text-white bg-[#141418] border border-white/10 active:scale-95 transition-all cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                </button>

                {/* Account Button (Both Desktop & Mobile) */}
                <Link
                  href={isAuthActive ? "/profile" : "/login"}
                  aria-label={isAuthActive ? "User Profile" : "User Login"}
                  className={`p-1.5 sm:p-2 rounded-full transition-all active:scale-95 flex items-center justify-center ${
                    isAuthActive
                      ? "bg-[#141418] border border-[#E2C275]/50 hover:border-[#E2C275] ring-1 ring-[#E2C275]/30 text-white"
                      : "text-zinc-300 hover:text-white bg-[#141418] border border-white/10 hover:border-white/20"
                  }`}
                >
                  {isAuthActive && user ? (
                    <span className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full bg-gradient-to-br from-[#E5C76B] to-[#B08922] text-[#09090B] font-black text-[10px] sm:text-xs flex items-center justify-center font-heading">
                      {user.avatarInitials}
                    </span>
                  ) : (
                    <User className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  )}
                </Link>

                {/* Brushed Champagne Gold Cart Button with Badge (Both Desktop & Mobile) */}
                <button
                  type="button"
                  onClick={openCart}
                  aria-label="Shopping Cart"
                  className="relative p-2 sm:p-2.5 rounded-full text-[#09090B] bg-gradient-to-r from-[#E5C76B] via-[#C9A227] to-[#B08922] hover:brightness-105 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] transition-all active:scale-95 flex items-center justify-center cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#09090B] stroke-[2.3]" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-black text-white bg-[#09090B] rounded-full border border-[#E2C275]">
                      {cartCount}
                    </span>
                  )}
                </button>

                {/* Mobile Hamburger Drawer Button (< lg) */}
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  aria-label="Open mobile navigation menu"
                  className="lg:hidden p-2 rounded-xl text-zinc-300 hover:text-white bg-[#141418] border border-white/10 active:scale-95 transition-all cursor-pointer"
                >
                  <Menu className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================================
          FULL-HEIGHT LUXURY MOBILE NAVIGATION DRAWER
          (Rendered outside <header> so it is NEVER clipped by containing-block bugs)
          ========================================================================= */}
      {mobileMenuOpen && (
        <div
          data-lenis-prevent
          className="fixed inset-0 h-dvh z-[100] bg-[#0B0B0E] text-white flex flex-col justify-between p-5 sm:p-6 overflow-y-auto overscroll-contain animate-in fade-in duration-200"
        >
          {/* Top Section */}
          <div className="space-y-6">
            {/* 1. Header with Logo & Close Button */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-baseline font-heading tracking-wider"
              >
                <span className="text-2xl font-black text-white">AURAFIT</span>
                <span className="text-2xl font-black text-[#E2C275] ml-0.5">.LK</span>
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
                className="p-2 rounded-xl text-zinc-400 hover:text-white bg-[#181820] border border-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2. Full-Width Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              <input
                ref={mobileSearchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search supplements, whey, creatine..."
                className="w-full bg-[#141418] border border-white/12 focus:border-[#E2C275]/70 rounded-full pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors"
              />
            </form>

            {/* 3. Main Navigation Links (Large & Clean) */}
            <div className="space-y-2">
              {/* Home */}
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3.5 rounded-xl font-heading text-base font-bold uppercase tracking-wider transition-all ${
                  pathname === "/"
                    ? "bg-[#181820] text-[#E2C275] border border-[#E2C275]/40"
                    : "text-zinc-200 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>HOME</span>
                <ChevronRight className="w-4 h-4 text-zinc-500" />
              </Link>

              {/* Shop Vault */}
              <Link
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3.5 rounded-xl font-heading text-base font-bold uppercase tracking-wider transition-all ${
                  pathname === "/shop"
                    ? "bg-[#181820] text-[#E2C275] border border-[#E2C275]/40"
                    : "text-zinc-200 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>SHOP VAULT</span>
                <ChevronRight className="w-4 h-4 text-zinc-500" />
              </Link>

              {/* AI Fitness Coach */}
              <Link
                href="/ai-coach"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3.5 rounded-xl font-heading text-base font-bold uppercase tracking-wider transition-all ${
                  pathname === "/ai-coach"
                    ? "bg-sky-950/60 text-sky-300 border border-sky-400/50"
                    : "bg-sky-950/30 text-sky-300 border border-sky-400/25 hover:bg-sky-950/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  <span>AI FITNESS COACH</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-400/20 text-sky-300 font-bold border border-sky-400/30">
                  STACK BUILDER
                </span>
              </Link>

              {/* Verify Product */}
              <Link
                href="/verify"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3.5 rounded-xl font-heading text-base font-bold uppercase tracking-wider transition-all ${
                  pathname === "/verify"
                    ? "bg-[#181820] text-[#E2C275] border border-[#E2C275]/40"
                    : "text-zinc-200 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-sky-400" />
                  <span>VERIFY PRODUCT</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-950/60 text-sky-300 font-bold border border-sky-400/20">
                  HOLOGRAM QR
                </span>
              </Link>

              {/* Track Order */}
              <Link
                href="/track-order"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3.5 rounded-xl font-heading text-base font-bold uppercase tracking-wider transition-all ${
                  pathname === "/track-order"
                    ? "bg-[#181820] text-[#E2C275] border border-[#E2C275]/40"
                    : "text-zinc-200 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#E2C275]" />
                  <span>TRACK ORDER</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1C170E] text-[#E2C275] font-bold border border-[#E2C275]/25">
                  LIVE LOGISTICS
                </span>
              </Link>

              {/* About Us */}
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3.5 rounded-xl font-heading text-base font-bold uppercase tracking-wider transition-all ${
                  pathname === "/about"
                    ? "bg-[#181820] text-[#E2C275] border border-[#E2C275]/40"
                    : "text-zinc-200 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#E2C275]" />
                  <span>ABOUT US</span>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-500" />
              </Link>

              {/* Contact Us */}
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3.5 rounded-xl font-heading text-base font-bold uppercase tracking-wider transition-all ${
                  pathname === "/contact"
                    ? "bg-[#181820] text-[#E2C275] border border-[#E2C275]/40"
                    : "text-zinc-200 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-sky-400" />
                  <span>CONTACT &amp; SUPPORT</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-950/60 text-sky-300 font-bold border border-sky-400/20">
                  24/7 CONCIERGE
                </span>
              </Link>
            </div>

            {/* 4. Trust Assurance Mini-Banner */}
            <div className="p-3.5 rounded-xl bg-[#141418] border border-white/6 space-y-2 text-xs text-zinc-400">
              <div className="flex items-center gap-2 text-white font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#E2C275]" />
                <span>100% Genuine Direct Manufacturer Imports</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400 text-[11px]">
                <PackageCheck className="w-3.5 h-3.5 text-sky-400" />
                <span>Tamper-evident holographic security seal on every tub</span>
              </div>
            </div>
          </div>

          {/* Bottom Footer Section (Duplicate Profile & Cart removed per UX requirements) */}
          <div className="pt-5 border-t border-white/10 space-y-2">
            <div className="text-center space-y-1 text-xs text-zinc-400 font-sans">
              <div className="flex items-center justify-center gap-1.5 text-zinc-300 font-semibold text-xs tracking-wider uppercase font-heading">
                <span>AURAFIT.LK</span>
                <span className="text-[#E2C275]">•</span>
                <span>AUTHENTICITY VAULT</span>
              </div>
              <div className="text-[11px] text-zinc-500 font-mono">
                Colombo 03 Flagship Store · Islandwide 24-48h Delivery
              </div>
              <div className="text-[11px] text-zinc-500 font-mono">
                Hotline / WhatsApp:{" "}
                <a href="tel:+94771234567" className="text-[#E2C275] hover:underline font-bold">
                  +94 77 123 4567
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

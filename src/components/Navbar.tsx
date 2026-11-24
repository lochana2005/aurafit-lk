"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
} from "lucide-react";

const NAV_LINKS = [
  { name: "SHOP", href: "/shop" },
  { name: "AI COACH", href: "/ai-coach", isPill: true },
  { name: "VERIFY PRODUCT", href: "/verify" },
  { name: "TRACK ORDER", href: "/shop" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount] = useState(2);
  const pathname = usePathname();
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="w-full bg-gradient-to-r from-[#C5A059] via-[#E2C275] to-[#B68D40] select-none sticky top-0 z-50 shadow-md transform-gpu">
      {/* 1. TOP SLEEK METALLIC CHAMPAGNE-GOLD ANNOUNCEMENT STRIP */}
      <div className="w-full text-[#09090B] px-4 sm:px-6 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs sm:text-[13px] font-semibold tracking-wider">
          {/* Left: Hotline & WhatsApp */}
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            <span className="hidden xs:inline">HOTLINE:</span>
            <a
              href="tel:+94771234567"
              className="font-bold hover:underline tracking-normal font-sans"
            >
              +94 77 123 4567
            </a>
          </div>

          {/* Center: Delivery & Authenticity announcements */}
          <div className="hidden md:flex items-center gap-6 text-xs sm:text-[13px] uppercase tracking-wider">
            <span className="flex items-center gap-1.5 font-bold">
              <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              Islandwide Express Delivery (24-48h)
            </span>
            <span className="w-1 h-1 rounded-full bg-[#09090B]/50" />
            <span className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              100% Authentic QR Verified
            </span>
          </div>

          {/* Right: Currency Selector Badge */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline opacity-75 font-normal">COUNTRY:</span>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#09090B]/12 border border-[#09090B]/20 text-xs font-extrabold uppercase">
              <span>🇱🇰 LKR (Rs.)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CURVED MAIN NAVBAR (Deep Matte Black #09090B with rounded top corners overlapping gold strip) */}
      <div className="w-full bg-[#09090B] rounded-t-[24px] sm:rounded-t-[28px] border-t border-white/10 shadow-[0_12px_36px_rgba(0,0,0,0.95)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
            {/* Left: Typographic Placeholder Logo */}
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

            {/* Center: Clean Uppercase Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative text-xs font-bold tracking-wider uppercase transition-colors py-1 ${
                      isActive
                        ? "text-[#E2C275]"
                        : "text-[#A1A1AA] hover:text-white"
                    } ${
                      link.isPill
                        ? "px-3.5 py-1 rounded-full bg-sky-400/10 border border-sky-400/30 text-sky-300 hover:bg-sky-400/20 hover:border-sky-400/50 shadow-[0_0_15px_rgba(56,189,248,0.12)] transition-all"
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

            {/* Right: Search, Account & Cart */}
            <div className="flex items-center gap-2 sm:gap-3.5">
              {/* Sleek Pill-Shaped Search Input */}
              <form
                onSubmit={handleSearchSubmit}
                className="hidden sm:flex relative items-center w-52 md:w-64 lg:w-72"
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

              {/* Account Button */}
              <Link
                href="/login"
                aria-label="User Account"
                className="p-2 sm:p-2.5 rounded-full text-zinc-300 hover:text-white bg-[#141418] border border-white/10 hover:border-white/20 transition-all active:scale-95 flex items-center justify-center"
              >
                <User className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </Link>

              {/* Brushed Metallic Champagne Gold Cart Button with Badge */}
              <Link
                href="/shop"
                aria-label="Shopping Cart"
                className="relative p-2 sm:p-2.5 rounded-full text-[#09090B] bg-gradient-to-r from-[#E5C76B] via-[#C9A227] to-[#B08922] hover:brightness-105 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] transition-all active:scale-95 flex items-center justify-center"
              >
                <ShoppingCart className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#09090B] stroke-[2.3]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-black text-white bg-[#09090B] rounded-full border border-[#E2C275]">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Drawer Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Toggle mobile menu"
                className="lg:hidden p-2 rounded-lg text-zinc-300 hover:text-white bg-[#141418] border border-white/10"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE SLIDE-OUT DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/90"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-out Menu */}
          <div className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-[#0E0E12] border-l border-white/10 p-6 flex flex-col justify-between overflow-y-auto shadow-2xl">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-5 border-b border-white/10">
                <div className="flex items-baseline font-heading">
                  <span className="text-xl font-black text-white">AURAFIT</span>
                  <span className="text-xl font-black text-[#E2C275]">.LK</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="relative mt-5 mb-6">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search supplements..."
                  className="w-full bg-[#141418] border border-white/10 rounded-full pl-9 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#E2C275]"
                />
              </form>

              {/* Nav Links */}
              <div className="space-y-1.5">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold tracking-wider transition-colors ${
                      link.isPill
                        ? "text-sky-300 bg-sky-400/10 border border-sky-400/25"
                        : "text-zinc-300 hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    <span>{link.name}</span>
                    <ChevronRight className="w-4 h-4 text-zinc-500" />
                  </Link>
                ))}
              </div>

              {/* Sri Lanka Service Strip in Drawer */}
              <div className="mt-8 p-4 rounded-xl bg-[#141418] border border-white/5 space-y-2.5 text-xs text-zinc-400">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <ShieldCheck className="w-4 h-4 text-[#E2C275]" />
                  <span>100% Guaranteed Authentic</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-400 text-[11px]">
                  <Truck className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Islandwide Delivery (Domex / PromptX)</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-400 text-[11px]">
                  <PackageCheck className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Batch QR Verification Hologram</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-white/10 space-y-3">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider text-center text-[#09090B] bg-gradient-to-r from-[#E5C76B] via-[#C9A227] to-[#B08922] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] flex items-center justify-center gap-2 transition-colors active:scale-95"
              >
                <User className="w-4 h-4 stroke-[2.5]" />
                <span>My Account / Sign In</span>
              </Link>
              <div className="text-center text-[10px] text-zinc-500">
                Colombo 03 Flagship Store &bull; +94 77 123 4567
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

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
  Sparkles,
  Headphones,
  Home,
  ShoppingBag,
  Award,
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

const DRAWER_LINKS = [
  { name: "HOME", href: "/", icon: Home },
  { name: "SHOP SUPPLEMENTS", href: "/shop", icon: ShoppingBag },
  { name: "AI STACK COACH", href: "/ai-coach", icon: Sparkles, isAI: true },
  { name: "VERIFY PRODUCT (QR)", href: "/verify", icon: ShieldCheck },
  { name: "TRACK ORDER", href: "/track-order", icon: Truck },
  { name: "ABOUT US", href: "/about", icon: Award },
  { name: "CONTACT SUPPORT", href: "/contact", icon: Headphones },
];

const emptySubscribe = () => () => {};

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
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
  const mobileSlideSearchRef = useRef<HTMLInputElement>(null);

  // Automatically close drawer and mobile search when pathname changes
  const [prevPath, setPrevPath] = useState(pathname);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  }

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

  // Auto-focus mobile slide-down search input when opened
  useEffect(() => {
    if (mobileSearchOpen) {
      const timer = setTimeout(() => {
        mobileSlideSearchRef.current?.focus({ preventScroll: true });
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [mobileSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
      setMobileSearchOpen(false);
    }
  };

  const isAuthActive = mounted && isAuthenticated && !!user;
  const cartCount = mounted ? totalItems : 0;

  return (
    <>
      {/* =========================================================================
          STICKY HEADER
          ========================================================================= */}
      <header className="w-full bg-gradient-to-r from-[#C5A059] via-[#E2C275] to-[#B68D40] select-none sticky top-0 z-40 shadow-md overflow-x-hidden">
        {/* 1. RESPONSIVE TOP CHAMPAGNE-GOLD ANNOUNCEMENT STRIP */}
        <div className="w-full text-[#09090B]">
          {/* Desktop Full 4-Item Bar (lg+) */}
          <div className="hidden lg:flex max-w-7xl mx-auto px-6 lg:px-8 py-2 items-center justify-between text-[13px] font-semibold tracking-wider">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>HOTLINE:</span>
              <a
                href="tel:+94771234567"
                className="font-bold hover:underline tracking-normal font-sans text-[13px]"
              >
                +94 77 123 4567
              </a>
            </div>

            <div className="flex items-center gap-6 uppercase tracking-wider text-[12px]">
              <span className="flex items-center gap-1.5 font-bold">
                <Truck className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>ISLANDWIDE EXPRESS DELIVERY (24–48H)</span>
              </span>
              <span className="w-1 h-1 rounded-full bg-[#09090B]/40" />
              <span className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>100% AUTHENTIC QR VERIFIED</span>
              </span>
            </div>

            <div className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#09090B]/12 border border-[#09090B]/20 text-xs font-extrabold uppercase">
              <span>🇱🇰 LKR (RS.)</span>
            </div>
          </div>

          {/* Mobile & Tablet Single-Line Compact Strip (< lg) */}
          <div className="flex lg:hidden h-8 px-3 items-center justify-between text-[11px] font-bold tracking-wider">
            <span className="flex items-center gap-1.5 uppercase truncate">
              <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
              <span className="truncate">100% AUTHENTIC QR VERIFIED</span>
            </span>
            <span className="px-2 py-0.5 rounded bg-[#09090B]/12 border border-[#09090B]/20 text-[10px] font-extrabold uppercase shrink-0">
              🇱🇰 LKR (RS.)
            </span>
          </div>
        </div>

        {/* 2. CURVED MAIN NAVBAR */}
        <div className="w-full bg-[#09090B] rounded-t-[20px] sm:rounded-t-[28px] border-t border-white/10 shadow-[0_12px_36px_rgba(0,0,0,0.95)]">
          {/* Desktop Main Navbar (xl+) */}
          <div className="hidden xl:flex max-w-7xl mx-auto px-6 lg:px-8 items-center justify-between h-20 gap-4">
            {/* Left: Brand Logo */}
            <Link
              href="/"
              className="flex items-baseline tracking-widest font-heading transition-opacity hover:opacity-90 shrink-0"
            >
              <span className="text-2xl font-black text-white">AURAFIT</span>
              <span className="text-2xl font-black text-[#E2C275] ml-0.5">.LK</span>
            </Link>

            {/* Center: All 7 Desktop Links */}
            <nav className="flex items-center gap-5 2xl:gap-7 text-xs font-semibold tracking-wider whitespace-nowrap">
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

            {/* Right: Search, Profile & Cart */}
            <div className="flex items-center gap-3 shrink-0">
              <form
                onSubmit={handleSearchSubmit}
                className="relative flex items-center w-48 2xl:w-60"
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

              <Link
                href={isAuthActive ? "/profile" : "/login"}
                aria-label={isAuthActive ? "User Profile" : "User Login"}
                className={`p-2 rounded-full flex items-center justify-center btn-aurafit-dark-circle ${
                  isAuthActive
                    ? "bg-[#141418] border-[#E2C275]/50 ring-1 ring-[#E2C275]/30 text-white"
                    : "text-zinc-300 hover:text-white bg-[#141418]"
                }`}
              >
                {isAuthActive && user ? (
                  <span className="w-5.5 h-5.5 rounded-full bg-gradient-to-br from-[#E5C76B] to-[#B08922] text-[#09090B] font-black text-xs flex items-center justify-center font-heading">
                    {user.avatarInitials}
                  </span>
                ) : (
                  <User className="w-4.5 h-4.5" />
                )}
              </Link>

              <button
                type="button"
                onClick={openCart}
                aria-label="Shopping Cart"
                className="p-2.5 rounded-full btn-aurafit-gold-circle flex items-center justify-center cursor-pointer"
              >
                <ShoppingCart className="w-4.5 h-4.5 text-[#09090B] stroke-[2.3]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 z-10 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-black text-white bg-[#09090B] rounded-full border border-[#E2C275]">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile & Tablet Main Navbar (< xl) */}
          <div className="flex xl:hidden items-center justify-between h-16 px-4">
            {/* Left Group: Menu Toggle + Brand Logo */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileMenuOpen}
                className="w-10 h-10 rounded-xl bg-[#16161C] border border-white/12 flex items-center justify-center text-zinc-200 hover:border-[#E2C275] hover:text-[#E2C275] transition-colors cursor-pointer"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>

              <Link
                href="/"
                className="flex items-baseline tracking-tight font-heading text-lg sm:text-xl font-extrabold shrink-0"
              >
                <span className="text-white">AURAFIT</span>
                <span className="text-[#E2C275] ml-0.5">.LK</span>
              </Link>
            </div>

            {/* Right Group: Search Toggle, Profile Avatar, Gold Cart */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setMobileSearchOpen((prev) => !prev)}
                aria-label="Toggle search bar"
                aria-expanded={mobileSearchOpen}
                className="w-10 h-10 rounded-full btn-aurafit-dark-circle bg-[#141418] flex items-center justify-center text-zinc-200 cursor-pointer"
              >
                {mobileSearchOpen ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </button>

              <Link
                href={isAuthActive ? "/profile" : "/login"}
                aria-label={isAuthActive ? "User Profile" : "User Login"}
                className={`w-9 h-9 rounded-full btn-aurafit-dark-circle flex items-center justify-center ${
                  isAuthActive
                    ? "bg-[#141418] border-[#E2C275]/50 ring-1 ring-[#E2C275]/30 text-white"
                    : "text-zinc-200 bg-[#141418]"
                }`}
              >
                {isAuthActive && user ? (
                  <span className="w-5 h-5 rounded-full bg-gradient-to-br from-[#E5C76B] to-[#B08922] text-[#09090B] font-black text-[10px] flex items-center justify-center font-heading">
                    {user.avatarInitials}
                  </span>
                ) : (
                  <User className="w-4 h-4" />
                )}
              </Link>

              <button
                type="button"
                onClick={openCart}
                aria-label="Shopping Cart"
                className="w-10 h-10 rounded-full btn-aurafit-gold-circle flex items-center justify-center cursor-pointer"
              >
                <ShoppingCart className="w-4.5 h-4.5 text-[#09090B] stroke-[2.3]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 z-10 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-black text-white bg-[#09090B] rounded-full border border-[#E2C275]">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile/Tablet Slide-Down Search Bar (< xl) */}
          {mobileSearchOpen && (
            <div className="xl:hidden px-4 py-3 bg-[#0E0E12] border-t border-white/10">
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center w-full rounded-full bg-[#141418] border border-white/15 focus-within:border-[#E2C275] pl-4 pr-1.5 py-1 transition-colors"
              >
                <input
                  ref={mobileSlideSearchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search whey, creatine, pre-workouts..."
                  className="flex-1 min-w-0 bg-transparent text-sm text-white placeholder:text-zinc-400 focus:outline-none pr-2"
                />
                {searchQuery && (
                  <button
                    type="button"
                    data-no-glint
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                    className="p-1 text-zinc-400 hover:text-white shrink-0 mr-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="submit"
                  aria-label="Search supplements"
                  className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center bg-[#E2C275] text-[#09090B] cursor-pointer"
                >
                  <Search className="w-4 h-4 stroke-[2.5]" />
                </button>
              </form>
            </div>
          )}
        </div>
      </header>

      {/* =========================================================================
          FULL-FEATURED LUXURY MOBILE SLIDE-OVER DRAWER (< xl)
          ========================================================================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] xl:hidden flex">
          {/* Dark Backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/80 cursor-pointer"
            aria-hidden="true"
          />

          {/* Slide-Over Drawer Panel */}
          <aside
            data-lenis-prevent
            aria-label="Mobile Navigation"
            className="relative z-10 w-[86%] max-w-[360px] h-full bg-[#0B0B0F] border-r border-white/10 flex flex-col justify-between overflow-y-auto overscroll-contain shadow-2xl"
          >
            <div className="p-5 space-y-5">
              {/* 1. Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-baseline font-heading tracking-wider"
                  >
                    <span className="text-xl font-black text-white">AURAFIT</span>
                    <span className="text-xl font-black text-[#E2C275] ml-0.5">.LK</span>
                  </Link>
                  <span className="px-2 py-0.5 rounded-full bg-[#16161C] border border-[#E2C275]/30 text-[9px] font-bold uppercase tracking-wider text-[#E2C275]">
                    AUTHENTIC VAULT
                  </span>
                </div>

                <button
                  type="button"
                  data-no-glint
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close navigation menu"
                  className="p-2 rounded-xl text-zinc-400 hover:text-white bg-[#16161C] border border-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 2. Integrated Drawer Search Input */}
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center w-full rounded-full bg-[#141418] border border-white/15 focus-within:border-[#E2C275] pl-4 pr-1.5 py-1 transition-colors"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search whey, creatine, pre-workouts..."
                  className="flex-1 min-w-0 bg-transparent text-sm text-white placeholder:text-zinc-400 focus:outline-none pr-2"
                />
                {searchQuery && (
                  <button
                    type="button"
                    data-no-glint
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                    className="p-1 text-zinc-400 hover:text-white shrink-0 mr-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="submit"
                  aria-label="Search supplements"
                  className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center bg-[#E2C275] text-[#09090B] cursor-pointer"
                >
                  <Search className="w-4 h-4 stroke-[2.5]" />
                </button>
              </form>

              {/* 3. All 7 Navigation Links with Icons & Active Gold States */}
              <nav className="space-y-1.5" aria-label="Mobile links">
                {DRAWER_LINKS.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all font-sans ${
                        isActive
                          ? "border-l-2 border-l-[#E2C275] border border-[#E2C275]/35 bg-[#E2C275]/10 text-[#E2C275]"
                          : "text-zinc-200 hover:text-white hover:bg-white/[0.04] border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isActive
                              ? "text-[#E2C275]"
                              : item.isAI
                              ? "text-[#38BDF8]"
                              : "text-zinc-400"
                          }`}
                        />
                        <span>{item.name}</span>
                      </div>

                      {item.isAI ? (
                        <span className="px-2 py-0.5 rounded-full bg-sky-400/15 border border-sky-400/35 text-[10px] font-bold text-[#38BDF8]">
                          AI
                        </span>
                      ) : (
                        <ChevronRight
                          className={`w-4 h-4 ${
                            isActive ? "text-[#E2C275]" : "text-zinc-600"
                          }`}
                        />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* 4. Drawer Footer: Account & Direct Support Info from Top Bar */}
            <div className="p-5 border-t border-white/10 bg-[#0E0E13] space-y-4">
              {/* My Account / Orders Link Card */}
              <Link
                href={isAuthActive ? "/profile" : "/login"}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl bg-[#16161C] border border-white/10 hover:border-[#E2C275]/45 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#09090B] border border-[#E2C275]/30 flex items-center justify-center text-[#E2C275]">
                    {isAuthActive && user ? (
                      <span className="text-xs font-black font-heading">
                        {user.avatarInitials}
                      </span>
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {isAuthActive && user ? user.name : "My Account / Orders"}
                    </div>
                    <div className="text-xs text-zinc-400">
                      {isAuthActive ? "View profile & order history" : "Sign in or register"}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-500" />
              </Link>

              {/* Direct Hotline & Trust Badges */}
              <div className="space-y-2 text-xs text-zinc-300">
                <a
                  href="tel:+94771234567"
                  className="flex items-center gap-2 text-[#E2C275] font-semibold hover:underline"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>WhatsApp / Hotline: +94 77 123 4567</span>
                </a>
                <div className="flex items-center gap-2 text-zinc-400">
                  <Truck className="w-3.5 h-3.5 text-[#E2C275] shrink-0" />
                  <span>Islandwide 24–48H Express Delivery</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                  <span>100% QR Batch Verified Imports</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

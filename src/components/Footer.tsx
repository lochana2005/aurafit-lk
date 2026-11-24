"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="w-full bg-[#141418] -mt-10 md:-mt-12 pt-20 md:pt-24 pb-10 text-[#A1A1AA] text-xs relative z-0 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* =========================================================================
            ROW 1: TOP BRAND & CONTACT BAR
            ========================================================================= */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 sm:pb-10 border-b border-white/10">
          {/* Left: Typographic AURAFIT.LK logo */}
          <Link
            href="/"
            className="inline-flex items-baseline tracking-widest font-heading transition-opacity hover:opacity-90 shrink-0"
          >
            <span className="text-2xl sm:text-3xl font-black text-white">AURAFIT</span>
            <span className="text-2xl sm:text-3xl font-black text-[#E2C275] ml-0.5">.LK</span>
          </Link>

          {/* Center: Phone and Email with small champagne-gold Lucide icons */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs sm:text-sm text-zinc-300">
            <a
              href="tel:+94771234567"
              className="flex items-center gap-2 hover:text-[#E2C275] transition-colors"
            >
              <Phone className="w-4 h-4 text-[#E2C275] stroke-[2.2]" />
              <span className="font-semibold">+94 77 123 4567</span>
            </a>
            <a
              href="mailto:support@aurafit.lk"
              className="flex items-center gap-2 hover:text-[#E2C275] transition-colors"
            >
              <Mail className="w-4 h-4 text-[#E2C275] stroke-[2.2]" />
              <span className="font-semibold">support@aurafit.lk</span>
            </a>
          </div>

          {/* Right: Minimal Social Media Buttons */}
          <div className="flex items-center gap-3">
            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 rounded-full bg-[#1C1C22] border border-white/10 hover:border-[#E2C275]/50 text-zinc-400 hover:text-[#E2C275] flex items-center justify-center transition-all duration-200 hover:bg-[#23232B] active:scale-95"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full bg-[#1C1C22] border border-white/10 hover:border-[#E2C275]/50 text-zinc-400 hover:text-[#E2C275] flex items-center justify-center transition-all duration-200 hover:bg-[#23232B] active:scale-95"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            {/* TikTok */}
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="w-9 h-9 rounded-full bg-[#1C1C22] border border-white/10 hover:border-[#E2C275]/50 text-zinc-400 hover:text-[#E2C275] flex items-center justify-center transition-all duration-200 hover:bg-[#23232B] active:scale-95"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
              </svg>
            </a>
            {/* YouTube */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="w-9 h-9 rounded-full bg-[#1C1C22] border border-white/10 hover:border-[#E2C275]/50 text-zinc-400 hover:text-[#E2C275] flex items-center justify-center transition-all duration-200 hover:bg-[#23232B] active:scale-95"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>
        </div>

        {/* =========================================================================
            ROW 2: LINKS & NEWSLETTER (Split Grid)
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 py-10 lg:py-12">
          {/* Left: 3-Column Link Grid (7 columns) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Column 1: CUSTOMER SUPPORT */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-white font-heading">
                CUSTOMER SUPPORT
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <Link href="/contact" className="text-zinc-300 hover:text-[#E2C275] font-semibold transition-colors flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E2C275]" />
                    <span>Contact Us</span>
                  </Link>
                </li>
                <li>
                  <Link href="/track-order" className="text-zinc-300 hover:text-[#E2C275] transition-colors">
                    Track Your Order
                  </Link>
                </li>
                <li>
                  <Link href="/verify" className="text-zinc-300 hover:text-[#E2C275] transition-colors">
                    Verify Product Batch
                  </Link>
                </li>
                <li>
                  <Link href="/shop" className="text-zinc-300 hover:text-[#E2C275] transition-colors">
                    Shipping &amp; Delivery Policy
                  </Link>
                </li>
                <li>
                  <Link href="/shop" className="text-zinc-300 hover:text-[#E2C275] transition-colors">
                    Refund &amp; Returns Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: ABOUT US */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-white font-heading">
                ABOUT US
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <Link href="/shop" className="text-zinc-300 hover:text-[#E2C275] transition-colors">
                    About AuraFit.lk
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-zinc-300 hover:text-[#E2C275] transition-colors">
                    24/7 Athlete Concierge
                  </Link>
                </li>
                <li>
                  <Link href="/ai-coach" className="text-zinc-300 hover:text-[#E2C275] transition-colors">
                    AI Fitness Coach
                  </Link>
                </li>
                <li>
                  <Link href="/shop" className="text-zinc-300 hover:text-[#E2C275] transition-colors">
                    Terms &amp; Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/shop" className="text-zinc-300 hover:text-[#E2C275] transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: CATALOGS */}
            <div className="space-y-4 col-span-2 sm:col-span-1">
              <h4 className="text-xs font-black uppercase tracking-widest text-white font-heading">
                CATALOGS
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <Link href="/shop?cat=whey-protein" className="text-zinc-300 hover:text-[#E2C275] transition-colors">
                    Whey Protein
                  </Link>
                </li>
                <li>
                  <Link href="/shop?cat=mass-gainer" className="text-zinc-300 hover:text-[#E2C275] transition-colors">
                    Mass Gainer
                  </Link>
                </li>
                <li>
                  <Link href="/shop?cat=creatine" className="text-zinc-300 hover:text-[#E2C275] transition-colors">
                    Creatine
                  </Link>
                </li>
                <li>
                  <Link href="/shop?cat=fat-burners" className="text-zinc-300 hover:text-[#E2C275] transition-colors">
                    Fat Burner
                  </Link>
                </li>
                <li>
                  <Link href="/shop?cat=pre-workout" className="text-zinc-300 hover:text-[#E2C275] transition-colors">
                    Pre Workout
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Right: Newsletter Box (5 columns with vertical divider on desktop) */}
          <div className="lg:col-span-5 lg:pl-10 lg:border-l lg:border-white/10 flex flex-col justify-center">
            <div className="text-center space-y-1.5 mb-6">
              <h3 className="font-heading uppercase tracking-wide text-2xl sm:text-3xl font-bold text-[#E2C275] leading-none">
                STACK SMART, TRAIN HARD
              </h3>
              <span className="font-heading uppercase tracking-wider text-xl sm:text-2xl font-bold text-white block">
                SAVE BIG
              </span>
              <p className="text-xs sm:text-sm text-zinc-400 mt-2">
                Sign up to receive our exclusive offers &amp; restock alerts.
              </p>
            </div>

            {subscribed ? (
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm flex items-center justify-center gap-2 text-center max-w-md mx-auto w-full">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Thank you for subscribing to AuraFit VIP alerts!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3 max-w-md mx-auto w-full">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="w-full rounded-full bg-[#1C1C22] border border-white/10 px-5 py-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#E2C275] transition-colors text-center"
                />
                <button
                  type="submit"
                  className="w-full py-3 px-6 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider text-[#09090B] bg-gradient-to-r from-[#E5C76B] via-[#C9A227] to-[#B08922] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] hover:brightness-105 active:scale-95 transition-all text-center flex items-center justify-center gap-2"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* =========================================================================
            ROW 3: COPYRIGHT & PAYMENT METHODS
            ========================================================================= */}
        <div className="pt-8 mt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <div>
            Copyright &copy; 2026 AuraFit.lk. All rights reserved.
          </div>

          <div className="flex items-center gap-2.5 flex-wrap justify-center">
            <span className="px-3 py-1 rounded-md bg-[#1C1C22] border border-white/10 text-xs font-bold text-zinc-300 tracking-wider">
              VISA
            </span>
            <span className="px-3 py-1 rounded-md bg-[#1C1C22] border border-white/10 text-xs font-bold text-zinc-300 tracking-wider">
              MASTERCARD
            </span>
            <span className="px-3 py-1 rounded-md bg-[#1C1C22] border border-white/10 text-xs font-bold text-zinc-300 tracking-wider">
              KOKO
            </span>
            <span className="px-3 py-1 rounded-md bg-[#1C1C22] border border-white/10 text-xs font-bold text-zinc-300 tracking-wider">
              AMEX
            </span>
          </div>
        </div>

        {/* =========================================================================
            ROW 4: DISCLAIMER
            ========================================================================= */}
        <div className="pt-6 mt-6 border-t border-white/10">
          <p className="text-xs text-zinc-500 leading-relaxed max-w-5xl">
            <strong className="text-zinc-400">Disclaimer:</strong> Statements made on AuraFit.lk have not been evaluated by the FDA or local food and health authorities. Dietary supplements are not intended to diagnose, treat, cure, or prevent any disease. Always consult with a qualified healthcare professional before beginning any diet, exercise, or supplementation program. 100% genuine imported products guaranteed with manufacturer batch laboratory certificates.
          </p>
        </div>
      </div>
    </footer>
  );
}

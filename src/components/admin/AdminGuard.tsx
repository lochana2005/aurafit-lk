"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Lock, ArrowLeft, Sparkles, KeyRound } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isHydrated, isAdminAuthenticated, adminLogin, adminQuickLogin } =
    useAdmin();
  const [email, setEmail] = useState("admin@gmail.com");
  const [pin, setPin] = useState("");

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#E2C275] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAdminAuthenticated) {
    return <>{children}</>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    adminLogin(email, pin);
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[520px] h-64 rounded-full bg-[#E2C275]/8 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#111115] border border-[#E2C275]/25 rounded-3xl p-7 sm:p-9 shadow-[0_24px_60px_rgba(0,0,0,0.8)] relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#16161C] border border-[#E2C275]/35 flex items-center justify-center mx-auto text-[#E2C275] mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-[#E2C275]">
            AURAFIT.LK COMMAND CENTER
          </div>
          <h1 className="text-3xl font-black uppercase tracking-wide font-heading text-white">
            ADMIN VAULT LOGIN
          </h1>
          <p className="text-xs text-zinc-400">
            Authorized personnel only. Enter your administrator credentials or use Demo Quick Login.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gmail.com"
              className="w-full bg-[#09090B] border border-white/15 focus:border-[#E2C275] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#E2C275]" />
              <span>Security PIN</span>
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter PIN (2026)"
              className="w-full bg-[#09090B] border border-white/15 focus:border-[#E2C275] rounded-xl px-4 py-3 text-sm font-mono tracking-widest text-white focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider btn-aurafit-gold flex items-center justify-center gap-2 cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>Unlock Admin Vault</span>
          </button>
        </form>

        <div className="pt-2 border-t border-white/[0.08] space-y-3">
          <button
            type="button"
            onClick={adminQuickLogin}
            className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider btn-aurafit-dark text-[#38BDF8] border-sky-400/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#38BDF8]" />
            <span>Demo Admin Quick Login</span>
          </button>

          <Link
            href="/"
            className="w-full py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Storefront</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

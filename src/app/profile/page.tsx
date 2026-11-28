"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  User,
  Package,
  MapPin,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Heart,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useWatchlist } from "@/context/WatchlistContext";
import ProfileDetailsTab from "@/components/profile/ProfileDetailsTab";
import WatchlistTab from "@/components/profile/WatchlistTab";
import SavedStacksTab, {
  SAVED_STACKS_KEY,
  SEEDED_SAVED_STACKS,
} from "@/components/profile/SavedStacksTab";
import OrdersTab from "@/components/profile/OrdersTab";
import AddressesTab from "@/components/profile/AddressesTab";
import VerifiedBatchesTab from "@/components/profile/VerifiedBatchesTab";

type TabType =
  | "profile"
  | "watchlist"
  | "stacks"
  | "orders"
  | "addresses"
  | "batches";

const VALID_TABS: TabType[] = [
  "profile",
  "watchlist",
  "stacks",
  "orders",
  "addresses",
  "batches",
];

function resolveInitialTab(param: string | null): TabType {
  if (param && VALID_TABS.includes(param as TabType)) {
    return param as TabType;
  }
  return "profile";
}

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const { user, isAuthenticated, logout } = useAuth();
  const { watchlistCount } = useWatchlist();

  const [activeTab, setActiveTab] = useState<TabType>(() =>
    resolveInitialTab(tabParam)
  );
  const [prevTabParam, setPrevTabParam] = useState(tabParam);
  if (tabParam !== prevTabParam) {
    setPrevTabParam(tabParam);
    setActiveTab(resolveInitialTab(tabParam));
  }

  const [stacksCount, setStacksCount] = useState<number>(() => {
    if (typeof window === "undefined") return SEEDED_SAVED_STACKS.length;
    try {
      const saved = window.localStorage.getItem(SAVED_STACKS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed.length;
      }
    } catch {
      // fallback
    }
    return SEEDED_SAVED_STACKS.length;
  });

  const [batchesCount] = useState<number>(() => {
    if (typeof window === "undefined") return 2;
    try {
      const saved = window.localStorage.getItem("aurafit_verified_batches");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed.length;
      }
    } catch {
      // fallback
    }
    return 2;
  });

  // Protect route: redirect to /login if unauthenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-[#09090B]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-[#E2C275] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-zinc-400">Verifying session...</p>
        </div>
      </div>
    );
  }

  const handleSignOut = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="w-full min-h-screen bg-[#09090B] text-white">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400 mb-6 flex-wrap"
        >
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          <span className="text-[#E2C275] font-semibold">Athlete Profile</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/8 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white font-heading">
              ATHLETE VAULT{" "}
              <span className="bg-gradient-to-r from-[#E5C76B] via-[#C9A227] to-[#B08922] bg-clip-text text-transparent">
                DASHBOARD
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Welcome back, <strong className="text-white">{user.name}</strong>. Manage
              your saved watchlist, AI stacks, orders, and verified batch reports.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141418] border border-[#E2C275]/30 text-xs font-semibold text-[#E2C275] self-start sm:self-auto font-heading uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#E2C275]" />
            <span>Verified Vault Member</span>
          </div>
        </div>

        {/* 12-Column Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sticky Sidebar */}
          <aside className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-36 lg:self-start space-y-4">
            {/* User Profile Mini Card */}
            <div className="bg-[#111115] rounded-2xl border border-white/10 p-5 shadow-xl text-center space-y-3 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#E5C76B] to-[#C9A227]" />

              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E5C76B] via-[#C9A227] to-[#B08922] text-[#09090B] font-black text-xl flex items-center justify-center font-heading mx-auto shadow-lg ring-4 ring-white/5">
                {user.avatarInitials}
              </div>

              <div>
                <h3 className="text-base font-bold text-white font-heading uppercase tracking-wide">
                  {user.name}
                </h3>
                <p className="text-xs text-zinc-400 truncate max-w-[200px] mx-auto">
                  {user.email}
                </p>
              </div>

              <div className="pt-2">
                <span className="px-3 py-1 rounded-full bg-[#18181D] border border-white/10 text-[10px] font-bold uppercase tracking-wider text-[#E2C275] font-mono">
                  {user.fitnessGoal}
                </span>
              </div>
            </div>

            {/* 6 Navigation Tabs */}
            <div className="bg-[#111115] rounded-2xl border border-white/8 p-2.5 shadow-xl space-y-1">
              {/* 1. PROFILE DETAILS */}
              <button
                type="button"
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer font-heading ${
                  activeTab === "profile"
                    ? "bg-gradient-to-r from-[#E5C76B] via-[#C9A227] to-[#B08922] text-[#09090B] shadow-md"
                    : "text-zinc-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4" />
                  <span>PROFILE DETAILS</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              {/* 2. SAVED WATCHLIST */}
              <button
                type="button"
                onClick={() => setActiveTab("watchlist")}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer font-heading ${
                  activeTab === "watchlist"
                    ? "bg-gradient-to-r from-[#E5C76B] via-[#C9A227] to-[#B08922] text-[#09090B] shadow-md"
                    : "text-zinc-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Heart className="w-4 h-4" />
                  <span>SAVED WATCHLIST</span>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    activeTab === "watchlist"
                      ? "bg-[#09090B] text-white"
                      : "bg-[#E2C275]/15 text-[#E2C275] border border-[#E2C275]/30"
                  }`}
                >
                  {watchlistCount}
                </span>
              </button>

              {/* 3. SAVED AI STACKS */}
              <button
                type="button"
                onClick={() => setActiveTab("stacks")}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer font-heading ${
                  activeTab === "stacks"
                    ? "bg-gradient-to-r from-[#E5C76B] via-[#C9A227] to-[#B08922] text-[#09090B] shadow-md"
                    : "text-zinc-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#38BDF8]" />
                  <span>SAVED AI STACKS</span>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    activeTab === "stacks"
                      ? "bg-[#09090B] text-white"
                      : "bg-[#1C1C22] text-[#38BDF8]"
                  }`}
                >
                  {stacksCount}
                </span>
              </button>

              {/* 4. MY ORDERS */}
              <button
                type="button"
                onClick={() => setActiveTab("orders")}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer font-heading ${
                  activeTab === "orders"
                    ? "bg-gradient-to-r from-[#E5C76B] via-[#C9A227] to-[#B08922] text-[#09090B] shadow-md"
                    : "text-zinc-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4" />
                  <span>MY ORDERS</span>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    activeTab === "orders"
                      ? "bg-[#09090B] text-white"
                      : "bg-[#1C1C22] text-[#E2C275]"
                  }`}
                >
                  3
                </span>
              </button>

              {/* 5. SAVED ADDRESSES */}
              <button
                type="button"
                onClick={() => setActiveTab("addresses")}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer font-heading ${
                  activeTab === "addresses"
                    ? "bg-gradient-to-r from-[#E5C76B] via-[#C9A227] to-[#B08922] text-[#09090B] shadow-md"
                    : "text-zinc-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4" />
                  <span>SAVED ADDRESSES</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              {/* 6. VERIFIED BATCHES */}
              <button
                type="button"
                onClick={() => setActiveTab("batches")}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer font-heading ${
                  activeTab === "batches"
                    ? "bg-gradient-to-r from-[#E5C76B] via-[#C9A227] to-[#B08922] text-[#09090B] shadow-md"
                    : "text-sky-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-sky-400" />
                  <span>VERIFIED BATCHES</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              </button>
            </div>

            {/* Sign Out Action Card */}
            <div className="p-3 bg-[#111115] rounded-2xl border border-white/8 shadow-xl">
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300 bg-red-950/20 hover:bg-red-950/40 border border-red-500/20 transition-all cursor-pointer font-heading"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of Vault</span>
              </button>
            </div>
          </aside>

          {/* Right Content Area */}
          <main className="lg:col-span-8 xl:col-span-9 w-full">
            {activeTab === "profile" && (
              <ProfileDetailsTab
                user={user}
                ordersCount={3}
                stacksCount={stacksCount}
                batchesCount={batchesCount}
              />
            )}
            {activeTab === "watchlist" && <WatchlistTab />}
            {activeTab === "stacks" && (
              <SavedStacksTab onCountChange={setStacksCount} />
            )}
            {activeTab === "orders" && <OrdersTab />}
            {activeTab === "addresses" && <AddressesTab />}
            {activeTab === "batches" && <VerifiedBatchesTab />}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#09090B] flex items-center justify-center text-zinc-500 font-heading tracking-widest text-sm uppercase">
          Loading Athlete Vault...
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}

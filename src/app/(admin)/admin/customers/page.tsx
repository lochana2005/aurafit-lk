"use client";

import React, { useState, useMemo } from "react";
import {
  Users,
  Award,
  UserPlus,
  Wallet,
  Search,
  MessageCircle,
  Eye,
} from "lucide-react";
import CustomerProfileDrawer, {
  AdminCustomer,
  CustomerTag,
} from "@/components/admin/CustomerProfileDrawer";

type CustomerFilterTab =
  | "ALL CUSTOMERS"
  | "VIP / REPEAT"
  | "FIRST-TIME"
  | "COD RISK";

const INITIAL_CUSTOMERS: AdminCustomer[] = [
  {
    id: "cust_1",
    name: "Kasun Perera",
    phone: "+94 77 412 9088",
    email: "kasun.p@gmail.com",
    city: "Colombo 03",
    address: "No. 45/2, Galle Road, Apt 4B, Colombo 03",
    ordersCount: 4,
    totalSpentLkr: 138400,
    promoCode: "COACH10",
    coachName: "Coach Kasun Wijesinghe",
    lastOrderDate: "Nov 28, 2026",
    isNewLast30Days: false,
    tag: "VIP",
    adminNote: "Prefers afternoon delivery after 2:00 PM. Double Rich Chocolate fan.",
    orderHistory: [
      {
        orderId: "AF-2026-8492",
        date: "Nov 28, 2026",
        itemsSummary: "Gold Standard 100% Isolate (5 lbs) × 1",
        paymentMethod: "KOKO 3x",
        totalLkr: 35425,
        status: "Order Placed",
      },
      {
        orderId: "AF-2026-6102",
        date: "Oct 19, 2026",
        itemsSummary: "Micronized Creatine (400g) + C4 Original × 1",
        paymentMethod: "Card",
        totalLkr: 30400,
        status: "Delivered",
      },
    ],
  },
  {
    id: "cust_2",
    name: "Nadeesha Fernando",
    phone: "+94 76 309 1124",
    email: "nadeesha.f@gmail.com",
    city: "Negombo",
    address: "No. 102, Chilaw Road, Negombo",
    ordersCount: 2,
    totalSpentLkr: 72500,
    promoCode: "ROHAN1500",
    coachName: "Rohan Fitness Studio",
    lastOrderDate: "Nov 27, 2026",
    isNewLast30Days: true,
    tag: "VIP",
    adminNote: "Bulk mass gainer buyer. Always verify WhatsApp before dispatch.",
    orderHistory: [
      {
        orderId: "AF-2026-7055",
        date: "Nov 27, 2026",
        itemsSummary: "Critical Mass Original (6 kg) + Creatine × 1",
        paymentMethod: "COD",
        totalLkr: 41000,
        status: "Packed & QR Sealed",
      },
      {
        orderId: "AF-2026-5990",
        date: "Nov 02, 2026",
        itemsSummary: "Applied Nutrition Beef-XP (1.8 kg) × 1",
        paymentMethod: "Card",
        totalLkr: 31500,
        status: "Delivered",
      },
    ],
  },
  {
    id: "cust_3",
    name: "Dilshan Jayawardena",
    phone: "+94 71 884 2210",
    email: "dilshan.j@gmail.com",
    city: "Kandy",
    address: "No. 18, Peradeniya Road, Kandy",
    ordersCount: 1,
    totalSpentLkr: 18900,
    promoCode: "COACH10",
    coachName: "Coach Kasun Wijesinghe",
    lastOrderDate: "Nov 27, 2026",
    isNewLast30Days: true,
    tag: "Regular",
    adminNote: "First pre-workout order via Coach Kasun referral.",
    orderHistory: [
      {
        orderId: "AF-2026-7105",
        date: "Nov 27, 2026",
        itemsSummary: "C4 Original Explosive Pre-Workout (30 Serv) × 1",
        paymentMethod: "Card",
        totalLkr: 18900,
        status: "In Transit",
      },
    ],
  },
  {
    id: "cust_4",
    name: "Tharindu Silva",
    phone: "+94 77 990 3412",
    email: "tharindu.s@gmail.com",
    city: "Galle",
    address: "No. 7, Lighthouse Street, Galle Fort",
    ordersCount: 3,
    totalSpentLkr: 94200,
    lastOrderDate: "Nov 25, 2026",
    isNewLast30Days: false,
    tag: "VIP",
    adminNote: "Hydrolyzed Whey Isolate subscriber. Pays via KOKO 3x.",
    orderHistory: [
      {
        orderId: "AF-2026-6910",
        date: "Nov 25, 2026",
        itemsSummary: "Dymatize ISO100 Hydrolyzed (5 lbs) × 1",
        paymentMethod: "KOKO 3x",
        totalLkr: 38900,
        status: "Delivered",
      },
    ],
  },
  {
    id: "cust_5",
    name: "Shehan Rodrigo",
    phone: "+94 75 640 8821",
    email: "shehan.r@gmail.com",
    city: "Dehiwala",
    address: "No. 29/1, Station Road, Dehiwala",
    ordersCount: 2,
    totalSpentLkr: 28500,
    lastOrderDate: "Nov 21, 2026",
    isNewLast30Days: true,
    tag: "COD Risk",
    adminNote: "Missed first COD courier call in Oct. Confirm availability before dispatch.",
    orderHistory: [
      {
        orderId: "AF-2026-6540",
        date: "Nov 21, 2026",
        itemsSummary: "Lipo-6 Black Ultra Concentrate × 1",
        paymentMethod: "COD",
        totalLkr: 14500,
        status: "Delivered",
      },
      {
        orderId: "AF-2026-5811",
        date: "Oct 28, 2026",
        itemsSummary: "BCAA Energy Amino (30 Serv) × 1",
        paymentMethod: "COD",
        totalLkr: 14000,
        status: "Cancelled",
      },
    ],
  },
  {
    id: "cust_6",
    name: "Malith Wickramasinghe",
    phone: "+94 77 231 5590",
    email: "malith.w@gmail.com",
    city: "Maharagama",
    address: "No. 88, High Level Road, Maharagama",
    ordersCount: 1,
    totalSpentLkr: 24900,
    promoCode: "AURA10",
    coachName: "AuraFit VIP Club",
    lastOrderDate: "Nov 18, 2026",
    isNewLast30Days: true,
    tag: "Regular",
    adminNote: "Interested in Creatine + Whey stack for next month.",
    orderHistory: [
      {
        orderId: "AF-2026-6312",
        date: "Nov 18, 2026",
        itemsSummary: "MuscleTech Nitro-Tech Whey Gold (5.5 lbs) × 1",
        paymentMethod: "Card",
        totalLkr: 24900,
        status: "Delivered",
      },
    ],
  },
];

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<AdminCustomer[]>(INITIAL_CUSTOMERS);
  const [tab, setTab] = useState<CustomerFilterTab>("ALL CUSTOMERS");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const counts = useMemo<Record<CustomerFilterTab, number>>(
    () => ({
      "ALL CUSTOMERS": customers.length,
      "VIP / REPEAT": customers.filter(
        (c) => c.tag === "VIP" || c.ordersCount > 1
      ).length,
      "FIRST-TIME": customers.filter((c) => c.ordersCount === 1).length,
      "COD RISK": customers.filter((c) => c.tag === "COD Risk").length,
    }),
    [customers]
  );

  const totalCustomers = customers.length;
  const vipRepeatCount = counts["VIP / REPEAT"];
  const newLast30Days = customers.filter((c) => c.isNewLast30Days).length;
  const avgLtv =
    totalCustomers > 0
      ? Math.round(
          customers.reduce((s, c) => s + c.totalSpentLkr, 0) / totalCustomers
        )
      : 0;

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      if (tab === "VIP / REPEAT" && c.tag !== "VIP" && c.ordersCount <= 1)
        return false;
      if (tab === "FIRST-TIME" && c.ordersCount !== 1) return false;
      if (tab === "COD RISK" && c.tag !== "COD Risk") return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [customers, tab, search]);

  const selectedCustomer = useMemo(
    () => customers.find((c) => c.id === selectedId) || null,
    [customers, selectedId]
  );

  const handleUpdateTag = (customerId: string, tag: CustomerTag) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, tag } : c))
    );
  };

  const handleUpdateNote = (customerId: string, adminNote: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, adminNote } : c))
    );
  };

  return (
    <div className="-m-4 sm:-m-6 lg:-m-8 h-[calc(100vh-4rem)] flex flex-col overflow-hidden px-4 sm:px-6 py-4 gap-4 bg-[#09090B]">
      {/* Fixed Sleek Customer Command Deck */}
      <div className="shrink-0 rounded-xl border border-white/[0.08] bg-[#0e0e12] overflow-hidden">
        {/* Top Row — Compact 4-Column KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.08]">
          {/* 1. Total Customers */}
          <div className="px-5 py-3.5 border-t-2 border-t-[#d4af37]/80 lg:border-t-0 lg:border-l-2 lg:border-l-[#d4af37]/80">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                TOTAL CUSTOMERS
              </span>
              <Users className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white font-heading mt-1">
              {totalCustomers}
            </div>
          </div>

          {/* 2. VIP / Repeat Buyers */}
          <button
            type="button"
            onClick={() => setTab("VIP / REPEAT")}
            className={`px-5 py-3.5 text-left transition-colors cursor-pointer ${
              tab === "VIP / REPEAT"
                ? "bg-emerald-500/[0.08]"
                : "hover:bg-white/[0.02]"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                VIP / REPEAT BUYERS
              </span>
              <Award className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-300 font-heading mt-1">
              {vipRepeatCount}
            </div>
          </button>

          {/* 3. New Customers (30D) */}
          <div className="px-5 py-3.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                NEW CUSTOMERS (30D)
              </span>
              <UserPlus className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#38BDF8] font-heading mt-1">
              {newLast30Days}
            </div>
          </div>

          {/* 4. Avg. Lifetime Value */}
          <div className="px-5 py-3.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                AVG. LIFETIME VALUE
              </span>
              <Wallet className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white font-heading mt-1">
              Rs. {avgLtv.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Bottom Row — Integrated Filter & Search Bar */}
        <div className="px-4 py-3 bg-[#131318] border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                "ALL CUSTOMERS",
                "VIP / REPEAT",
                "FIRST-TIME",
                "COD RISK",
              ] as CustomerFilterTab[]
            ).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer ${
                  tab === t ? "btn-aurafit-gold" : "btn-aurafit-dark"
                }`}
              >
                <span>{t}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full font-mono text-[10px] leading-none ${
                    tab === t
                      ? "bg-[#09090B] text-white"
                      : "bg-[#09090B]/70 text-[#E2C275]"
                  }`}
                >
                  {counts[t]}
                </span>
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, phone, city, or email..."
              className="w-full bg-[#09090B] border border-white/12 focus:border-[#d4af37] rounded-lg pl-9 pr-3 py-1.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Framed Scrollable Customer Table */}
      <div className="flex-1 min-h-0 flex flex-col rounded-xl border border-white/[0.08] bg-[#0e0e12] overflow-hidden">
        <div className="flex-1 min-h-0 flex flex-col overflow-x-auto">
          <div className="min-w-[960px] flex-1 min-h-0 flex flex-col">
            {/* Pinned Table Header Row */}
            <div className="shrink-0 bg-[#131318] border-b border-white/[0.08] grid grid-cols-[minmax(220px,1.8fr)_minmax(100px,0.9fr)_minmax(70px,0.6fr)_minmax(130px,1fr)_minmax(130px,1fr)_minmax(110px,0.9fr)_minmax(95px,0.8fr)_minmax(145px,1fr)] items-center px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              <div>Customer &amp; Contact</div>
              <div>City</div>
              <div>Orders</div>
              <div>Total Spent (LKR)</div>
              <div>Promo / Coach</div>
              <div>Last Order</div>
              <div>Tag</div>
              <div className="text-right">Actions</div>
            </div>

            {/* Independently Scrollable Body */}
            <div
              data-lenis-prevent
              className="flex-1 min-h-0 overflow-y-auto divide-y divide-white/[0.06] scrollbar-thin"
            >
              {filtered.length === 0 ? (
                <div className="py-12 text-center text-xs text-zinc-500 uppercase tracking-widest">
                  No customers match your current filter.
                </div>
              ) : (
                filtered.map((c) => {
                  const tagBadge =
                    c.tag === "VIP"
                      ? "bg-[#d4af37]/15 border-[#d4af37]/40 text-[#d4af37]"
                      : c.tag === "COD Risk"
                      ? "bg-red-500/15 border-red-500/35 text-red-300"
                      : "bg-emerald-500/15 border-emerald-500/35 text-emerald-300";

                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedId(c.id)}
                      className="grid grid-cols-[minmax(220px,1.8fr)_minmax(100px,0.9fr)_minmax(70px,0.6fr)_minmax(130px,1fr)_minmax(130px,1fr)_minmax(110px,0.9fr)_minmax(95px,0.8fr)_minmax(145px,1fr)] items-center px-5 py-3.5 text-xs hover:bg-white/[0.03] transition-colors cursor-pointer"
                    >
                      <div className="pr-3 min-w-0">
                        <div className="font-bold text-white truncate">
                          {c.name}
                        </div>
                        <div className="text-[11px] font-mono text-zinc-400 truncate mt-0.5">
                          {c.phone}
                        </div>
                      </div>

                      <div className="text-zinc-300 pr-3 truncate">{c.city}</div>

                      <div className="font-mono font-bold text-white pr-3">
                        {c.ordersCount}
                      </div>

                      <div className="font-mono font-bold text-white pr-3">
                        Rs. {c.totalSpentLkr.toLocaleString()}
                      </div>

                      <div className="pr-3 min-w-0">
                        {c.promoCode ? (
                          <div>
                            <span className="px-2 py-0.5 rounded bg-[#d4af37]/15 border border-[#d4af37]/30 font-mono text-[10px] font-bold text-[#d4af37]">
                              {c.promoCode}
                            </span>
                            <div className="text-[10px] text-zinc-500 truncate mt-0.5">
                              {c.coachName}
                            </div>
                          </div>
                        ) : (
                          <span className="text-zinc-500">—</span>
                        )}
                      </div>

                      <div className="font-mono text-[11px] text-zinc-400 pr-3">
                        {c.lastOrderDate}
                      </div>

                      <div className="pr-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase ${tagBadge}`}
                        >
                          {c.tag}
                        </span>
                      </div>

                      <div
                        className="flex items-center justify-end gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedId(c.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-[#16161C] border border-white/10 text-zinc-200 hover:border-[#d4af37]/45 hover:text-[#d4af37] transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Profile</span>
                        </button>

                        <a
                          href={`https://wa.me/${c.phone.replace(
                            /[^0-9]/g,
                            ""
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`WhatsApp ${c.name}`}
                          className="p-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 hover:bg-emerald-500/25 transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Profile Slide-Over Drawer */}
      {selectedCustomer && (
        <CustomerProfileDrawer
          key={selectedCustomer.id}
          customer={selectedCustomer}
          onClose={() => setSelectedId(null)}
          onUpdateTag={handleUpdateTag}
          onUpdateNote={handleUpdateNote}
        />
      )}
    </div>
  );
}

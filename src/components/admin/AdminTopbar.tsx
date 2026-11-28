"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Bell, Plus, ExternalLink } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Executive Overview",
  "/admin/products": "Products & Inventory",
  "/admin/products/new": "Add New Supplement",
  "/admin/inventory": "Inventory & Stock Audit",
  "/admin/orders": "Orders & Delivery Dispatch",
  "/admin/batches": "QR Batch Authenticity Vault",
  "/admin/messages": "Customer Support Inquiries",
};

export default function AdminTopbar({
  onOpenMobile,
}: {
  onOpenMobile: () => void;
}) {
  const pathname = usePathname();
  const { orders } = useAdmin();
  const title = PAGE_TITLES[pathname] || "Admin Command Center";

  const newOrdersCount = orders.filter((o) => o.status === "Order Placed").length;

  return (
    <header className="h-16 bg-[#0E0E12] border-b border-white/10 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sticky top-0 z-30">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobile}
          aria-label="Open admin menu"
          className="lg:hidden p-2 rounded-xl bg-[#16161C] border border-white/12 text-zinc-200 hover:text-white cursor-pointer shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="text-base sm:text-xl font-black uppercase tracking-wider text-white font-heading truncate">
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        {/* Live Incoming Orders Bell / Pulse Counter */}
        <Link
          href="/admin/orders?filter=new"
          aria-label={`${newOrdersCount} new incoming orders`}
          className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-colors ${
            newOrdersCount > 0
              ? "bg-[#E2C275]/12 border-[#E2C275]/45 text-[#E2C275]"
              : "bg-[#16161C] border-white/12 text-zinc-300"
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Incoming</span>
          <span className="px-1.5 py-0.5 rounded-full bg-[#E2C275] text-[#09090B] font-mono text-[10px] font-black leading-none">
            {newOrdersCount}
          </span>
        </Link>

        {/* Quick + ADD PRODUCT Gold Button */}
        <Link
          href="/admin/products/new"
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider btn-aurafit-gold"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>ADD PRODUCT</span>
        </Link>

        {/* View Live Store Link */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold btn-aurafit-dark"
        >
          <span className="hidden sm:inline">View Live Store</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#E2C275]" />
        </Link>
      </div>
    </header>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Truck,
  QrCode,
  MessageSquare,
  ExternalLink,
  LogOut,
  X,
  Boxes,
  Tags,
  Layers,
  TicketPercent,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

interface AdminSidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const ADMIN_NAV = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Products & Stock", href: "/admin/products", icon: Package },
  { name: "Categories", href: "/admin/categories", icon: Layers },
  { name: "Categories & Brands", href: "/admin/categories-brands", icon: Tags },
  { name: "Inventory & Stock", href: "/admin/inventory", icon: Boxes },
  { name: "Orders & Dispatch", href: "/admin/orders", icon: Truck },
  { name: "Promo & Affiliates", href: "/admin/promo-affiliates", icon: TicketPercent },
  { name: "QR Batch Vault", href: "/admin/batches", icon: QrCode },
  { name: "Customer Inquiries", href: "/admin/messages", icon: MessageSquare },
];

export default function AdminSidebar({
  mobileOpen,
  onCloseMobile,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const { products, orders, messages, adminLogout } = useAdmin();

  const lowStockCount = products.filter(
    (p) => p.stockCount <= (p.lowStockThreshold ?? 5)
  ).length;
  const pendingOrders = orders.filter((o) => o.status !== "Delivered").length;
  const openMessages = messages.filter((m) => !m.resolved).length;

  const sidebarInner = (
    <div className="h-full flex flex-col justify-between bg-[#0E0E12] border-r border-white/10 p-5">
      <div className="space-y-6">
        {/* Brand */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <div className="flex items-baseline font-heading tracking-wider">
              <span className="text-xl font-black text-white">AURAFIT</span>
              <span className="text-xl font-black text-[#E2C275] ml-0.5">.LK</span>
            </div>
            <span className="inline-block mt-1 px-2 py-0.5 rounded bg-[#E2C275]/15 border border-[#E2C275]/35 text-[9px] font-bold uppercase tracking-widest text-[#E2C275]">
              ADMIN VAULT
            </span>
          </div>

          <button
            type="button"
            data-no-glint
            onClick={onCloseMobile}
            aria-label="Close admin sidebar"
            className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white bg-[#16161C] border border-white/10 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5" aria-label="Admin Navigation">
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin/products"
                ? pathname.startsWith("/admin/products")
                : pathname === item.href;
            const badgeCount =
              item.href === "/admin/inventory"
                ? lowStockCount
                : item.href === "/admin/orders"
                ? pendingOrders
                : item.href === "/admin/messages"
                ? openMessages
                : 0;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all font-sans ${
                  isActive
                    ? "bg-gradient-to-r from-[#E2C275] to-[#C9A227] text-[#09090B] shadow-md"
                    : "text-zinc-300 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </div>

                {badgeCount > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      isActive
                        ? "bg-[#09090B] text-white"
                        : "bg-[#16161C] text-[#E2C275] border border-[#E2C275]/30"
                    }`}
                  >
                    {badgeCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="space-y-2.5 pt-4 border-t border-white/10">
        <Link
          href="/"
          className="w-full py-2.5 px-3.5 rounded-xl text-xs font-semibold btn-aurafit-dark flex items-center justify-center gap-2"
        >
          <ExternalLink className="w-3.5 h-3.5 text-[#E2C275]" />
          <span>View Storefront</span>
        </Link>

        <button
          type="button"
          data-no-glint
          onClick={adminLogout}
          className="w-full py-2.5 px-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300 bg-red-950/20 hover:bg-red-950/35 border border-red-500/20 flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 sticky top-0 h-screen">
        {sidebarInner}
      </aside>

      {/* Mobile Slide-Over Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/80 cursor-pointer"
          />
          <aside className="relative z-10 w-72 max-w-[85%] h-full">
            {sidebarInner}
          </aside>
        </div>
      )}
    </>
  );
}

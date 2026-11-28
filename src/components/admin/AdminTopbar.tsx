"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Menu, ShieldCheck } from "lucide-react";

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Executive Overview",
  "/admin/products": "Products & Inventory Manager",
  "/admin/orders": "Orders & Courier Dispatch",
  "/admin/batches": "QR Batch Authenticity Vault",
  "/admin/messages": "Customer Support Inquiries",
};

export default function AdminTopbar({
  onOpenMobile,
}: {
  onOpenMobile: () => void;
}) {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] || "Admin Command Center";

  return (
    <header className="h-16 bg-[#0E0E12] border-b border-white/10 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobile}
          aria-label="Open admin menu"
          className="lg:hidden p-2 rounded-xl bg-[#16161C] border border-white/12 text-zinc-200 hover:text-white cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider text-white font-heading truncate">
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#16161C] border border-emerald-500/30 text-[11px] font-mono text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>SYSTEM ONLINE · COLOMBO HUB</span>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#16161C] border border-[#E2C275]/35 text-xs font-bold text-[#E2C275]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">VAULT ADMIN</span>
        </div>
      </div>
    </header>
  );
}

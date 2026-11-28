"use client";

import React from "react";
import Link from "next/link";
import {
  DollarSign,
  Truck,
  AlertTriangle,
  QrCode,
  ArrowRight,
  Package,
} from "lucide-react";
import { useAdmin, AdminOrderStatus } from "@/context/AdminContext";
import { formatLKR } from "@/lib/pricing";

const ORDER_STATUSES: AdminOrderStatus[] = [
  "Order Placed",
  "Packed & QR Sealed",
  "In Transit",
  "Out for Delivery",
  "Delivered",
];

export default function AdminOverviewPage() {
  const { products, orders, batches, updateOrderDispatch } = useAdmin();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const kokoRevenue = orders
    .filter((o) => o.paymentMethod === "KOKO 3x")
    .reduce((sum, o) => sum + o.total, 0);
  const cashCardRevenue = totalRevenue - kokoRevenue;

  const activeOrdersCount = orders.filter((o) => o.status !== "Delivered").length;
  const lowStockProducts = products.filter((p) => p.stockCount <= 5);
  const totalScans = batches.reduce((sum, b) => sum + b.scanCount, 0);

  // Category breakdown from products
  const categoryMap: Record<string, number> = {};
  products.forEach((p) => {
    categoryMap[p.category] = (categoryMap[p.category] || 0) + 1;
  });
  const categories = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
  const maxCatCount = Math.max(1, ...categories.map((c) => c[1]));

  return (
    <div className="space-y-6">
      {/* 4 Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* KPI 1: Total Revenue */}
        <div className="bg-[#111115] border border-white/10 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              TOTAL REVENUE (LKR)
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#E2C275]/12 border border-[#E2C275]/30 flex items-center justify-center text-[#E2C275]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-heading">
            {formatLKR(totalRevenue, false)}
          </div>
          <div className="text-xs text-zinc-400 flex items-center justify-between pt-1 border-t border-white/[0.06]">
            <span>Cash/Card: {formatLKR(cashCardRevenue, false)}</span>
            <span className="text-[#A78BFA] font-semibold">
              KOKO: {formatLKR(kokoRevenue, false)}
            </span>
          </div>
        </div>

        {/* KPI 2: Active Orders to Dispatch */}
        <div className="bg-[#111115] border border-white/10 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              ACTIVE ORDERS TO DISPATCH
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#38BDF8]/12 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-heading">
            {activeOrdersCount}
          </div>
          <div className="text-xs text-zinc-400 pt-1 border-t border-white/[0.06]">
            Out of {orders.length} total orders in pipeline
          </div>
        </div>

        {/* KPI 3: Low-Stock Products Alert */}
        <div className="bg-[#111115] border border-white/10 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              LOW-STOCK ALERTS
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/12 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-heading">
            {lowStockProducts.length}
          </div>
          <div className="text-xs text-zinc-400 pt-1 border-t border-white/[0.06]">
            SKUs with 5 or fewer units remaining
          </div>
        </div>

        {/* KPI 4: Verified QR Batch Scans */}
        <div className="bg-[#111115] border border-white/10 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              VERIFIED QR BATCH SCANS
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/12 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <QrCode className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-heading">
            {totalScans}
          </div>
          <div className="text-xs text-zinc-400 pt-1 border-t border-white/[0.06]">
            Across {batches.length} registered import batches
          </div>
        </div>
      </div>

      {/* Category Breakdown & Low-Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Revenue & Catalog Breakdown */}
        <div className="lg:col-span-7 bg-[#111115] border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold uppercase tracking-wider text-white font-heading">
              Catalog &amp; Category Distribution
            </h3>
            <Link
              href="/admin/products"
              className="text-xs font-bold text-[#E2C275] hover:underline flex items-center gap-1"
            >
              <span>Manage Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3.5">
            {categories.map(([cat, count]) => {
              const pct = Math.round((count / maxCatCount) * 100);
              return (
                <div key={cat} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-200">{cat}</span>
                    <span className="font-mono text-zinc-400">{count} SKUs</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#16161C] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#E2C275] to-[#C9A227]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Low Stock Restock Alerts */}
        <div className="lg:col-span-5 bg-[#111115] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold uppercase tracking-wider text-white font-heading">
              Low Stock Restock Alerts
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-[10px] font-bold text-amber-300">
              ACTION NEEDED
            </span>
          </div>

          {lowStockProducts.length === 0 ? (
            <div className="p-6 rounded-xl bg-[#16161C] border border-white/8 text-center text-xs text-zinc-400">
              All supplements are well-stocked.
            </div>
          ) : (
            <div className="space-y-2.5">
              {lowStockProducts.map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-xl bg-[#16161C] border border-white/8 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#E2C275]">{p.brand}</div>
                    <div className="text-sm font-semibold text-white truncate">
                      {p.name}
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-red-500/15 border border-red-400/30 text-xs font-mono font-bold text-red-300 shrink-0">
                    {p.stockCount} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders Quick-Action Table */}
      <div className="bg-[#111115] border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-[#E2C275]" />
            <h3 className="text-lg font-bold uppercase tracking-wider text-white font-heading">
              Recent Orders Quick-Action
            </h3>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-[#E2C275] hover:underline flex items-center gap-1"
          >
            <span>All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-white/10 text-zinc-400 uppercase text-[11px] tracking-wider">
                <th className="pb-3 pr-4">Order ID</th>
                <th className="pb-3 pr-4">Customer</th>
                <th className="pb-3 pr-4">Payment</th>
                <th className="pb-3 pr-4">Total</th>
                <th className="pb-3">Quick Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-white/[0.02]">
                  <td className="py-3.5 pr-4 font-mono font-bold text-white whitespace-nowrap">
                    {order.id}
                  </td>
                  <td className="py-3.5 pr-4">
                    <div className="font-semibold text-white">{order.customerName}</div>
                    <div className="text-xs text-zinc-400">{order.city}</div>
                  </td>
                  <td className="py-3.5 pr-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-[#16161C] border border-white/10 text-xs font-semibold text-zinc-200">
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4 font-bold text-white whitespace-nowrap">
                    {formatLKR(order.total, false)}
                  </td>
                  <td className="py-3.5">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderDispatch(order.id, {
                          status: e.target.value as AdminOrderStatus,
                        })
                      }
                      aria-label={`Status for ${order.id}`}
                      className="bg-[#16161C] border border-white/15 focus:border-[#E2C275] rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white focus:outline-none cursor-pointer"
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

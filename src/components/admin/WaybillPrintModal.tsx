"use client";

import React from "react";
import { X, Printer } from "lucide-react";
import { AdminOrder } from "@/context/AdminContext";
import { formatLKR } from "@/lib/pricing";

interface WaybillPrintModalProps {
  order: AdminOrder | null;
  onClose: () => void;
}

const BARCODE_WIDTHS = [
  3, 1, 2, 1, 4, 1, 2, 2, 1, 3, 1, 2, 4, 1, 1, 3, 2, 1, 3, 2, 1, 4, 1, 2, 1, 3,
  2, 1, 2, 3, 1, 2, 1, 4, 2, 1,
];

export default function WaybillPrintModal({
  order,
  onClose,
}: WaybillPrintModalProps) {
  if (!order) return null;

  const isCod = order.paymentMethod === "COD";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/85 cursor-pointer"
      />

      <div className="relative z-10 w-full max-w-xl bg-[#111115] border border-white/15 rounded-2xl p-5 sm:p-6 space-y-5 shadow-2xl my-8">
        {/* Modal Header (Hidden on Print) */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#E2C275]">
              THERMAL / A6 SHIPPING LABEL
            </span>
            <h3 className="text-lg font-bold uppercase tracking-wider text-white font-heading">
              Waybill &amp; Packing Slip · {order.id}
            </h3>
          </div>
          <button
            type="button"
            data-no-glint
            onClick={onClose}
            aria-label="Close print preview"
            className="p-2 rounded-xl bg-[#16161C] border border-white/10 text-zinc-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Crisp Black-on-White Printable Thermal Label */}
        <div
          id="aurafit-print-label"
          className="bg-white text-black rounded-xl p-5 border-2 border-black space-y-4 font-sans"
        >
          {/* Label Top Header */}
          <div className="flex items-start justify-between gap-4 pb-3 border-b-2 border-black">
            <div>
              <div className="text-2xl font-black tracking-widest font-heading leading-none">
                AURAFIT.LK
              </div>
              <div className="text-[11px] font-semibold mt-1">
                Colombo 03 Flagship Vault · Hotline: +94 77 123 4567
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold uppercase tracking-wider">
                COURIER PARTNER
              </div>
              <div className="text-sm font-black uppercase">
                {order.courier}
              </div>
            </div>
          </div>

          {/* Scannable CSS Barcode + Waybill & Order ID */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black">
            <div className="space-y-1">
              <div className="flex items-end h-10 gap-[2px]" aria-hidden="true">
                {BARCODE_WIDTHS.map((w, idx) => (
                  <span
                    key={idx}
                    className="bg-black inline-block h-full"
                    style={{ width: `${w}px` }}
                  />
                ))}
              </div>
              <div className="text-xs font-mono font-bold tracking-widest">
                {order.waybillNumber || `WB-${order.id}`}
              </div>
            </div>

            <div className="text-left sm:text-right text-xs space-y-0.5">
              <div>
                <span className="font-bold">ORDER ID:</span>{" "}
                <span className="font-mono font-black">{order.id}</span>
              </div>
              <div>
                <span className="font-bold">DATE:</span> {order.date}
              </div>
              <div>
                <span className="font-bold">ETA:</span> {order.estimatedArrival}
              </div>
            </div>
          </div>

          {/* COD vs PREPAID Banner */}
          <div
            className={`p-3 rounded border-2 border-black text-center font-black uppercase tracking-wider text-sm ${
              isCod ? "bg-black text-white" : "bg-zinc-100 text-black"
            }`}
          >
            {isCod
              ? `CASH ON DELIVERY: COLLECT ${formatLKR(order.total, false)}`
              : `PREPAID (${order.paymentMethod}) — DO NOT COLLECT CASH`}
          </div>

          {/* High-Contrast DELIVER TO Block */}
          <div className="p-3.5 rounded border border-black space-y-1">
            <div className="text-[10px] font-black uppercase tracking-widest">
              DELIVER TO:
            </div>
            <div className="text-base font-black">{order.customerName}</div>
            <div className="text-sm font-mono font-bold">{order.phone}</div>
            <div className="text-xs font-medium leading-snug">
              {order.address}, {order.city}, {order.district}
              {order.postalCode ? ` (${order.postalCode})` : ""}
            </div>
            {order.notes && (
              <div className="mt-2 pt-2 border-t border-dashed border-black text-xs font-bold">
                DELIVERY NOTE: {order.notes}
              </div>
            )}
          </div>

          {/* Compact Packing Manifest */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-black uppercase tracking-widest">
              PACKING MANIFEST ({order.items.length} ITEMS)
            </div>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-black text-[10px] uppercase">
                  <th className="py-1 pr-2">Supplement</th>
                  <th className="py-1 pr-2">Variant</th>
                  <th className="py-1 text-right">Qty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-300">
                {order.items.map((it, idx) => (
                  <tr key={idx}>
                    <td className="py-1.5 pr-2 font-bold">{it.name}</td>
                    <td className="py-1.5 pr-2">{it.flavor || "Standard"}</td>
                    <td className="py-1.5 text-right font-mono font-black">
                      ×{it.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            type="button"
            data-no-glint
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold btn-aurafit-dark cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider btn-aurafit-gold inline-flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>PRINT LABEL NOW</span>
          </button>
        </div>
      </div>
    </div>
  );
}

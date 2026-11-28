"use client";

import React, { useState, useMemo } from "react";
import { MessageSquare, CheckCircle2, RotateCcw, Phone, Mail } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

export default function AdminMessagesPage() {
  const { messages, toggleMessageResolved } = useAdmin();
  const [filter, setFilter] = useState<"All" | "Open" | "Resolved">("All");

  const filtered = useMemo(() => {
    if (filter === "Open") return messages.filter((m) => !m.resolved);
    if (filter === "Resolved") return messages.filter((m) => m.resolved);
    return messages;
  }, [messages, filter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {(["All", "Open", "Resolved"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer ${
                filter === tab ? "btn-aurafit-gold" : "btn-aurafit-dark"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-zinc-400">
          Showing {filtered.length} of {messages.length} inquiries
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-[#111115] border border-white/10 rounded-2xl p-12 text-center text-zinc-400 text-sm">
          No customer inquiries match this filter.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((msg) => (
            <div
              key={msg.id}
              className="bg-[#111115] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="w-9 h-9 rounded-xl bg-[#16161C] border border-white/10 flex items-center justify-center text-[#38BDF8]">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#E2C275]">
                        {msg.ticketId}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#16161C] border border-white/10 text-[11px] font-semibold text-zinc-300">
                        {msg.category}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      {msg.name}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                      msg.resolved
                        ? "bg-emerald-500/15 text-emerald-300 border-emerald-400/30"
                        : "bg-amber-500/15 text-amber-300 border-amber-400/30"
                    }`}
                  >
                    {msg.resolved ? "Resolved" : "Open"}
                  </span>

                  <button
                    type="button"
                    data-no-glint
                    onClick={() => toggleMessageResolved(msg.id)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider btn-aurafit-dark inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    {msg.resolved ? (
                      <>
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reopen</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Mark Resolved</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <p className="text-sm text-zinc-200 leading-relaxed">
                {msg.message}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 pt-2 border-t border-white/[0.06]">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#E2C275]" />
                  <span>{msg.email}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>{msg.phone}</span>
                </span>
                {msg.orderId && (
                  <span className="font-mono text-zinc-300">
                    Order Ref: {msg.orderId}
                  </span>
                )}
                <span className="ml-auto font-mono text-[11px] text-zinc-500">
                  {msg.createdAt}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Truck,
  ShieldCheck,
  Sparkles,
  RotateCcw,
  Building2,
  Send,
  Loader2,
  CheckCircle2,
  Copy,
  Check,
  UserCheck,
} from "lucide-react";

type InquiryCategory =
  | "Order & Delivery Issue"
  | "QR Batch Verification"
  | "Supplement & Stack Advice"
  | "Returns & Refunds"
  | "Gym / Wholesale Inquiry";

interface CategoryOption {
  id: InquiryCategory;
  label: string;
  icon: React.ReactNode;
}

const CATEGORIES: CategoryOption[] = [
  {
    id: "Order & Delivery Issue",
    label: "Order & Delivery Issue",
    icon: <Truck className="w-4 h-4" />,
  },
  {
    id: "QR Batch Verification",
    label: "QR Batch Verification",
    icon: <ShieldCheck className="w-4 h-4" />,
  },
  {
    id: "Supplement & Stack Advice",
    label: "Supplement & Stack Advice",
    icon: <Sparkles className="w-4 h-4" />,
  },
  {
    id: "Returns & Refunds",
    label: "Returns & Refunds",
    icon: <RotateCcw className="w-4 h-4" />,
  },
  {
    id: "Gym / Wholesale Inquiry",
    label: "Gym / Wholesale Inquiry",
    icon: <Building2 className="w-4 h-4" />,
  },
];

interface TicketSummary {
  ticketId: string;
  category: InquiryCategory;
  name: string;
  email: string;
  phone: string;
  orderId?: string;
  message: string;
  createdAt: string;
}

export default function SupportTicketForm() {
  const { user, isAuthenticated } = useAuth();

  const [category, setCategory] = useState<InquiryCategory>("Order & Delivery Issue");
  const [name, setName] = useState(() => user?.name || "");
  const [email, setEmail] = useState(() => user?.email || "");
  const [phone, setPhone] = useState(() =>
    user?.phone
      ? user.phone.startsWith("+94")
        ? user.phone
        : `+94 ${user.phone}`
      : "+94 "
  );
  const [orderId, setOrderId] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<TicketSummary | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAutofill = () => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.email) setEmail(user.email);
      if (user.phone) {
        setPhone(user.phone.startsWith("+94") ? user.phone : `+94 ${user.phone}`);
      }
    }
  };

  const handleCopyTicketId = () => {
    if (!submittedTicket) return;
    navigator.clipboard.writeText(submittedTicket.ticketId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (!phone.trim() || phone.trim() === "+94") {
      setErrorMessage("Please enter a contact phone number.");
      return;
    }
    if (!message.trim() || message.trim().length < 10) {
      setErrorMessage("Please provide a detailed message (at least 10 characters).");
      return;
    }

    setIsSubmitting(true);

    // Simulate realistic asynchronous ticket vault registration delay
    await new Promise((resolve) => setTimeout(resolve, 850));

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newTicket: TicketSummary = {
      ticketId: `TKT-2026-${randomNum}`,
      category,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      orderId: orderId.trim() || undefined,
      message: message.trim(),
      createdAt: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };

    setSubmittedTicket(newTicket);
    setIsSubmitting(false);
  };

  const handleReset = () => {
    setSubmittedTicket(null);
    setMessage("");
    setOrderId("");
    setErrorMessage("");
  };

  // =========================================================================
  // CONFIRMATION VIEW (Post-Submission)
  // =========================================================================
  if (submittedTicket) {
    return (
      <div className="rounded-2xl bg-[#111115] border border-[#E2C275]/40 p-6 sm:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.6),0_0_30px_rgba(226,194,117,0.08)] space-y-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
              TICKET REGISTERED IN SUPPORT VAULT
            </span>
            <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-white font-heading">
              SUPPORT REQUEST LOGGED
            </h3>
          </div>
        </div>

        {/* Ticket Reference Badge Box */}
        <div className="rounded-xl bg-[#181820] border border-white/10 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
              Official Reference Ticket ID
            </span>
            <div className="flex items-center gap-2.5">
              <span className="text-2xl font-black font-mono tracking-wider text-[#E2C275]">
                {submittedTicket.ticketId}
              </span>
              <button
                type="button"
                onClick={handleCopyTicketId}
                aria-label="Copy Ticket ID"
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
              Estimated Concierge SLA
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-mono font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Under 2 Hours (SLST)
            </span>
          </div>
        </div>

        {/* Ticket Details Breakdown */}
        <div className="rounded-xl bg-[#0E0E12] border border-white/6 p-4 sm:p-5 space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-white/8">
            <div>
              <span className="text-zinc-500 font-mono block text-[10px] uppercase">
                Inquiry Category
              </span>
              <span className="text-zinc-200 font-semibold mt-0.5 block">
                {submittedTicket.category}
              </span>
            </div>
            <div>
              <span className="text-zinc-500 font-mono block text-[10px] uppercase">
                Customer Name
              </span>
              <span className="text-zinc-200 font-semibold mt-0.5 block">
                {submittedTicket.name}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-white/8">
            <div>
              <span className="text-zinc-500 font-mono block text-[10px] uppercase">
                Contact Details
              </span>
              <span className="text-zinc-200 font-mono mt-0.5 block">
                {submittedTicket.email} · {submittedTicket.phone}
              </span>
            </div>
            {submittedTicket.orderId && (
              <div>
                <span className="text-zinc-500 font-mono block text-[10px] uppercase">
                  Referenced Order ID
                </span>
                <span className="text-[#E2C275] font-mono font-bold mt-0.5 block">
                  {submittedTicket.orderId}
                </span>
              </div>
            )}
          </div>

          <div>
            <span className="text-zinc-500 font-mono block text-[10px] uppercase">
              Message Excerpt
            </span>
            <p className="text-zinc-300 italic mt-1 line-clamp-3 bg-[#141418] p-3 rounded-lg border border-white/5">
              &quot;{submittedTicket.message}&quot;
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <p className="text-[11px] text-zinc-500 font-mono text-center sm:text-left">
            A confirmation receipt has been dispatched to your email &amp; phone.
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-[#09090B] bg-gradient-to-r from-[#E5C76B] via-[#C9A227] to-[#B08922] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] hover:brightness-105 transition-all font-heading cursor-pointer active:scale-95"
          >
            <span>Send Another Message</span>
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // STANDARD FORM VIEW
  // =========================================================================
  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-[#111115] border border-white/10 p-6 sm:p-8 shadow-[0_12px_36px_rgba(0,0,0,0.5)] space-y-6"
    >
      {/* Form Header with Autofill prompt */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/8">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-white font-heading">
            SUBMIT SUPPORT TICKET
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Our priority response team will follow up via WhatsApp and email.
          </p>
        </div>

        {isAuthenticated && user && (
          <button
            type="button"
            onClick={handleAutofill}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-[#E2C275] bg-[#181820] hover:bg-[#202028] border border-[#E2C275]/30 hover:border-[#E2C275]/60 transition-all cursor-pointer self-start sm:self-auto"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Autofill ({user.name.split(" ")[0]})</span>
          </button>
        )}
      </div>

      {/* 1. Category Pill Selector */}
      <div className="space-y-2">
        <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 block">
          1. Select Inquiry Topic <span className="text-[#E2C275]">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const isSelected = category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer font-heading ${
                  isSelected
                    ? "bg-gradient-to-r from-[#E5C76B] via-[#C9A227] to-[#B08922] text-[#09090B] shadow-[0_0_16px_rgba(226,194,117,0.25)]"
                    : "bg-[#181820] text-zinc-300 hover:text-white border border-white/10 hover:border-white/20 hover:bg-[#202028]"
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Customer Name & Mobile Number (2-Column Row) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label
            htmlFor="contact-name"
            className="text-xs font-mono uppercase tracking-wider text-zinc-300 block"
          >
            Full Name <span className="text-[#E2C275]">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Kasun Perera"
            className="w-full bg-[#181820] border border-white/10 focus:border-[#E2C275]/70 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="contact-phone"
            className="text-xs font-mono uppercase tracking-wider text-zinc-300 block"
          >
            Mobile / WhatsApp <span className="text-[#E2C275]">*</span>
          </label>
          <input
            id="contact-phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+94 77 123 4567"
            className="w-full bg-[#181820] border border-white/10 focus:border-[#E2C275]/70 rounded-xl px-4 py-2.5 text-sm font-mono text-white placeholder-zinc-500 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* 3. Email & Optional Order ID (2-Column Row) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label
            htmlFor="contact-email"
            className="text-xs font-mono uppercase tracking-wider text-zinc-300 block"
          >
            Email Address <span className="text-[#E2C275]">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="w-full bg-[#181820] border border-white/10 focus:border-[#E2C275]/70 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="contact-order-id"
              className="text-xs font-mono uppercase tracking-wider text-zinc-300 block"
            >
              Order ID <span className="text-zinc-500 font-normal">(Optional)</span>
            </label>
            {category === "Order & Delivery Issue" && (
              <span className="text-[10px] font-mono text-sky-400 font-bold">
                Recommended
              </span>
            )}
          </div>
          <input
            id="contact-order-id"
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value.toUpperCase())}
            placeholder="e.g. AF-2026-8492"
            className={`w-full bg-[#181820] rounded-xl px-4 py-2.5 text-sm font-mono text-white placeholder-zinc-500 focus:outline-none transition-colors ${
              category === "Order & Delivery Issue"
                ? "border border-sky-400/50 focus:border-sky-400"
                : "border border-white/10 focus:border-[#E2C275]/70"
            }`}
          />
        </div>
      </div>

      {/* 4. Issue Description / Message Textarea */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="contact-message"
            className="text-xs font-mono uppercase tracking-wider text-zinc-300 block"
          >
            Message &amp; Issue Description <span className="text-[#E2C275]">*</span>
          </label>
          <span className="text-[10px] font-mono text-zinc-500">
            {message.length} characters
          </span>
        </div>
        <textarea
          id="contact-message"
          rows={4}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Please describe your question, supplement advice request, delivery inquiry, or batch serial..."
          className="w-full bg-[#181820] border border-white/10 focus:border-[#E2C275]/70 rounded-xl p-4 text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors resize-none leading-relaxed"
        />
      </div>

      {/* Error message notification */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs">
          {errorMessage}
        </div>
      )}

      {/* 5. Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 px-6 rounded-xl text-sm font-black uppercase tracking-wider text-[#09090B] bg-gradient-to-r from-[#E5C76B] via-[#C9A227] to-[#B08922] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] hover:brightness-105 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 font-heading cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-[#09090B]" />
            <span>TRANSMITTING TO SUPPORT VAULT...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4 stroke-[2.3]" />
            <span>SUBMIT SUPPORT REQUEST</span>
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-zinc-500">
        <ShieldCheck className="w-3.5 h-3.5 text-[#E2C275]" />
        <span>SSL 256-bit Encrypted Support Channel · Sri Lanka</span>
      </div>
    </form>
  );
}

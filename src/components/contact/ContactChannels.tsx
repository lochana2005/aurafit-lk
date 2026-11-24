"use client";

import React from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";

export default function ContactChannels() {
  return (
    <div className="space-y-4">
      {/* 1. Instant WhatsApp Concierge (Featured Highlight) */}
      <div className="relative rounded-2xl bg-gradient-to-br from-[#121A15] via-[#111115] to-[#111115] border border-emerald-500/30 p-5 sm:p-6 shadow-[0_12px_32px_rgba(0,0,0,0.5),0_0_24px_rgba(16,185,129,0.06)] hover:border-emerald-500/50 transition-all duration-300">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
                  FASTEST RESOLUTION
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  &lt;10 MINS
                </span>
              </div>
              <h3 className="text-lg font-bold uppercase tracking-wider text-white font-heading mt-0.5">
                WHATSAPP CONCIERGE
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Chat directly with our certified sports nutrition specialists.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3.5 border-t border-white/8 flex items-center justify-between gap-3">
          <span className="text-sm font-mono font-bold text-zinc-200">
            +94 77 123 4567
          </span>
          <a
            href="https://wa.me/94771234567?text=Hi%20AuraFit%20Support%2C%20I%20have%20an%20inquiry%20regarding%20my%20supplement%20order."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-emerald-950 bg-emerald-400 hover:bg-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.3)] transition-all active:scale-95 font-heading"
          >
            <span>Chat on WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 2. Direct Support Telephone Hotline */}
      <div className="rounded-2xl bg-[#111115] border border-white/10 p-5 hover:border-[#E2C275]/40 transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#E2C275]/10 border border-[#E2C275]/25 flex items-center justify-center text-[#E2C275] shrink-0">
            <Phone className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#E2C275] uppercase">
                TELEPHONE HOTLINE
              </span>
              <span className="text-[10px] font-mono text-zinc-500">
                8:30 AM – 9:00 PM
              </span>
            </div>
            <h3 className="text-base font-bold uppercase tracking-wider text-white font-heading mt-0.5">
              CUSTOMER CARE DESK
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Order status, courier coordination &amp; phone orders.
            </p>

            <div className="mt-3.5 pt-3 border-t border-white/8 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                <span className="text-xs font-mono text-zinc-300">
                  Mon – Sun (Open 7 Days)
                </span>
              </div>
              <a
                href="tel:+94771234567"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-[#09090B] bg-gradient-to-r from-[#E5C76B] via-[#C9A227] to-[#B08922] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] hover:brightness-105 transition-all active:scale-95 font-heading"
              >
                <span>Call +94 77 123 4567</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Official Email Support */}
      <div className="rounded-2xl bg-[#111115] border border-white/10 p-5 hover:border-sky-400/40 transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-sky-400/10 border border-sky-400/25 flex items-center justify-center text-sky-400 shrink-0">
            <Mail className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-widest text-sky-400 uppercase">
                FORMAL DESK
              </span>
              <span className="text-[10px] font-mono text-zinc-500">
                2-Hour SLA
              </span>
            </div>
            <h3 className="text-base font-bold uppercase tracking-wider text-white font-heading mt-0.5">
              EMAIL SUPPORT
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Invoices, B2B wholesale rate cards &amp; laboratory COA reports.
            </p>

            <div className="mt-3.5 pt-3 border-t border-white/8 flex items-center justify-between gap-3">
              <span className="text-xs font-mono text-zinc-300 truncate">
                support@aurafit.lk
              </span>
              <a
                href="mailto:support@aurafit.lk"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-sky-200 bg-sky-400/10 hover:bg-sky-400/20 border border-sky-400/30 transition-all font-heading shrink-0"
              >
                <span>Compose Email</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Colombo Flagship Store Vault */}
      <div className="rounded-2xl bg-[#111115] border border-white/10 p-5 hover:border-amber-400/40 transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/25 flex items-center justify-center text-amber-300 shrink-0">
            <MapPin className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase">
                FLAGSHIP STORE &amp; VAULT
              </span>
              <span className="text-[10px] font-mono text-zinc-500">
                Colombo 03
              </span>
            </div>
            <h3 className="text-base font-bold uppercase tracking-wider text-white font-heading mt-0.5">
              PHYSICAL SHOWROOM
            </h3>
            <p className="text-xs text-zinc-300 mt-1 font-sans">
              No. 42, Galle Road, Colombo 03, Sri Lanka
            </p>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              In-store pickup, free shaker bottle &amp; hologram batch verification available.
            </p>

            <div className="mt-3.5 pt-3 border-t border-white/8 flex items-center justify-between gap-3">
              <span className="text-[11px] font-mono text-zinc-400">
                Daily: 9:00 AM – 8:30 PM
              </span>
              <a
                href="https://maps.google.com/?q=Colombo+03+Sri+Lanka"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-zinc-200 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all font-heading"
              >
                <span>View Map</span>
                <ExternalLink className="w-3 h-3 text-zinc-400" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Trust & Authenticity Assurance Card */}
      <div className="rounded-2xl bg-gradient-to-br from-[#16140F] to-[#111115] border border-[#E2C275]/25 p-4 sm:p-5 flex items-start gap-3 text-xs text-zinc-300">
        <ShieldCheck className="w-5 h-5 text-[#E2C275] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-white font-heading uppercase tracking-wider text-sm block">
            AUTHENTICITY &amp; 24-HOUR RESOLUTION GUARANTEE
          </span>
          <p className="text-zinc-400 text-[11px] leading-relaxed">
            All AuraFit products feature tamper-evident seals and manufacturer-registered batch codes. If your tub exhibits any damage or courier delay, our emergency team dispatches a direct replacement within 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
}

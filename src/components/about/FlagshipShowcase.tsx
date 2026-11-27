"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Clock, CreditCard, ShieldCheck, ArrowRight, QrCode } from "lucide-react";

export default function FlagshipShowcase() {
  return (
    <section className="w-full pb-16 sm:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-br from-[#16161C] via-[#111115] to-[#09090B] border border-[#E2C275]/25 p-7 sm:p-10 lg:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.65)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left: Flagship Details */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#09090B] border border-[#E2C275]/30">
                <MapPin className="w-3.5 h-3.5 text-[#E2C275]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#E2C275]">
                  COLOMBO 03 FLAGSHIP VAULT
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-wide text-white font-heading leading-tight">
                EXPERIENCE THE VAULT IN PERSON
              </h2>

              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl">
                Visit our Colombo 03 flagship showroom for personalized supplement stack consultations, live batch verification demos, and instant in-store pickup with flexible KOKO 3-installment payments.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="rounded-xl bg-[#09090B]/80 border border-white/10 p-4">
                  <div className="flex items-center gap-2 text-[#E2C275] text-xs font-bold uppercase tracking-wider mb-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Address</span>
                  </div>
                  <p className="text-sm text-zinc-200 font-medium">
                    No. 42, Galle Road, Colombo 03
                  </p>
                </div>

                <div className="rounded-xl bg-[#09090B]/80 border border-white/10 p-4">
                  <div className="flex items-center gap-2 text-[#E2C275] text-xs font-bold uppercase tracking-wider mb-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Store Hours</span>
                  </div>
                  <p className="text-sm text-zinc-200 font-medium">
                    Mon – Sun · 9:00 AM – 8:30 PM
                  </p>
                </div>

                <div className="rounded-xl bg-[#09090B]/80 border border-white/10 p-4">
                  <div className="flex items-center gap-2 text-[#38BDF8] text-xs font-bold uppercase tracking-wider mb-1.5">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Flexible Pay</span>
                  </div>
                  <p className="text-sm text-zinc-200 font-medium">
                    KOKO 3-Installment Supported
                  </p>
                </div>
              </div>
            </div>

            {/* Right: CTA Card */}
            <div className="lg:col-span-5 rounded-2xl bg-[#09090B]/90 border border-white/10 p-6 sm:p-7 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E2C275]/10 border border-[#E2C275]/30 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-[#E2C275]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-wider text-white font-heading">
                    READY TO UPGRADE YOUR STACK?
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Explore lab-verified formulas or verify your current tub.
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Link
                  href="/shop"
                  className="w-full py-3.5 px-5 rounded-xl text-sm font-bold uppercase tracking-wider btn-aurafit-gold flex items-center justify-center gap-2"
                >
                  <span>Explore Supplement Vault</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.3]" />
                </Link>

                <Link
                  href="/verify"
                  className="w-full py-3.5 px-5 rounded-xl text-sm font-bold uppercase tracking-wider text-sky-200 btn-aurafit-dark border-sky-400/30 flex items-center justify-center gap-2"
                >
                  <QrCode className="w-4 h-4 text-[#38BDF8]" />
                  <span>Verify Product Batch</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

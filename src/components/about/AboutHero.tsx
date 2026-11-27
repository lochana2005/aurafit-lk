"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, ShieldCheck, Users, Truck, QrCode } from "lucide-react";

const METRICS = [
  {
    icon: ShieldCheck,
    value: "100%",
    label: "Direct Imports",
    sub: "Zero third-party grey market brokers",
    accent: "text-[#E2C275]",
  },
  {
    icon: Users,
    value: "15,000+",
    label: "Athletes Served",
    sub: "Colombo to Jaffna islandwide trust",
    accent: "text-[#E2C275]",
  },
  {
    icon: Truck,
    value: "24–48H",
    label: "Islandwide Delivery",
    sub: "Same-day express inside Colombo",
    accent: "text-[#38BDF8]",
  },
  {
    icon: QrCode,
    value: "100%",
    label: "QR Batch Verified",
    sub: "Tamper-evident hologram lab seals",
    accent: "text-[#38BDF8]",
  },
];

export default function AboutHero() {
  return (
    <section className="w-full bg-[#111115] border-b border-white/[0.08] py-10 sm:py-14 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-zinc-400 mb-6"
        >
          <Link href="/" className="hover:text-[#E2C275] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          <span className="text-white font-medium">About Us</span>
        </nav>

        {/* Eyebrow & Display Title */}
        <div className="max-w-4xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#16161C] border border-[#E2C275]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E2C275]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#E2C275]">
              OUR STORY · SRI LANKA&apos;S AUTHENTIC SUPPLEMENT VAULT
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-wide text-white font-heading leading-[1.02]">
            ENGINEERED FOR PURE PERFORMANCE.{" "}
            <span className="champagne-gold-gradient-text block sm:inline">
              ZERO COMPROMISE.
            </span>
          </h1>

          <p className="text-zinc-300 text-base sm:text-lg leading-relaxed max-w-3xl font-normal">
            AuraFit.lk was founded with a single non-negotiable mission: to eradicate counterfeit and heat-damaged supplements from Sri Lanka&apos;s fitness ecosystem. Every tub, capsule, and formula in our vault is air-freighted directly from authorized USA and UK manufacturers, stored in climate-controlled facilities, and sealed with a verifiable holographic batch QR code.
          </p>
        </div>

        {/* 4-Column Metrics Strip */}
        <div className="mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {METRICS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="rounded-2xl bg-[#16161C] border border-white/10 p-5 sm:p-6 flex flex-col justify-between hover:border-[#E2C275]/35 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#09090B] border border-white/10 flex items-center justify-center">
                    <Icon className={`w-5 h-5 ${item.accent}`} />
                  </div>
                  <span className="text-2xl sm:text-3xl font-black text-white font-heading tracking-wide">
                    {item.value}
                  </span>
                </div>
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                    {item.label}
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    {item.sub}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

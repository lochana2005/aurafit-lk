"use client";

import React from "react";
import Link from "next/link";
import { Plane, ThermometerSnowflake, QrCode, ArrowRight } from "lucide-react";

const PIPELINE_STEPS = [
  {
    step: "01",
    icon: Plane,
    title: "Direct USA & UK Manufacturer Sourcing",
    description:
      "We procure directly from authorized brand headquarters and official master distributors in the United States and United Kingdom—never through unverified regional resellers.",
    accentBorder: "border-[#E2C275]/25 hover:border-[#E2C275]/55",
    iconStyle: "text-[#E2C275] bg-[#E2C275]/10 border-[#E2C275]/25",
  },
  {
    step: "02",
    icon: ThermometerSnowflake,
    title: "Climate-Controlled Vault Storage",
    description:
      "Sri Lanka's tropical humidity degrades amino acids, creatine, and whey isolates. Our Colombo vault maintains strict 20°C–22°C temperature and humidity control 24/7.",
    accentBorder: "border-white/10 hover:border-[#E2C275]/45",
    iconStyle: "text-[#E2C275] bg-[#E2C275]/10 border-[#E2C275]/25",
  },
  {
    step: "03",
    icon: QrCode,
    title: "Tamper-Evident Holographic QR Batch Seals",
    description:
      "Before dispatch, every container receives a unique serialized AuraFit hologram seal linked to its manufacturer Certificate of Analysis (COA) and import batch record.",
    accentBorder: "border-sky-400/25 hover:border-sky-400/60",
    iconStyle: "text-[#38BDF8] bg-sky-400/10 border-sky-400/25",
    cta: true,
  },
];

export default function AuthenticityPipeline() {
  return (
    <section className="w-full py-14 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#E2C275]">
              CHAIN OF CUSTODY
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-wide text-white font-heading mt-1.5">
              OUR 3-STEP AUTHENTICITY PIPELINE
            </h2>
          </div>
          <p className="text-sm text-zinc-400 max-w-md leading-relaxed">
            Every jar you open is backed by verifiable import documentation, cold-chain discipline, and instant QR lookup.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PIPELINE_STEPS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className={`rounded-2xl bg-[#111115] border ${item.accentBorder} p-6 sm:p-7 flex flex-col justify-between transition-all duration-300`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-12 h-12 rounded-xl border flex items-center justify-center ${item.iconStyle}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-bold text-zinc-500 tracking-widest">
                      STEP {item.step}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold uppercase tracking-wide text-white font-heading mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {item.cta && (
                  <div className="mt-6 pt-4 border-t border-white/[0.08]">
                    <Link
                      href="/verify"
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#38BDF8] hover:text-sky-200 transition-colors"
                    >
                      <span>Verify a Batch Code Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

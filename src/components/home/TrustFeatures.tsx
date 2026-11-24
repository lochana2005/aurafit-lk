"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, QrCode, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function TrustFeatures() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14 border-t border-white/[0.08]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: "some", margin: "0px 0px -40px 0px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Card 1: Authenticity Scanner */}
        <div className="rounded-2xl bg-gradient-to-br from-[#18181E] to-[#111114] border border-white/12 hover:border-white/20 p-6 sm:p-8 flex flex-col justify-between transition-all shadow-[0_12px_32px_rgba(0,0,0,0.5)]">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#E2C275]/10 border border-[#E2C275]/25 flex items-center justify-center shrink-0">
              <QrCode className="w-6 h-6 text-[#E2C275]" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#E2C275]">
                ANTI-COUNTERFEIT VAULT
              </span>
              <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-white font-heading mt-0.5 leading-tight">
                VERIFY YOUR SUPPLEMENT
              </h3>
              <p className="text-[#B4B4BC] text-xs mt-2 leading-[1.65]">
                Enter your container&apos;s unique batch number or scan the QR security sticker to confirm direct import authenticity and view the certificate of analysis.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between">
            <span className="text-[11px] text-zinc-500 font-mono">
              Sri Lanka Customs Approved
            </span>
            <Link
              href="/verify"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-[#09090B] bg-gradient-to-r from-[#E5C76B] via-[#C9A227] to-[#B08922] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] hover:brightness-105 transition-all"
            >
              <span>Verify Now</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </Link>
          </div>
        </div>

        {/* Card 2: AI Fitness Coach */}
        <div className="rounded-2xl bg-gradient-to-br from-[#18181E] to-[#111114] border border-sky-400/20 hover:border-sky-400/40 p-6 sm:p-8 flex flex-col justify-between transition-all shadow-[0_12px_32px_rgba(0,0,0,0.5),0_0_24px_rgba(56,189,248,0.05)]">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-400/10 border border-sky-400/25 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-sky-300" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-sky-300">
                INTELLIGENT SPORTS NUTRITION
              </span>
              <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-white font-heading mt-0.5 leading-tight">
                BUILD YOUR STACK WITH AI COACH
              </h3>
              <p className="text-[#B4B4BC] text-xs mt-2 leading-[1.65]">
                Eliminate guesswork and overpaying. Tell our AI your training routine, body parameters, and fitness goals to receive a customized daily supplement protocol.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between">
            <span className="text-[11px] text-zinc-500 font-mono">
              Tailored for Sri Lankan Athletes
            </span>
            <Link
              href="/ai-coach"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-sky-200 bg-sky-400/10 hover:bg-sky-400/20 border border-sky-400/30 hover:border-sky-400/50 transition-colors"
            >
              <span>Launch Coach</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}


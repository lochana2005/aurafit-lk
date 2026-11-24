"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, Truck, CreditCard, ShieldCheck, RotateCcw, MapPin, ThermometerSnowflake } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  icon: React.ReactNode;
}

const FAQS: FAQItem[] = [
  {
    id: "delivery",
    question: "How long does islandwide delivery take?",
    answer:
      "Orders placed before 2:00 PM on weekdays are dispatched the same day. Deliveries within Colombo (01–15) and immediate Western Province suburbs arrive within 24 hours. For all outstation regions (Kandy, Galle, Kurunegala, Matara, Jaffna, etc.), express courier transit takes 24–48 hours. Live tracking is available via /track-order.",
    icon: <Truck className="w-4 h-4 text-[#E2C275]" />,
  },
  {
    id: "koko",
    question: "How do I pay with KOKO in 3 interest-free installments?",
    answer:
      "At checkout, select KOKO as your payment method. You will pay 1/3 of your order total today using any Sri Lankan debit or credit card (Commercial Bank, Sampath, HNB, Seylan, etc.). The remaining two equal installments are automatically charged at 30 days and 60 days with 0% interest and 0 hidden fees.",
    icon: <CreditCard className="w-4 h-4 text-emerald-400" />,
  },
  {
    id: "batch-fail",
    question: "What if my QR batch code fails verification?",
    answer:
      "Every genuine AuraFit supplement tub carries an anti-counterfeit holographic seal linked to our direct import customs registry. If your scan or serial input fails on /verify, please do not break the seal. Call our hotline immediately (+94 77 123 4567) or submit a ticket above under 'QR Batch Verification' for an immediate 24h replacement.",
    icon: <ShieldCheck className="w-4 h-4 text-sky-400" />,
  },
  {
    id: "returns",
    question: "What is your return & exchange policy on sealed tubs?",
    answer:
      "We provide a 7-day hassle-free return or exchange window for all unopened products with the tamper-evident holographic seal intact. You can return products in person at our Colombo 03 flagship store or request a complimentary courier pickup through our support desk.",
    icon: <RotateCcw className="w-4 h-4 text-amber-400" />,
  },
  {
    id: "pickup",
    question: "Can I pick up my order in Colombo in person?",
    answer:
      "Yes! Select 'In-Store Pickup' during checkout. Your order will be prepared and staged at our Colombo 03 Flagship Vault (No. 42, Galle Road, Colombo 03) within 2 hours. Walk-in customers also receive a complimentary AuraFit shaker bottle and live batch verification on-site.",
    icon: <MapPin className="w-4 h-4 text-rose-400" />,
  },
  {
    id: "storage",
    question: "How are supplements stored in Sri Lanka's tropical climate?",
    answer:
      "Proteins, creatines, and pre-workouts are sensitive to Sri Lankan heat and humidity. AuraFit operates an air-conditioned, climate-controlled warehousing facility in Colombo regulated at 21°C and below 55% relative humidity to ensure your powder remains 100% clump-free and potent.",
    icon: <ThermometerSnowflake className="w-4 h-4 text-cyan-300" />,
  },
];

export default function SupportFaqSection() {
  const [openId, setOpenId] = useState<string | null>("delivery");

  const toggleFAQ = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="w-full pt-10 border-t border-white/8 space-y-8">
      {/* FAQ Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#141418] border border-white/10 text-zinc-300 text-[10px] sm:text-xs font-bold tracking-widest uppercase font-mono">
          <HelpCircle className="w-3.5 h-3.5 text-[#E2C275]" />
          <span>SELF-SERVICE KNOWLEDGE VAULT</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-wider font-heading text-white">
          <span>FREQUENTLY ASKED </span>
          <span className="text-[#E2C275]">QUESTIONS</span>
        </h2>

        <p className="text-xs sm:text-sm text-zinc-400">
          Instant answers to common customer queries regarding Sri Lankan deliveries, KOKO installments, and product authenticity.
        </p>
      </div>

      {/* 2-Column FAQ Accordion Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FAQS.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? "bg-[#141418] border-[#E2C275]/50 shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
                  : "bg-[#111115] border-white/8 hover:border-white/15"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleFAQ(faq.id)}
                aria-expanded={isOpen}
                className="w-full p-5 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#181820] border border-white/10 flex items-center justify-center shrink-0">
                    {faq.icon}
                  </div>
                  <span className="font-heading font-bold text-sm sm:text-base tracking-wide text-zinc-100 uppercase">
                    {faq.question}
                  </span>
                </div>

                <ChevronDown
                  className={`w-4 h-4 text-zinc-400 transition-transform duration-200 shrink-0 ${
                    isOpen ? "rotate-180 text-[#E2C275]" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs text-zinc-300 leading-relaxed border-t border-white/6 font-sans">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}


"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Send,
  Sliders,
  Plus,
  Check,
  MessageSquare,
  Flame,
  Zap,
  Dumbbell,
  ShieldAlert,
} from "lucide-react";
import { Product } from "@/data/mockProducts";
import { useCart } from "@/context/CartContext";
import StudioImage from "@/components/StudioImage";
import { formatLKR, getKokoInstallment } from "@/lib/pricing";
import RecommendedStackCard from "./RecommendedStackCard";
import { ChatSession } from "./types";

interface AIChatWorkspaceProps {
  session: ChatSession;
  onSendMessage: (text: string) => void;
  isTyping: boolean;
  onSwitchToStackBuilder: () => void;
  onToggleMobileSidebar: () => void;
  onNewChat: () => void;
}

const STARTER_PROMPTS = [
  {
    icon: Dumbbell,
    title: "Hypertrophy Caloric Surplus",
    prompt: "Best bulking stack under Rs. 45,000 for hardgainers?",
    desc: "Complex carbs, clean whey & cellular creatine",
  },
  {
    icon: Zap,
    title: "Creatine Saturation Timing",
    prompt: "When should I take Creatine, and do I need a loading phase?",
    desc: "Intramuscular saturation, optimal window & hydration",
  },
  {
    icon: Flame,
    title: "Lean Cut & Definition",
    prompt: "What is the best stack for cutting fat while preserving muscle?",
    desc: "Hydrolyzed whey isolate & intra-workout BCAAs",
  },
  {
    icon: ShieldAlert,
    title: "Pre-Workout Formulation",
    prompt: "Pre-workout recommendation for evening gym sessions?",
    desc: "Caffeine half-life, beta-alanine tingles & nitric oxide pumps",
  },
];

export default function AIChatWorkspace({
  session,
  onSendMessage,
  isTyping,
  onSwitchToStackBuilder,
  onToggleMobileSidebar,
  onNewChat,
}: AIChatWorkspaceProps) {
  const { addToCart } = useCart();
  const [inputText, setInputText] = useState("");
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior,
      });
    }
  };

  useEffect(() => {
    scrollToBottom("smooth");
  }, [session.messages, isTyping]);

  useEffect(() => {
    // When switching active chat session, adjust container scroll position without jumping the window
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "auto",
      });
    }
    inputRef.current?.focus({ preventScroll: true });
  }, [session.id]);

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1, product.flavors?.[0] || product.weight);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isTyping) return;
    onSendMessage(inputText.trim());
    setInputText("");
    inputRef.current?.focus({ preventScroll: true });
  };

  const isFreshChat =
    session.messages.length === 0 ||
    (session.messages.length === 1 &&
      session.messages[0].role === "assistant" &&
      !session.messages[0].recommendedStack);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#0B0B0E] h-full overflow-hidden relative">
      {/* =========================================================================
          SLIM TOP BAR
          ========================================================================= */}
      <div className="h-14 px-4 sm:px-6 border-b border-white/8 flex items-center justify-between shrink-0 bg-[#0E0E12]/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile Sidebar Toggle */}
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-lg bg-[#181820] text-zinc-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="Open Conversations & Stack Builder"
          >
            <MessageSquare className="w-4 h-4 text-sky-400" />
          </button>

          {/* Active Chat Title & Status */}
          <div className="min-w-0 flex items-center gap-2.5">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white font-heading truncate max-w-[200px] sm:max-w-xs md:max-w-md">
              {session.title || "AuraFit AI Consultation"}
            </h2>
            <span className="inline-flex items-center gap-1.5 text-[10px] text-sky-300 font-mono font-medium shrink-0 px-2 py-0.5 rounded-full bg-sky-950/60 border border-sky-400/30">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              <span className="hidden xs:inline">ONLINE</span>
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onSwitchToStackBuilder}
            className="px-3 py-1.5 rounded-xl text-xs font-heading uppercase tracking-wider font-bold bg-[#14141A] text-sky-300 border border-sky-400/30 hover:border-sky-400 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            title="Configure athlete biometrics & custom stack"
          >
            <Sliders className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Stack Builder</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onNewChat();
              inputRef.current?.focus({ preventScroll: true });
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-heading uppercase tracking-wider font-bold bg-[#14141A] text-zinc-300 border border-white/10 hover:border-white/25 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
            title="Start fresh consultation"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Chat</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          CHAT STREAM AREA
          ========================================================================= */}
      <div
        ref={messagesContainerRef}
        data-lenis-prevent
        className="flex-1 overflow-y-auto overscroll-contain custom-scrollbar px-4 sm:px-8 py-6 space-y-6"
      >
        {/* If fresh chat, show clean centered ChatGPT-style hero & starter cards */}
        {isFreshChat ? (
          <div className="max-w-2xl mx-auto py-8 sm:py-12 space-y-8 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-sky-950/60 border border-sky-400/40 flex items-center justify-center text-sky-400 shadow-[0_0_30px_rgba(56,189,248,0.25)]">
              <Sparkles className="w-7 h-7 text-sky-400" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-heading">
                AURAFIT AI{" "}
                <span className="bg-gradient-to-r from-sky-400 via-[#E2C275] to-[#B08922] bg-clip-text text-transparent">
                  SPORTS NUTRITION
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
                Evidence-based dosage timing protocols, supplement comparisons, and custom
                stacks calibrated to your biometrics in Sri Lanka.
              </p>
            </div>

            {/* Starter Prompt Cards in 2x2 Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left pt-2">
              {STARTER_PROMPTS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onSendMessage(item.prompt);
                      inputRef.current?.focus({ preventScroll: true });
                    }}
                    className="p-3.5 rounded-xl bg-[#121217] border border-white/8 hover:border-sky-400/40 hover:bg-[#161620] transition-all cursor-pointer group space-y-1.5"
                  >
                    <div className="flex items-center gap-2 text-sky-400">
                      <Icon className="w-3.5 h-3.5 text-sky-400" />
                      <span className="text-xs font-bold font-heading uppercase tracking-wider text-zinc-200 group-hover:text-white">
                        {item.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 group-hover:text-zinc-300 line-clamp-2 leading-relaxed">
                      &quot;{item.prompt}&quot;
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Render Active Message Stream */
          session.messages.map((msg) => {
            const isUser = msg.role === "user";

            if (isUser) {
              return (
                <div key={msg.id} className="flex justify-end">
                  <div className="bg-[#1E1E26] text-white px-5 py-3 rounded-2xl rounded-tr-sm max-w-[85%] sm:max-w-[75%] shadow-md leading-relaxed text-sm sm:text-[15px] font-sans">
                    <p className="whitespace-pre-line">{msg.content}</p>
                    <div className="text-[10px] text-zinc-400 font-mono text-right mt-1 opacity-70">
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            }

            // AI Message (ChatGPT/Gemini Style: Left avatar + airy markdown, NO heavy dark box)
            return (
              <div key={msg.id} className="flex items-start gap-3.5 max-w-[92%] sm:max-w-[85%]">
                {/* AI Avatar */}
                <div className="w-8 h-8 rounded-full bg-sky-950/60 border border-sky-400/40 flex items-center justify-center text-sky-400 shrink-0 mt-0.5 shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0 space-y-3 pt-0.5">
                  {/* Clean Typography */}
                  <div className="text-sm sm:text-[15px] leading-relaxed text-zinc-200 whitespace-pre-line">
                    {msg.content}
                  </div>

                  {/* Inline Recommended Stack Bundle Card (when attached to this message) */}
                  {msg.recommendedStack && (
                    <RecommendedStackCard
                      stackItems={msg.recommendedStack.items}
                      goalTitle={msg.recommendedStack.title}
                      rationale={msg.recommendedStack.rationale}
                    />
                  )}

                  {/* Standalone Recommended Product Cards (if no full stack) */}
                  {!msg.recommendedStack &&
                    msg.recommendedProducts &&
                    msg.recommendedProducts.length > 0 && (
                      <div className="pt-2 space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#E2C275] font-heading block">
                          Recommended Authentic Supplements:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {msg.recommendedProducts.map((prod) => {
                            const isAdded = !!addedIds[prod.id];
                            return (
                              <div
                                key={prod.id}
                                className="p-3 rounded-xl bg-[#121217] border border-white/8 hover:border-white/20 transition-all flex items-center justify-between gap-3 group"
                              >
                                <Link
                                  href={`/shop/${prod.slug}`}
                                  className="relative w-12 h-12 rounded-lg bg-[#181820] border border-white/8 p-1 shrink-0 overflow-hidden"
                                >
                                  <StudioImage
                                    src={prod.image}
                                    alt={prod.name}
                                    fill
                                    sizes="48px"
                                    objectFit="contain"
                                    fallbackLabel={prod.name}
                                  />
                                </Link>

                                <div className="flex-1 min-w-0">
                                  <Link
                                    href={`/shop/${prod.slug}`}
                                    className="text-xs font-bold text-white font-heading truncate hover:text-[#E2C275] transition-colors block"
                                  >
                                    {prod.name}
                                  </Link>
                                  <div className="flex items-center gap-1.5 text-[11px] mt-0.5">
                                    <span className="font-extrabold text-[#E2C275] font-sans">
                                      {formatLKR(prod.price, false)}
                                    </span>
                                    <span className="text-[9px] text-zinc-500 font-mono">
                                      3x {formatLKR(getKokoInstallment(prod.price), false)}
                                    </span>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleAddToCart(prod)}
                                  className={`p-2 rounded-lg font-bold text-xs transition-all cursor-pointer shrink-0 ${
                                    isAdded
                                      ? "bg-emerald-500 text-black"
                                      : "bg-[#1C1C22] text-[#E2C275] hover:bg-[#E2C275] hover:text-[#09090B] border border-white/10"
                                  }`}
                                  title="Add to Cart"
                                >
                                  {isAdded ? (
                                    <Check className="w-3.5 h-3.5" />
                                  ) : (
                                    <Plus className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  <div className="text-[10px] text-zinc-500 font-mono">
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Typing Bubble */}
        {isTyping && (
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-full bg-sky-950/60 border border-sky-400/40 flex items-center justify-center text-sky-400 shrink-0">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-[#14141A] border border-white/8 text-xs text-sky-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-bounce [animation-delay:0.4s]" />
              <span className="text-zinc-400 font-mono text-[11px] ml-1">
                Formulating sports nutrition advice...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          BOTTOM FLOATING INPUT BAR
          ========================================================================= */}
      <div className="p-3.5 sm:p-4 border-t border-white/8 bg-[#0E0E12] shrink-0">
        <form
          onSubmit={handleFormSubmit}
          className="max-w-3xl mx-auto bg-[#18181F] border border-white/12 focus-within:border-sky-400/50 rounded-full px-4 sm:px-5 py-2 flex items-center gap-3 shadow-lg transition-colors"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask AI Coach (e.g. Best bulking stack, creatine timing, whey vs isolate)..."
            className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-none py-1"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-r from-sky-400 to-sky-500 hover:brightness-105 active:scale-95 disabled:opacity-30 flex items-center justify-center text-[#09090B] font-bold transition-all shrink-0 cursor-pointer shadow-sm"
          >
            <Send className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>
        <p className="text-[10px] text-zinc-500 text-center mt-2 font-mono">
          AI guidance for sports performance. Non-medical advice.
        </p>
      </div>
    </div>
  );
}

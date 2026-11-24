"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Send,
  RotateCcw,
  Bot,
  User,
  Check,
  Plus,
} from "lucide-react";
import { Product, MOCK_PRODUCTS } from "@/data/mockProducts";
import { useCart } from "@/context/CartContext";
import StudioImage from "@/components/StudioImage";
import { formatLKR, getKokoInstallment } from "@/lib/pricing";

export interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: string;
  recommendedProducts?: Product[];
}

interface AIChatWorkspaceProps {
  externalPrompt?: string | null;
  onClearExternalPrompt?: () => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "msg_welcome",
    role: "assistant",
    content:
      "Ayubowan! I'm your AuraFit AI Nutrition & Performance Coach. I analyze clinical sports nutrition data and match genuine imported supplements to your exact biometric targets, training schedule, and budget in Sri Lanka.\n\nAsk me anything about dosage timing, comparing Whey vs Mass Gainer, or click 'Generate My Stack' on the left to build a custom bundle!",
    timestamp: "Just now",
  },
];

const PROMPT_CHIPS = [
  "Best bulking stack under Rs. 45,000?",
  "When should I take Creatine?",
  "Whey Isolate vs Mass Gainer?",
  "Pre-workout for evening gym?",
];

export default function AIChatWorkspace({
  externalPrompt,
  onClearExternalPrompt,
}: AIChatWorkspaceProps) {
  const { addToCart } = useCart();
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1, product.flavors?.[0] || product.weight);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  const generateAIResponse = (userText: string) => {
    const text = userText.toLowerCase();

    // 1. Bulking / Mass Gainer query
    if (text.includes("bulk") || text.includes("mass") || text.includes("45,000")) {
      return {
        reply:
          "For serious hypertrophy, you need a daily caloric surplus of ~350–500 kcal combined with 1.8g to 2.2g of protein per kg of bodyweight.\n\nRecommended Strategy:\n• Primary Fuel: Critical Mass Gainer (50g protein + complex carbs post-workout)\n• Cellular Volumization: 5g Micronized Creatine daily to supercharge ATP stores and muscle fullness.\n\nHere are the top direct-import options in Sri Lanka:",
        products: [MOCK_PRODUCTS[2], MOCK_PRODUCTS[4]], // Critical Mass + Creatine
      };
    }

    // 2. Creatine query
    if (text.includes("creatine") || text.includes("when")) {
      return {
        reply:
          "Creatine Monohydrate works by saturation, meaning consistency is far more critical than exact timing.\n\nBest Practices:\n• Dosage: 5 grams daily (1 level scoop). No aggressive loading phase is necessary—full muscle saturation occurs in 3 weeks at 5g/day.\n• Optimal Window: Post-workout with water or mixed into your protein shake. Carbohydrates and protein trigger an insulin response that enhances cellular creatine uptake.",
        products: [MOCK_PRODUCTS[4]], // Applied Nutrition Creatine
      };
    }

    // 3. Whey vs Mass Gainer
    if (text.includes("vs") || text.includes("difference") || text.includes("isolate")) {
      return {
        reply:
          "Key Difference:\n• 100% Whey Isolate: 25g pure protein, only ~120 calories, under 1g carbohydrates. Engineered for lean muscle preservation, cutting phases, and rapid post-workout digestion.\n• Mass Gainer: 50g protein, 100g+ complex carbs, and 650+ calories. Engineered for hardgainers struggling to meet daily calorie targets through food alone.\n\nChoose Isolate if your priority is lean definition; choose Mass Gainer if you are trying to break through a weight plateau.",
        products: [MOCK_PRODUCTS[0], MOCK_PRODUCTS[2]],
      };
    }

    // 4. Pre-Workout query
    if (text.includes("pre-workout") || text.includes("evening") || text.includes("energy")) {
      return {
        reply:
          "If training after 6:00 PM, be mindful of caffeine half-life (typically 5 to 7 hours).\n\nRecommendations:\n• Take 20–30 minutes before your first working set with 250ml cold water.\n• For evening workouts, start with half a scoop to gauge sleep impact while still enjoying the clinical beta-alanine tingles and L-Citrulline nitric oxide pumps.\n\nBoth formulas below are factory-sealed with QR laboratory batch tracking:",
        products: [MOCK_PRODUCTS[6], MOCK_PRODUCTS[7]],
      };
    }

    // 5. Configurator / Biometrics input
    if (text.includes("diagnostic scan") || text.includes("biometric") || text.includes("goal:")) {
      return {
        reply:
          "I've analyzed your athlete biometrics against our current import inventory.\n\nTargeted Recommendation:\n• Based on your training schedule, target 1.6g–2.0g protein per kg of bodyweight.\n• Your primary stack below pairs fast-digesting protein with ATP creatine regeneration to maximize protein synthesis within 45 minutes of training.",
        products: [MOCK_PRODUCTS[0], MOCK_PRODUCTS[4], MOCK_PRODUCTS[6]],
      };
    }

    // Default friendly response
    return {
      reply:
        "Great question! Optimal supplementation is built upon three pillars: consistent protein pacing every 3–4 hours, proven strength enhancers like Creatine Monohydrate, and adequate electrolyte recovery in tropical climates like Sri Lanka.\n\nHere are our highest-rated imported supplements suited for your athletic profile:",
      products: [MOCK_PRODUCTS[0], MOCK_PRODUCTS[4]],
    };
  };

  const handleUserSend = (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: "user",
      content: text.trim(),
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      const response = generateAIResponse(text);
      const assistantMessage: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: "assistant",
        content: response.reply,
        timestamp: "Just now",
        recommendedProducts: response.products,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 700);
  };

  // Handle external prompts sent from AthleteProfilePanel
  useEffect(() => {
    if (!externalPrompt) return;

    const timer = setTimeout(() => {
      handleUserSend(externalPrompt);
      if (onClearExternalPrompt) {
        onClearExternalPrompt();
      }
    }, 0);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalPrompt]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleUserSend(inputText);
  };

  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES);
    setInputText("");
  };

  return (
    <div className="bg-[#111115] border border-white/10 rounded-2xl flex flex-col h-[600px] lg:h-[660px] shadow-2xl relative overflow-hidden">
      {/* Top Ambient Glow Line */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-sky-400 via-[#E2C275] to-[#C9A227]" />

      {/* =========================================================================
          CHAT HEADER
          ========================================================================= */}
      <div className="p-4 sm:p-5 border-b border-white/8 flex items-center justify-between flex-wrap gap-2 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-950/60 border border-sky-400/35 flex items-center justify-center text-sky-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-white font-heading">
                AuraFit AI Coach v2.4
              </h3>
              <span className="flex items-center gap-1 text-[10px] text-sky-300 font-mono font-semibold">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                ONLINE
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Clinical Sports Nutrition &amp; Supplement Formulation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex text-[10px] font-mono text-zinc-500 uppercase px-2.5 py-1 rounded bg-[#18181D] border border-white/8">
            AI Guidance · Non-Medical
          </span>
          <button
            type="button"
            onClick={handleResetChat}
            title="Reset conversation"
            className="p-2 rounded-xl text-zinc-400 hover:text-white bg-[#18181D] border border-white/8 hover:border-white/20 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          SCROLLABLE MESSAGES AREA
          ========================================================================= */}
      <div
        data-lenis-prevent
        className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-5 scrollbar-thin"
      >
        {messages.map((msg) => {
          const isAI = msg.role === "assistant";
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                isAI ? "justify-start" : "justify-end"
              }`}
            >
              {isAI && (
                <div className="w-8 h-8 rounded-full bg-sky-950/60 border border-sky-400/40 flex items-center justify-center text-sky-400 shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-3 ${
                  isAI
                    ? "bg-[#18181D] border border-white/10 text-zinc-200 shadow-md"
                    : "bg-gradient-to-r from-[#1A1710] to-[#141418] border border-[#E2C275]/40 text-white shadow-md self-end"
                }`}
              >
                {/* Message Prose */}
                <div className="whitespace-pre-line">{msg.content}</div>

                {/* Inline Product Recommendations if present */}
                {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                  <div className="pt-3 border-t border-white/8 space-y-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#E2C275] font-heading block">
                      Recommended Authentic Supplements:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {msg.recommendedProducts.map((prod) => {
                        const isAdded = !!addedIds[prod.id];
                        return (
                          <div
                            key={prod.id}
                            className="p-3 rounded-xl bg-[#0E0E12] border border-white/10 flex items-center justify-between gap-3 group"
                          >
                            <Link
                              href={`/shop/${prod.slug}`}
                              className="relative w-12 h-12 rounded-lg bg-[#141418] border border-white/8 p-1 shrink-0 overflow-hidden"
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

                <div className="text-[10px] text-zinc-500 font-mono text-right pt-0.5">
                  {msg.timestamp}
                </div>
              </div>

              {!isAI && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E5C76B] to-[#B08922] text-[#09090B] font-black text-xs flex items-center justify-center font-heading shrink-0 mt-0.5">
                  <User className="w-4 h-4 text-[#09090B]" />
                </div>
              )}
            </div>
          );
        })}

        {/* Typing Animation */}
        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-sky-950/60 border border-sky-400/40 flex items-center justify-center text-sky-400 shrink-0">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-[#18181D] border border-white/10 text-xs text-sky-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-bounce [animation-delay:0.4s]" />
              <span className="text-zinc-400 font-mono text-[11px] ml-1">
                AI Coach is analyzing clinical sports nutrition formulas...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* =========================================================================
          SUGGESTION CHIPS
          ========================================================================= */}
      <div className="px-4 py-2 border-t border-white/6 overflow-x-auto scrollbar-none flex items-center gap-2 shrink-0 bg-[#0E0E12]">
        <span className="text-[10px] uppercase font-bold text-zinc-500 font-heading shrink-0">
          Try Asking:
        </span>
        {PROMPT_CHIPS.map((chip, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleUserSend(chip)}
            className="text-[11px] text-zinc-300 hover:text-white bg-[#18181D] hover:bg-[#202028] border border-white/10 hover:border-sky-400/40 px-3 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer shrink-0 font-medium"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* =========================================================================
          INPUT BAR
          ========================================================================= */}
      <form
        onSubmit={handleFormSubmit}
        className="p-3.5 sm:p-4 border-t border-white/8 flex items-center gap-2.5 bg-[#111115] shrink-0"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask AI Coach (e.g. Best bulking stack, creatine timing, whey vs isolate)..."
          className="flex-1 bg-[#18181D] border border-white/12 focus:border-sky-400/60 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isTyping}
          className="p-3 rounded-xl bg-gradient-to-r from-sky-400 to-sky-500 hover:brightness-105 active:scale-95 disabled:opacity-40 text-[#09090B] font-bold transition-all cursor-pointer flex items-center justify-center shrink-0"
        >
          <Send className="w-4 h-4 stroke-[2.5]" />
        </button>
      </form>
    </div>
  );
}

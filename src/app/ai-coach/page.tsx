"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  Sliders,
  Plus,
  X,
} from "lucide-react";
import AthleteProfilePanel, {
  AthleteConfig,
} from "@/components/ai-coach/AthleteProfilePanel";
import AIChatWorkspace from "@/components/ai-coach/AIChatWorkspace";
import ChatHistorySidebar from "@/components/ai-coach/ChatHistorySidebar";
import { StackItem } from "@/components/ai-coach/RecommendedStackCard";
import { ChatSession, ChatMessage } from "@/components/ai-coach/types";
import { MOCK_PRODUCTS } from "@/data/mockProducts";

const STORAGE_KEY = "aurafit_ai_chats";

// Helper: Curated Master Stacks based on Goal & Budget
function resolveStack(config: AthleteConfig): {
  items: StackItem[];
  title: string;
  rationale: string;
} {
  switch (config.goal) {
    case "Lean Cutting":
      return {
        title: "Lean Cut & Vascularity",
        rationale:
          "Zero-sugar hydrolyzed whey isolate preserves lean muscle tissue during a caloric deficit, while pure micronized creatine sustains intramuscular ATP power and BCAA reduces catabolic muscle breakdown.",
        items: [
          {
            product: MOCK_PRODUCTS[1], // Dymatize ISO100
            timingBadge: "Post-Workout",
            dosageNote: "1 scoop immediately after training in 250ml cold water",
          },
          {
            product: MOCK_PRODUCTS[4], // Applied Nutrition Creatine
            timingBadge: "Daily 5g",
            dosageNote: "5 grams daily with meal to preserve lean muscle density",
          },
          {
            product: MOCK_PRODUCTS[9], // BCAA Amino
            timingBadge: "Intra-Workout",
            dosageNote: "Sip throughout fasted or high-intensity cardio sessions",
          },
        ],
      };

    case "Strength & Power":
      return {
        title: "Max Power & Explosive Force",
        rationale:
          "Combines high-stimulant citrulline malate and beta-alanine for immediate blood flow and mental drive, backed by ultra-pure whey isolate and creatine monohydrate for heavy progressive overload.",
        items: [
          {
            product: MOCK_PRODUCTS[0], // Gold Standard Isolate
            timingBadge: "Post-Workout",
            dosageNote: "1 rounded scoop within 30 minutes of lifting",
          },
          {
            product: MOCK_PRODUCTS[7], // Applied Nutrition ABE Pre-Workout
            timingBadge: "30m Pre-Workout",
            dosageNote: "1 scoop 20-30 mins prior to training for nitric oxide surge",
          },
          {
            product: MOCK_PRODUCTS[4], // Creatine
            timingBadge: "Daily 5g",
            dosageNote: "5g daily for continuous phosphocreatine resynthesis",
          },
        ],
      };

    case "Recovery":
      return {
        title: "Complete Cellular Recovery",
        rationale:
          "Engineered for high-frequency training. Paces amino acid availability across the day and replenishes micronutrients depleted through heavy sweat and fatigue in Sri Lanka's climate.",
        items: [
          {
            product: MOCK_PRODUCTS[11], // Dymatize Elite 100% Whey
            timingBadge: "Post-Workout",
            dosageNote: "1 scoop post-workout or upon waking on rest days",
          },
          {
            product: MOCK_PRODUCTS[8], // Scivation Xtend BCAA
            timingBadge: "Intra-Workout",
            dosageNote: "1 serving during training for cellular hydration",
          },
          {
            product: MOCK_PRODUCTS[10], // Opti-Men Multivitamin
            timingBadge: "Morning",
            dosageNote: "Take with breakfast for full-spectrum micronutrient support",
          },
        ],
      };

    case "Muscle Gain":
    default:
      if (config.budget === "Under Rs. 20,000") {
        return {
          title: "Hypertrophy Starter",
          rationale:
            "High-yield micronized creatine monohydrate increases cellular hydration, power output, and accelerates muscle fullness on an economical budget.",
          items: [
            {
              product: MOCK_PRODUCTS[4], // Creatine
              timingBadge: "Daily 5g",
              dosageNote: "1 scoop (5g) daily mixed with water or fruit juice",
            },
          ],
        };
      }

      if (config.budget === "Rs. 20k – 45k") {
        return {
          title: "Hypertrophy Power",
          rationale:
            "Combines 50g of clean protein with multi-source carbohydrates and 5g of pure creatine to create the ideal anabolic environment for rapid mass building.",
          items: [
            {
              product: MOCK_PRODUCTS[2], // Applied Nutrition Critical Mass
              timingBadge: "Post-Workout",
              dosageNote: "2 scoops post-workout with 400ml water or milk",
            },
            {
              product: MOCK_PRODUCTS[4], // Applied Nutrition Creatine
              timingBadge: "Daily 5g",
              dosageNote: "5g daily for progressive strength overload",
            },
          ],
        };
      }

      return {
        title: "Pro Anabolic Hypertrophy",
        rationale:
          "The complete golden trifecta: clinical pre-workout pump formula, pure micro-filtered whey isolate for zero-bloat recovery, and daily micronized creatine for continuous strength progression.",
        items: [
          {
            product: MOCK_PRODUCTS[0], // Gold Standard Isolate
            timingBadge: "Post-Workout",
            dosageNote: "1 scoop immediately after training",
          },
          {
            product: MOCK_PRODUCTS[4], // Creatine
            timingBadge: "Daily 5g",
            dosageNote: "5g daily to maximize intracellular ATP capacity",
          },
          {
            product: MOCK_PRODUCTS[6], // Cellucor C4 Pre-Workout
            timingBadge: "30m Pre-Workout",
            dosageNote: "1 scoop 20-30 mins before workout for intense laser focus",
          },
        ],
      };
  }
}

// 2 Seeded realistic chats with inline bundle in Chat 2
const SEEDED_CHATS: ChatSession[] = [
  {
    id: "session_creatine_saturation",
    title: "Creatine Saturation & Timing",
    createdAt: "Today, 10:15 AM",
    updatedAt: Date.now() - 3600000,
    messages: [
      {
        id: "msg_seed_1_q",
        role: "user",
        content: "When should I take Creatine, and do I need a loading phase?",
        timestamp: "10:15 AM",
      },
      {
        id: "msg_seed_1_a",
        role: "assistant",
        content:
          "Creatine Monohydrate works by intracellular phosphocreatine saturation rather than acute stimulation, meaning daily consistency is far more critical than exact timing.\n\nKey Clinical Protocols:\n• Daily Dosing: 5 grams (1 level scoop) daily. An aggressive loading phase (20g/day) is optional—5g daily achieves complete intramuscular saturation in 3 weeks with zero digestive distress.\n• Optimal Timing: Post-workout alongside carbohydrates or a protein shake. The post-training insulin spike enhances sodium-dependent creatine transporter (CreaT1) uptake into muscle cells.\n• Hydration: Aim for 3.5–4.0 liters of water daily in Sri Lanka's tropical climate to maintain cellular hydration.",
        timestamp: "10:15 AM",
        recommendedProducts: [MOCK_PRODUCTS[4]],
      },
    ],
  },
  {
    id: "session_hypertrophy_stack",
    title: "Hypertrophy Caloric Surplus Stack",
    createdAt: "Yesterday, 4:45 PM",
    updatedAt: Date.now() - 86400000,
    messages: [
      {
        id: "msg_seed_2_q",
        role: "user",
        content:
          "Best bulking stack under Rs. 45,000 for hardgainers struggling to gain weight?",
        timestamp: "Yesterday",
      },
      {
        id: "msg_seed_2_a",
        role: "assistant",
        content:
          "For serious hypertrophy, you need a daily caloric surplus of ~350–500 kcal combined with 1.8g to 2.2g of protein per kg of bodyweight.\n\nRecommended Strategy:\n• Primary Fuel: Critical Mass Gainer (50g protein + complex carbohydrates post-workout)\n• Cellular Volumization: 5g Micronized Creatine daily to supercharge ATP stores and muscle fullness.\n\nI have formulated your custom Hypertrophy Power Stack below with direct import batch verification:",
        timestamp: "Yesterday",
        recommendedStack: {
          title: "Hypertrophy Power",
          rationale:
            "Combines 50g of clean protein with multi-source carbohydrates and 5g of pure creatine to create the ideal anabolic environment for rapid mass building.",
          items: [
            {
              product: MOCK_PRODUCTS[2],
              timingBadge: "Post-Workout",
              dosageNote: "2 scoops post-workout with 400ml water or milk",
            },
            {
              product: MOCK_PRODUCTS[4],
              timingBadge: "Daily 5g",
              dosageNote: "5g daily for progressive strength overload",
            },
          ],
        },
      },
    ],
    recommendedStack: {
      title: "Hypertrophy Power",
      rationale:
        "Combines 50g of clean protein with multi-source carbohydrates and 5g of pure creatine to create the ideal anabolic environment for rapid mass building.",
      items: [
        {
          product: MOCK_PRODUCTS[2],
          timingBadge: "Post-Workout",
          dosageNote: "2 scoops post-workout with 400ml water or milk",
        },
        {
          product: MOCK_PRODUCTS[4],
          timingBadge: "Daily 5g",
          dosageNote: "5g daily for progressive strength overload",
        },
      ],
    },
  },
];

// Fallback AI Response Generator
function generateAIResponse(userText: string) {
  const text = userText.toLowerCase();

  if (text.includes("bulk") || text.includes("mass") || text.includes("45,000")) {
    return {
      reply:
        "For serious hypertrophy, you need a daily caloric surplus of ~350–500 kcal combined with 1.8g to 2.2g of protein per kg of bodyweight.\n\nRecommended Strategy:\n• Primary Fuel: Critical Mass Gainer (50g protein + complex carbs post-workout)\n• Cellular Volumization: 5g Micronized Creatine daily to supercharge ATP stores and muscle fullness.\n\nHere are our top direct-import options in Sri Lanka:",
      products: [MOCK_PRODUCTS[2], MOCK_PRODUCTS[4]],
    };
  }

  if (text.includes("creatine") || text.includes("when")) {
    return {
      reply:
        "Creatine Monohydrate works by saturation, meaning consistency is far more critical than exact timing.\n\nBest Practices:\n• Dosage: 5 grams daily (1 level scoop). Full muscle saturation occurs in 3 weeks at 5g/day without any gastrointestinal distress.\n• Optimal Window: Post-workout with water or mixed into your protein shake. Carbohydrates and protein trigger an insulin response that enhances cellular creatine uptake.",
      products: [MOCK_PRODUCTS[4]],
    };
  }

  if (text.includes("vs") || text.includes("difference") || text.includes("isolate")) {
    return {
      reply:
        "Key Differences:\n• 100% Whey Isolate: 25g pure protein, only ~120 calories, under 1g carbohydrates. Engineered for lean muscle preservation, cutting phases, and rapid post-workout digestion.\n• Mass Gainer: 50g protein, 100g+ complex carbs, and 650+ calories. Engineered for hardgainers struggling to meet daily calorie targets through food alone.\n\nChoose Isolate if your priority is lean definition; choose Mass Gainer if you are trying to break through a weight plateau.",
      products: [MOCK_PRODUCTS[0], MOCK_PRODUCTS[2]],
    };
  }

  if (
    text.includes("pre-workout") ||
    text.includes("evening") ||
    text.includes("energy") ||
    text.includes("pump")
  ) {
    return {
      reply:
        "If training after 6:00 PM, be mindful of caffeine half-life (typically 5 to 7 hours).\n\nRecommendations:\n• Take 20–30 minutes before your first working set with 250ml cold water.\n• For evening workouts, start with half a scoop to gauge sleep impact while still enjoying clinical beta-alanine tingles and L-Citrulline nitric oxide pumps.\n\nBoth formulas below are factory-sealed with QR laboratory batch tracking:",
      products: [MOCK_PRODUCTS[6], MOCK_PRODUCTS[7]],
    };
  }

  if (
    text.includes("recover") ||
    text.includes("sore") ||
    text.includes("bcaa") ||
    text.includes("amino")
  ) {
    return {
      reply:
        "Muscle repair requires both essential amino acids (EAAs/BCAAs) and deep restorative hydration.\n\nRecommendations:\n• Intra-Workout: Sip 1 scoop of BCAAs with cold water to attenuate muscle protein breakdown (proteolysis) during demanding training.\n• Post-Workout: 1 scoop of Whey Isolate within 45 minutes to spike protein synthesis.\n• Daily Micronutrients: High-potency vitamins and minerals to restore zinc and magnesium depleted through heavy sweat in Sri Lanka.",
      products: [MOCK_PRODUCTS[9], MOCK_PRODUCTS[10]],
    };
  }

  if (text.includes("diagnostic scan") || text.includes("biometric") || text.includes("goal:")) {
    return {
      reply:
        "I have analyzed your athlete biometrics against our laboratory-verified catalog.\n\nTargeted Protocol:\n• Target 1.6g–2.2g of protein per kg of bodyweight paced across 3–4 meals.\n• Your primary stack below pairs rapid-digesting protein with ATP creatine regeneration to maximize protein synthesis within 45 minutes of training.",
      products: [MOCK_PRODUCTS[0], MOCK_PRODUCTS[4]],
    };
  }

  return {
    reply:
      "Great question! Optimal supplementation is built upon three pillars: consistent protein pacing every 3–4 hours, proven strength enhancers like Creatine Monohydrate, and adequate electrolyte recovery in tropical climates like Sri Lanka.\n\nHere are our highest-rated imported supplements suited for your athletic goals:",
    products: [MOCK_PRODUCTS[0], MOCK_PRODUCTS[4]],
  };
}

export default function AICoachPage() {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    if (typeof window === "undefined") return SEEDED_CHATS;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Failed to load chat history from localStorage", e);
    }
    return SEEDED_CHATS;
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    if (typeof window === "undefined") return SEEDED_CHATS[0].id;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed[0].id;
        }
      }
    } catch {
      // fallback
    }
    return SEEDED_CHATS[0].id;
  });

  const [activeTab, setActiveTab] = useState<"history" | "builder">("history");
  const [isTyping, setIsTyping] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Sync to localStorage
  const persistSessions = (updated: ChatSession[]) => {
    setSessions(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save chat history to localStorage", e);
    }
  };

  const activeSession =
    sessions.find((s) => s.id === activeSessionId) || sessions[0];

  // Action: Create New Chat
  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: `session_${Date.now()}`,
      title: "New Consultation",
      createdAt: "Just now",
      updatedAt: Date.now(),
      messages: [],
    };

    const updated = [newSession, ...sessions];
    persistSessions(updated);
    setActiveSessionId(newSession.id);
    setActiveTab("history");
    setMobileSidebarOpen(false);
  };

  // Action: Delete Session
  const handleDeleteSession = (id: string) => {
    const remaining = sessions.filter((s) => s.id !== id);
    if (remaining.length === 0) {
      const fresh: ChatSession = {
        id: `session_${Date.now()}`,
        title: "New Consultation",
        createdAt: "Just now",
        updatedAt: Date.now(),
        messages: [],
      };
      persistSessions([fresh]);
      setActiveSessionId(fresh.id);
    } else {
      persistSessions(remaining);
      if (activeSessionId === id) {
        setActiveSessionId(remaining[0].id);
      }
    }
  };

  // Action: Send Message
  const handleSendMessage = (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: "user",
      content: text.trim(),
      timestamp: "Just now",
    };

    const isFirstQuery =
      activeSession.title === "New Consultation" ||
      activeSession.messages.filter((m) => m.role === "user").length === 0;

    const newTitle = isFirstQuery
      ? text.length > 34
        ? `${text.substring(0, 34).trim()}...`
        : text
      : activeSession.title;

    const updatedMessages = [...activeSession.messages, userMsg];

    const updatedSession: ChatSession = {
      ...activeSession,
      title: newTitle,
      updatedAt: Date.now(),
      messages: updatedMessages,
    };

    const newSessions = sessions.map((s) =>
      s.id === activeSession.id ? updatedSession : s
    );
    persistSessions(newSessions);

    // AI Response Simulation
    setIsTyping(true);
    setTimeout(() => {
      const response = generateAIResponse(text);
      const assistantMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: "assistant",
        content: response.reply,
        timestamp: "Just now",
        recommendedProducts: response.products,
      };

      const finalMessages = [...updatedMessages, assistantMsg];
      const finalSession: ChatSession = {
        ...updatedSession,
        updatedAt: Date.now(),
        messages: finalMessages,
      };

      const finalSessions = sessions.map((s) =>
        s.id === activeSession.id ? finalSession : s
      );
      persistSessions(finalSessions);
      setIsTyping(false);
    }, 700);
  };

  // Action: Generate Stack from AthleteProfilePanel
  const handleGenerateStack = (config: AthleteConfig) => {
    const stack = resolveStack(config);

    const scanSummary = `[Diagnostic Scan: Goal: ${config.goal}, Weight: ${config.weightKg}kg, Height: ${config.heightCm}cm, Frequency: ${config.frequency}, Budget: ${config.budget}]. Generate tailored advice and matching stack recommendations.`;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: "user",
      content: scanSummary,
      timestamp: "Just now",
    };

    const aiMsg: ChatMessage = {
      id: `ai_${Date.now()}`,
      role: "assistant",
      content: `I've analyzed your athlete biometrics (${config.weightKg}kg, ${config.heightCm}cm, training ${config.frequency}) and formulated your custom ${stack.title} stack below.\n\n${stack.rationale}\n\nAll items below are guaranteed authentic with direct QR batch verification.`,
      timestamp: "Just now",
      recommendedStack: stack,
    };

    const stackTitle = `${stack.title} Stack`;

    const updatedSession: ChatSession = {
      ...activeSession,
      title: stackTitle,
      updatedAt: Date.now(),
      messages: [...activeSession.messages, userMsg, aiMsg],
      recommendedStack: stack,
    };

    const updatedSessions = sessions.map((s) =>
      s.id === activeSession.id ? updatedSession : s
    );

    persistSessions(updatedSessions);
    setActiveTab("history");
    setMobileSidebarOpen(false);
  };

  return (
    <div className="w-full bg-[#09090B] text-white">
      {/* =========================================================================
          FULL-VIEWPORT APP SHELL CONTAINER (Zero Outer Page Scroll Lag)
          ========================================================================= */}
      <div className="max-w-[1440px] w-full mx-auto px-2 sm:px-4 lg:px-6 pt-3 pb-4 lg:h-[calc(100vh-125px)] lg:min-h-[620px] flex flex-col">
        {/* Single Rounded Unified Workspace Frame */}
        <div className="bg-[#0E0E12] border border-white/10 rounded-2xl flex overflow-hidden h-full flex-1 shadow-2xl relative">
          {/* =====================================================================
              LEFT SIDEBAR (Desktop: w-72 shrink-0 border-r border-white/8 bg-[#111115])
              ===================================================================== */}
          <aside className="w-72 shrink-0 border-r border-white/8 bg-[#111115] flex flex-col hidden lg:flex h-full select-none">
            {/* Top 2-Tab Switcher & New Chat Button */}
            <div className="p-3 border-b border-white/8 space-y-2 shrink-0 bg-[#0E0E12]">
              <div className="bg-[#181820] p-1 rounded-xl flex items-center gap-1 border border-white/6">
                <button
                  type="button"
                  onClick={() => setActiveTab("history")}
                  className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-xs font-heading uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === "history"
                      ? "bg-[#22222D] text-sky-300 border border-sky-400/30 shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chats</span>
                  <span className="text-[10px] font-mono px-1 rounded bg-black/40 text-zinc-400">
                    {sessions.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("builder")}
                  className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-xs font-heading uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === "builder"
                      ? "bg-[#22222D] text-[#E2C275] border border-[#E2C275]/30 shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Builder</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleNewChat}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-sky-500/15 to-sky-400/10 border border-sky-400/30 text-sky-300 hover:border-sky-400 hover:text-white hover:bg-sky-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer font-heading uppercase text-xs tracking-wider font-bold shadow-sm"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>New Chat</span>
              </button>
            </div>

            {/* Sidebar Body */}
            {activeTab === "history" ? (
              <ChatHistorySidebar
                sessions={sessions}
                activeSessionId={activeSession.id}
                onSelectSession={(id) => setActiveSessionId(id)}
                onDeleteSession={handleDeleteSession}
              />
            ) : (
              <AthleteProfilePanel
                onGenerateStack={handleGenerateStack}
                isGenerating={isTyping}
              />
            )}
          </aside>

          {/* =====================================================================
              RIGHT MAIN CHAT AREA (flex-1 flex flex-col min-w-0 bg-[#0B0B0E])
              ===================================================================== */}
          <main className="flex-1 flex flex-col min-w-0 bg-[#0B0B0E] h-full overflow-hidden">
            <AIChatWorkspace
              session={activeSession}
              onSendMessage={handleSendMessage}
              isTyping={isTyping}
              onSwitchToStackBuilder={() => {
                setActiveTab("builder");
                setMobileSidebarOpen(true);
              }}
              onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
              onNewChat={handleNewChat}
            />
          </main>

          {/* =====================================================================
              MOBILE SLIDE-OVER DRAWER (For screen sizes < lg)
              ===================================================================== */}
          {mobileSidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden flex">
              {/* Backdrop */}
              <div
                onClick={() => setMobileSidebarOpen(false)}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
              />

              {/* Drawer Container */}
              <div className="relative w-80 max-w-[85vw] bg-[#111115] border-r border-white/10 h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-left duration-200">
                <div className="p-3.5 border-b border-white/8 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-white font-heading">
                    AuraFit Workspace
                  </span>
                  <button
                    type="button"
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-1 rounded-lg text-zinc-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Mobile Tab Switcher */}
                <div className="p-3 border-b border-white/8 space-y-2 bg-[#0E0E12]">
                  <div className="bg-[#181820] p-1 rounded-xl flex items-center gap-1 border border-white/6">
                    <button
                      type="button"
                      onClick={() => setActiveTab("history")}
                      className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-xs font-heading uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                        activeTab === "history"
                          ? "bg-[#22222D] text-sky-300 border border-sky-400/30"
                          : "text-zinc-400"
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chats ({sessions.length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("builder")}
                      className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-xs font-heading uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                        activeTab === "builder"
                          ? "bg-[#22222D] text-[#E2C275] border border-[#E2C275]/30"
                          : "text-zinc-400"
                      }`}
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Builder</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleNewChat}
                    className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-sky-500/15 to-sky-400/10 border border-sky-400/30 text-sky-300 hover:border-sky-400 hover:text-white font-heading uppercase text-xs tracking-wider font-bold flex items-center justify-center gap-2"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>New Chat</span>
                  </button>
                </div>

                {/* Mobile Drawer Body */}
                <div className="flex-1 overflow-hidden flex flex-col">
                  {activeTab === "history" ? (
                    <ChatHistorySidebar
                      sessions={sessions}
                      activeSessionId={activeSession.id}
                      onSelectSession={(id) => {
                        setActiveSessionId(id);
                        setMobileSidebarOpen(false);
                      }}
                      onDeleteSession={handleDeleteSession}
                    />
                  ) : (
                    <AthleteProfilePanel
                      onGenerateStack={handleGenerateStack}
                      isGenerating={isTyping}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

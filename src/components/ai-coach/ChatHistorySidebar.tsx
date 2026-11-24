"use client";

import React from "react";
import { MessageSquare, Trash2, Sparkles, Clock } from "lucide-react";
import { ChatSession } from "./types";

interface ChatHistorySidebarProps {
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
}

export default function ChatHistorySidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onDeleteSession,
}: ChatHistorySidebarProps) {
  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onDeleteSession(id);
  };

  if (sessions.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 text-center text-zinc-500 space-y-2">
        <Sparkles className="w-5 h-5 text-zinc-600" />
        <p className="text-xs">No saved consultations.</p>
      </div>
    );
  }

  return (
    <div
      data-lenis-prevent
      className="flex-1 overflow-y-auto overscroll-contain custom-scrollbar p-2 space-y-1"
    >
      {sessions.map((session) => {
        const isActive = session.id === activeSessionId;
        return (
          <div
            key={session.id}
            onClick={() => onSelectSession(session.id)}
            className={`group w-full text-left px-3 py-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-2 select-none ${
              isActive
                ? "bg-sky-400/10 text-sky-300 font-medium"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <MessageSquare
                className={`w-3.5 h-3.5 shrink-0 ${
                  isActive ? "text-sky-400" : "text-zinc-500 group-hover:text-zinc-400"
                }`}
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs truncate font-heading tracking-wide">
                  {session.title || "Consultation"}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-mono">
                  <Clock className="w-2.5 h-2.5" />
                  <span>{session.createdAt}</span>
                  {session.recommendedStack && (
                    <span className="text-[#E2C275] text-[9px] font-sans font-semibold">
                      • Stack
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Hover Delete Button */}
            <button
              type="button"
              onClick={(e) => handleDelete(e, session.id)}
              title="Delete consultation"
              className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-zinc-500 hover:text-red-400 hover:bg-red-950/40 transition-all cursor-pointer shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import React from "react";
import { Clock, MapPin, CheckCircle2, CircleDot } from "lucide-react";
import { TimelineEvent } from "@/data/orderTrackingRegistry";

interface ShipmentTimelineProps {
  timeline: TimelineEvent[];
}

export default function ShipmentTimeline({ timeline }: ShipmentTimelineProps) {
  return (
    <div className="bg-[#111115] border border-white/8 rounded-2xl p-6 sm:p-7 space-y-6 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-white/8">
        <div>
          <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-white font-heading">
            Live Courier Checkpoints &amp; Manifest Log
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Real-time scans from Sri Lanka logistics facilities and field dispatchers
          </p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#181820] text-sky-300 border border-sky-400/25">
          LIVE FEED
        </span>
      </div>

      {/* Vertical Timeline */}
      <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-sky-400 before:via-white/15 before:to-white/5">
        {timeline.map((event) => {
          const isCurrent = !!event.isCurrent;
          return (
            <div key={event.id} className="relative group">
              {/* Timeline Marker Node */}
              <div
                className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  isCurrent
                    ? "bg-sky-400 text-[#09090B] ring-4 ring-sky-400/25 shadow-[0_0_15px_rgba(56,189,248,0.8)]"
                    : "bg-[#181820] border border-white/20 text-[#E2C275]"
                }`}
              >
                {isCurrent ? (
                  <CircleDot className="w-3.5 h-3.5 animate-pulse" />
                ) : (
                  <CheckCircle2 className="w-3 h-3 text-[#E2C275]" />
                )}
              </div>

              {/* Event Content */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  isCurrent
                    ? "bg-[#141A22] border-sky-400/40 shadow-[0_0_20px_rgba(56,189,248,0.08)]"
                    : "bg-[#0E0E12] border-white/6 hover:border-white/15"
                }`}
              >
                {/* Header: Location & Timestamp */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-white/6">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-sky-300 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>{event.location}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-mono">
                    <Clock className="w-3 h-3 text-zinc-500" />
                    <span>{event.timestamp}</span>
                  </div>
                </div>

                {/* Body: Title & Details */}
                <div className="pt-2 space-y-1">
                  <h4 className="text-sm font-bold uppercase tracking-wide text-white font-heading">
                    {event.title}
                  </h4>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


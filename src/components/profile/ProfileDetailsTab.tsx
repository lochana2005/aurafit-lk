"use client";

import React, { useState } from "react";
import { User, Mail, Phone, Target, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { UserProfile, useAuth } from "@/context/AuthContext";

interface ProfileDetailsTabProps {
  user: UserProfile;
}

const FITNESS_GOALS = [
  "Muscle Gain",
  "Lean Cutting",
  "Strength & Power",
  "General Wellness",
] as const;

export default function ProfileDetailsTab({ user }: ProfileDetailsTabProps) {
  const { updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    fitnessGoal: user.fitnessGoal,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage(false);

    await new Promise((resolve) => setTimeout(resolve, 600));

    updateProfile(formData);
    setIsSaving(false);
    setSuccessMessage(true);

    setTimeout(() => {
      setSuccessMessage(false);
    }, 4000);
  };

  return (
    <div className="bg-[#141418] rounded-2xl border border-white/8 p-6 sm:p-8 shadow-xl space-y-6">
      {/* Tab Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/8">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-wider text-white font-heading">
            Personal Athlete Profile
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage your athlete details, contact information, and training target
          </p>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1C1C22] border border-white/10 text-[11px] font-mono text-[#E2C275]">
          <Sparkles className="w-3.5 h-3.5" />
          Member Since {user.memberSince}
        </span>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Your athlete profile details have been saved successfully.</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#E2C275]" />
              <span>Full Name</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#0E0E12] border border-white/12 focus:border-[#E2C275] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
            />
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#E2C275]" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-[#0E0E12] border border-white/12 focus:border-[#E2C275] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
            />
          </div>

          {/* Mobile Number */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#E2C275]" />
              <span>Mobile Number</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-xs font-mono font-bold text-zinc-400 border-r border-white/10 pr-2 pointer-events-none">
                +94
              </span>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full pl-16 pr-4 py-3 bg-[#0E0E12] border border-white/12 focus:border-[#E2C275] rounded-xl text-sm text-white font-mono focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Fitness Goal */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-[#E2C275]" />
              <span>Current Training Goal</span>
            </label>
            <select
              value={formData.fitnessGoal}
              onChange={(e) => setFormData({ ...formData, fitnessGoal: e.target.value })}
              className="w-full bg-[#0E0E12] border border-white/12 focus:border-[#E2C275] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors cursor-pointer"
            >
              {FITNESS_GOALS.map((goal) => (
                <option key={goal} value={goal} className="bg-[#141418] text-white py-1">
                  {goal}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Member Account ID Information */}
        <div className="p-4 rounded-xl bg-[#0E0E12] border border-white/6 flex items-center justify-between text-xs text-zinc-400">
          <div>
            <span className="text-zinc-500 block text-[11px]">Vault Account ID</span>
            <span className="font-mono text-white font-semibold">{user.id}</span>
          </div>
          <div className="text-right">
            <span className="text-zinc-500 block text-[11px]">Security Tier</span>
            <span className="text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
              2FA Verified
            </span>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold uppercase tracking-wider text-[#09090B] bg-gradient-to-r from-[#E5C76B] via-[#C9A227] to-[#B08922] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] hover:brightness-105 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer font-heading text-xs sm:text-sm"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#09090B]" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}


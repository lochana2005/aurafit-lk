"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  Target,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const FITNESS_GOALS = [
  "Muscle Gain",
  "Lean Cutting",
  "Strength & Power",
  "General Wellness",
] as const;

export default function RegisterPage() {
  const router = useRouter();
  const { register, loginWithGoogle, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    fitnessGoal: "Muscle Gain",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect to profile
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push("/profile");
    }
  }, [isAuthenticated, router]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      errs.fullName = "Please enter your full name";
    }

    if (
      !formData.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      errs.email = "Please enter a valid email address";
    }

    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length < 9) {
      errs.phone = "Please enter a valid 9-digit mobile number";
    }

    if (!formData.password || formData.password.length < 6) {
      errs.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await register({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        fitnessGoal: formData.fitnessGoal,
        password: formData.password,
      });
      router.push("/profile");
    } catch {
      setErrors({ form: "Registration failed. Please try again." });
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      router.push("/profile");
    } catch {
      setErrors({ form: "Google registration failed. Please try again." });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-12 bg-[#09090B]">
      <div className="max-w-lg w-full bg-[#111115] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Top Gold Shimmer Border */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#E5C76B] via-[#C9A227] to-[#B08922]" />

        {/* Brand Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A1710] border border-[#E2C275]/30 text-[11px] font-bold text-[#E2C275] tracking-widest uppercase font-heading">
            <Sparkles className="w-3 h-3 text-[#E2C275]" />
            <span>Vault Membership Registration</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-heading">
            JOIN THE VAULT
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-sm mx-auto">
            Create your account to unlock manufacturer-direct pricing, automated QR
            verification tracking, and express courier dispatch.
          </p>
        </div>

        {errors.form && (
          <div className="mb-5 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300">
            {errors.form}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#E2C275]" />
              <span>Full Name *</span>
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              placeholder="e.g. Kasun Perera"
              className={`w-full bg-[#0E0E12] border rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none transition-colors ${
                errors.fullName
                  ? "border-red-500/80 focus:border-red-500"
                  : "border-white/12 focus:border-[#E2C275]"
              }`}
            />
            {errors.fullName && (
              <p className="text-[11px] text-red-400 pl-1">{errors.fullName}</p>
            )}
          </div>

          {/* Email & Phone 2-Col Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#E2C275]" />
                <span>Email Address *</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="name@example.com"
                className={`w-full bg-[#0E0E12] border rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none transition-colors ${
                  errors.email
                    ? "border-red-500/80 focus:border-red-500"
                    : "border-white/12 focus:border-[#E2C275]"
                }`}
              />
              {errors.email && (
                <p className="text-[11px] text-red-400 pl-1">{errors.email}</p>
              )}
            </div>

            {/* Mobile Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#E2C275]" />
                <span>Mobile Number *</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-xs font-mono font-bold text-zinc-400 border-r border-white/10 pr-2 pointer-events-none">
                  +94
                </span>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="77 123 4567"
                  className={`w-full pl-16 pr-4 py-3 bg-[#0E0E12] border rounded-xl text-sm text-white placeholder:text-zinc-500 focus:outline-none font-mono transition-colors ${
                    errors.phone
                      ? "border-red-500/80 focus:border-red-500"
                      : "border-white/12 focus:border-[#E2C275]"
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="text-[11px] text-red-400 pl-1">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Fitness Goal Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-[#E2C275]" />
              <span>Primary Fitness Goal *</span>
            </label>
            <select
              value={formData.fitnessGoal}
              onChange={(e) => handleChange("fitnessGoal", e.target.value)}
              className="w-full bg-[#0E0E12] border border-white/12 focus:border-[#E2C275] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors cursor-pointer"
            >
              {FITNESS_GOALS.map((goal) => (
                <option
                  key={goal}
                  value={goal}
                  className="bg-[#141418] text-white py-1"
                >
                  {goal}
                </option>
              ))}
            </select>
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#E2C275]" />
                <span>Password *</span>
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="At least 6 chars"
                  className={`w-full bg-[#0E0E12] border rounded-xl pl-4 pr-11 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none transition-colors ${
                    errors.password
                      ? "border-red-500/80 focus:border-red-500"
                      : "border-white/12 focus:border-[#E2C275]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-zinc-400 hover:text-white transition-colors cursor-pointer p-1"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-red-400 pl-1">{errors.password}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                Confirm Password *
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                placeholder="Confirm password"
                className={`w-full bg-[#0E0E12] border rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none transition-colors ${
                  errors.confirmPassword
                    ? "border-red-500/80 focus:border-red-500"
                    : "border-white/12 focus:border-[#E2C275]"
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-[11px] text-red-400 pl-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Member Benefits Note */}
          <div className="p-3 rounded-xl bg-[#141418] border border-white/6 flex items-center gap-2.5 text-xs text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-[#E2C275] shrink-0" />
            <span>Includes 100% authenticity guarantee &amp; verified batch tracking.</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl font-bold uppercase tracking-wider text-[#09090B] bg-gradient-to-r from-[#E5C76B] via-[#C9A227] to-[#B08922] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] hover:brightness-105 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer font-heading text-xs sm:text-sm mt-3"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#09090B]" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Vault Account</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <span className="relative px-3 bg-[#111115] text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            or register with
          </span>
        </div>

        {/* Google Registration Button */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={isSubmitting}
          className="w-full py-3 rounded-xl bg-[#18181D] hover:bg-[#202026] border border-white/10 hover:border-white/20 text-white font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-3 cursor-pointer active:scale-95"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Login Link */}
        <div className="mt-6 pt-5 border-t border-white/8 text-center text-xs text-zinc-400">
          <span>Already have a Vault account? </span>
          <Link
            href="/login"
            className="text-[#E2C275] font-bold hover:underline font-heading uppercase tracking-wider"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}


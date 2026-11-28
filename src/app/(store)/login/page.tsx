"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect to profile
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push("/profile");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }
    if (!password) {
      setError("Please enter your password");
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      router.push("/profile");
    } catch {
      setError("Failed to sign in. Please check your credentials.");
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      router.push("/profile");
    } catch {
      setError("Google sign in failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  const autofillDemo = () => {
    setEmail("kasun.perera@aurafit.lk");
    setPassword("AuraFit2026!");
    setError(null);
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-12 bg-[#09090B]">
      <div className="max-w-md w-full bg-[#111115] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Top Gold Shimmer Border */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#E5C76B] via-[#C9A227] to-[#B08922]" />

        {/* Brand Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A1710] border border-[#E2C275]/30 text-[11px] font-bold text-[#E2C275] tracking-widest uppercase font-heading">
            <Sparkles className="w-3 h-3 text-[#E2C275]" />
            <span>AuraFit Vault Access</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-heading">
            WELCOME BACK
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xs mx-auto">
            Sign in to access your verified batch orders, saved stacks, and athlete rewards.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#E2C275]" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. athlete@aurafit.lk"
              className="w-full bg-[#0E0E12] border border-white/12 focus:border-[#E2C275] rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#E2C275]" />
                <span>Password</span>
              </label>
              <button
                type="button"
                onClick={() => alert("Password reset link has been dispatched to your email.")}
                className="text-[11px] font-semibold text-[#E2C275] hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-[#0E0E12] border border-white/12 focus:border-[#E2C275] rounded-xl pl-4 pr-11 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3.5 text-zinc-400 hover:text-white transition-colors cursor-pointer p-1"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-zinc-300">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-[#E2C275] w-4 h-4 rounded cursor-pointer"
              />
              <span>Remember me on this device</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl font-bold uppercase tracking-wider text-[#09090B] bg-gradient-to-r from-[#E5C76B] via-[#C9A227] to-[#B08922] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] hover:brightness-105 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer font-heading text-xs sm:text-sm mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#09090B]" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <span>Sign In to Vault</span>
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
            or continue with
          </span>
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
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

        {/* Demo Account Quick-Fill Pill */}
        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={autofillDemo}
            className="text-[11px] text-zinc-400 hover:text-[#E2C275] bg-[#18181D] border border-white/8 hover:border-[#E2C275]/40 px-3 py-1.5 rounded-full transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#E2C275]" />
            <span>Click to Autofill Demo Athlete Account</span>
          </button>
        </div>

        {/* Register Link */}
        <div className="mt-6 pt-5 border-t border-white/8 text-center text-xs text-zinc-400">
          <span>Don&apos;t have an account yet? </span>
          <Link
            href="/register"
            className="text-[#E2C275] font-bold hover:underline font-heading uppercase tracking-wider"
          >
            Create Vault Account
          </Link>
        </div>
      </div>
    </div>
  );
}


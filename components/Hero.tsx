"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function Hero() {
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            prompt: "select_account",
            access_type: "offline",
          },
        },
      });
      if (error) {
        console.error("Google login error:", error.message);
        setGoogleLoading(false);
      }
    } catch (err: any) {
      console.error("Google authentication error:", err);
      setGoogleLoading(false);
    }
  };

  return (
    <section id="search" className="relative pt-14 pb-[60px] sm:pt-16 sm:pb-[72px] lg:pt-18 lg:pb-[72px] bg-[#09090b] overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Eyebrow */}
        <div className="text-[12px] font-normal tracking-[0.04em] uppercase text-neutral-400 mb-4 sm:mb-5">
          AI-POWERED PHONE INTELLIGENCE
        </div>

        {/* Headline: Degular Display, weight 500, exact responsive scaling & text-balance */}
        <h1 className="font-display font-[500] text-[40px] sm:text-[48px] lg:text-[56px] leading-[1.05] tracking-[-0.015em] text-white max-w-[768px] mx-auto text-balance mb-5 sm:mb-6">
          Search One Number. Find More.
        </h1>

        {/* Subheading: exactly 2 lines as shown */}
        <p className="font-normal text-[15px] sm:text-[16px] text-neutral-300 max-w-2xl mx-auto leading-[1.5] mb-8 sm:mb-9 text-balance">
          Search phone intelligence with one simple query and uncover real identity,{" "}
          <br className="hidden md:inline" />
          social records, location, carrier, and connected data instantly.
        </p>

        {/* Dual CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-10 sm:mb-12">
          <Link
            href="/signup"
            className="w-full sm:w-auto h-12 px-7 rounded-md bg-[#1C4D8D] hover:bg-[#153a6b] text-white font-semibold text-sm sm:text-[15px] flex items-center justify-center transition-all shadow-xs cursor-pointer"
          >
            Start free with email
          </Link>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full sm:w-auto h-12 px-6 rounded-md border border-neutral-700 bg-neutral-900/80 hover:bg-neutral-800 disabled:opacity-60 text-white font-semibold text-sm sm:text-[15px] flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-xs"
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
            ) : (
              /* Google Multi-Color G Icon */
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
            )}
            <span>{googleLoading ? "Connecting..." : "Start free with Google"}</span>
          </button>
        </div>

        {/* Trust & Compliance Line */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] sm:text-xs font-semibold text-neutral-400 tracking-wider uppercase">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-neutral-400" />
            <span>SOC 2 (TYPE II)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg
              className="w-4 h-4 text-neutral-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span>GDPR + CCPA COMPLIANT</span>
          </div>
        </div>
      </div>
    </section>
  );
}

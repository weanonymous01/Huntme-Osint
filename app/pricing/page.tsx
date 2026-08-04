'use client';

import React from 'react';
import { Header } from '@/components/ui/header-3';
import { Footer } from '@/components/ui/footer';
import { Check, ArrowRight } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-zinc-800 selection:text-white">
      <Header />
      
      <main className="grow py-16 px-4 md:py-24">
        <div className="mx-auto max-w-5xl space-y-12">
          {/* Header Section */}
          <div className="flex flex-col items-center text-center gap-4 max-w-2xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
              Simple, Transparent Pricing
            </h1>
            <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">
              Choose the right plan for AI-powered OSINT searches and enterprise investigation workflows.
            </p>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto pt-4 items-stretch">
            
            {/* Plan 1: Pro */}
            <div className="rounded-2xl border border-zinc-800/90 bg-[#0d0d0e] p-8 flex flex-col justify-between shadow-2xl transition-all duration-300 hover:border-zinc-700">
              <div>
                {/* Plan Header */}
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold text-zinc-400 tracking-widest uppercase">
                    PRO
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold tracking-tight text-white">
                      ₹79
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 font-medium leading-relaxed">
                    Best for casual users and occasional investigations.
                  </p>
                </div>

                {/* Divider */}
                <div className="border-b border-zinc-800/80 my-6" />

                {/* Features List */}
                <div className="space-y-4">
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Includes
                  </p>
                  <ul className="space-y-3.5 text-sm">
                    <li className="flex items-center gap-3 text-zinc-200">
                      <Check className="size-4 text-zinc-400 shrink-0" />
                      <span className="font-semibold text-white">100 Credits</span>
                    </li>
                    <li className="flex items-center gap-3 text-zinc-300">
                      <Check className="size-4 text-zinc-400 shrink-0" />
                      <span>Phone Intelligence</span>
                    </li>
                    <li className="flex items-center gap-3 text-zinc-300">
                      <Check className="size-4 text-zinc-400 shrink-0" />
                      <span>Vehicle Intelligence</span>
                    </li>
                    <li className="flex items-center gap-3 text-zinc-300">
                      <Check className="size-4 text-zinc-400 shrink-0" />
                      <span>AI Case Assistant</span>
                    </li>
                    <li className="flex items-center gap-3 text-zinc-300">
                      <Check className="size-4 text-zinc-400 shrink-0" />
                      <span>Investigation Reports</span>
                    </li>
                    <li className="flex items-center gap-3 text-zinc-300">
                      <Check className="size-4 text-zinc-400 shrink-0" />
                      <span>Export Reports</span>
                    </li>
                    <li className="flex items-center gap-3 text-zinc-300">
                      <Check className="size-4 text-zinc-400 shrink-0" />
                      <span>Email Support</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-8">
                <a
                  href="/login"
                  className="w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/80 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all text-sm shadow-md"
                >
                  <span>Get Started</span>
                  <ArrowRight className="size-4" />
                </a>
              </div>
            </div>

            {/* Plan 2: Premium (Highlighted) */}
            <div className="rounded-2xl border border-zinc-700 bg-[#0d0d0e] p-8 flex flex-col justify-between shadow-2xl transition-all duration-300 hover:border-zinc-600 relative">
              
              {/* Most Popular Badge */}
              <div className="absolute -top-3.5 right-6 bg-zinc-800 border border-zinc-700 text-zinc-300 text-[11px] font-semibold px-3 py-1 rounded-full shadow-lg font-mono tracking-wider">
                MOST POPULAR
              </div>

              <div>
                {/* Plan Header */}
                <div className="space-y-4 pt-1">
                  <h3 className="text-xs font-semibold text-zinc-300 tracking-widest uppercase flex items-center gap-2">
                    PREMIUM
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold tracking-tight text-white">
                      ₹499
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 font-medium leading-relaxed">
                    Best Value for professionals and power users.
                  </p>
                </div>

                {/* Divider */}
                <div className="border-b border-zinc-800/80 my-6" />

                {/* Features List */}
                <div className="space-y-4">
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Includes
                  </p>
                  <ul className="space-y-3.5 text-sm">
                    <li className="flex items-center gap-3 text-zinc-200">
                      <Check className="size-4 text-white shrink-0" />
                      <span className="font-bold text-white">1,000 Credits</span>
                    </li>

                    <li className="flex items-center gap-3 text-zinc-200">
                      <Check className="size-4 text-white shrink-0" />
                      <span className="font-semibold text-white">Everything in Pro</span>
                    </li>
                    <li className="flex items-center gap-3 text-zinc-300">
                      <Check className="size-4 text-zinc-400 shrink-0" />
                      <span>Faster Processing</span>
                    </li>
                    <li className="flex items-center gap-3 text-zinc-300">
                      <Check className="size-4 text-zinc-400 shrink-0" />
                      <span>Priority Support</span>
                    </li>
                    <li className="flex items-center gap-3 text-zinc-300">
                      <Check className="size-4 text-zinc-400 shrink-0" />
                      <span>Early Access to New Features</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-8">
                <a
                  href="/login"
                  className="w-full bg-white hover:bg-zinc-200 text-black font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm shadow-xl"
                >
                  <span>Upgrade to Premium</span>
                  <ArrowRight className="size-4" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

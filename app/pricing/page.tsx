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
              Simple Pricing
            </h1>
            <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">
              Choose the right plan for AI-powered OSINT searches and investigation workflows.
            </p>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto pt-4">
            {/* Plan 1: Monthly */}
            <div className="rounded-2xl border border-zinc-800/90 bg-[#0d0d0e] p-8 flex flex-col justify-between shadow-2xl transition-all duration-300 hover:border-zinc-700">
              <div>
                {/* Plan Header */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-zinc-200 tracking-wider uppercase">
                    MONTHLY
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl sm:text-6xl font-medium tracking-tight text-white">
                      ₹79
                    </span>
                    <span className="text-sm text-zinc-400 font-normal">
                      /month
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400">
                    Ideal for recurring investigations.
                  </p>
                </div>

                {/* Divider */}
                <div className="border-b border-zinc-800/80 my-8" />

                {/* Features List */}
                <div className="space-y-4">
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Includes
                  </p>
                  <ul className="space-y-4 text-sm">
                    <li className="flex items-center gap-3 text-zinc-200">
                      <Check className="size-4 text-zinc-300 shrink-0" />
                      <span>100 Credits</span>
                    </li>
                    <li className="flex items-center gap-3 text-zinc-200">
                      <Check className="size-4 text-zinc-300 shrink-0" />
                      <span>Phone Intelligence</span>
                    </li>
                    <li className="flex items-center gap-3 text-zinc-200">
                      <Check className="size-4 text-zinc-300 shrink-0" />
                      <span>Vehicle Intelligence</span>
                    </li>
                    <li className="flex items-center gap-3 text-zinc-200">
                      <Check className="size-4 text-zinc-300 shrink-0" />
                      <span>AI Case Assistant</span>
                    </li>
                    <li className="flex items-center gap-3 text-zinc-200">
                      <Check className="size-4 text-zinc-300 shrink-0" />
                      <span>Investigation Reports</span>
                    </li>
                    <li className="flex items-center gap-3 text-zinc-200">
                      <Check className="size-4 text-zinc-300 shrink-0" />
                      <span>Export Reports</span>
                    </li>
                    <li className="flex items-center gap-3 text-zinc-200">
                      <Check className="size-4 text-zinc-300 shrink-0" />
                      <span>Email Support</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-8">
                <a
                  href="/login"
                  className="w-full bg-white hover:bg-zinc-200 text-black font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
                >
                  <span>Get Started</span>
                  <ArrowRight className="size-4" />
                </a>
              </div>
            </div>

            {/* Plan 2: Lifetime */}
            <div className="rounded-2xl border border-zinc-800/90 bg-[#0d0d0e] p-8 flex flex-col justify-between shadow-2xl transition-all duration-300 hover:border-zinc-700 relative overflow-hidden">
              <div>
                {/* Plan Header */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-zinc-200 tracking-wider uppercase">
                    LIFETIME
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl sm:text-6xl font-medium tracking-tight text-white">
                      ₹799
                    </span>
                    <span className="text-sm text-zinc-400 font-normal">
                      one-time
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400">
                    Pay once and access forever.
                  </p>
                </div>

                {/* Divider */}
                <div className="border-b border-zinc-800/80 my-8" />

                {/* Features List */}
                <div className="space-y-4">
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Includes
                  </p>
                  <ul className="space-y-4 text-sm">
                    <li className="flex items-center gap-3 text-zinc-200">
                      <Check className="size-4 text-zinc-300 shrink-0" />
                      <span>Unlimited Credits</span>
                    </li>
                    <li className="flex items-center gap-3 text-zinc-200">
                      <Check className="size-4 text-zinc-300 shrink-0" />
                      <span>Phone Intelligence</span>
                    </li>
                    <li className="flex items-center gap-3 text-zinc-200">
                      <Check className="size-4 text-zinc-300 shrink-0" />
                      <span>Vehicle Intelligence</span>
                    </li>
                    <li className="flex items-center gap-3 text-zinc-200">
                      <Check className="size-4 text-zinc-300 shrink-0" />
                      <span>AI Case Assistant</span>
                    </li>
                    <li className="flex items-center gap-3 text-zinc-200">
                      <Check className="size-4 text-zinc-300 shrink-0" />
                      <span>Investigation Reports</span>
                    </li>
                    <li className="flex items-center gap-3 text-zinc-200">
                      <Check className="size-4 text-zinc-300 shrink-0" />
                      <span>Export Reports</span>
                    </li>
                    <li className="flex items-center gap-3 text-zinc-200">
                      <Check className="size-4 text-zinc-300 shrink-0" />
                      <span>Email Support</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-8">
                <a
                  href="/login"
                  className="w-full bg-white hover:bg-zinc-200 text-black font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
                >
                  <span>Buy Lifetime</span>
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

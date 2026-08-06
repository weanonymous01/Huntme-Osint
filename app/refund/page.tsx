'use client';

import React from 'react';
import { Header } from '@/components/ui/header-3';
import { Footer } from '@/components/ui/footer';
import { RotateCcw, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-zinc-800 selection:text-white">
      <Header />

      <main className="grow py-16 px-4 sm:px-6 md:py-24 max-w-4xl mx-auto w-full space-y-12">
        {/* Header Title */}
        <div className="space-y-4 text-center sm:text-left border-b border-zinc-800/80 pb-8">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">

            Refund Policy
          </h1>
          <p className="text-sm sm:text-base text-zinc-400">
            Last Updated: August 4, 2026 • Transparent guidelines on payment processing, credit top-ups, and refund eligibility.
          </p>
        </div>

        {/* Content Section */}
        <div className="space-y-8 text-sm sm:text-base text-zinc-300 leading-relaxed">
          <section className="space-y-3 bg-[#0d0d0e] p-6 rounded-2xl border border-zinc-800/90">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="size-5 text-zinc-400" />
              1. Credit Top-Ups & Deliveries
            </h2>
            <p>
              Huntme provides digital API credit top-ups (e.g., ₹79 for 100 Credits, ₹499 for 1,000 Credits). Credits are provisioned automatically to your database account balance upon successful payment verification.
            </p>
          </section>

          <section className="space-y-3 bg-[#0d0d0e] p-6 rounded-2xl border border-zinc-800/90">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertCircle className="size-5 text-zinc-400" />
              2. Credit Deduction & Refund Eligibility
            </h2>
            <p>
              Digital query credits that have been consumed for successful live database searches are non-refundable. However, queries for phone numbers or targets that do not exist in our database <strong className="text-white">will not consume your credits</strong>. If a payment is completed but credits fail to deliver due to a technical error, we will issue an immediate manual credit top-up or full refund within 5–7 business days upon request.
            </p>
          </section>

          <section className="space-y-3 bg-[#0d0d0e] p-6 rounded-2xl border border-zinc-800/90">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <HelpCircle className="size-5 text-zinc-400" />
              3. Requesting a Refund
            </h2>
            <p className="text-zinc-400 text-sm">
              To request a refund or report a payment issue, email your transaction ID and account email to{' '}
              <a href="mailto:your.weanonymous@gmail.com" className="text-white underline font-semibold">
                your.weanonymous@gmail.com
              </a>. Our support team reviews all requests within 24 hours.

            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

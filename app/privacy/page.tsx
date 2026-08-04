'use client';

import React from 'react';
import { Header } from '@/components/ui/header-3';
import { Footer } from '@/components/ui/footer';
import { Shield, Lock, Eye, Server } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-zinc-800 selection:text-white">
      <Header />

      <main className="grow py-16 px-4 sm:px-6 md:py-24 max-w-4xl mx-auto w-full space-y-12">
        {/* Header Title */}
        <div className="space-y-4 text-center sm:text-left border-b border-zinc-800/80 pb-8">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">

            Privacy Policy
          </h1>
          <p className="text-sm sm:text-base text-zinc-400">
            Last Updated: August 4, 2026 • Learn how Huntme protects user information and handles OSINT search data.
          </p>
        </div>

        {/* Content Section */}
        <div className="space-y-8 text-sm sm:text-base text-zinc-300 leading-relaxed">
          <section className="space-y-3 bg-[#0d0d0e] p-6 rounded-2xl border border-zinc-800/90">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock className="size-5 text-zinc-400" />
              1. Information We Collect
            </h2>
            <p>
              When you register for a Huntme account, we collect basic account credentials (such as your name, email address, and authentication avatar). We collect telemetry usage metrics and query history to provide you with dossier reporting features.
            </p>
          </section>

          <section className="space-y-3 bg-[#0d0d0e] p-6 rounded-2xl border border-zinc-800/90">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Eye className="size-5 text-zinc-400" />
              2. How Search Data is Processed
            </h2>
            <p>
              Search queries executed through our Phone & Vehicle Intelligence engines process publicly indexable data sources. Search records are stored securely in your isolated user database partition protected by Row Level Security (RLS).
            </p>
          </section>

          <section className="space-y-3 bg-[#0d0d0e] p-6 rounded-2xl border border-zinc-800/90">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Server className="size-5 text-zinc-400" />
              3. Security & Encryption
            </h2>
            <p>
              We implement industry-standard AES-256 encryption for data at rest and TLS 1.3 transport security for all data in transit. We never sell, rent, or monetize personal account information to third parties.
            </p>
          </section>

          <section className="space-y-3 bg-[#0d0d0e] p-6 rounded-2xl border border-zinc-800/90">
            <h2 className="text-lg font-bold text-white">4. Your Privacy Rights</h2>
            <p className="text-zinc-400 text-sm">
              You have the right to request deletion of your account and associated search logs at any time. For data deletion inquiries or privacy questions, contact us at{' '}
              <a href="mailto:your.weanonymous@gmail.com" className="text-white underline">
                your.weanonymous@gmail.com
              </a>.

            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

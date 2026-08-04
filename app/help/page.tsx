'use client';

import React from 'react';
import { Header } from '@/components/ui/header-3';
import { Footer } from '@/components/ui/footer';
import { HelpCircle, Mail, MapPin, Phone, MessageSquare, Search, FileCode2 } from 'lucide-react';

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-zinc-800 selection:text-white">
      <Header />

      <main className="grow py-16 px-4 sm:px-6 md:py-24 max-w-5xl mx-auto w-full space-y-12">
        {/* Header Title */}
        <div className="space-y-4 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700/60 text-xs font-mono text-zinc-300">
            <HelpCircle className="size-3.5" />
            <span>Support & Documentation</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Help Center & Support
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">
            Find quick answers to common OSINT search questions, API integration guides, or get in touch with our team.
          </p>
        </div>

        {/* Support Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="rounded-2xl border border-zinc-800/90 bg-[#0d0d0e] p-6 space-y-3">
            <Search className="size-8 text-zinc-400" />
            <h3 className="text-lg font-bold text-white">OSINT Search Help</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Learn how to run phone telemetry lookups, vehicle RTO queries, and interpret AI investigation reports.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800/90 bg-[#0d0d0e] p-6 space-y-3">
            <FileCode2 className="size-8 text-zinc-400" />
            <h3 className="text-lg font-bold text-white">API & Top-ups</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Need help with credit top-ups or integrating Huntme REST API into your application? View our API docs.
            </p>
            <a href="/products/rest-api" className="inline-block text-xs font-semibold text-white underline pt-1">
              Explore REST API →
            </a>
          </div>

          <div className="rounded-2xl border border-zinc-800/90 bg-[#0d0d0e] p-6 space-y-3">
            <MessageSquare className="size-8 text-zinc-400" />
            <h3 className="text-lg font-bold text-white">Direct Assistance</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Have a billing question or custom enterprise requirement? Email our 24/7 technical support team.
            </p>
            <a href="mailto:hello@huntme.in" className="inline-block text-xs font-semibold text-white underline pt-1">
              hello@huntme.in →
            </a>
          </div>
        </div>

        {/* Contact Info Card */}
        <div className="rounded-2xl border border-zinc-800 bg-[#0d0d0e] p-8 sm:p-10 space-y-6">
          <h2 className="text-xl font-bold text-white">Get in Touch</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
            <div className="flex items-start gap-3 text-zinc-300">
              <Mail className="size-5 text-zinc-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Email</p>
                <a href="mailto:hello@huntme.in" className="text-zinc-400 hover:text-white transition-colors">
                  hello@huntme.in
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3 text-zinc-300">
              <Phone className="size-5 text-zinc-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Phone</p>
                <p className="text-zinc-400">+91 11 4050 8900</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-zinc-300">
              <MapPin className="size-5 text-zinc-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Office</p>
                <p className="text-zinc-400 text-xs">DLF Cyber City, Phase 2, Gurugram, India</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

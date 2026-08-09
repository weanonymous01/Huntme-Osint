import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/ui/header-3';
import { Footer } from '@/components/ui/footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Globe, Cpu, CheckCircle2 } from 'lucide-react';
import { constructMetadata, getBreadcrumbSchema } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = constructMetadata({
  title: 'About Huntme | Lawful AI-Powered Open Source Intelligence',
  description:
    'Discover the mission behind Huntme: empowering cyber investigators and security analysts with modern, lawful, AI-augmented intelligence tools.',
  path: '/company/about',
  keywords: [
    'About Huntme',
    'Huntme OSINT Mission',
    'Lawful Open Source Intelligence',
    'AI Investigation Software Company',
    'Ethical OSINT Platform',
  ],
});

export default function AboutCompanyPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Company', path: '/company/about' },
    { name: 'About Us', path: '/company/about' },
  ]);

  const sellingPoints = [
    'AI-Powered Investigations with automated entity resolution and relationship graphs',
    'Lawful Public-Source Intelligence aggregated across verified global data registries',
    'Structured Investigation Reports with 1-click court and compliance-ready PDF export',
    'Clean REST API built for rapid Python and enterprise SIEM/SOAR integration',
    'Enterprise-Ready Architecture featuring SOC-2 compliance & Row-Level Security',
    'Sub-100ms API Latency with guaranteed 99.99% SLA availability and edge routing',
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-zinc-800 selection:text-white">
      <JsonLd data={breadcrumbSchema} />
      <Header />

      <main className="grow py-16 px-4">
        <div className="mx-auto max-w-5xl space-y-16">
          {/* Breadcrumb Visual Navigation */}
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground flex items-center gap-2">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-muted-foreground">Company</span>
            <span>/</span>
            <span className="text-emerald-400 font-medium">About Huntme</span>
          </nav>

          {/* Mission */}
          <header className="flex flex-col items-start gap-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-mono text-emerald-400">
              <Globe className="size-3.5" />
              <span>Modern Open Source Intelligence</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground">
              Empowering Lawful Investigations
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed">
              Huntme combines Open Source Intelligence (OSINT), AI-driven entity resolution, and enterprise-grade APIs to transform publicly available information into actionable, structured intelligence.
            </p>
          </header>

          {/* Long Term Vision Card */}
          <section className="rounded-2xl border border-border bg-card/60 p-8 sm:p-12 space-y-4">
            <div className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400">
              OUR MISSION & VISION
            </div>
            <p className="text-xl sm:text-2xl font-medium text-foreground leading-relaxed">
              "Become the global intelligence foundation for investigators, security teams, and developers by combining Open Source Intelligence, AI neural analysis, and enterprise-grade infrastructure into a single, unified platform focused strictly on lawful public-source data."
            </p>
          </section>

          {/* Key Selling Points */}
          <section className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Key Platform Pillars</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sellingPoints.map((point, idx) => (
                <div key={idx} className="flex items-start gap-3 rounded-lg border border-border/80 bg-card/40 p-4">
                  <CheckCircle2 className="size-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-foreground">{point}</span>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="rounded-2xl border border-zinc-800 bg-[#0d0d0e] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">Ready to explore Huntme?</h3>
              <p className="text-xs text-zinc-400">Start investigating phone numbers and vehicle registrations in seconds.</p>
            </div>
            <Button size="lg" asChild>
              <Link href="/pricing">Get Started Now</Link>
            </Button>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

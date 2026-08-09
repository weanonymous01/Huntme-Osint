import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/ui/header-3';
import { Footer } from '@/components/ui/footer';
import { Button } from '@/components/ui/button';
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
    'AI-Powered Investigations with automated entity resolution',
    'Lawful Public-Source Intelligence aggregated across global data sets',
    'Structured Investigation Reports with 1-click court-ready PDF export',
    'Clean REST API built for rapid Python requests integration',
    'Enterprise-Ready Architecture featuring SOC-2 compliance & RBAC',
    'Sub-100ms API Latency with guaranteed 99.99% SLA availability',
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-zinc-800 selection:text-white">
      <JsonLd data={breadcrumbSchema} />
      <Header />

      <main className="grow py-16 px-4">
        <div className="mx-auto max-w-5xl space-y-16">
          {/* Mission */}
          <header className="flex flex-col items-start gap-4 max-w-3xl">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground">
              Modern OSINT Platform
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed">
              AI-powered OSINT transforming public information into actionable investigative intelligence.
            </p>
          </header>

          {/* Long Term Vision Card */}
          <section className="rounded-2xl border border-border bg-card/60 p-8 sm:p-12 space-y-4">
            <div className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              LONG-TERM VISION
            </div>
            <p className="text-xl sm:text-2xl font-medium text-foreground leading-relaxed">
              "Become the AI-powered investigation platform for individuals, security teams, and developers by combining Open Source Intelligence, AI analysis, and enterprise-grade APIs into a single, modern platform focused on lawful public-source intelligence."
            </p>
          </section>

          {/* Key Selling Points */}
          <section className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Key Selling Points</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sellingPoints.map((point, idx) => (
                <div key={idx} className="flex items-center gap-3 rounded-lg border border-border/80 bg-card/40 p-4">
                  <span className="text-sm font-medium text-foreground">• {point}</span>
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

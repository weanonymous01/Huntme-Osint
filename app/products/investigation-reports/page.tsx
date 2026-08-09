import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/ui/header-3';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/ui/footer';
import { ArrowRight } from 'lucide-react';
import { constructMetadata, getBreadcrumbSchema, getFaqSchema } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = constructMetadata({
  title: 'OSINT Investigation Reports & 1-Click PDF Export | Huntme',
  description:
    'Generate executive-ready OSINT investigation dossiers complete with AI executive summaries, verified entity maps, and 1-click PDF download.',
  path: '/products/investigation-reports',
  keywords: [
    'OSINT Investigation Reports',
    'Cyber Investigation PDF Export',
    'Evidence Timeline Mapping',
    'Due Diligence Briefing',
    'Court Ready Forensic Dossier',
    'Digital Forensics Reporting',
  ],
});

const reportFaqs = [
  {
    q: 'What formats are Huntme investigation reports available in?',
    a: 'Reports can be exported in 1-click branded PDF format, structured JSON payloads via REST API, CSV tables, and interactive online dossiers.',
  },
  {
    q: 'Can reports be customized with organization branding?',
    a: 'Yes. Enterprise tiers support custom watermarking, logo integration, and tailored disclaimer text for institutional delivery.',
  },
  {
    q: 'Are timestamps and data provenance included in the PDF export?',
    a: 'Yes. Every generated report records precise extraction timestamps, query target identifiers, source reliability confidence ratings, and cryptographic hash verifications.',
  },
];

export default function InvestigationReportsPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products/investigation-reports' },
    { name: 'Investigation Reports', path: '/products/investigation-reports' },
  ]);

  const faqSchema = getFaqSchema(reportFaqs);

  const reportFeatures = [
    { title: 'Search Summary', desc: 'High-level overview of query targets, execution metadata, and data sources accessed.' },
    { title: 'AI Analysis', desc: 'Automated natural language evaluation of threats, risk indicators, and entity importance.' },
    { title: 'Discovered Public Information', desc: 'Raw and enriched data artifacts extracted from lawful open-source registries.' },
    { title: 'Related Entities & Mapping', desc: 'Visualized network diagrams connecting phone numbers, emails, vehicles, and domains.' },
    { title: 'Investigation Timeline', desc: 'Chronological activity log detailing historical events and registration dates.' },
    { title: 'Structured Findings', desc: 'Clear bullet points categorized by risk level, evidence type, and confidence score.' },
    { title: '1-Click PDF Export', desc: 'Download court-ready, branded PDF reports formatted for legal and enterprise delivery.' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-zinc-800 selection:text-white">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />
      <Header />

      <main className="grow py-16 px-4">
        <div className="mx-auto max-w-5xl space-y-16">
          {/* Hero */}
          <header className="flex flex-col items-start gap-4 max-w-3xl">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground">
              Investigation Reports
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed">
              Every search generates a comprehensive, professional report equipped with AI analysis, structured findings, timeline mapping, and instant 1-click PDF export.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Button size="lg" className="gap-2" asChild>
                <Link href="/login">
                  Generate First Report <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/pricing">
                  View Credit Plans
                </Link>
              </Button>
            </div>
          </header>

          {/* Report Features Grid */}
          <section className="space-y-8">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Dossier Contents & Structure</h2>
              <p className="text-muted-foreground text-base">Standardized modular components included in every generated intelligence brief.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reportFeatures.map((item, idx) => (
                <div key={idx} className="rounded-xl border border-border/80 bg-card/40 p-6 flex flex-col gap-2 hover:border-purple-500/50 transition-all">
                  <h3 className="font-semibold text-lg text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQs Section */}
          <section className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reportFaqs.map((faq, idx) => (
                <div key={idx} className="rounded-xl border border-border/70 bg-card/30 p-6 space-y-2">
                  <h3 className="font-semibold text-base text-foreground">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

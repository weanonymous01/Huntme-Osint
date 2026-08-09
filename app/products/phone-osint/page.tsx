import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/ui/header-3';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/ui/footer';
import { ArrowRight, PhoneCall, ShieldCheck, Database, Cpu, HelpCircle } from 'lucide-react';
import { constructMetadata, getBreadcrumbSchema, getFaqSchema } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = constructMetadata({
  title: 'Phone Number OSINT & Reverse Phone Intelligence | Huntme',
  description:
    'Search phone carrier details, telecom circle, associated digital footprints, and AI risk analysis from any phone number using lawful open source intelligence.',
  path: '/products/phone-osint',
  keywords: [
    'Phone Number OSINT',
    'Reverse Phone Lookup API',
    'Carrier Lookup Tool',
    'Telecom Circle Identifier',
    'Phone Breach Intelligence',
    'OSINT Phone Investigation',
  ],
});

const phoneFaqs = [
  {
    q: 'What is Phone Number OSINT?',
    a: 'Phone Number Open Source Intelligence (OSINT) is the lawful practice of gathering and analyzing publicly accessible data linked to a telephone number, including carrier details, telecom circle, line type (mobile/landline/VoIP), and associated digital footprints.',
  },
  {
    q: 'Can Huntme detect whether a phone number is VoIP or Mobile?',
    a: 'Yes. Huntme analyzes real-time telecom routing data to distinguish between standard cellular lines, landline infrastructure, and virtual VoIP numbers commonly used in fraud attempts.',
  },
  {
    q: 'How does Huntme protect data privacy during phone investigations?',
    a: 'Huntme operates exclusively with publicly available records, verified directory metadata, and lawful intelligence feeds. Queries are secured with end-to-end encryption and strict isolated user partitions.',
  },
  {
    q: 'What happens if a phone number returns no records in the database?',
    a: 'Under our Fair Billing Guarantee, if a phone query yields no records because the number does not exist in our database, zero credits are deducted from your balance.',
  },
];

export default function PhoneOsintPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products/phone-osint' },
    { name: 'Phone Number OSINT', path: '/products/phone-osint' },
  ]);

  const faqSchema = getFaqSchema(phoneFaqs);

  const resultsList = [
    { title: 'Owner Name & Aliases', desc: 'Discovered registered names and public directory records.' },
    { title: 'Alternate Phone Numbers', desc: 'Cross-referenced associated landline and secondary mobile lines.' },
    { title: 'Connected Email Addresses', desc: 'Associated email accounts linked across public data breach indices.' },
    { title: 'Telecom Circle & Operator', desc: 'Real-time carrier identification, network type, and geographic circle.' },
    { title: 'Publicly Available Addresses', desc: 'Historical and current registered physical locations.' },
    { title: 'Related Public Records', desc: 'Linked corporate filings, domain WHOIS, and public directory listings.' },
    { title: 'AI-Generated Summary', desc: 'Instant synthesis of all phone intelligence into a concise investigative report.' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-zinc-800 selection:text-white">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />
      <Header />

      <main className="grow py-16 px-4">
        <div className="mx-auto max-w-5xl space-y-16">
          {/* Breadcrumb Visual Navigation */}
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground flex items-center gap-2">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Products</span>
            <span>/</span>
            <span className="text-emerald-400 font-medium">Phone Number OSINT</span>
          </nav>

          {/* Hero Section */}
          <header className="flex flex-col items-start gap-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-mono text-emerald-400">
              <PhoneCall className="size-3.5" />
              <span>Real-Time Phone Telemetry</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground">
              Phone Number OSINT
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed">
              Search publicly available intelligence related to any phone number. Transform raw telephone numbers into rich, actionable investigation profiles with AI entity correlation.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Button size="lg" className="gap-2" asChild>
                <Link href="/login">
                  Start Phone Search <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/products/rest-api">
                  View REST API Docs
                </Link>
              </Button>
            </div>
          </header>

          {/* Discovered Data & Telemetry Grid */}
          <section className="space-y-8">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Discovered Data & Telemetry</h2>
              <p className="text-muted-foreground text-base">Comprehensive intelligence extracted from lawful open-source intelligence databases.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resultsList.map((item, idx) => (
                <div key={idx} className="rounded-xl border border-border/80 bg-card/40 p-6 flex flex-col gap-2 hover:border-emerald-500/50 transition-all">
                  <h3 className="font-semibold text-lg text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* How It Works - Step-by-Step SEO Section */}
          <section className="space-y-6 rounded-2xl border border-border bg-card/50 p-8 sm:p-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">How Phone OSINT Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="space-y-2">
                <div className="size-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 font-mono text-emerald-400 flex items-center justify-center font-bold text-sm">1</div>
                <h3 className="text-lg font-bold text-foreground">Query Resolution</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Enter any international or domestic phone number. Our system validates formatting and queries global telecom routing tables.
                </p>
              </div>
              <div className="space-y-2">
                <div className="size-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 font-mono text-emerald-400 flex items-center justify-center font-bold text-sm">2</div>
                <h3 className="text-lg font-bold text-foreground">Multi-Source Extraction</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Extracts carrier, circle, line classification, domain WHOIS links, and historical public directory records lawfully.
                </p>
              </div>
              <div className="space-y-2">
                <div className="size-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 font-mono text-emerald-400 flex items-center justify-center font-bold text-sm">3</div>
                <h3 className="text-lg font-bold text-foreground">AI Entity Correlation</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Synthesizes cross-referenced findings into structured case timelines, confidence scores, and instant PDF dossiers.
                </p>
              </div>
            </div>
          </section>

          {/* AI Summary Feature Box */}
          <section className="rounded-2xl border border-border bg-card/60 p-8 flex flex-col md:flex-row items-center gap-8 justify-between">
            <div className="space-y-3 max-w-xl">
              <h2 className="text-2xl font-bold text-foreground">Automated Risk & Entity Scoring</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our AI Case Assistant automatically cross-references phone telemetry with known breach indexes to calculate threat probability and highlight key connections.
              </p>
            </div>
            <Button size="lg" className="shrink-0" asChild>
              <Link href="/products/ai-case-solver">Explore AI Case Solver</Link>
            </Button>
          </section>

          {/* Phone OSINT FAQs */}
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <HelpCircle className="size-5 text-emerald-400" />
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Frequently Asked Questions</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {phoneFaqs.map((faq, idx) => (
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

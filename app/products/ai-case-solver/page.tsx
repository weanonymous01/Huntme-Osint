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
  title: 'AI Case Solver & Entity Resolution Software | Huntme',
  description:
    'Automatically connect phone, vehicle, and subject artifacts into structured investigation timelines and graph relationships using cutting-edge AI.',
  path: '/products/ai-case-solver',
  keywords: [
    'AI Case Solver',
    'OSINT Entity Resolution',
    'AI Cyber Investigation',
    'Relationship Graph Analysis',
    'Automated Evidence Timeline',
    'Threat Actor Correlation',
  ],
});

const aiSolverFaqs = [
  {
    q: 'How does the AI Case Solver analyze OSINT data?',
    a: 'The AI Case Solver uses advanced natural language processing and graph neural reasoning to correlate disjoint data points—such as phone numbers, vehicle registrations, email addresses, and timestamps—into unified subject profiles.',
  },
  {
    q: 'Can the AI Case Solver generate legal and court-ready reports?',
    a: 'Yes. It automatically compiles comprehensive investigation briefs with structured executive summaries, entity relation graphs, timeline maps, and verified source citations exportable to PDF.',
  },
  {
    q: 'How does AI calculate entity confidence scores?',
    a: 'Confidence scores evaluate source provenance, cross-platform corroboration, and data freshness to assign an objective 0–100% confidence rating to every discovered artifact.',
  },
];

export default function AiCaseSolverPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products/ai-case-solver' },
    { name: 'AI Case Solver', path: '/products/ai-case-solver' },
  ]);

  const faqSchema = getFaqSchema(aiSolverFaqs);

  const capabilities = [
    { title: 'Connect Related Entities', desc: 'Link phone numbers, vehicles, email profiles, and physical addresses into a unified intelligence graph.' },
    { title: 'Summarize Findings', desc: 'Instantly translate thousands of raw data points into actionable executive briefings.' },
    { title: 'Detect Relationships', desc: 'Uncover hidden co-location occurrences, shared domain registrations, and cross-platform mentions.' },
    { title: 'Generate Investigation Reports', desc: 'Auto-compile court and compliance-ready reports complete with timestamped citations.' },
    { title: 'Organize Evidence', desc: 'Tag, categorize, and verify open-source artifacts with immutable chain-of-custody tracking.' },
    { title: 'Produce Structured Timelines', desc: 'Chronologically map all discovered events, phone activity, and registry updates.' },
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
              AI Case Solver
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed">
              AI automatically analyzes collected information to connect related entities, summarize complex findings, detect hidden relationships, and organize case evidence into clear investigative paths.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Button size="lg" className="gap-2" asChild>
                <Link href="/login">
                  Try AI Assistant <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/products/investigation-reports">
                  Explore Report Formats
                </Link>
              </Button>
            </div>
          </header>

          {/* Capabilities Grid */}
          <section className="space-y-8">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Core AI Capabilities</h2>
              <p className="text-muted-foreground text-base">Intelligent automation designed for modern cyber investigators and intelligence analysts.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {capabilities.map((item, idx) => (
                <div key={idx} className="rounded-xl border border-border/80 bg-card/40 p-6 flex flex-col gap-2 hover:border-cyan-500/50 transition-all">
                  <h3 className="font-semibold text-lg text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* AI Workflow Section */}
          <section className="space-y-6 rounded-2xl border border-border bg-card/50 p-8 sm:p-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Investigation Workflow with AI</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-foreground">1. Input Artifacts</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Provide initial investigative seeds: phone numbers, plate numbers, email handles, or suspicious transaction data.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-foreground">2. Automated Correlation</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The AI engine queries multi-source lawful registries, clusters overlapping entities, and isolates common threat patterns.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-foreground">3. Actionable Briefing</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Outputs comprehensive threat evaluations, confidence scores, and instant exportable PDF case dossiers.
                </p>
              </div>
            </div>
          </section>

          {/* FAQs Section */}
          <section className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aiSolverFaqs.map((faq, idx) => (
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

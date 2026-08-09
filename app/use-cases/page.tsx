import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/ui/header-3';
import { Footer } from '@/components/ui/footer';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { constructMetadata, getBreadcrumbSchema } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = constructMetadata({
  title: 'OSINT Use Cases: Fraud Research & Threat Hunting | Huntme',
  description:
    'Learn how corporate investigators, SOC teams, and due diligence analysts use Huntme to resolve fraud, trace threat actors, and verify subjects.',
  path: '/use-cases',
  keywords: [
    'OSINT Use Cases',
    'Fraud Investigation Software',
    'Cyber Due Diligence',
    'Threat Hunting Workflows',
    'Entity Network Analysis',
    'Security Operations Enrichment',
  ],
});

export default function UseCasesPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Use Cases', path: '/use-cases' },
  ]);

  const cases = [
    {
      title: 'Investigating Unknown Contacts',
      desc: 'Identify unknown incoming callers, carrier information, line classification, and public background associations in seconds.',
    },
    {
      title: 'Verifying Public Information',
      desc: 'Validate subject claims, vehicle registrations, business filings, and open web mentions with authoritative public datasets.',
    },
    {
      title: 'Digital & Cyber Investigations',
      desc: 'Correlate OSINT artifacts across phone numbers, emails, domain WHOIS records, and breach leaks to map threat networks.',
    },
    {
      title: 'Fraud Research & Prevention',
      desc: 'Detect fraudulent accounts, VoIP spoofing attempts, and synthetic identity fraud before financial or reputational damage occurs.',
    },
    {
      title: 'Security Operations (SOC/SOAR)',
      desc: 'Enrich incoming security alerts and incident tickets with automated OSINT intelligence via low-latency API integration.',
    },
    {
      title: 'Corporate Due Diligence',
      desc: 'Conduct background diligence on vendors, partners, and key personnel prior to mergers, acquisitions, or high-value partnerships.',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-zinc-800 selection:text-white">
      <JsonLd data={breadcrumbSchema} />
      <Header />

      <main className="grow py-16 px-4">
        <div className="mx-auto max-w-5xl space-y-16">
          {/* Hero */}
          <header className="flex flex-col items-start gap-4 max-w-3xl">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground">
              Investigative Use Cases
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed">
              Explore how cybersecurity teams, private investigators, journalists, and risk analysts leverage Huntme OSINT to accelerate investigations and mitigate risk.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Button size="lg" className="gap-2" asChild>
                <Link href="/login">
                  Start an Investigation <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/pricing">
                  View Pricing Plans
                </Link>
              </Button>
            </div>
          </header>

          {/* Cases Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cases.map((item, idx) => (
              <div key={idx} className="rounded-xl border border-border/80 bg-card/40 p-6 flex flex-col gap-2 hover:border-zinc-700 transition-all">
                <h2 className="text-xl font-bold text-foreground">{item.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </section>

          {/* Callout Section */}
          <section className="rounded-2xl border border-border bg-card/60 p-8 flex flex-col md:flex-row items-center gap-8 justify-between">
            <div className="space-y-2 max-w-xl">
              <h2 className="text-2xl font-bold text-white">Have a Specialized Investigative Need?</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our team assists enterprise organizations with custom data pipelines, high-volume API feeds, and bespoke entity correlation models.
              </p>
            </div>
            <Button size="lg" className="shrink-0" asChild>
              <Link href="/help">Contact Support Team</Link>
            </Button>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

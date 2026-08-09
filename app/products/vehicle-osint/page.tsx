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
  title: 'Vehicle Number OSINT & License Plate Lookup | Huntme',
  description:
    'Search public vehicle registration data, RTO jurisdiction, vehicle specs, and ownership timelines with instant AI-powered vehicle intelligence.',
  path: '/products/vehicle-osint',
  keywords: [
    'Vehicle OSINT',
    'License Plate Lookup Tool',
    'VIN Number OSINT',
    'RTO Vehicle Registration Search',
    'Vehicle Ownership History',
    'Vehicle Intelligence API',
  ],
});

const vehicleFaqs = [
  {
    q: 'What is Vehicle Number OSINT?',
    a: 'Vehicle OSINT is the lawful extraction and analysis of publicly available motor vehicle records, including registration authority (RTO), vehicle make and model, fuel type, fitness validity, and registration status.',
  },
  {
    q: 'What information is extracted from a vehicle registration search?',
    a: 'Searches provide official public registration details, vehicle make/model/variant, registration state, RTO jurisdiction, insurance and roadworthiness validity timestamps, and active/expired status.',
  },
  {
    q: 'Is vehicle registration data lawful to search?',
    a: 'Yes. Huntme queries authorized public transport datasets and open-source registry databases strictly for lawful investigation, fraud prevention, insurance verification, and due diligence.',
  },
  {
    q: 'Can vehicle intelligence be exported as a report?',
    a: 'Yes. Every vehicle lookup can be exported as a court-ready PDF dossier or ingested programmatically via our Developer REST API.',
  },
];

export default function VehicleOsintPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products/vehicle-osint' },
    { name: 'Vehicle Number OSINT', path: '/products/vehicle-osint' },
  ]);

  const faqSchema = getFaqSchema(vehicleFaqs);

  const resultsList = [
    { title: 'Registration Details', desc: 'Official public registration history and active status records.' },
    { title: 'Vehicle Make & Model', desc: 'Detailed specs, manufacturing year, vehicle trim level, and fuel type.' },
    { title: 'Registration State & Region', desc: 'Jurisdiction, regional transport office (RTO) code, and location data.' },
    { title: 'Registration Status', desc: 'Active, expired, transferred, or blacklisted status alerts.' },
    { title: 'Insurance & Fitness Logs', desc: 'Public validity timestamps for vehicle insurance and roadworthiness.' },
    { title: 'AI-Generated Summary', desc: 'Automated report synthesizing vehicle ownership timeline and anomalies.' },
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
              Vehicle Number OSINT
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed">
              Search vehicle registration information from lawful public sources. Instantly query license plate data, VIN records, and historical vehicle telemetry.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Button size="lg" className="gap-2" asChild>
                <Link href="/login">
                  Lookup License Plate <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/products/rest-api">
                  View REST API Docs
                </Link>
              </Button>
            </div>
          </header>

          {/* Possible Results Grid */}
          <section className="space-y-8">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Extracted Vehicle Telemetry</h2>
              <p className="text-muted-foreground text-base">Standardized vehicle intelligence gathered from verified public transport databases.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resultsList.map((item, idx) => (
                <div key={idx} className="rounded-xl border border-border/80 bg-card/40 p-6 flex flex-col gap-2 hover:border-amber-500/50 transition-all">
                  <h3 className="font-semibold text-lg text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* How It Works - Step-by-Step Workflow */}
          <section className="space-y-6 rounded-2xl border border-border bg-card/50 p-8 sm:p-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">How Vehicle OSINT Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-foreground">1. Registration Lookup</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Provide a valid license plate or registration identifier. The system normalizes state/RTO codes automatically.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-foreground">2. Registry Verification</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Queries state and national transport databases to extract technical specifications, fuel classification, and validity dates.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-foreground">3. Timeline Mapping</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Builds a verified chronological history of the vehicle for insurance, fraud detection, and due diligence dossiers.
                </p>
              </div>
            </div>
          </section>

          {/* FAQs Section */}
          <section className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {vehicleFaqs.map((faq, idx) => (
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

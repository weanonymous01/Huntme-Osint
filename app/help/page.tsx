import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/ui/header-3';
import { Footer } from '@/components/ui/footer';
import { Mail, MapPin, Search, FileCode2, MessageSquare } from 'lucide-react';
import { constructMetadata, getBreadcrumbSchema, getFaqSchema } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = constructMetadata({
  title: 'Huntme Help Center | Guides, FAQs & Technical Support',
  description:
    'Get comprehensive guidance on running OSINT queries, managing API keys, purchasing credits, and troubleshooting searches.',
  path: '/help',
  keywords: [
    'Huntme Help Center',
    'OSINT Search Guide',
    'Phone OSINT Support',
    'Vehicle OSINT FAQ',
    'Huntme API Documentation',
  ],
});

const helpFaqs = [
  {
    q: 'How do I top up search credits?',
    a: 'Navigate to our Pricing page, select either the Pro (100 credits) or Premium (1,000 credits) plan, and complete checkout via Cashfree. Credits are automatically provisioned to your account upon payment.',
  },
  {
    q: 'Why did my phone search return no records?',
    a: 'Some phone numbers may not be present in public registries or open databases. Under our Fair Billing Guarantee, zero credits are deducted for searches returning no database records.',
  },
  {
    q: 'Where can I find my API key?',
    a: 'Log into your dashboard, navigate to Account Settings > API Keys, and generate your secure Bearer authentication token.',
  },
];

export default function HelpPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Help Center', path: '/help' },
  ]);

  const faqSchema = getFaqSchema(helpFaqs);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-zinc-800 selection:text-white">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />
      <Header />

      <main className="grow py-16 px-4 sm:px-6 md:py-24 max-w-5xl mx-auto w-full space-y-12">
        {/* Header Title */}
        <header className="space-y-4 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Help Center & Support
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">
            Find quick answers to common OSINT search questions, API integration guides, or get in touch directly with our engineering team.
          </p>
        </header>

        {/* Support Grid Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="rounded-2xl border border-zinc-800/90 bg-[#0d0d0e] p-6 space-y-3">
            <Search className="size-8 text-zinc-400" />
            <h2 className="text-lg font-bold text-white">OSINT Search Help</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Learn how to run phone telemetry lookups, vehicle RTO queries, and interpret AI investigation confidence scores.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800/90 bg-[#0d0d0e] p-6 space-y-3">
            <FileCode2 className="size-8 text-zinc-400" />
            <h2 className="text-lg font-bold text-white">API & Credit Top-ups</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Need assistance with credit top-ups or integrating Huntme REST API into your SIEM platform? View our API documentation.
            </p>
            <Link href="/products/rest-api" className="inline-block text-xs font-semibold text-white underline pt-1">
              Explore REST API →
            </Link>
          </div>

          <div className="rounded-2xl border border-zinc-800/90 bg-[#0d0d0e] p-6 space-y-3">
            <MessageSquare className="size-8 text-zinc-400" />
            <h2 className="text-lg font-bold text-white">Direct Assistance</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Have a billing question or custom enterprise requirement? Email our 24/7 technical support team.
            </p>
            <a href="mailto:your.weanonymous@gmail.com" className="inline-block text-xs font-semibold text-white underline pt-1">
              your.weanonymous@gmail.com →
            </a>
          </div>
        </section>

        {/* FAQs */}
        <section className="space-y-6 pt-4">
          <h2 className="text-2xl font-bold text-white text-center">Frequently Asked Support Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {helpFaqs.map((faq, idx) => (
              <div key={idx} className="rounded-xl border border-zinc-800 bg-[#0d0d0e] p-6 space-y-2">
                <h3 className="font-semibold text-sm text-white">{faq.q}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Info Card */}
        <section className="rounded-2xl border border-zinc-800 bg-[#0d0d0e] p-8 sm:p-10 space-y-6">
          <h2 className="text-xl font-bold text-white">Official Contact Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div className="flex items-start gap-3 text-zinc-300">
              <Mail className="size-5 text-zinc-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Technical & Billing Support</p>
                <a href="mailto:your.weanonymous@gmail.com" className="text-zinc-400 hover:text-white transition-colors">
                  your.weanonymous@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3 text-zinc-300">
              <MapPin className="size-5 text-zinc-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Headquarters</p>
                <p className="text-zinc-400 text-xs">DLF Cyber City, Phase 2, Gurugram, Haryana 122002, India</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

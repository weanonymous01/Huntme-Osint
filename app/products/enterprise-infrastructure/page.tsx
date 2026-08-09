import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/ui/header-3';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/ui/footer';
import { ArrowRight, Shield, Zap, Server, Lock, HelpCircle } from 'lucide-react';
import { constructMetadata, getBreadcrumbSchema, getFaqSchema } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = constructMetadata({
  title: 'Enterprise OSINT Infrastructure & SOC-2 Compliance | Huntme',
  description:
    'High-availability intelligence architecture featuring 99.99% uptime SLAs, edge deployment, encrypted data pipelines, and strict compliance boundaries.',
  path: '/products/enterprise-infrastructure',
  keywords: [
    'Enterprise OSINT Infrastructure',
    'SOC-2 OSINT Platform',
    'High Availability Threat Intelligence',
    'SIEM Integration Architecture',
    'Encrypted Intelligence Pipelines',
  ],
});

const enterpriseFaqs = [
  {
    q: 'What uptime SLA does Huntme Enterprise offer?',
    a: 'Huntme Enterprise includes a guaranteed 99.99% uptime SLA backed by multi-region automated failover and 24/7 engineering escalation.',
  },
  {
    q: 'How does Huntme protect data confidentiality?',
    a: 'All data is encrypted in transit via TLS 1.3 and at rest with AES-256 encryption. User search queries are partitioned using Row-Level Security (RLS) and never shared across tenants.',
  },
  {
    q: 'Is custom on-premise or private cloud deployment available?',
    a: 'Yes. For specialized defense, legal, and financial institutions, we support dedicated virtual private cloud (VPC) deployments.',
  },
];

export default function EnterpriseInfraPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products/enterprise-infrastructure' },
    { name: 'Enterprise Infrastructure', path: '/products/enterprise-infrastructure' },
  ]);

  const faqSchema = getFaqSchema(enterpriseFaqs);

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
            <span className="text-amber-400 font-medium">Enterprise Infrastructure</span>
          </nav>

          {/* Hero */}
          <header className="flex flex-col items-start gap-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-mono text-amber-400">
              <Shield className="size-3.5" />
              <span>Enterprise-Grade Security</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground">
              Enterprise Infrastructure
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed">
              Built for high-availability security operations, sub-100ms latency, 99.99% uptime SLAs, and strict SOC-2 & GDPR compliance boundaries.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Button size="lg" className="gap-2" asChild>
                <a
                  href="https://superprofile.bio/bookings/weanonymous?sessionId=669cabd1bffec60013ed7996"
                  target="_blank"
                  rel="noreferrer"
                >
                  Contact Enterprise Team <ArrowRight className="size-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/pricing">
                  View Pricing Plans
                </Link>
              </Button>
            </div>
          </header>

          {/* Pillars */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-xl border border-border/80 bg-card/40 p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-emerald-400">
                <Zap className="size-5" />
                <h2 className="text-xl font-bold text-foreground">Fast Performance</h2>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Sub-100ms API latency</li>
                <li>• Distributed edge nodes</li>
                <li>• Optimized JSON payloads</li>
              </ul>
            </div>

            <div className="rounded-xl border border-border/80 bg-card/40 p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-cyan-400">
                <Server className="size-5" />
                <h2 className="text-xl font-bold text-foreground">High Availability</h2>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• 99.99% uptime target SLA</li>
                <li>• Multi-region failover</li>
                <li>• Automated load balancing</li>
              </ul>
            </div>

            <div className="rounded-xl border border-border/80 bg-card/40 p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-amber-400">
                <Lock className="size-5" />
                <h2 className="text-xl font-bold text-foreground">Enterprise Security</h2>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• End-to-end TLS 1.3 encryption</li>
                <li>• Role-Based Access Control (RBAC)</li>
                <li>• Immutable audit trails</li>
              </ul>
            </div>
          </section>

          {/* FAQs Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <HelpCircle className="size-5 text-amber-400" />
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Frequently Asked Questions</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enterpriseFaqs.map((faq, idx) => (
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

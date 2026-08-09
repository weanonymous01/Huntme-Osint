import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/ui/header-3';
import { Footer } from '@/components/ui/footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Shield, Award, Newspaper, Briefcase, Code, HelpCircle } from 'lucide-react';
import { constructMetadata, getBreadcrumbSchema } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = constructMetadata({
  title: 'Who We Serve: OSINT for Security Teams & Analysts | Huntme',
  description:
    'Tailored intelligence workflows built specifically for licensed investigators, cybersecurity teams, journalists, and compliance officers.',
  path: '/target-users',
  keywords: [
    'OSINT for Investigators',
    'Cybersecurity Threat Hunting Tools',
    'Journalism OSINT Platform',
    'Corporate Due Diligence Software',
    'SOC OSINT Automation',
  ],
});

export default function TargetUsersPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Target Users', path: '/target-users' },
  ]);

  const users = [
    {
      title: 'Security Professionals & SOC Teams',
      desc: 'Accelerate threat hunting, triage suspicious contacts, verify phishing domains, and correlate incident indicators across SIEM environments.',
      icon: Shield,
    },
    {
      title: 'Licensed Private Investigators',
      desc: 'Gather lawful open-source intelligence on telephone numbers, vehicle registries, and subject records to prepare court-admissible dossiers.',
      icon: Award,
    },
    {
      title: 'Journalists & OSINT Researchers',
      desc: 'Verify public claims, map complex corporate networks, and unmask public background data safely with cryptographic data provenance.',
      icon: Newspaper,
    },
    {
      title: 'Corporate Due Diligence Teams',
      desc: 'Assess vendor risk, verify executive profiles, and prevent fraudulent transactions prior to major mergers or strategic investments.',
      icon: Briefcase,
    },
    {
      title: 'Developers & Integration Engineers',
      desc: 'Embed high-speed OSINT search capabilities directly into internal fraud engines, CRM portals, or custom investigation tools via REST API.',
      icon: Code,
    },
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
            <span className="text-emerald-400 font-medium">Target Users</span>
          </nav>

          {/* Hero */}
          <header className="flex flex-col items-start gap-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-mono text-emerald-400">
              <Users className="size-3.5" />
              <span>Tailored Intelligence Personas</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground">
              Who We Serve
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed">
              Huntme OSINT provides tailored intelligence tools for professionals who require lawful, verified, and AI-augmented public-source intelligence.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Button size="lg" className="gap-2" asChild>
                <Link href="/signup">
                  Create Free Account <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/products/phone-osint">
                  Explore Phone OSINT
                </Link>
              </Button>
            </div>
          </header>

          {/* Users Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {users.map((item, idx) => (
              <div key={idx} className="rounded-xl border border-border/80 bg-card/40 p-6 flex flex-col gap-3 hover:border-zinc-700 transition-all">
                <div className="flex items-center gap-2 text-white font-bold text-lg">
                  <item.icon className="size-5 text-emerald-400" />
                  <h2>{item.title}</h2>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

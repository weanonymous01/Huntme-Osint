import React from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/ui/header-3';
import { Footer } from '@/components/ui/footer';
import { constructMetadata, getBreadcrumbSchema } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = constructMetadata({
  title: 'Terms of Service | Huntme OSINT Platform',
  description:
    'Read the terms of service, acceptable use guidelines, and Fair Billing Guarantee for using Huntme OSINT intelligence services.',
  path: '/terms',
  keywords: ['Huntme Terms of Service', 'OSINT Acceptable Use Policy', 'Fair Billing Guarantee'],
});

export default function TermsPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Terms of Service', path: '/terms' },
  ]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-zinc-800 selection:text-white">
      <JsonLd data={breadcrumbSchema} />
      <Header />

      <main className="grow py-16 px-4 sm:px-6 md:py-24 max-w-4xl mx-auto w-full space-y-12">
        {/* Header Title */}
        <header className="space-y-4 text-center sm:text-left border-b border-zinc-800/80 pb-8">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Terms of Service
          </h1>
          <p className="text-sm sm:text-base text-zinc-400">
            Last Updated: August 6, 2026 • Please read these terms carefully before utilizing Huntme OSINT services.
          </p>
        </header>

        {/* Content Section */}
        <div className="space-y-8 text-sm sm:text-base text-zinc-300 leading-relaxed">
          <section className="space-y-3 bg-[#0d0d0e] p-6 rounded-2xl border border-zinc-800/90">
            <h2 className="text-lg font-bold text-white">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using the Huntme OSINT Platform ("Service"), operated by Huntme ("we", "us", or "our"), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the Service.
            </p>
          </section>

          <section className="space-y-3 bg-[#0d0d0e] p-6 rounded-2xl border border-zinc-800/90">
            <h2 className="text-lg font-bold text-white">
              2. Lawful OSINT Research & Acceptable Use
            </h2>
            <p>
              Huntme is an Open-Source Intelligence (OSINT) research tool designed strictly for lawful investigation, cybersecurity research, fraud prevention, due diligence, and enterprise risk management.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-400 text-sm">
              <li>You agree not to use the Service for stalking, harassment, unlawful surveillance, or identity theft.</li>
              <li>You must comply with all applicable local, state, national, and international data protection laws.</li>
              <li>Automated scraping or reverse engineering of Huntme API endpoints without explicit written authorization is prohibited.</li>
            </ul>
          </section>

          <section className="space-y-3 bg-[#0d0d0e] p-6 rounded-2xl border border-zinc-800/90">
            <h2 className="text-lg font-bold text-white">
              3. Credits, Subscriptions & Fair Billing Guarantee
            </h2>
            <p>
              Account credits grant non-transferable access to execute intelligence queries on the platform. You are responsible for safeguarding your account credentials and API authorization keys.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-400 text-sm">
              <li>
                <strong className="text-white">Zero Credit Deduction for Missing Records:</strong> If a search query (such as a phone number lookup) yields no results because the requested number does not exist in our database or third-party datasets, <strong className="text-white">this query will NOT consume your account credits</strong>.
              </li>
              <li>
                Credits are strictly deducted only upon successfully retrieving and providing intelligence search records.
              </li>
            </ul>
          </section>

          <section className="space-y-3 bg-[#0d0d0e] p-6 rounded-2xl border border-zinc-800/90">
            <h2 className="text-lg font-bold text-white">
              4. Database Coverage & Information Disclaimer
            </h2>
            <p>
              Huntme aggregates public index metadata and open-source intelligence records from multi-source databases.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-400 text-sm">
              <li>
                <strong className="text-white">No Guarantee of Complete Information:</strong> We do not claim, promise, or guarantee that intelligence records or personal information will be found for every phone number or target query searched on our platform.
              </li>
              <li>
                <strong className="text-white">Non-Existent Database Records:</strong> Some numbers may not exist within our indexed databases or third-party datasets. In such cases, we cannot provide information for that number.
              </li>
            </ul>
          </section>

          <section className="space-y-3 bg-[#0d0d0e] p-6 rounded-2xl border border-zinc-800/90">
            <h2 className="text-lg font-bold text-white">
              5. Limitation of Liability
            </h2>
            <p className="text-zinc-400 text-sm">
              Huntme aggregates public index metadata. We do not guarantee absolute accuracy or completeness of third-party public registries. In no event shall Huntme be liable for indirect, consequential, or punitive damages resulting from your reliance on search output.
            </p>
          </section>

          <section className="space-y-3 bg-[#0d0d0e] p-6 rounded-2xl border border-zinc-800/90">
            <h2 className="text-lg font-bold text-white">6. Contact Information</h2>
            <p className="text-zinc-400 text-sm">
              For questions regarding these Terms of Service, please contact our legal team at{' '}
              <a href="mailto:your.weanonymous@gmail.com" className="text-white underline">
                your.weanonymous@gmail.com
              </a>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

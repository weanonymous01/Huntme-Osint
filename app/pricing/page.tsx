import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/ui/header-3';
import { Footer } from '@/components/ui/footer';
import { Check, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { constructMetadata, getBreadcrumbSchema, getFaqSchema, getSoftwareAppSchema } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = constructMetadata({
  title: 'Huntme OSINT Pricing | Transparent Search Credits',
  description:
    'Simple, pay-as-you-go OSINT search credits starting at ₹79. Zero credit deduction guarantee for queries with no database records found.',
  path: '/pricing',
  keywords: [
    'Huntme Pricing',
    'OSINT Search Credits',
    'Affordable OSINT API',
    'Pay Per Search Intelligence',
    'Enterprise OSINT Subscription',
  ],
});

const pricingFaqs = [
  {
    q: 'How do Huntme credits work?',
    a: 'Each successful phone number or vehicle registration search consumes 1 credit. Unsuccessful queries where no records exist in our database consume ZERO credits.',
  },
  {
    q: 'What is the Fair Billing Guarantee?',
    a: 'We never charge you for empty search results. If a target identifier has no index records, your credit balance remains 100% untouched.',
  },
  {
    q: 'Do credits expire?',
    a: 'No. Purchased credits remain permanently active in your account balance until consumed.',
  },
  {
    q: 'Can I upgrade or purchase top-ups at any time?',
    a: 'Yes. You can top up additional credits instantly via secure Cashfree payment links directly from your account.',
  },
];

export default function PricingPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Pricing', path: '/pricing' },
  ]);

  const pricingSchema = getSoftwareAppSchema();
  const faqSchema = getFaqSchema(pricingFaqs);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-zinc-800 selection:text-white">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={pricingSchema} />
      <JsonLd data={faqSchema} />
      <Header />

      <main className="grow py-16 px-4 md:py-24">
        <div className="mx-auto max-w-5xl space-y-12">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground flex items-center justify-center gap-2">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-emerald-400 font-medium">Pricing</span>
          </nav>

          {/* Header Section */}
          <header className="flex flex-col items-center text-center gap-4 max-w-2xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
              Simple, Transparent Pricing
            </h1>
            <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">
              Choose the right credit plan for AI-powered OSINT searches and enterprise investigation workflows.
            </p>
          </header>

          {/* Fair Billing Guarantee Banner */}
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 max-w-3xl mx-auto flex items-center justify-center gap-3 text-emerald-400 text-sm font-medium text-center">
            <ShieldCheck className="size-5 shrink-0" />
            <span>Fair Billing Guarantee: Zero credit deduction if no records exist in our database for your query.</span>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto pt-4 items-stretch">
            {/* Plan 1: Pro */}
            <div className="rounded-2xl border border-zinc-800/90 bg-[#0d0d0e] p-8 flex flex-col justify-between shadow-2xl transition-all duration-300 hover:border-zinc-700">
              <div>
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold text-zinc-400 tracking-widest uppercase">
                    PRO
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold tracking-tight text-white">
                      ₹79
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 font-medium leading-relaxed">
                    Best for casual users and occasional investigations.
                  </p>
                </div>

                <div className="border-b border-zinc-800/80 my-6" />

                <div className="space-y-4">
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Includes
                  </p>
                  <ul className="space-y-3.5 text-sm">
                    <li className="flex items-center gap-3 text-zinc-200">
                      <Check className="size-4 text-zinc-400 shrink-0" />
                      <span className="font-semibold text-white">100 Credits</span>
                    </li>
                    <li className="flex items-center gap-3 text-zinc-300">
                      <Check className="size-4 text-zinc-400 shrink-0" />
                      <span>Phone Intelligence</span>
                    </li>
                    <li className="flex items-center gap-3 text-zinc-300">
                      <Check className="size-4 text-zinc-400 shrink-0" />
                      <span>Vehicle Intelligence</span>
                    </li>
                    <li className="flex items-center gap-3 text-zinc-300">
                      <Check className="size-4 text-zinc-400 shrink-0" />
                      <span>AI Case Assistant</span>
                    </li>
                    <li className="flex items-center gap-3 text-zinc-300">
                      <Check className="size-4 text-zinc-400 shrink-0" />
                      <span>Investigation Reports</span>
                    </li>
                    <li className="flex items-center gap-3 text-zinc-300">
                      <Check className="size-4 text-zinc-400 shrink-0" />
                      <span>Export Reports</span>
                    </li>
                    <li className="flex items-center gap-3 text-zinc-300">
                      <Check className="size-4 text-zinc-400 shrink-0" />
                      <span>Email Support</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-8">
                <a
                  href="https://payments.cashfree.com/forms/Huntme-pro"
                  target="_self"
                  className="w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/80 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all text-sm shadow-md"
                >
                  <span>Get Started</span>
                  <ArrowRight className="size-4" />
                </a>
              </div>
            </div>

            {/* Plan 2: Premium */}
            <div className="rounded-2xl border border-zinc-700 bg-[#0d0d0e] p-8 flex flex-col justify-between shadow-2xl transition-all duration-300 hover:border-zinc-600 relative">
              <div className="absolute -top-3.5 right-6 bg-zinc-800 border border-zinc-700 text-zinc-300 text-[11px] font-semibold px-3 py-1 rounded-full shadow-lg font-mono tracking-wider">
                MOST POPULAR
              </div>

              <div>
                <div className="space-y-4 pt-1">
                  <h3 className="text-xs font-semibold text-zinc-300 tracking-widest uppercase flex items-center gap-2">
                    PREMIUM
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold tracking-tight text-white">
                      ₹499
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 font-medium leading-relaxed">
                    Best Value for professionals and power users.
                  </p>
                </div>

                <div className="border-b border-zinc-800/80 my-6" />

                <div className="space-y-4">
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Includes
                  </p>
                  <ul className="space-y-3.5 text-sm">
                    <li className="flex items-center gap-3 text-zinc-200">
                      <Check className="size-4 text-white shrink-0" />
                      <span className="font-bold text-white">1,000 Credits</span>
                    </li>
                    <li className="flex items-center gap-3 text-zinc-200">
                      <Check className="size-4 text-white shrink-0" />
                      <span className="font-semibold text-white">Everything in Pro</span>
                    </li>
                    <li className="flex items-center gap-3 text-zinc-300">
                      <Check className="size-4 text-zinc-400 shrink-0" />
                      <span>Faster Processing</span>
                    </li>
                    <li className="flex items-center gap-3 text-zinc-300">
                      <Check className="size-4 text-zinc-400 shrink-0" />
                      <span>Priority Support</span>
                    </li>
                    <li className="flex items-center gap-3 text-zinc-300">
                      <Check className="size-4 text-zinc-400 shrink-0" />
                      <span>Early Access to New Features</span>
                    </li>
                    <li className="flex items-center gap-3 text-zinc-300">
                      <Check className="size-4 text-zinc-400 shrink-0" />
                      <span>1:1 Investigation Training</span>
                    </li>
                    <li className="flex items-center gap-3 text-zinc-300">
                      <Check className="size-4 text-zinc-400 shrink-0" />
                      <span>Priority Data Sources Points</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-8">
                <a
                  href="https://payments.cashfree.com/forms/huntme-premimum"
                  target="_self"
                  className="w-full bg-white hover:bg-zinc-200 text-black font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm shadow-xl"
                >
                  <span>Upgrade to Premium</span>
                  <ArrowRight className="size-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Pricing FAQs Section */}
          <section className="space-y-6 pt-12">
            <div className="flex items-center justify-center gap-2">
              <HelpCircle className="size-5 text-emerald-400" />
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center">Frequently Asked Questions</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {pricingFaqs.map((faq, idx) => (
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

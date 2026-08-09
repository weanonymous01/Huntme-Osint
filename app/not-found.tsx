import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/ui/header-3';
import { Footer } from '@/components/ui/footer';
import { Button } from '@/components/ui/button';
import { Search, PhoneCall, Car, BrainCircuit, ArrowRight, Home } from 'lucide-react';

export const metadata = {
  title: '404 - Page Not Found | Huntme OSINT',
  description: 'The requested intelligence record or page could not be located. Explore our OSINT investigation tools.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  const quickLinks = [
    {
      title: 'Phone Number OSINT',
      desc: 'Carrier, telecom circle & breach footprint lookup',
      href: '/products/phone-osint',
      icon: PhoneCall,
    },
    {
      title: 'Vehicle Number OSINT',
      desc: 'License plate and RTO public registration telemetry',
      href: '/products/vehicle-osint',
      icon: Car,
    },
    {
      title: 'AI Case Solver',
      desc: 'Entity correlation and timeline reconstruction',
      href: '/products/ai-case-solver',
      icon: BrainCircuit,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-zinc-800 selection:text-white">
      <Header />

      <main className="grow py-16 px-4 sm:px-6 md:py-24 max-w-4xl mx-auto w-full flex flex-col items-center justify-center text-center space-y-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3.5 py-1 text-xs font-mono text-rose-400">
            <Search className="size-3.5" />
            <span>404: RECORD_NOT_FOUND</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white">
            Target Query Not Located
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed">
            The page or record you are searching for might have been moved, renamed, or is temporarily unavailable in the database.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button size="lg" className="gap-2" asChild>
            <Link href="/">
              <Home className="size-4" /> Return to Homepage
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/help">
              Visit Help Center <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        {/* Suggested Tools Grid */}
        <div className="w-full pt-8 space-y-4 text-left">
          <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-500 text-center">
            Popular OSINT Investigation Modules
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickLinks.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="group rounded-xl border border-zinc-800/90 bg-[#0d0d0e] p-5 hover:border-zinc-700 transition-all flex flex-col gap-2"
              >
                <div className="flex items-center gap-2 text-white font-semibold group-hover:text-emerald-400 transition-colors">
                  <item.icon className="size-4 shrink-0" />
                  <span>{item.title}</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

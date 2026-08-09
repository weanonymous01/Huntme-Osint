import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/ui/header-3';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/ui/footer';
import { ArrowRight, Code2, ShieldCheck, Zap, HelpCircle } from 'lucide-react';
import { constructMetadata, getBreadcrumbSchema, getFaqSchema } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';
import { ApiCodeBlock } from '@/components/ui/api-code-block';

export const metadata: Metadata = constructMetadata({
  title: 'Developer REST API for OSINT & Threat Intelligence | Huntme',
  description:
    'Integrate high-speed phone, vehicle, and threat intelligence into SIEM/SOAR platforms with standardized JSON responses and sub-100ms latency.',
  path: '/products/rest-api',
  keywords: [
    'OSINT REST API',
    'Developer Threat Intelligence API',
    'Phone Lookup API',
    'Vehicle Intelligence API',
    'SIEM SOAR OSINT Integration',
    'Python OSINT Requests',
  ],
});

const apiFaqs = [
  {
    q: 'How do I authenticate with the Huntme REST API?',
    a: 'Authentication is handled via standard HTTP Bearer token headers. Pass your secret enterprise key: Authorization: Bearer <your_api_key>.',
  },
  {
    q: 'What is the average response latency of the API?',
    a: 'Our globally distributed edge endpoints achieve an average response time of under 100ms for cached and live query resolutions.',
  },
  {
    q: 'Can I integrate Huntme API into SIEM and SOAR platforms?',
    a: 'Yes. Standard JSON payloads make it easy to connect Huntme with Splunk, Cortex XSOAR, Microsoft Sentinel, IBM QRadar, or custom Python orchestration scripts.',
  },
];

const pythonSnippet = `import requests

url = "https://api.huntme.in/v1/investigate"
headers = {
    "Authorization": "Bearer huntme_live_9f8a3c2b1e",
    "Content-Type": "application/json"
}
payload = {
    "target": "+14155552671",
    "modules": ["phone", "carrier", "breaches"]
}

res = requests.post(url, json=payload, headers=headers)
data = res.json()
print("Discovered Entities:", data["entities"])`;

export default function RestApiPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products/rest-api' },
    { name: 'REST API', path: '/products/rest-api' },
  ]);

  const faqSchema = getFaqSchema(apiFaqs);

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
            <span className="text-emerald-400 font-medium">Developer REST API</span>
          </nav>

          {/* Hero */}
          <header className="flex flex-col items-start gap-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-mono text-emerald-400">
              <Code2 className="size-3.5" />
              <span>Low-Latency Intelligence Endpoints</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground">
              Developer REST API
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed">
              Integrate real-time OSINT intelligence into security platforms, investigation software, SIEM/SOAR workflows, and internal enterprise tools using standard HTTP requests and clean JSON responses.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Button size="lg" className="gap-2" asChild>
                <Link href="/login">
                  Get API Key <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/pricing">
                  View API Pricing
                </Link>
              </Button>
            </div>
          </header>

          {/* Workflow Grid */}
          <section className="space-y-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Integration Workflow</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-xl border border-border/80 bg-card/40 p-6 flex flex-col gap-3">
                <div className="size-8 rounded-full bg-muted font-mono flex items-center justify-center font-bold text-foreground">1</div>
                <h3 className="font-semibold text-lg text-foreground">1. Authenticate</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Pass your enterprise key using Bearer authentication in standard HTTP headers.</p>
              </div>
              <div className="rounded-xl border border-border/80 bg-card/40 p-6 flex flex-col gap-3">
                <div className="size-8 rounded-full bg-muted font-mono flex items-center justify-center font-bold text-foreground">2</div>
                <h3 className="font-semibold text-lg text-foreground">2. Query Targets</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Search phone numbers, vehicle registrations, domain WHOIS, or email intelligence.</p>
              </div>
              <div className="rounded-xl border border-border/80 bg-card/40 p-6 flex flex-col gap-3">
                <div className="size-8 rounded-full bg-muted font-mono flex items-center justify-center font-bold text-foreground">3</div>
                <h3 className="font-semibold text-lg text-foreground">3. Receive JSON</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Instantly process structured, standardized JSON payloads with zero parsing overhead.</p>
              </div>
            </div>
          </section>

          {/* Interactive Code Example */}
          <section>
            <ApiCodeBlock codeSnippet={pythonSnippet} />
          </section>

          {/* FAQs Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <HelpCircle className="size-5 text-emerald-400" />
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Frequently Asked Questions</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {apiFaqs.map((faq, idx) => (
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

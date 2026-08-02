'use client';

import React from 'react';
import { Header } from "@/components/ui/header-3";

export default function UseCasesPage() {
  const cases = [
    { title: "Investigating Unknown Contacts", desc: "Identify unknown incoming callers, carrier information, and public background associations." },
    { title: "Verifying Public Information", desc: "Validate claims, vehicle registrations, business filings, and open web mentions." },
    { title: "Digital & Cyber Investigations", desc: "Correlate OSINT artifacts across phone numbers, emails, domain WHOIS, and breach leaks." },
    { title: "Fraud Research & Prevention", desc: "Detect fraudulent accounts and synthetic identity attempts before they cause financial harm." },
    { title: "Security Operations (SOC/SOAR)", desc: "Enrich security alerts with automated OSINT intelligence via low-latency API integration." },
    { title: "Corporate Due Diligence", desc: "Conduct background diligence on vendors, partners, and key personnel prior to deals." },
    { title: "AI Evidence Organization", desc: "Automatically cluster evidence into timelines, graph connections, and exportable PDF briefs." },
    { title: "Enterprise API Integrations", desc: "Embed high-throughput intelligence directly into internal enterprise portals." },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="grow py-16 px-4">
        <div className="mx-auto max-w-5xl space-y-16">
          <div className="flex flex-col items-start gap-4 max-w-3xl">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground">
              Investigative Use Cases
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Explore how organizations leverage Huntme OSINT to accelerate investigations and reduce risk.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cases.map((item, idx) => (
              <div key={idx} className="rounded-xl border border-border/80 bg-card/40 p-6 flex flex-col gap-2 hover:border-border transition-all">
                <h2 className="text-xl font-bold text-foreground">{item.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

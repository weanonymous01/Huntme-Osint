'use client';

import React from 'react';
import { Header } from "@/components/ui/header-3";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Footer } from "@/components/ui/footer";

export default function PhoneOsintPage() {
  const resultsList = [
    { title: "Owner Name & Aliases", desc: "Discovered registered names and public directory records." },
    { title: "Alternate Phone Numbers", desc: "Cross-referenced associated landline and secondary mobile lines." },
    { title: "Connected Email Addresses", desc: "Associated email accounts linked across public data breaches." },
    { title: "Telecom Circle & Operator", desc: "Real-time carrier identification, network type, and geographic circle." },
    { title: "Publicly Available Addresses", desc: "Historical and current registered physical locations." },
    { title: "Related Public Records", desc: "Linked corporate filings, domain WHOIS, and public listings." },
    { title: "AI-Generated Summary", desc: "Instant synthesis of all phone intelligence into a concise report." },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="grow py-16 px-4">
        <div className="mx-auto max-w-5xl space-y-16">
          {/* Hero */}
          <div className="flex flex-col items-start gap-4 max-w-3xl">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground">
              Phone Number OSINT
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Search publicly available information related to any phone number. Transform raw phone numbers into rich, actionable intelligence profiles.
            </p>
            <div className="flex items-center gap-3 pt-4">
              <Button size="lg" className="gap-2">
                Start Phone Search <ArrowRight className="size-4" />
              </Button>
              <Button size="lg" variant="outline">
                View API Specs
              </Button>
            </div>
          </div>

          {/* Possible Results Grid */}
          <div className="space-y-8">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Discovered Data & Insights</h2>
              <p className="text-muted-foreground text-base">Comprehensive telemetry extracted from lawful open-source intelligence databases.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resultsList.map((item, idx) => (
                <div key={idx} className="rounded-xl border border-border/80 bg-card/40 p-6 flex flex-col gap-2 hover:border-emerald-500/50 transition-all">
                  <h3 className="font-semibold text-lg text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Summary Feature Box */}
          <div className="rounded-2xl border border-border bg-card/60 p-8 flex flex-col md:flex-row items-center gap-8 justify-between">
            <div className="space-y-3 max-w-xl">
              <h3 className="text-2xl font-bold text-foreground">Automated Risk & Entity Scoring</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our AI Case Assistant automatically cross-references phone telemetry with known breach indexes to calculate threat probability and highlight key connections.
              </p>
            </div>
            <Button size="lg" className="shrink-0">
              Request Enterprise Access
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

'use client';

import React from 'react';
import { Header } from "@/components/ui/header-3";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function InvestigationReportsPage() {
  const reportFeatures = [
    { title: "Search Summary", desc: "High-level overview of query targets, execution metadata, and data sources accessed." },
    { title: "AI Analysis", desc: "Automated natural language evaluation of threats, risk indicators, and entity importance." },
    { title: "Discovered Public Information", desc: "Raw and enriched data artifacts extracted from lawful open-source registries." },
    { title: "Related Entities & Mapping", desc: "Visualized network diagrams connecting phone numbers, emails, vehicles, and domains." },
    { title: "Investigation Timeline", desc: "Chronological activity log detailing historical events and registration dates." },
    { title: "Structured Findings", desc: "Clear bullet points categorized by risk level, evidence type, and confidence score." },
    { title: "1-Click PDF Export", desc: "Download court-ready, branded PDF reports formatted for legal and enterprise delivery." },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="grow py-16 px-4">
        <div className="mx-auto max-w-5xl space-y-16">
          {/* Hero */}
          <div className="flex flex-col items-start gap-4 max-w-3xl">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground">
              Investigation Reports
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Every search generates a comprehensive, professional report equipped with AI analysis, structured findings, timeline mapping, and instant PDF export.
            </p>
          </div>


          {/* Report Features */}
          <div className="space-y-8">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Report Contents</h2>
              <p className="text-muted-foreground text-base">Standardized structure included in every generated report.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reportFeatures.map((item, idx) => (
                <div key={idx} className="rounded-xl border border-border/80 bg-card/40 p-6 flex flex-col gap-2 hover:border-purple-500/50 transition-all">
                  <h3 className="font-semibold text-lg text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

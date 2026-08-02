'use client';

import React from 'react';
import { Header } from "@/components/ui/header-3";

export default function AboutCompanyPage() {
  const sellingPoints = [
    "AI-Powered Investigations with automated entity resolution",
    "Lawful Public-Source Intelligence aggregated across global data sets",
    "Structured Investigation Reports with 1-click court-ready PDF export",
    "Clean REST API built for rapid Python requests integration",
    "Enterprise-Ready Architecture featuring SOC-2 compliance & RBAC",
    "Sub-100ms API Latency with guaranteed 99.99% SLA availability",
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="grow py-16 px-4">
        <div className="mx-auto max-w-5xl space-y-16">
          {/* Mission */}
          <div className="flex flex-col items-start gap-4 max-w-3xl">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground">
              Modern OSINT Platform
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              AI-powered OSINT transforming public information into actionable investigative intelligence.
            </p>
          </div>

          {/* Long Term Vision Card */}
          <div className="rounded-2xl border border-border bg-card/60 p-8 sm:p-12 space-y-4">
            <div className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              LONG-TERM VISION
            </div>
            <p className="text-xl sm:text-2xl font-medium text-foreground leading-relaxed">
              "Become the AI-powered investigation platform for individuals, security teams, and developers by combining Open Source Intelligence, AI analysis, and enterprise-grade APIs into a single, modern platform focused on lawful public-source intelligence."
            </p>
          </div>

          {/* Key Selling Points */}
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Key Selling Points</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sellingPoints.map((point, idx) => (
                <div key={idx} className="flex items-center gap-3 rounded-lg border border-border/80 bg-card/40 p-4">
                  <span className="text-sm font-medium text-foreground">• {point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

'use client';

import React from 'react';
import { Header } from "@/components/ui/header-3";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function AiCaseSolverPage() {
  const capabilities = [
    { title: "Connect Related Entities", desc: "Link phone numbers, vehicles, email profiles, and physical addresses into a unified graph." },
    { title: "Summarize Findings", desc: "Instantly translate thousands of raw data points into actionable executive briefings." },
    { title: "Detect Relationships", desc: "Uncover hidden co-location occurrences, shared domain registrations, and cross-platform mentions." },
    { title: "Generate Investigation Reports", desc: "Auto-compile court and compliance-ready reports complete with citations." },
    { title: "Organize Evidence", desc: "Tag, categorize, and verify open-source artifacts with immutable chain-of-custody tracking." },
    { title: "Produce Structured Timelines", desc: "Chronologically map all discovered events, phone activity, and registry updates." },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="grow py-16 px-4">
        <div className="mx-auto max-w-5xl space-y-16">
          {/* Hero */}
          <div className="flex flex-col items-start gap-4 max-w-3xl">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground">
              AI Case Solver
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              AI automatically analyzes collected information to connect related entities, summarize complex findings, detect hidden relationships, and organize case evidence.
            </p>
            <div className="flex items-center gap-3 pt-4">
              <Button size="lg" className="gap-2" asChild>
                <a href="/login">
                  Try AI Assistant <ArrowRight className="size-4" />
                </a>
              </Button>
            </div>

          </div>

          {/* Capabilities Grid */}
          <div className="space-y-8">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Core AI Capabilities</h2>
              <p className="text-muted-foreground text-base">Intelligent automation designed for modern cyber investigators and intelligence analysts.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {capabilities.map((item, idx) => (
                <div key={idx} className="rounded-xl border border-border/80 bg-card/40 p-6 flex flex-col gap-2 hover:border-cyan-500/50 transition-all">
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

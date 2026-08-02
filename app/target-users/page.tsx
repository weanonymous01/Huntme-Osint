'use client';

import React from 'react';
import { Header } from "@/components/ui/header-3";

export default function TargetUsersPage() {
  const users = [
    { title: "Security Professionals & SOC Teams", desc: "Accelerate threat hunting, triage suspicious contacts, and correlate incident indicators." },
    { title: "Licensed Investigators", desc: "Gather lawful open-source intelligence on phone numbers, vehicles, and subject records." },
    { title: "Journalists & OSINT Researchers", desc: "Verify public facts, map entity networks, and discover public background data safely." },
    { title: "Corporate Due Diligence Teams", desc: "Assess vendor risk, verify executive profiles, and prevent fraudulent transactions." },
    { title: "Developers & Integration Engineers", desc: "Build automated investigation workflows into internal software using our REST API." },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="grow py-16 px-4">
        <div className="mx-auto max-w-5xl space-y-16">
          <div className="flex flex-col items-start gap-4 max-w-3xl">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground">
              Who We Serve
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Huntme OSINT provides tailored intelligence tools for professionals who require lawful, reliable public-source intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {users.map((item, idx) => (
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

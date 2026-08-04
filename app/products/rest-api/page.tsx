'use client';

import React, { useState } from 'react';
import { Header } from "@/components/ui/header-3";
import { Button } from "@/components/ui/button";
import { Terminal, Copy, Check, ArrowRight } from "lucide-react";

export default function RestApiPage() {
  const [copied, setCopied] = useState(false);

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

  const copyCode = () => {
    navigator.clipboard.writeText(pythonSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="grow py-16 px-4">
        <div className="mx-auto max-w-5xl space-y-16">
          {/* Hero */}
          <div className="flex flex-col items-start gap-4 max-w-3xl">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground">
              Developer-First REST API
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Integrate real-time OSINT intelligence into security platforms, investigation software, SIEM/SOAR workflows, and internal enterprise tools using standard HTTP requests and clean JSON responses.
            </p>
            <div className="flex items-center gap-3 pt-4">
              <Button size="lg" className="gap-2" asChild>
                <a href="/login">
                  Get API Key <ArrowRight className="size-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="/login">
                  Read API Documentation
                </a>
              </Button>
            </div>

          </div>

          {/* Workflow */}
          <div className="space-y-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">API Workflow</h2>
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
          </div>

          {/* Python Code Example */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Terminal className="size-5 text-emerald-400" /> Python Request Example
              </h3>
              <button
                onClick={copyCode}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 bg-card border border-border px-2.5 py-1.5 rounded-md"
              >
                {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                <span>{copied ? "Copied!" : "Copy Python Snippet"}</span>
              </button>
            </div>

            <div className="rounded-xl border border-border bg-black/90 p-5 font-mono text-xs overflow-x-auto text-zinc-300 leading-relaxed">
              <pre>{pythonSnippet}</pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

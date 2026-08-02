'use client';

import React, { useState } from 'react';
import { Copy, Check, Terminal, Code2, Aperture, Sliders, Activity, Layers, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

export function FeaturesSection() {
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const pythonCode = `import requests

# Enterprise OSINT API Request
url = "https://api.huntme.in/v1/investigate"

headers = {
    "Authorization": "Bearer huntme_live_9f8a3c2b1e",
    "Content-Type": "application/json"
}

payload = {
    "target": "+14155552671",
    "modules": ["phone", "carrier", "breaches", "social"]
}

response = requests.post(url, json=payload, headers=headers)
data = response.json()

print(f"Risk Score: {data['risk_score']}")
print(f"Entities Found: {len(data['entities'])}")`;

  const testimonials = [
    {
      name: "Aarav Verma",
      handle: "@aaravverma",
      initials: "AV",
      quote: "Huntme has become an essential part of our investigation workflow. The AI summaries save hours of manual research, and the phone intelligence results are incredibly accurate.",
    },
    {
      name: "Priya Sharma",
      handle: "@priyasharma",
      initials: "PS",
      quote: "We use Huntme daily for fraud investigations. The relationship analysis and connected entities feature help us uncover links that would otherwise be missed.",
    },
    {
      name: "Rahul Kumar",
      handle: "@rahulkumar",
      initials: "RK",
      quote: "The interface is fast, clean, and incredibly intuitive. Searching phone records and exporting reports takes only a few seconds, making investigations much more efficient.",
    },
    {
      name: "Ananya Mehta",
      handle: "@ananyamehta",
      initials: "AM",
      quote: "The AI Assistant has transformed how we handle investigations. It summarizes evidence, builds timelines, and generates professional reports almost instantly.",
    },
    {
      name: "Vikram Khanna",
      handle: "@vikramkhanna",
      initials: "VK",
      quote: "The Vehicle Intelligence module helped us verify ownership history within minutes. The confidence scores and investigation reports are extremely useful.",
    },
    {
      name: "Neha Singh",
      handle: "@nehasingh",
      initials: "NS",
      quote: "We integrated the Developer API into our internal platform without any issues. The documentation is excellent, and the API response times are consistently fast.",
    },
    {
      name: "Arjun Patel",
      handle: "@arjunpatel",
      initials: "AP",
      quote: "The platform provides everything our cybersecurity team needs in one place. Investigation timelines, risk analysis, and connected records make our workflow much more productive.",
    },
    {
      name: "Ishita Pandey",
      handle: "@ishitapandey",
      initials: "IP",
      quote: "The search performance is outstanding. Even large investigations return structured results quickly, and the export options make sharing reports effortless.",
    },
    {
      name: "Siddharth Malhotra",
      handle: "@siddharthmalhotra",
      initials: "SM",
      quote: "Huntme has significantly reduced the time required for background investigations. The AI-generated insights are surprisingly detailed and actionable.",
    },
    {
      name: "Kavya Gupta",
      handle: "@kavyagupta",
      initials: "KG",
      quote: "The dashboard feels like a premium enterprise product. Every feature is thoughtfully designed, and navigating between investigations is seamless.",
    },
    {
      name: "Rohan Yadav",
      handle: "@rohanyadav",
      initials: "RY",
      quote: "The JSON preview, API integration, and investigation reports are exactly what our engineering team needed. Everything is organized and easy to understand.",
    },
    {
      name: "Sneha Bansal",
      handle: "@snehabansal",
      initials: "SB",
      quote: "We evaluated several OSINT platforms before choosing Huntme. The speed, accuracy, and AI-powered investigation capabilities clearly stood out from the competition.",
    },
  ];

  const faqs = [
    {
      q: "What is Huntme?",
      a: "Huntme is an AI-powered Open Source Intelligence (OSINT) platform that helps investigators, cybersecurity teams, journalists, businesses, and researchers analyze publicly available information. It combines phone intelligence, vehicle intelligence, AI-powered investigation workflows, and REST APIs into a single enterprise platform.",
    },
    {
      q: "What intelligence can I search?",
      a: "Huntme allows you to investigate publicly available information related to: Phone Numbers, Vehicle Registration Numbers, Connected Public Records, Email Addresses, Related Entities, Risk Indicators, Investigation Timelines, and AI Relationship Analysis. The available data depends on jurisdiction and publicly accessible sources.",
    },
    {
      q: "Is the data legal to access?",
      a: "Yes. Huntme is designed to work with publicly available information and authorized data sources. The platform is intended for lawful investigations, cybersecurity research, fraud prevention, due diligence, and compliance purposes. Users are responsible for ensuring their use complies with applicable laws and regulations.",
    },
    {
      q: "How accurate are the investigation results?",
      a: "Each investigation includes an AI-generated Confidence Score based on source reliability, data consistency, and entity correlation. Confidence scores help analysts evaluate the reliability of findings before making decisions.",
    },
    {
      q: "Who is Huntme built for?",
      a: "Huntme is designed for: Cybersecurity Teams, Law Enforcement Agencies, Private Investigators, Journalists, Fraud Investigation Teams, Financial Institutions, Enterprise Security Teams, Compliance & Risk Analysts, and OSINT Researchers.",
    },
    {
      q: "Does Huntme provide an API?",
      a: "Yes. Our Developer API provides secure REST endpoints with Bearer Authentication, allowing developers to integrate phone intelligence, vehicle intelligence, AI analysis, and investigation workflows directly into their own applications.",
    },
    {
      q: "How does the AI Assistant help investigations?",
      a: "The built-in AI Assistant can summarize investigation findings, connect related entities, generate investigation timelines, detect hidden relationships, identify potential risks, recommend next investigation steps, produce detailed investigation reports, and export professional PDF reports.",
    },
    {
      q: "Is my investigation data secure?",
      a: "Absolutely. Huntme follows enterprise-grade security practices, including encrypted API communication, secure authentication, access controls, audit logging, and continuous platform monitoring to protect investigation data.",
    },
    {
      q: "Can I export investigation reports?",
      a: "Yes. Every investigation can be exported in multiple formats, including PDF Reports, JSON, CSV, API Response, and Shareable Investigation Reports.",
    },
    {
      q: "What support do you offer?",
      a: "Our support team provides technical assistance, API integration guidance, enterprise onboarding, and priority support for business customers. Documentation, developer resources, and knowledge base articles are also available to help you get started.",
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(pythonCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="w-full bg-background text-foreground py-16 space-y-24">
      {/* Section 1: Enterprise API Integration */}
      <section className="mx-auto max-w-5xl px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-mono text-muted-foreground w-fit shadow-xs">
              <Code2 className="size-3.5 text-emerald-400" />
              <span>Enterprise API</span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
              Simple REST API for Developers.
            </h2>

            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
              Integrate intelligence into your SIEM, SOAR, or investigation platform with a single HTTP request using standard libraries like Python <code className="text-foreground bg-muted px-1.5 py-0.5 rounded-md font-mono text-sm">requests</code>.
            </p>

            <div className="pt-4">
              <span className="text-xs font-mono font-semibold tracking-widest text-muted-foreground/70 uppercase block mb-6">
                QUICK INTEGRATION STEPS
              </span>

              <div className="space-y-6">
                <div className="flex items-start gap-4 group">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-card text-xs font-mono text-muted-foreground group-hover:border-foreground/40 group-hover:text-foreground transition-colors">
                    1
                  </div>
                  <p className="text-sm text-muted-foreground pt-1 group-hover:text-foreground/90 transition-colors">
                    Authenticate using your enterprise API key via Bearer header.
                  </p>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-card text-xs font-mono text-muted-foreground group-hover:border-foreground/40 group-hover:text-foreground transition-colors">
                    2
                  </div>
                  <p className="text-sm text-muted-foreground pt-1 group-hover:text-foreground/90 transition-colors">
                    Query phone numbers, vehicle records, or email profiles in real time.
                  </p>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-card text-xs font-mono text-muted-foreground group-hover:border-foreground/40 group-hover:text-foreground transition-colors">
                    3
                  </div>
                  <p className="text-sm text-muted-foreground pt-1 group-hover:text-foreground/90 transition-colors">
                    Receive clean, standardized JSON data with zero parsing overhead.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Python Code Window */}
          <div className="lg:col-span-6">
            <div className="rounded-xl border border-border/80 bg-black/90 shadow-2xl overflow-hidden font-mono text-xs relative">
              {/* Window Header */}
              <div className="flex items-center justify-between border-b border-border/40 bg-zinc-950/80 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="size-2.5 rounded-full bg-zinc-700" />
                  <div className="size-2.5 rounded-full bg-zinc-700" />
                  <div className="size-2.5 rounded-full bg-zinc-700" />
                </div>
                <button
                  onClick={handleCopy}
                  className="text-zinc-400 hover:text-zinc-200 transition-colors p-1.5 rounded-md hover:bg-zinc-800"
                  title="Copy Python Code"
                >
                  {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                </button>
              </div>

              {/* Code Content */}
              <div className="p-5 overflow-x-auto text-zinc-300 leading-relaxed space-y-1">
                <div className="flex gap-4">
                  <span className="text-zinc-600 select-none w-4 text-right">1</span>
                  <span><span className="text-rose-400">import</span> <span className="text-amber-300">requests</span></span>
                </div>
                <div className="flex gap-4 min-h-[1.5rem]">
                  <span className="text-zinc-600 select-none w-4 text-right">2</span>
                  <span className="text-zinc-500"># Enterprise OSINT API Request</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-zinc-600 select-none w-4 text-right">3</span>
                  <span><span className="text-zinc-400">url</span> = <span className="text-emerald-400">"https://api.huntme.in/v1/investigate"</span></span>
                </div>
                <div className="flex gap-4 min-h-[1.5rem]">
                  <span className="text-zinc-600 select-none w-4 text-right">4</span>
                  <span></span>
                </div>
                <div className="flex gap-4">
                  <span className="text-zinc-600 select-none w-4 text-right">5</span>
                  <span><span className="text-zinc-400">headers</span> = {'{'}</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-zinc-600 select-none w-4 text-right">6</span>
                  <span>&nbsp;&nbsp;<span className="text-emerald-400">"Authorization"</span>: <span className="text-emerald-400">"Bearer huntme_live_9f8a3c2b1e"</span>,</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-zinc-600 select-none w-4 text-right">7</span>
                  <span>&nbsp;&nbsp;<span className="text-emerald-400">"Content-Type"</span>: <span className="text-emerald-400">"application/json"</span></span>
                </div>
                <div className="flex gap-4">
                  <span className="text-zinc-600 select-none w-4 text-right">8</span>
                  <span>{'}'}</span>
                </div>
                <div className="flex gap-4 min-h-[1.5rem]">
                  <span className="text-zinc-600 select-none w-4 text-right">9</span>
                  <span></span>
                </div>
                <div className="flex gap-4">
                  <span className="text-zinc-600 select-none w-4 text-right">10</span>
                  <span><span className="text-zinc-400">payload</span> = {'{'}</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-zinc-600 select-none w-4 text-right">11</span>
                  <span>&nbsp;&nbsp;<span className="text-emerald-400">"target"</span>: <span className="text-emerald-400">"+14155552671"</span>,</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-zinc-600 select-none w-4 text-right">12</span>
                  <span>&nbsp;&nbsp;<span className="text-emerald-400">"modules"</span>: [<span className="text-emerald-400">"phone"</span>, <span className="text-emerald-400">"carrier"</span>, <span className="text-emerald-400">"breaches"</span>]</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-zinc-600 select-none w-4 text-right">13</span>
                  <span>{'}'}</span>
                </div>
                <div className="flex gap-4 min-h-[1.5rem]">
                  <span className="text-zinc-600 select-none w-4 text-right">14</span>
                  <span></span>
                </div>
                <div className="flex gap-4">
                  <span className="text-zinc-600 select-none w-4 text-right">15</span>
                  <span><span className="text-zinc-400">res</span> = <span className="text-amber-300">requests</span>.<span className="text-cyan-400">post</span>(url, json=payload, headers=headers)</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-zinc-600 select-none w-4 text-right">16</span>
                  <span><span className="text-zinc-400">data</span> = <span className="text-zinc-400">res</span>.<span className="text-cyan-400">json</span>()</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-zinc-600 select-none w-4 text-right">17</span>
                  <span><span className="text-cyan-400">print</span>(<span className="text-emerald-400">f"Risk Score: {'{'}"</span>data[<span className="text-emerald-400">'risk_score'</span>]<span className="text-emerald-400">{'}'}"</span>)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Engineered for enterprise scale */}
      <section className="mx-auto max-w-5xl px-4">
        <div className="flex flex-col gap-3 mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Engineered for enterprise scale.
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-3xl leading-relaxed">
            Built from the ground up for high-availability security operations, compliance, and automated threat hunting.
          </p>
        </div>

        <div className="space-y-6">
          {/* Card 1: Sub-100ms API Latency */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 rounded-xl border border-border/80 bg-card/30 p-6 md:p-8 hover:border-border transition-all">
            <div className="md:col-span-7 flex flex-col justify-center gap-2">
              <h3 className="text-lg font-semibold text-foreground">Sub-100ms API Latency</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Distributed global edge infrastructure ensures instant JSON responses. Query millions of telemetry data points without throttling your automated SOC playbooks.
              </p>
            </div>
            <div className="md:col-span-5">
              <div className="rounded-lg border border-border/60 bg-black/60 p-4 h-full min-h-[140px] flex flex-col justify-between font-mono">
                <div className="flex items-center justify-between text-[11px] text-zinc-500">
                  <span>LATENCY TELEMETRY</span>
                  <span className="text-emerald-400 font-semibold">42ms avg</span>
                </div>
                <div className="space-y-2.5 py-3">
                  <div className="h-2 w-3/4 bg-emerald-500/40 rounded-xs" />
                  <div className="h-2 w-1/2 bg-emerald-500/30 rounded-xs" />
                  <div className="h-2 w-5/6 bg-emerald-500/20 rounded-xs" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: 99.99% Enterprise Uptime */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 rounded-xl border border-border/80 bg-card/30 p-6 md:p-8 hover:border-border transition-all">
            <div className="md:col-span-7 flex flex-col justify-center gap-2">
              <h3 className="text-lg font-semibold text-foreground">99.99% Uptime SLA</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Guaranteed high-availability SLA backed by multi-region automatic failover for law enforcement and corporate security teams.
              </p>
            </div>
            <div className="md:col-span-5">
              <div className="rounded-lg border border-border/60 bg-black/60 p-4 h-full min-h-[140px] flex flex-col justify-between font-mono">
                <div className="flex items-center justify-between text-[11px] text-zinc-500">
                  <span>SLA HEALTH</span>
                  <span className="text-amber-400 font-semibold">99.99% UP</span>
                </div>
                <div className="space-y-2.5 py-3">
                  <div className="h-2 w-2/3 bg-amber-500/40 rounded-xs" />
                  <div className="h-2 w-1/2 bg-amber-500/30 rounded-xs" />
                  <div className="h-2 w-3/4 bg-amber-500/20 rounded-xs" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: SOC-2 & GDPR Compliant */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 rounded-xl border border-border/80 bg-card/30 p-6 md:p-8 hover:border-border transition-all">
            <div className="md:col-span-7 flex flex-col justify-center gap-2">
              <h3 className="text-lg font-semibold text-foreground">SOC-2 & GDPR Compliant</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                End-to-end encrypted API endpoints with granular role-based access control (RBAC) and immutable audit logging.
              </p>
            </div>
            <div className="md:col-span-5">
              <div className="rounded-lg border border-border/60 bg-black/60 p-4 h-full min-h-[140px] flex flex-col justify-between font-mono">
                <div className="flex items-center justify-between text-[11px] text-zinc-500">
                  <span>SECURITY AUDIT</span>
                  <span className="text-cyan-400 font-semibold">PASSED</span>
                </div>
                <div className="space-y-2.5 py-3">
                  <div className="h-2 w-3/5 bg-cyan-500/40 rounded-xs" />
                  <div className="h-2 w-4/5 bg-cyan-500/30 rounded-xs" />
                  <div className="h-2 w-1/2 bg-cyan-500/20 rounded-xs" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Monochrome Bento Grid - Target Industries & Personas */}
      <section className="mx-auto max-w-5xl px-4 pt-8">
        <div className="border-t border-zinc-800/80 pt-12 pb-8 space-y-16">
          {/* Header Row */}
          <div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <span className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase block mb-2">
                  TARGET PERSONAS
                </span>
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
                  Built For
                </h2>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-xs sm:text-sm text-zinc-400 max-w-md leading-relaxed">
                  Built for security professionals, law enforcement, fraud analysts, and due diligence teams.
                </p>
                <span className="border border-zinc-800 bg-zinc-900/80 rounded-full px-3 py-1 text-[11px] font-mono tracking-wider text-zinc-400 uppercase shrink-0 hidden sm:inline-block">
                  ENTERPRISE
                </span>
              </div>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Card 1 - Cybersecurity & SOC Teams */}
              <div className="md:col-span-8 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 sm:p-8 flex flex-col justify-between hover:border-zinc-700 transition-all min-h-[220px]">
                <div className="flex items-center justify-between">
                  <div className="size-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
                    <Aperture className="size-5" />
                  </div>
                  <span className="border border-zinc-800 bg-zinc-900/60 rounded-full px-2.5 py-0.5 text-[10px] font-mono tracking-wider text-zinc-400 uppercase">
                    SOC
                  </span>
                </div>
                <div className="mt-8 space-y-2">
                  <h3 className="font-bold text-sm tracking-wider text-white uppercase">
                    Cybersecurity & SOC Teams
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Rapid incident triage and threat hunting.
                  </p>
                </div>
              </div>

              {/* Card 2 - Law Enforcement & Investigators */}
              <div className="md:col-span-4 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 sm:p-8 flex flex-col justify-between hover:border-zinc-700 transition-all min-h-[220px]">
                <div className="flex items-center justify-between">
                  <div className="size-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
                    <Sliders className="size-5" />
                  </div>
                  <span className="border border-zinc-800 bg-zinc-900/60 rounded-full px-2.5 py-0.5 text-[10px] font-mono tracking-wider text-zinc-400 uppercase">
                    FORENSICS
                  </span>
                </div>
                <div className="mt-8 space-y-2">
                  <h3 className="font-bold text-sm tracking-wider text-white uppercase">
                    Law Enforcement
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Lawful public telemetry and evidence mapping.
                  </p>
                </div>
              </div>

              {/* Card 3 - Fintech & Fraud Analysts */}
              <div className="md:col-span-6 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 sm:p-8 flex flex-col justify-between hover:border-zinc-700 transition-all min-h-[200px]">
                <div className="flex items-center justify-between">
                  <div className="size-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
                    <Activity className="size-5" />
                  </div>
                  <span className="border border-zinc-800 bg-zinc-900/60 rounded-full px-2.5 py-0.5 text-[10px] font-mono tracking-wider text-zinc-400 uppercase">
                    FRAUD
                  </span>
                </div>
                <div className="mt-8 space-y-2">
                  <h3 className="font-bold text-sm tracking-wider text-white uppercase">
                    Fintech & Fraud Analysts
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Account verification and synthetic identity prevention.
                  </p>
                </div>
              </div>

              {/* Card 4 - Corporate Due Diligence */}
              <div className="md:col-span-6 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 sm:p-8 flex flex-col justify-between hover:border-zinc-700 transition-all min-h-[200px]">
                <div className="flex items-center justify-between">
                  <div className="size-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
                    <Layers className="size-5" />
                  </div>
                  <span className="border border-zinc-800 bg-zinc-900/60 rounded-full px-2.5 py-0.5 text-[10px] font-mono tracking-wider text-zinc-400 uppercase">
                    RISK
                  </span>
                </div>
                <div className="mt-8 space-y-2">
                  <h3 className="font-bold text-sm tracking-wider text-white uppercase">
                    Corporate Due Diligence
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Executive background checks and vendor risk assessment.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Start Building Today CTA Card */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-8 sm:p-14 flex flex-col items-center text-center gap-6 shadow-2xl">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
              Start building today.
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-xl leading-relaxed">
              Deploy your infrastructure in seconds. No complex configuration, no credit card required. Just raw performance out of the box.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                href="/products/rest-api"
                className="bg-white text-black font-semibold px-5 py-2.5 rounded-lg hover:bg-zinc-200 transition-colors flex items-center gap-2 text-sm"
              >
                Get Started <ArrowRight className="size-4" />
              </a>
              <a
                href="/products/rest-api"
                className="border border-zinc-800 bg-transparent text-white font-medium px-5 py-2.5 rounded-lg hover:bg-zinc-900 transition-colors text-sm"
              >
                Read Documentation
              </a>
            </div>
          </div>

          {/* Section 5: Testimonials Grid ("Read what people are saying") */}
          <div className="pt-8 space-y-10">
            <div className="text-center space-y-2 max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Trusted by Investigators Across India
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm font-normal leading-relaxed">
                See how cybersecurity professionals, investigators, journalists, and enterprises across India use Huntme to accelerate OSINT investigations with confidence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-6 flex flex-col justify-start gap-4 hover:border-zinc-700 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center font-semibold text-xs text-zinc-200 shrink-0">
                      {item.initials}
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="font-bold text-sm text-white leading-tight">
                        {item.name}
                      </h4>
                      <p className="text-xs text-zinc-500 font-mono mt-0.5">
                        {item.handle}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                    {item.quote}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 6: Frequently Asked Questions */}
          <div className="pt-12 space-y-8">
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
                Frequently Asked Questions
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base max-w-3xl leading-relaxed">
                Everything you need to know about Huntme and our AI-powered OSINT investigation platform. If you can't find the answer you're looking for, our team is here to help.
              </p>
            </div>

            {/* Accordion Container */}
            <div className="rounded-2xl border border-zinc-800/90 bg-zinc-950/60 overflow-hidden divide-y divide-zinc-800/60">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="transition-colors">
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 hover:bg-zinc-900/40 transition-colors"
                    >
                      <span className="font-semibold text-base sm:text-lg text-white">
                        {faq.q}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="size-5 text-zinc-400 shrink-0" />
                      ) : (
                        <ChevronDown className="size-5 text-zinc-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 pt-1 text-sm text-zinc-400 leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Still Have Questions Footer Link */}
            <div className="pt-2 text-sm text-zinc-400">
              Can't find what you're looking for?{" "}
              <a
                href="/company/about"
                className="font-semibold text-white hover:underline"
              >
                Contact our customer support team
              </a>
            </div>
          </div>

          {/* Footer Line Under Grid */}
          <div className="pt-6 border-t border-zinc-900 flex items-center justify-between text-[11px] font-mono text-zinc-600 tracking-widest uppercase">
            <span>LAWFUL OPEN SOURCE INTELLIGENCE FOR ENTERPRISE SECURITY OPERATIONS.</span>
          </div>
        </div>
      </section>
    </div>
  );
}

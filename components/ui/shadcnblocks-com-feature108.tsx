'use client';

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { PhoneCall, Car, BrainCircuit, Terminal, Copy, Check } from "lucide-react";

interface TabContent {
  badge: string;
  title: string;
  description: string;
  buttonText: string;
  href?: string;
  imageSrc?: string;
  imageAlt?: string;
  jsonFilename?: string;
  jsonData?: any;
}

interface Tab {
  value: string;
  icon: React.ReactNode;
  label: string;
  content: TabContent;
}

interface Feature108Props {
  badge?: string;
  heading?: string;
  description?: string;
  tabs?: Tab[];
}

function JsonTerminalWindow({ filename, data }: { filename: string; data: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(data);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-full rounded-2xl border border-[#26262a] bg-[#111113] shadow-2xl overflow-hidden font-mono text-[11px] sm:text-xs text-left relative">
      {/* Terminal Bar */}
      <div className="flex items-center justify-between border-b border-[#26262a] bg-[#161619] px-3.5 py-2.5 sm:px-4 sm:py-3">
        <div className="flex items-center gap-2">
          <div className="size-2.5 sm:size-3 rounded-full bg-rose-500/80" />
          <div className="size-2.5 sm:size-3 rounded-full bg-amber-500/80" />
          <div className="size-2.5 sm:size-3 rounded-full bg-emerald-500/80" />
        </div>
        <button
          onClick={handleCopy}
          className="text-zinc-400 hover:text-white transition-colors p-1 rounded-md hover:bg-zinc-800"
          title="Copy JSON Payload"
        >
          {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
        </button>
      </div>

      {/* JSON Code Viewer */}
      <div className="p-3.5 sm:p-5 overflow-x-auto text-zinc-300 leading-relaxed max-h-[380px] bg-[#111113] w-full max-w-full">
        <pre className="text-[10px] sm:text-xs font-mono tracking-normal leading-relaxed text-zinc-300">
          <code>
            {filename === "phone_telemetry.json" && (
              <>
                <span className="text-zinc-500">{'{'}</span>{'\n'}
                {'  '}<span className="text-rose-400">"status"</span>: <span className="text-emerald-400">"success"</span>,{'\n'}
                {'  '}<span className="text-rose-400">"query"</span>: <span className="text-emerald-400">"+91 98765 43210"</span>,{'\n'}
                {'  '}<span className="text-rose-400">"timestamp"</span>: <span className="text-emerald-400">"2026-08-02T02:42:00Z"</span>,{'\n'}
                {'  '}<span className="text-rose-400">"phone_intelligence"</span>: <span className="text-zinc-500">{'{'}</span>{'\n'}
                {'    '}<span className="text-cyan-400">"carrier"</span>: <span className="text-emerald-400">"Bharti Airtel VoLTE"</span>,{'\n'}
                {'    '}<span className="text-cyan-400">"circle"</span>: <span className="text-emerald-400">"Delhi NCR, India"</span>,{'\n'}
                {'    '}<span className="text-cyan-400">"line_type"</span>: <span className="text-emerald-400">"Mobile / Active"</span>,{'\n'}
                {'    '}<span className="text-cyan-400">"risk_score"</span>: <span className="text-amber-400">12</span>,{'\n'}
                {'    '}<span className="text-cyan-400">"owner_identity"</span>: <span className="text-zinc-500">{'{'}</span>{'\n'}
                {'      '}<span className="text-purple-400">"name_match"</span>: <span className="text-emerald-400">"Aarav Verma"</span>,{'\n'}
                {'      '}<span className="text-purple-400">"associated_emails"</span>: <span className="text-amber-400">2</span>,{'\n'}
                {'      '}<span className="text-purple-400">"linked_socials"</span>: [<span className="text-emerald-400">"WhatsApp"</span>, <span className="text-emerald-400">"Telegram"</span>, <span className="text-emerald-400">"LinkedIn"</span>]{'\n'}
                {'    '}<span className="text-zinc-500">{'}'}</span>,{'\n'}
                {'    '}<span className="text-cyan-400">"breach_telemetry"</span>: <span className="text-zinc-500">{'{'}</span>{'\n'}
                {'      '}<span className="text-purple-400">"breaches_found"</span>: <span className="text-emerald-400">true</span>,{'\n'}
                {'      '}<span className="text-purple-400">"pwned_databases"</span>: [<span className="text-emerald-400">"Verifications_DB_2024"</span>]{'\n'}
                {'    '}<span className="text-zinc-500">{'}'}</span>{'\n'}
                {'  '}<span className="text-zinc-500">{'}'}</span>{'\n'}
                <span className="text-zinc-500">{'}'}</span>
              </>
            )}

            {filename === "vehicle_records.json" && (
              <>
                <span className="text-zinc-500">{'{'}</span>{'\n'}
                {'  '}<span className="text-rose-400">"status"</span>: <span className="text-emerald-400">"success"</span>,{'\n'}
                {'  '}<span className="text-rose-400">"plate_number"</span>: <span className="text-emerald-400">"DL 01 AB 1234"</span>,{'\n'}
                {'  '}<span className="text-rose-400">"vehicle_intelligence"</span>: <span className="text-zinc-500">{'{'}</span>{'\n'}
                {'    '}<span className="text-cyan-400">"maker"</span>: <span className="text-emerald-400">"Tata Motors Passenger Vehicles"</span>,{'\n'}
                {'    '}<span className="text-cyan-400">"model"</span>: <span className="text-emerald-400">"Nexon EV Max"</span>,{'\n'}
                {'    '}<span className="text-cyan-400">"vehicle_class"</span>: <span className="text-emerald-400">"Motor Car (LMV)"</span>,{'\n'}
                {'    '}<span className="text-cyan-400">"registration_date"</span>: <span className="text-emerald-400">"2023-05-14"</span>,{'\n'}
                {'    '}<span className="text-cyan-400">"rto_location"</span>: <span className="text-emerald-400">"RTO Mall Road, New Delhi"</span>,{'\n'}
                {'    '}<span className="text-cyan-400">"insurance_valid_until"</span>: <span className="text-emerald-400">"2027-05-13"</span>,{'\n'}
                {'    '}<span className="text-cyan-400">"pucc_status"</span>: <span className="text-emerald-400">"Active / Compliant"</span>,{'\n'}
                {'    '}<span className="text-cyan-400">"blacklist_history"</span>: <span className="text-emerald-400">false</span>{'\n'}
                {'  '}<span className="text-zinc-500">{'}'}</span>{'\n'}
                <span className="text-zinc-500">{'}'}</span>
              </>
            )}

            {filename === "ai_case_analysis.json" && (
              <>
                <span className="text-zinc-500">{'{'}</span>{'\n'}
                {'  '}<span className="text-rose-400">"case_id"</span>: <span className="text-emerald-400">"CASE-2026-8942"</span>,{'\n'}
                {'  '}<span className="text-rose-400">"ai_relationship_map"</span>: <span className="text-zinc-500">{'{'}</span>{'\n'}
                {'    '}<span className="text-cyan-400">"confidence_score"</span>: <span className="text-amber-400">98.4</span>,{'\n'}
                {'    '}<span className="text-cyan-400">"primary_subject"</span>: <span className="text-emerald-400">"Target_Target_Node_49"</span>,{'\n'}
                {'    '}<span className="text-cyan-400">"connected_entities"</span>: <span className="text-amber-400">4</span>,{'\n'}
                {'    '}<span className="text-cyan-400">"risk_summary"</span>: <span className="text-emerald-400">"Synthetic identity correlation detected across 2 regional endpoints."</span>,{'\n'}
                {'    '}<span className="text-cyan-400">"recommended_action"</span>: <span className="text-emerald-400">"Issue automated SOC flag & initiate deep phone telemetry sweep."</span>{'\n'}
                {'  '}<span className="text-zinc-500">{'}'}</span>{'\n'}
                <span className="text-zinc-500">{'}'}</span>
              </>
            )}
          </code>
        </pre>
      </div>
    </div>
  );
}

const Feature108 = ({
  badge = "Platform Features",
  heading = "OSINT Solutions",
  description = "Phone intelligence, vehicle lookups, and AI-powered case analysis in one platform.",
  tabs = [
    {
      value: "tab-1",
      icon: <PhoneCall className="h-auto w-4 shrink-0" />,
      label: "Phone Intelligence",
      content: {
        badge: "Phone Lookup",
        title: "Phone Intelligence",
        description:
          "Search publicly available phone intelligence with AI-powered analysis and structured investigation reports.",
        buttonText: "Explore Phone OSINT",
        href: "/products/phone-osint",
        jsonFilename: "phone_telemetry.json",
        jsonData: "Phone Intelligence JSON",
      },
    },
    {
      value: "tab-2",
      icon: <Car className="h-auto w-4 shrink-0" />,
      label: "Vehicle Intelligence",
      content: {
        badge: "Plate & VIN Search",
        title: "Vehicle Intelligence",
        description:
          "Access vehicle records instantly with AI-driven insights and comprehensive investigation summaries.",
        buttonText: "Explore Vehicle OSINT",
        href: "/products/vehicle-osint",
        jsonFilename: "vehicle_records.json",
        jsonData: "Vehicle Intelligence JSON",
      },
    },
    {
      value: "tab-3",
      icon: <BrainCircuit className="h-auto w-4 shrink-0" />,
      label: "AI Assistant",
      content: {
        badge: "AI Analysis",
        title: "AI Assistant",
        description:
          "Analyze evidence, connect information, and generate complete investigation reports using AI.",
        buttonText: "Try AI Assistant",
        href: "/products/ai-case-solver",
        jsonFilename: "ai_case_analysis.json",
        jsonData: "AI Assistant JSON",
      },
    },
  ],
}: Feature108Props) => {
  return (
    <section className="py-16 sm:py-24 bg-[#0a0a0b] overflow-hidden w-full">
      <div className="container mx-auto px-4 max-w-full">
        <div className="flex flex-col items-center gap-3 text-center mb-8 sm:mb-10">
          <h1 className="max-w-2xl text-3xl font-bold tracking-tight text-white md:text-5xl">
            {heading}
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl leading-relaxed">{description}</p>
        </div>

        <Tabs defaultValue={tabs[0].value} className="mt-6 sm:mt-8 max-w-5xl mx-auto w-full">
          <div className="flex justify-center w-full px-2">
            <TabsList className="inline-flex flex-wrap sm:flex-nowrap items-center justify-center gap-1.5 sm:gap-2 rounded-2xl border border-[#222225] bg-[#121213] p-1.5 shadow-lg w-full sm:w-auto">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex items-center justify-center rounded-xl px-3 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold text-zinc-400 data-[state=active]:bg-[#242428] data-[state=active]:text-white data-[state=active]:shadow-sm cursor-pointer transition-all shrink-0"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="mx-auto mt-6 sm:mt-8 rounded-2xl border border-[#222225] bg-[#121213] p-4 sm:p-8 lg:p-14 shadow-2xl w-full max-w-full overflow-hidden">
            {tabs.map((tab) => (
              <TabsContent
                key={tab.value}
                value={tab.value}
                className="grid place-items-center gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-10 w-full max-w-full"
              >
                <div className="flex flex-col gap-4 sm:gap-6 text-left w-full">
                  <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight lg:text-5xl">
                    {tab.content.title}
                  </h3>
                  <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                    {tab.content.description}
                  </p>
                  <a
                    href={tab.content.href || "#"}
                    className="mt-1 sm:mt-2 inline-flex items-center gap-2 w-fit bg-white text-black font-semibold px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm hover:bg-zinc-200 transition-colors shadow-md"
                  >
                    {tab.content.buttonText}
                  </a>
                </div>
                
                {/* Custom JSON Telemetry Terminal Window */}
                <div className="w-full max-w-full min-w-0 overflow-hidden">
                  <JsonTerminalWindow
                    filename={tab.content.jsonFilename || (tab.value === "tab-2" ? "vehicle_records.json" : tab.value === "tab-3" ? "ai_case_analysis.json" : "phone_telemetry.json")}
                    data={tab.content.jsonData || ""}
                  />
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export { Feature108 };

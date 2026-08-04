'use client';

import React from 'react';
import { Header } from "@/components/ui/header-3";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function VehicleOsintPage() {
  const resultsList = [
    { title: "Registration Details", desc: "Official public registration history and active status records." },
    { title: "Vehicle Make & Model", desc: "Detailed specs, manufacturing year, vehicle trim level, and fuel type." },
    { title: "Registration State & Region", desc: "Jurisdiction, regional transport office (RTO) code, and location data." },
    { title: "Registration Status", desc: "Active, expired, transferred, or blacklisted status alerts." },
    { title: "Insurance & Fitness Logs", desc: "Public validity timestamps for vehicle insurance and roadworthiness." },
    { title: "AI-Generated Summary", desc: "Automated report synthesizing vehicle ownership timeline and anomalies." },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="grow py-16 px-4">
        <div className="mx-auto max-w-5xl space-y-16">
          {/* Hero */}
          <div className="flex flex-col items-start gap-4 max-w-3xl">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground">
              Vehicle Number OSINT
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Search vehicle registration information from lawful public sources. Instantly query license plate data, VIN records, and historical vehicle telemetry.
            </p>
            <div className="flex items-center gap-3 pt-4">
              <Button size="lg" className="gap-2" asChild>
                <a href="/login">
                  Lookup License Plate <ArrowRight className="size-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="/login">
                  View API Specs
                </a>
              </Button>
            </div>

          </div>

          {/* Possible Results Grid */}
          <div className="space-y-8">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Extracted Vehicle Telemetry</h2>
              <p className="text-muted-foreground text-base">Standardized vehicle intelligence gathered from verified public transport databases.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resultsList.map((item, idx) => (
                <div key={idx} className="rounded-xl border border-border/80 bg-card/40 p-6 flex flex-col gap-2 hover:border-amber-500/50 transition-all">
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

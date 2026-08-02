'use client';

import React from 'react';
import { Header } from "@/components/ui/header-3";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function EnterpriseInfraPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="grow py-16 px-4">
        <div className="mx-auto max-w-5xl space-y-16">
          {/* Hero */}
          <div className="flex flex-col items-start gap-4 max-w-3xl">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground">
              Enterprise Infrastructure
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Built for high-availability security operations, sub-100ms latency, 99.99% uptime SLAs, and strict SOC-2 & GDPR compliance boundaries.
            </p>
            <div className="flex items-center gap-3 pt-4">
              <Button size="lg" className="gap-2">
                Contact Enterprise Team <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Fast Performance */}
            <div className="rounded-xl border border-border/80 bg-card/40 p-6 flex flex-col gap-4">
              <h2 className="text-xl font-bold text-foreground">Fast Performance</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Sub-100ms API latency</li>
                <li>• Distributed edge nodes</li>
                <li>• Optimized JSON payloads</li>
              </ul>
            </div>

            {/* High Availability */}
            <div className="rounded-xl border border-border/80 bg-card/40 p-6 flex flex-col gap-4">
              <h2 className="text-xl font-bold text-foreground">High Availability</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• 99.99% uptime target SLA</li>
                <li>• Multi-region failover</li>
                <li>• Automated load balancing</li>
              </ul>
            </div>

            {/* Security */}
            <div className="rounded-xl border border-border/80 bg-card/40 p-6 flex flex-col gap-4">
              <h2 className="text-xl font-bold text-foreground">Enterprise Security</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• End-to-end encryption</li>
                <li>• Role-Based Access (RBAC)</li>
                <li>• Immutable audit logs</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

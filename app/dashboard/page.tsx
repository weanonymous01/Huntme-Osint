'use client';

import React, { useState } from 'react';
import {
  PhoneCall,
  Car,
  BrainCircuit,
  FileText,
  Settings,
  Search,
  RefreshCw,
  User,
  MapPin,
  Phone,
  Signal,
  AlertCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

type PhoneResult = {
  name: string;
  mobile: string;
  alternativeMobile: string | null;
  fatherName: string | null;
  address: string | null;
  circle: string | null;
  idNumber: string | null;
  email: string | null;
};

// Render AI report markdown sections with styled headings and dork blocks
function AIReportSection({ text }: { text: string }) {
  const lines = text.split('\n');

  const renderInline = (content: string) => {
    // Handle bold **text** and inline `code`
    const parts = content.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
    return parts.map((part, j) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={j} className="font-mono text-[11px] bg-zinc-800 text-emerald-300 px-1.5 py-0.5 rounded border border-zinc-700">
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={j} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="space-y-3">
      {lines.map((line, i) => {
        // Numbered section heading: ## 1. Title or ## Title
        if (/^## /.test(line)) {
          const title = line.replace(/^## \d+\.\s*/, '').replace(/^## /, '');
          return (
            <h3 key={i} className="text-[13px] font-bold text-white pt-4 pb-1 border-t border-zinc-800/80 flex items-center gap-2 first:pt-0 first:border-t-0">
              <Sparkles className="size-3 text-purple-400 shrink-0" />
              {title}
            </h3>
          );
        }
        // Bullet list item
        if (/^[-•] /.test(line)) {
          return (
            <div key={i} className="flex gap-2 pl-1">
              <span className="text-purple-400 mt-0.5 shrink-0 text-xs">›</span>
              <p className="text-xs text-zinc-300 leading-relaxed">{renderInline(line.replace(/^[-•] /, ''))}</p>
            </div>
          );
        }
        // Numbered list items (1. 2. etc for dorks)
        if (/^\d+\. /.test(line)) {
          const num = line.match(/^(\d+)\./)?.[1];
          const content = line.replace(/^\d+\. /, '');
          // If it's a dork (contains site: or intext: or filetype:)
          if (/site:|intext:|filetype:|intitle:|OR /.test(content)) {
            return (
              <div key={i} className="flex items-start gap-2 pl-1">
                <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 border border-purple-500/20 px-1.5 py-0.5 rounded shrink-0 mt-0.5">{num}</span>
                <code className="font-mono text-[11px] bg-zinc-900 text-emerald-300 px-2 py-1 rounded border border-zinc-700/80 break-all leading-relaxed flex-1">
                  {content.replace(/`/g, '')}
                </code>
              </div>
            );
          }
          return (
            <div key={i} className="flex gap-2 pl-1">
              <span className="text-[11px] font-mono text-zinc-500 shrink-0 mt-0.5">{num}.</span>
              <p className="text-xs text-zinc-300 leading-relaxed">{renderInline(content)}</p>
            </div>
          );
        }
        // Platform ratings: lines with HIGH / MEDIUM / LOW
        if (/\b(HIGH|MEDIUM|LOW)\b/.test(line) && line.includes(':')) {
          const [platform, ...rest] = line.split(':');
          const ratingText = rest.join(':').trim();
          const rating = ratingText.match(/\b(HIGH|MEDIUM|LOW)\b/)?.[1];
          const ratingColor = rating === 'HIGH' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : rating === 'MEDIUM' ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' : 'text-zinc-400 bg-zinc-700/30 border-zinc-700/40';
          return (
            <div key={i} className="flex items-center justify-between gap-4 py-1.5 border-b border-zinc-800/40 pl-1">
              <span className="text-xs text-zinc-400">{renderInline(platform.trim())}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ratingColor}`}>{rating}</span>
            </div>
          );
        }
        // Confidence score line
        if (/score|confidence|rating/i.test(line) && /\d/.test(line)) {
          return (
            <p key={i} className="text-xs text-zinc-300 leading-relaxed font-mono bg-zinc-900/60 px-3 py-1.5 rounded border border-zinc-800/60">
              {renderInline(line)}
            </p>
          );
        }
        // Separator line
        if (/^---+$/.test(line.trim())) {
          return <hr key={i} className="border-zinc-800/60" />;
        }
        // Empty line
        if (line.trim() === '') return null;
        // Regular paragraph
        return (
          <p key={i} className="text-xs text-zinc-300 leading-relaxed pl-1">
            {renderInline(line)}
          </p>
        );
      })}
    </div>
  );
}

// Reusable Skeleton Report Component
function ReportSkeleton({ type }: { type: 'phone' | 'vehicle' }) {
  return (
    <div className="rounded-2xl border border-zinc-800/90 bg-[#0d0d10] p-6 sm:p-8 space-y-8 shadow-2xl">
      {/* Skeleton Report Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Query Placeholder */}
            <div className="h-8 w-44 bg-zinc-800/90 rounded-lg animate-pulse" />
            {/* Badge Placeholders */}
            <div className="h-6 w-24 bg-zinc-800/70 rounded-full animate-pulse" />
            <div className="h-6 w-32 bg-zinc-800/70 rounded-full animate-pulse" />
          </div>
          <div className="h-3.5 w-72 bg-zinc-800/50 rounded animate-pulse" />
        </div>

        {/* Action Button Skeletons */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="h-9 w-24 bg-zinc-800/80 rounded-lg animate-pulse" />
          <div className="h-9 w-32 bg-zinc-800/80 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Skeleton Section 1: Network & Telemetry Specs */}
      <div className="space-y-4">
        <div className="h-4 w-48 bg-zinc-800/80 rounded animate-pulse" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl border border-zinc-800/80 bg-[#121215] p-4 space-y-2">
              <div className="h-3 w-20 bg-zinc-800/60 rounded animate-pulse" />
              <div className="h-6 w-36 bg-zinc-800/90 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Skeleton Section 2: Discovered Owner & Linked Footprint */}
      <div className="space-y-4">
        <div className="h-4 w-64 bg-zinc-800/80 rounded animate-pulse" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1 */}
          <div className="rounded-xl border border-zinc-800/80 bg-[#121215] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
              <div className="h-3 w-28 bg-zinc-800/60 rounded animate-pulse" />
              <div className="h-5 w-20 bg-zinc-800/70 rounded animate-pulse" />
            </div>
            <div className="h-7 w-48 bg-zinc-800/90 rounded animate-pulse" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-zinc-800/50 rounded animate-pulse" />
              <div className="h-3 w-3/4 bg-zinc-800/50 rounded animate-pulse" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-xl border border-zinc-800/80 bg-[#121215] p-5 space-y-4">
            <div className="border-b border-zinc-800/60 pb-3">
              <div className="h-3 w-36 bg-zinc-800/60 rounded animate-pulse" />
            </div>
            <div className="space-y-2.5">
              <div className="h-4 w-full bg-zinc-800/70 rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-zinc-800/70 rounded animate-pulse" />
            </div>
            <div className="flex gap-2 pt-1">
              <div className="h-5 w-24 bg-zinc-800/60 rounded animate-pulse" />
              <div className="h-5 w-24 bg-zinc-800/60 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Skeleton Section 3: Breach Intelligence & Leak Indexes */}
      <div className="space-y-4">
        <div className="h-4 w-56 bg-zinc-800/80 rounded animate-pulse" />

        <div className="rounded-xl border border-zinc-800/80 bg-[#121215] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-4 w-44 bg-zinc-800/70 rounded animate-pulse" />
            <div className="h-4 w-28 bg-zinc-800/70 rounded animate-pulse" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-lg bg-zinc-900/80 border border-zinc-800 space-y-2">
              <div className="h-4 w-32 bg-zinc-800/90 rounded animate-pulse" />
              <div className="h-3 w-48 bg-zinc-800/50 rounded animate-pulse" />
            </div>
            <div className="p-4 rounded-lg bg-zinc-900/80 border border-zinc-800 space-y-2">
              <div className="h-4 w-32 bg-zinc-800/90 rounded animate-pulse" />
              <div className="h-3 w-48 bg-zinc-800/50 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Skeleton Section 4: AI Assistant Executive Summary */}
      <div className="rounded-xl border border-zinc-800/80 bg-[#121215] p-6 space-y-3">
        <div className="h-4 w-44 bg-zinc-800/90 rounded animate-pulse" />
        <div className="space-y-2 pt-1">
          <div className="h-3 w-full bg-zinc-800/60 rounded animate-pulse" />
          <div className="h-3 w-[92%] bg-zinc-800/60 rounded animate-pulse" />
          <div className="h-3 w-[78%] bg-zinc-800/60 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'phone' | 'vehicle' | 'ai' | 'reports' | 'settings'>('phone');

  // Automatically clean up access token hash from URL bar after OAuth login
  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Phone search state
  const [phoneInput, setPhoneInput] = useState('');
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [phoneResults, setPhoneResults] = useState<PhoneResult[] | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  // Vehicle search state
  const [vehicleInput, setVehicleInput] = useState('');
  const [vehicleLoading, setVehicleLoading] = useState(false);

  // AI report state
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [aiReportLoading, setAiReportLoading] = useState(false);
  const [aiReportError, setAiReportError] = useState<string | null>(null);

  const handleGenerateReport = async (result: PhoneResult) => {
    setAiReportLoading(true);
    setAiReport(null);
    setAiReportError(null);
    try {
      const res = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneData: result }),
      });
      const data = await res.json();
      if (data.success) {
        setAiReport(data.report);
      } else {
        setAiReportError(data.message || 'Failed to generate report.');
      }
    } catch {
      setAiReportError('Network error. Please try again.');
    } finally {
      setAiReportLoading(false);
    }
  };

  const navItems = [
    { id: 'phone' as const, label: 'Phone Intelligence', icon: PhoneCall },
    { id: 'vehicle' as const, label: 'Vehicle Intelligence', icon: Car },
    { id: 'ai' as const, label: 'AI Assistant', icon: BrainCircuit },
    { id: 'reports' as const, label: 'Reports', icon: FileText },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  const handlePhoneSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput.trim()) return;
    setPhoneLoading(true);
    setPhoneError(null);
    setPhoneResults(null);

    try {
      const res = await fetch('/api/phone-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phoneInput.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setPhoneResults(data.results);
      } else {
        setPhoneError(data.message || 'No records found.');
      }
    } catch (err) {
      setPhoneError('Network error. Please try again.');
    } finally {
      setPhoneLoading(false);
    }
  };

  const handleVehicleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setVehicleLoading(true);
    setTimeout(() => {
      setVehicleLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#070708] text-white flex selection:bg-zinc-800 selection:text-white font-sans">
      {/* Left Sidebar */}
      <aside className="w-64 border-r border-zinc-800/80 bg-[#0a0a0c] flex flex-col justify-between p-5 shrink-0 hidden md:flex min-h-screen sticky top-0">
        <div className="space-y-6">
          {/* Brand Header */}
          <a href="/" className="flex flex-col gap-0.5 px-2">
            <span className="text-xl font-bold text-white tracking-tight">
              Huntme
            </span>
            <span className="text-xs text-zinc-500 font-medium">
              AI Powered OSINT Platform
            </span>
          </a>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left block px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#1c1c1f] text-white shadow-sm font-semibold border border-zinc-700/60'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Info */}
        <div className="space-y-4 pt-6 border-t border-zinc-800/80">
          <div className="px-2">
            <p className="text-xs font-semibold text-white">AI Engine</p>
            <p className="text-[11px] text-zinc-500 truncate">ai.engine@huntme.app</p>
          </div>

          {/* API Credits Box */}
          <div className="rounded-xl border border-zinc-800/90 bg-[#121214] p-3.5 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
              <span>API Credits</span>
            </div>
            <p className="text-lg font-bold text-white tracking-tight">
              84,500 <span className="text-xs font-normal text-zinc-500">/ 100,000</span>
            </p>
            <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden mt-1">
              <div className="bg-white h-full rounded-full w-[84.5%]" />
            </div>
          </div>

          <a
            href="/products/rest-api"
            className="flex items-center gap-2 px-2 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <span>Documentation</span>
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="grow flex flex-col min-w-0 bg-[#070708]">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-zinc-800/80 bg-[#0a0a0c]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-white tracking-tight">
              {activeTab === 'phone' && 'Phone Intelligence'}
              {activeTab === 'vehicle' && 'Vehicle Intelligence'}
              {activeTab === 'ai' && 'AI Assistant'}
              {activeTab === 'reports' && 'Investigation Reports'}
              {activeTab === 'settings' && 'Settings'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* API Status Badge */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-zinc-400 bg-[#121215] border border-zinc-800/90 px-3 py-1.5 rounded-lg">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>API Status: <strong className="text-white">Operational</strong></span>
            </div>

            {/* Profile Avatar */}
            <div className="size-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-white cursor-pointer hover:bg-zinc-700 transition-colors">
              AI
            </div>
          </div>
        </header>

        {/* Dashboard Main View Container */}
        <div className="p-6 md:p-8 space-y-8 max-w-6xl mx-auto w-full">

          {/* ========================================================================= */}
          {/* PHONE INTELLIGENCE TAB VIEW */}
          {/* ========================================================================= */}
          {activeTab === 'phone' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* TOP SECTION: Search Input & Value Slider */}
              <div className="rounded-2xl border border-zinc-800/90 bg-[#0d0d10] p-6 sm:p-8 space-y-6 shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h2 className="text-lg font-bold text-white">
                      Phone Number OSINT Lookup
                    </h2>
                    <p className="text-xs text-zinc-400">
                      Query mobile telemetry, carrier records, owner identity, and data breach indexes.
                    </p>
                  </div>
                </div>

                <form onSubmit={handlePhoneSearch} className="space-y-6">
                  {/* Search Input Box */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-500 pointer-events-none" />
                      <input
                        type="text"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        placeholder="Enter phone number (e.g. +91 98765 43210 or +1 415 555 2671)"
                        className="w-full bg-[#141418] border border-zinc-700/80 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-colors font-mono"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={phoneLoading}
                      className="bg-white hover:bg-zinc-200 text-black font-semibold px-6 py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
                    >
                      {phoneLoading ? (
                        <>
                          <RefreshCw className="size-4 animate-spin" />
                          <span>Searching...</span>
                        </>
                      ) : (
                        <>
                          <span>Investigate Phone</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* RESULTS */}
              {phoneLoading && <ReportSkeleton type="phone" />}

              {phoneError && (
                <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 flex items-center gap-3">
                  <AlertCircle className="size-5 text-rose-400 shrink-0" />
                  <p className="text-sm text-rose-300">{phoneError}</p>
                </div>
              )}

              {phoneResults && phoneResults.length > 0 && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  {/* Success header */}
                  <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                    <CheckCircle2 className="size-4" />
                    <span>{phoneResults.length} record{phoneResults.length > 1 ? 's' : ''} found for <span className="font-mono text-white">{phoneInput}</span></span>
                  </div>

                  {phoneResults.map((r, idx) => (
                    <div key={idx} className="rounded-2xl border border-zinc-800/90 bg-[#0d0d10] p-6 space-y-5 shadow-2xl">
                      {/* Identity Header */}
                      <div className="flex items-start justify-between gap-4 border-b border-zinc-800/80 pb-5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <User className="size-4 text-zinc-400" />
                            <h3 className="text-lg font-bold text-white">{r.name}</h3>
                          </div>
                          {r.fatherName && (
                            <p className="text-xs text-zinc-500">S/O: <span className="text-zinc-300">{r.fatherName}</span></p>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full shrink-0">
                          <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Verified Record
                        </div>
                      </div>

                      {/* Info Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="rounded-xl border border-zinc-800/80 bg-[#121215] p-4 space-y-1">
                          <p className="text-[11px] text-zinc-500 font-medium flex items-center gap-1.5"><Phone className="size-3" />Primary Mobile</p>
                          <p className="text-sm font-mono text-white">{r.mobile}</p>
                        </div>
                        {r.alternativeMobile && (
                          <div className="rounded-xl border border-zinc-800/80 bg-[#121215] p-4 space-y-1">
                            <p className="text-[11px] text-zinc-500 font-medium flex items-center gap-1.5"><Phone className="size-3" />Alternative Mobile</p>
                            <p className="text-sm font-mono text-white">{r.alternativeMobile}</p>
                          </div>
                        )}
                        {r.circle && (
                          <div className="rounded-xl border border-zinc-800/80 bg-[#121215] p-4 space-y-1">
                            <p className="text-[11px] text-zinc-500 font-medium flex items-center gap-1.5"><Signal className="size-3" />Carrier / Circle</p>
                            <p className="text-sm text-white">{r.circle}</p>
                          </div>
                        )}
                        {r.email && (
                          <div className="rounded-xl border border-zinc-800/80 bg-[#121215] p-4 space-y-1">
                            <p className="text-[11px] text-zinc-500 font-medium">Email</p>
                            <p className="text-sm text-white">{r.email}</p>
                          </div>
                        )}
                        {r.idNumber && (
                          <div className="rounded-xl border border-zinc-800/80 bg-[#121215] p-4 space-y-1">
                            <p className="text-[11px] text-zinc-500 font-medium">ID Number</p>
                            <p className="text-sm font-mono text-white">{r.idNumber}</p>
                          </div>
                        )}
                      </div>

                      {/* Address */}
                      {r.address && (
                        <div className="rounded-xl border border-zinc-800/80 bg-[#121215] p-4 space-y-1">
                          <p className="text-[11px] text-zinc-500 font-medium flex items-center gap-1.5"><MapPin className="size-3" />Registered Address</p>
                          <p className="text-sm text-zinc-200 leading-relaxed">{r.address}</p>
                        </div>
                      )}

                      {/* AI Report Generate Button — appears at bottom of each result card */}
                      <div className="pt-4 border-t border-zinc-800/80">
                        <button
                          type="button"
                          onClick={() => handleGenerateReport(r)}
                          disabled={aiReportLoading}
                          className="flex items-center gap-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 hover:border-purple-500/50 text-purple-300 hover:text-purple-200 font-semibold text-xs px-5 py-2.5 rounded-xl transition-all disabled:opacity-50"
                        >
                          {aiReportLoading ? (
                            <><RefreshCw className="size-3.5 animate-spin" /><span>Generating AI Report...</span></>
                          ) : (
                            <><Sparkles className="size-3.5" /><span>Generate AI Investigation Report</span></>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* AI Report Error */}
                  {aiReportError && (
                    <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5 flex items-center gap-3">
                      <AlertCircle className="size-4 text-rose-400 shrink-0" />
                      <p className="text-xs text-rose-300">{aiReportError}</p>
                    </div>
                  )}

                  {/* AI Loading Skeleton */}
                  {aiReportLoading && (
                    <div className="rounded-2xl border border-purple-500/20 bg-[#0d0d10] p-6 space-y-4 animate-pulse">
                      <div className="flex items-center gap-2">
                        <Sparkles className="size-4 text-purple-400" />
                        <span className="text-sm font-bold text-purple-300">Generating AI Intelligence Report...</span>
                      </div>
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className="space-y-2">
                          <div className="h-3 w-40 bg-zinc-800 rounded" />
                          <div className="h-2.5 w-full bg-zinc-800/60 rounded" />
                          <div className="h-2.5 w-4/5 bg-zinc-800/40 rounded" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* AI Report Card */}
                  {aiReport && !aiReportLoading && (
                    <div className="rounded-2xl border border-purple-500/20 bg-[#0d0d10] p-6 space-y-5 shadow-2xl animate-in fade-in duration-500">
                      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
                        <div className="flex items-center gap-2">
                          <Sparkles className="size-4 text-purple-400" />
                          <h3 className="text-sm font-bold text-white">AI Intelligence Report</h3>
                        </div>
                        <span className="text-[11px] text-purple-400 font-mono bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">NVIDIA NIM · Llama 3.1</span>
                      </div>
                      <AIReportSection text={aiReport} />
                    </div>
                  )}
                </div>
              )}

              {/* Show skeleton only if no search has been made yet */}
              {!phoneLoading && !phoneResults && !phoneError && (
                <ReportSkeleton type="phone" />
              )}
            </div>
          )}


          {/* ========================================================================= */}
          {/* VEHICLE INTELLIGENCE TAB VIEW */}
          {/* ========================================================================= */}
          {activeTab === 'vehicle' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* TOP SECTION: Search Input & Value Slider */}
              <div className="rounded-2xl border border-zinc-800/90 bg-[#0d0d10] p-6 sm:p-8 space-y-6 shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h2 className="text-lg font-bold text-white">
                      Vehicle License Plate & VIN OSINT Lookup
                    </h2>
                    <p className="text-xs text-zinc-400">
                      Query vehicle registration records, maker specs, RTO regional data, and compliance status.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleVehicleSearch} className="space-y-6">
                  {/* Search Input Box */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-500 pointer-events-none" />
                      <input
                        type="text"
                        value={vehicleInput}
                        onChange={(e) => setVehicleInput(e.target.value)}
                        placeholder="Enter license plate or VIN (e.g. DL 01 AB 1234 or UP 32 AB 5678)"
                        className="w-full bg-[#141418] border border-zinc-700/80 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-colors font-mono uppercase"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={vehicleLoading}
                      className="bg-white hover:bg-zinc-200 text-black font-semibold px-6 py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
                    >
                      {vehicleLoading ? (
                        <>
                          <RefreshCw className="size-4 animate-spin" />
                          <span>Searching...</span>
                        </>
                      ) : (
                        <>
                          <span>Lookup Vehicle</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* SKELETON REPORT DOWN BELOW */}
              <ReportSkeleton type="vehicle" />
            </div>
          )}


          {/* ========================================================================= */}
          {/* OTHER TABS: AI Assistant, Reports, Settings */}
          {/* ========================================================================= */}
          {activeTab === 'ai' && (
            <div className="rounded-2xl border border-zinc-800/90 bg-[#0d0d10] p-8 space-y-6 animate-in fade-in duration-300">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white">
                  AI Case Assistant
                </h2>
                <p className="text-xs text-zinc-400">
                  Connect phone numbers, vehicle records, and subject identities into structured investigation timelines.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-[#121216] p-6 space-y-4">
                <p className="text-sm text-zinc-300 leading-relaxed">
                  Select any active investigation from Phone Intelligence or Vehicle Intelligence to synthesize relationships, map connected nodes, and auto-generate comprehensive summaries.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab('phone')}
                    className="bg-white hover:bg-zinc-200 text-black font-semibold px-4 py-2 rounded-lg text-xs transition-colors"
                  >
                    Open Phone Intelligence
                  </button>
                  <button
                    onClick={() => setActiveTab('vehicle')}
                    className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold px-4 py-2 rounded-lg text-xs transition-colors"
                  >
                    Open Vehicle Intelligence
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="rounded-2xl border border-zinc-800/90 bg-[#0d0d10] p-8 space-y-6 animate-in fade-in duration-300">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white">
                  Investigation Reports
                </h2>
                <p className="text-xs text-zinc-400">
                  View and export all generated OSINT investigation reports.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-zinc-800 bg-[#121215] p-5 space-y-3">
                  <div className="h-4 w-28 bg-zinc-800 rounded animate-pulse" />
                  <div className="h-5 w-48 bg-zinc-700 rounded animate-pulse" />
                  <div className="h-3 w-36 bg-zinc-800/60 rounded animate-pulse" />
                </div>
                <div className="rounded-xl border border-zinc-800 bg-[#121215] p-5 space-y-3">
                  <div className="h-4 w-28 bg-zinc-800 rounded animate-pulse" />
                  <div className="h-5 w-48 bg-zinc-700 rounded animate-pulse" />
                  <div className="h-3 w-36 bg-zinc-800/60 rounded animate-pulse" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="rounded-2xl border border-zinc-800/90 bg-[#0d0d10] p-8 space-y-6 animate-in fade-in duration-300">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white">
                  Platform Settings
                </h2>
                <p className="text-xs text-zinc-400">
                  Manage API keys, team access permissions, and export preferences.
                </p>
              </div>

              <div className="space-y-4 max-w-md">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Default Confidence Threshold</label>
                  <input
                    type="text"
                    disabled
                    value="85% (High Precision)"
                    className="w-full bg-[#141418] border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-400 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Enterprise API Token</label>
                  <input
                    type="password"
                    disabled
                    value="huntme_live_9f8a3c2b1e"
                    className="w-full bg-[#141418] border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-400 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

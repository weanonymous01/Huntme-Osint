'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
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
  Sparkles,
  Lock,
  Calendar,
  Eye,
  ChevronRight,
  Copy,
  Check,
  Menu,
  X
} from 'lucide-react';

function maskWord(w: string): string {
  if (!w || w.length === 0) return '';
  if (w.length <= 2) return w[0] + '*';
  return w[0] + '*'.repeat(Math.max(1, w.length - 2)) + w[w.length - 1];
}

function maskText(str: string | null): string {
  if (!str) return '';
  return str.split(/(\s+|-|!|,|\/|:|\.)/).map(part => {
    if (!part || /^[\s!,-/:.]+$/.test(part)) return part;
    return maskWord(part);
  }).join('');
}

function maskNumber(str: string | null): string {
  if (!str) return '';
  const clean = str.trim();
  if (clean.length <= 4) return clean[0] + '*'.repeat(Math.max(1, clean.length - 1));
  return clean.slice(0, 2) + '*'.repeat(Math.max(2, clean.length - 4)) + clean.slice(-2);
}

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

type VehicleResult = {
  registrationNumber: string;
  ownerName: string | null;
  fatherName: string | null;
  modelName: string | null;
  vehicleClass: string | null;
  fuelType: string | null;
  registrationDate: string | null;
  insuranceExpiry: string | null;
  registeredRTO: string | null;
  address: string | null;
  cityName: string | null;
  sourceCredit: string | null;
};

type UserProfile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  plan_type: string;
  api_credits: number;
  max_credits: number;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Render AI report markdown sections with styled headings and dork blocks
function AIReportSection({ text }: { text: string }) {
  const lines = text.split('\n');

  const renderInline = (content: string) => {
    // Handle bold **text** and inline `code` — strip ** markers, render plain
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
        // Render bold without stars — just plain white text
        return <strong key={j} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
      }
      // Strip any stray single * characters
      return part.replace(/\*/g, '');
    });
  };

  return (
    <div className="space-y-3">
      {lines.map((line, i) => {
        // Numbered section heading: ## 1. Title or ## Title
        if (/^## /.test(line)) {
          const title = line.replace(/^## \d+\.\s*/, '').replace(/^## /, '');
          return (
            <h3 key={i} className="text-[13px] font-bold text-white pt-4 pb-1 border-t border-zinc-800/80 first:pt-0 first:border-t-0">
              {title}
            </h3>
          );
        }
        // Bullet list item
        if (/^[-•] /.test(line)) {
          return (
            <div key={i} className="flex gap-2 pl-1">
              <span className="text-zinc-500 mt-0.5 shrink-0 text-xs">›</span>
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
                <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 rounded shrink-0 mt-0.5">{num}</span>
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
        // Regular paragraph — strip stray * chars
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

  // Real user profile from Supabase
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Free search tracking for 0-credit preview users
  const [freeSearchCount, setFreeSearchCount] = useState<number>(0);

  // Load user session + profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { setProfileLoading(false); return; }
      
      let { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      const isOwner = session.user.email === 'adarshverma3655@gmail.com';

      if (typeof window !== 'undefined') {
        const storedCount = parseInt(localStorage.getItem(`huntme_free_searches_${session.user.id}`) || '0', 10);
        setFreeSearchCount(storedCount);
      }

      // If profile missing or newly created user, upsert with 0 credits for free users
      if (!data || error) {
        const newProfile = {
          id: session.user.id,
          email: session.user.email || '',
          full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || null,
          avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || null,
          plan_type: isOwner ? 'lifetime' : 'free',
          api_credits: isOwner ? 9999 : 0,
          max_credits: isOwner ? 9999 : 100,
        };

        const { data: inserted } = await supabase
          .from('profiles')
          .upsert(newProfile)
          .select()
          .single();

        if (inserted) data = inserted;
      }

      if (data) setProfile(data);
      setProfileLoading(false);
    };
    loadProfile();
  }, []);

  // Deduct 5 credits per search and refresh profile if credits >= 5
  const deductCredit = async () => {
    if (!profile) return;
    if (profile.api_credits < 5) return; // Free trial search allowed, no negative credits
    const newCredits = Math.max(0, profile.api_credits - 5);
    await supabase
      .from('profiles')
      .update({ api_credits: newCredits })
      .eq('id', profile.id);
    setProfile(prev => prev ? { ...prev, api_credits: newCredits } : prev);
  };

  // Saved Reports state
  const [savedReports, setSavedReports] = useState<any[]>([]);
  const [reportsLoading, setReportsLoading] = useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const isSavingRef = React.useRef<boolean>(false);

  const fetchSavedReports = async (userId: string) => {
    setReportsLoading(true);
    const { data } = await supabase
      .from('phone_searches')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (data) {
      // Deduplicate entries by target phone number — keep only the most recent search per phone number
      const unique = data.filter((item, index, self) =>
        index === self.findIndex((t) => t.phone_number === item.phone_number)
      );
      setSavedReports(unique);
    }
    setReportsLoading(false);
  };

  // Fetch reports when switching to reports tab or profile loads
  useEffect(() => {
    if (profile?.id && activeTab === 'reports') {
      fetchSavedReports(profile.id);
    }
  }, [activeTab, profile?.id]);

  // Save phone search to Supabase (guarded against double execution)
  const savePhoneSearch = async (result: PhoneResult, aiReportText: string | null) => {
    if (!profile || isSavingRef.current) return;
    isSavingRef.current = true;
    try {
      await supabase.from('phone_searches').insert({
        user_id: profile.id,
        phone_number: result.mobile,
        carrier: result.circle || null,
        circle: result.circle || null,
        status: 'Completed',
        telemetry_json: { result, aiReport: aiReportText },
      });
      await fetchSavedReports(profile.id);
    } finally {
      setTimeout(() => {
        isSavingRef.current = false;
      }, 3000);
    }
  };

  // Automatically clean up access token hash from URL bar after OAuth login
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Mobile navigation drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Phone search state
  const [phoneInput, setPhoneInput] = useState('');
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [phoneResults, setPhoneResults] = useState<PhoneResult[] | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  // Vehicle search state
  const [vehicleInput, setVehicleInput] = useState('');
  const [vehicleLoading, setVehicleLoading] = useState(false);
  const [vehicleResult, setVehicleResult] = useState<VehicleResult | null>(null);
  const [vehicleError, setVehicleError] = useState<string | null>(null);

  // Copy report state
  const [copiedReport, setCopiedReport] = useState<boolean>(false);

  const handleCopyReport = (reportText: string) => {
    if (!reportText) return;
    navigator.clipboard.writeText(reportText);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  // AI report state
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [aiReportLoading, setAiReportLoading] = useState(false);
  const [aiReportError, setAiReportError] = useState<string | null>(null);

  const handleGenerateReport = async (result: PhoneResult, onComplete?: (report: string) => void) => {
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
        if (onComplete) onComplete(data.report);
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

  const isLocked = !profileLoading && (profile?.api_credits ?? 0) < 5;

  const handlePhoneSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput.trim()) return;

    // Hard block if 0-credit user has already performed their 1 free search
    if (isLocked && freeSearchCount >= 1) {
      setPhoneResults(null);
      setAiReport(null);
      setPhoneError("FREE_SEARCH_LIMIT_REACHED");
      return;
    }

    setPhoneLoading(true);
    setPhoneError(null);
    setPhoneResults(null);
    // Reset AI report on every new search
    setAiReport(null);
    setAiReportError(null);
    setAiReportLoading(false);

    try {
      const res = await fetch('/api/phone-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phoneInput.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setPhoneResults(data.results);
        
        // Record the 1 free search used if in preview mode
        if (isLocked) {
          const nextCount = freeSearchCount + 1;
          setFreeSearchCount(nextCount);
          if (typeof window !== 'undefined' && profile?.id) {
            localStorage.setItem(`huntme_free_searches_${profile.id}`, nextCount.toString());
          }
        } else {
          // Deduct 1 credit per successful search for paid users
          await deductCredit();
        }

        // Auto-generate AI report immediately using the first result
        handleGenerateReport(data.results[0], (report) => {
          savePhoneSearch(data.results[0], report);
        });
      } else {
        setPhoneError(data.message || 'No records found.');
      }
    } catch (err) {
      setPhoneError('Network error. Please try again.');
    } finally {
      setPhoneLoading(false);
    }
  };

  const handleVehicleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleInput.trim()) return;

    // Hard block if 0-credit user has already performed their 1 free search
    if (isLocked && freeSearchCount >= 1) {
      setVehicleResult(null);
      setVehicleError('FREE_SEARCH_LIMIT_REACHED');
      return;
    }

    setVehicleLoading(true);
    setVehicleError(null);
    setVehicleResult(null);

    try {
      const res = await fetch('/api/vehicle-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationNumber: vehicleInput.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setVehicleResult(data.vehicle);

        // Record the 1 free search used if in preview mode
        if (isLocked) {
          const nextCount = freeSearchCount + 1;
          setFreeSearchCount(nextCount);
          if (typeof window !== 'undefined' && profile?.id) {
            localStorage.setItem(`huntme_free_searches_${profile.id}`, nextCount.toString());
          }
        } else {
          await deductCredit();
        }
      } else {
        setVehicleError(data.message || 'No records found.');
      }
    } catch {
      setVehicleError('Network error. Please try again.');
    } finally {
      setVehicleLoading(false);
    }
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
          <div className="px-2 space-y-0.5">
            {/* Real user name */}
            <p className="text-xs font-semibold text-white truncate">
              {profileLoading ? '...' : (profile?.full_name || profile?.email?.split('@')[0] || 'User')}
            </p>
            {/* Real email */}
            <p className="text-[11px] text-zinc-500 truncate">
              {profileLoading ? '...' : (profile?.email || '')}
            </p>
          </div>

          {/* Real API Credits Box */}
          <div className="rounded-xl border border-zinc-800/90 bg-[#121214] p-3.5 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
              <span>API Credits</span>
              {profile && (
                <span className="text-[10px] text-zinc-500 font-mono capitalize">{profile.plan_type}</span>
              )}
            </div>
            <p className="text-lg font-bold text-white tracking-tight">
              {profileLoading ? (
                <span className="text-zinc-600">loading...</span>
              ) : (
                <>
                  {(profile?.api_credits ?? 0).toLocaleString()}
                  <span className="text-xs font-normal text-zinc-500"> / {(profile?.max_credits ?? 100).toLocaleString()}</span>
                </>
              )}
            </p>
            <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden mt-1">
              <div
                className="bg-white h-full rounded-full transition-all duration-500"
                style={{ width: `${profile ? Math.round((profile.api_credits / profile.max_credits) * 100) : 0}%` }}
              />
            </div>
            {isLocked && (
              <div className="pt-1 flex items-center justify-between text-[11px]">
                <span className="text-amber-400 font-medium flex items-center gap-1">
                  <Lock className="size-3" />
                  Free Trial
                </span>
                <span className="text-zinc-400 font-mono">{freeSearchCount === 0 ? '1 Free Search' : '0 Left'}</span>
              </div>
            )}
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
        <header className="h-16 border-b border-zinc-800/80 bg-[#0a0a0c]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-1 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/80 md:hidden transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>

            <h1 className="text-base sm:text-xl font-bold text-white tracking-tight truncate">
              {activeTab === 'phone' && 'Phone Intelligence'}
              {activeTab === 'vehicle' && 'Vehicle Intelligence'}
              {activeTab === 'ai' && 'AI Assistant'}
              {activeTab === 'reports' && 'Investigation Reports'}
              {activeTab === 'settings' && 'Settings'}
            </h1>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* API Status Badge */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-zinc-400 bg-[#121215] border border-zinc-800/90 px-3 py-1.5 rounded-lg">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>API Status: <strong className="text-white">Operational</strong></span>
            </div>

            {/* Mobile Credits Badge */}
            <div className="md:hidden text-[11px] font-mono font-semibold text-zinc-300 bg-zinc-800/80 border border-zinc-700/60 px-2.5 py-1 rounded-full">
              {(profile?.api_credits ?? 0)} Cr
            </div>

            {/* Real Profile Avatar */}
            <div
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="size-8 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden flex items-center justify-center text-xs font-bold text-white cursor-pointer hover:ring-2 hover:ring-zinc-500 transition-all shrink-0"
            >
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <span>{profile?.full_name?.charAt(0)?.toUpperCase() || profile?.email?.charAt(0)?.toUpperCase() || 'U'}</span>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-zinc-800/90 bg-[#0d0d10] p-4 space-y-5 animate-in slide-in-from-top duration-200 z-30 sticky top-16 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 px-1">
              <div>
                <p className="text-sm font-bold text-white">Huntme OSINT</p>
                <p className="text-[11px] text-zinc-500">{profile?.email || 'AI OSINT Suite'}</p>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full capitalize font-mono">
                {profile?.plan_type || 'free'}
              </span>
            </div>

            {/* Mobile Tab Links */}
            <nav className="grid grid-cols-1 gap-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
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

            {/* Mobile Credits Card */}
            <div className="rounded-xl border border-zinc-800/90 bg-[#121214] p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
                <span>API Credits</span>
                <span className="text-white font-mono font-bold">{(profile?.api_credits ?? 0)} / {(profile?.max_credits ?? 100)}</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-white h-full rounded-full transition-all duration-500"
                  style={{ width: `${profile ? Math.round((profile.api_credits / profile.max_credits) * 100) : 0}%` }}
                />
              </div>
              {isLocked && (
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-amber-400 font-medium flex items-center gap-1">
                    <Lock className="size-3" />
                    {freeSearchCount === 0 ? '1 Free Search Left' : '0 Free Left'}
                  </span>
                  <a href="/pricing" className="text-amber-400 underline font-semibold">
                    Upgrade Plan
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dashboard Main View Container */}
        <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-6xl mx-auto w-full">

          {/* ========================================================================= */}
          {/* PHONE INTELLIGENCE TAB VIEW */}
          {/* ========================================================================= */}
          {activeTab === 'phone' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* TOP SECTION: Search Input & Value Slider */}
              <div className="rounded-2xl border border-zinc-800/90 bg-[#0d0d10] p-6 sm:p-8 space-y-6 shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg font-bold text-white">
                        Phone Number OSINT Lookup
                      </h2>
                      {isLocked && (
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${freeSearchCount === 0 ? 'text-amber-300 bg-amber-500/10 border-amber-500/30' : 'text-rose-300 bg-rose-500/10 border-rose-500/30'}`}>
                          {freeSearchCount === 0 ? '1 Free Search Available' : '0 Free Searches Left'}
                        </span>
                      )}
                    </div>
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

                  {isLocked && freeSearchCount === 0 && (
                    <div className="flex items-center gap-2 text-xs text-amber-300/90 bg-amber-500/10 border border-amber-500/20 px-3.5 py-2 rounded-xl">
                      <Lock className="size-3.5 text-amber-400 shrink-0" />
                      <span>You have <strong>1 free preview search</strong> available. Results will be partially masked.</span>
                    </div>
                  )}
                </form>
              </div>

              {/* RESULTS */}
              {phoneLoading && <ReportSkeleton type="phone" />}

              {phoneError === "FREE_SEARCH_LIMIT_REACHED" || phoneError === "INSUFFICIENT_CREDITS" ? (
                <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-8 space-y-4 text-center animate-in fade-in duration-300 shadow-xl">
                  <div className="size-12 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto">
                    <Lock className="size-6" />
                  </div>
                  <div className="space-y-2 max-w-md mx-auto">
                    <h3 className="text-lg font-bold text-white">
                      {(profile?.api_credits ?? 0) > 0 
                        ? `Insufficient Credits (${profile?.api_credits} / 5 Credits)`
                        : 'Free Search Limit Reached (1/1 Used)'}
                    </h3>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      {(profile?.api_credits ?? 0) > 0
                        ? `Each Phone OSINT Lookup requires 5 credits. You currently have ${profile?.api_credits} credits remaining. Upgrade your plan or top up credits to run full investigations.`
                        : 'You have used your 1 free preview search. Upgrade your account to unlock unlimited searches, full unmasked identity data, and complete AI reports.'}
                    </p>
                  </div>
                  <div className="pt-2">
                    <a
                      href="/pricing"
                      className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-black font-bold px-6 py-3 rounded-xl text-xs transition-all shadow-lg"
                    >
                      <Lock className="size-4" />
                      <span>Upgrade Plan for Unlimited Searches</span>
                    </a>
                  </div>
                </div>
              ) : phoneError ? (
                <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 flex items-center gap-3">
                  <AlertCircle className="size-5 text-rose-400 shrink-0" />
                  <p className="text-sm text-rose-300">{phoneError}</p>
                </div>
              ) : null}

              {phoneResults && phoneResults.length > 0 && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  {/* Lock Notice Banner for 0 Credit Users */}
                  {isLocked && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl text-xs shadow-lg">
                      <div className="flex items-center gap-2 text-amber-300 font-medium">
                        <Lock className="size-4 shrink-0 text-amber-400" />
                        <span>Preview Mode (0 Credits) — Full identity, address & ID records are locked.</span>
                      </div>
                      <a
                        href="/pricing"
                        className="bg-amber-400 hover:bg-amber-300 text-black font-bold px-4 py-2 rounded-xl text-xs transition-colors shrink-0 flex items-center justify-center gap-1.5 shadow-md"
                      >
                        <Lock className="size-3.5" />
                        <span>Unlock Full Report</span>
                      </a>
                    </div>
                  )}

                  {/* Success header */}
                  <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                    <CheckCircle2 className="size-4" />
                    <span>{phoneResults.length} record{phoneResults.length > 1 ? 's' : ''} found for <span className="font-mono text-white">{phoneInput}</span></span>
                  </div>

                  {phoneResults.map((r, idx) => (
                    <div
                      key={idx}
                      onClick={() => isLocked && (window.location.href = '/pricing')}
                      className={`relative rounded-2xl border border-zinc-800/90 bg-[#0d0d10] p-6 space-y-5 shadow-2xl transition-all ${isLocked ? 'cursor-pointer hover:border-amber-500/40' : ''}`}
                    >
                      {/* Identity Header */}
                      <div className="flex items-start justify-between gap-4 border-b border-zinc-800/80 pb-5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <User className="size-4 text-zinc-400" />
                            <h3 className={`text-lg font-bold text-white ${isLocked ? 'blur-[1.5px] select-none' : ''}`}>
                              {isLocked ? maskText(r.name) : r.name}
                            </h3>
                          </div>
                          {r.fatherName && (
                            <p className="text-xs text-zinc-500">S/O: <span className={`text-zinc-300 ${isLocked ? 'blur-[1.5px] select-none' : ''}`}>{isLocked ? maskText(r.fatherName) : r.fatherName}</span></p>
                          )}
                        </div>
                        {isLocked ? (
                          <a
                            href="/pricing"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full shrink-0 hover:bg-amber-500/20 transition-colors"
                          >
                            <Lock className="size-3" />
                            Unlock Data
                          </a>
                        ) : (
                          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full shrink-0">
                            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Verified Record
                          </div>
                        )}
                      </div>

                      {/* Info Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="rounded-xl border border-zinc-800/80 bg-[#121215] p-4 space-y-1">
                          <p className="text-[11px] text-zinc-500 font-medium flex items-center gap-1.5"><Phone className="size-3" />Primary Mobile</p>
                          <p className={`text-sm font-mono text-white ${isLocked ? 'blur-[1.5px] select-none' : ''}`}>
                            {isLocked ? maskNumber(r.mobile) : r.mobile}
                          </p>
                        </div>
                        {r.alternativeMobile && (
                          <div className="rounded-xl border border-zinc-800/80 bg-[#121215] p-4 space-y-1">
                            <p className="text-[11px] text-zinc-500 font-medium flex items-center gap-1.5"><Phone className="size-3" />Alternative Mobile</p>
                            <p className={`text-sm font-mono text-white ${isLocked ? 'blur-[1.5px] select-none' : ''}`}>
                              {isLocked ? maskNumber(r.alternativeMobile) : r.alternativeMobile}
                            </p>
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
                            <p className={`text-sm text-white ${isLocked ? 'blur-[1.5px] select-none' : ''}`}>
                              {isLocked ? maskText(r.email) : r.email}
                            </p>
                          </div>
                        )}
                        {r.idNumber && (
                          <div className="rounded-xl border border-zinc-800/80 bg-[#121215] p-4 space-y-1">
                            <p className="text-[11px] text-zinc-500 font-medium">ID Number</p>
                            <p className={`text-sm font-mono text-white ${isLocked ? 'blur-[1.5px] select-none' : ''}`}>
                              {isLocked ? maskNumber(r.idNumber) : r.idNumber}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Address */}
                      {r.address && (
                        <div className="rounded-xl border border-zinc-800/80 bg-[#121215] p-4 space-y-1">
                          <p className="text-[11px] text-zinc-500 font-medium flex items-center gap-1.5"><MapPin className="size-3" />Registered Address</p>
                          <p className={`text-sm text-zinc-200 leading-relaxed ${isLocked ? 'blur-[1.5px] select-none' : ''}`}>
                            {isLocked ? maskText(r.address) : r.address}
                          </p>
                        </div>
                      )}
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
                    <div className="rounded-2xl border border-zinc-700/40 bg-[#0d0d10] p-6 space-y-4 animate-pulse">
                      <div className="flex items-center gap-2">
                        <RefreshCw className="size-4 text-zinc-400 animate-spin" />
                        <span className="text-sm font-bold text-white">Generating AI Intelligence Report...</span>
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
                    <div className="relative rounded-2xl border border-zinc-700/50 bg-[#0d0d10] p-6 space-y-5 shadow-2xl animate-in fade-in duration-500 overflow-hidden">
                      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
                        <h3 className="text-sm font-bold text-white">AI Intelligence Report</h3>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleCopyReport(aiReport)}
                            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700/60 px-3 py-1.5 rounded-lg transition-all"
                          >
                            {copiedReport ? (
                              <>
                                <Check className="size-3.5 text-emerald-400" />
                                <span className="text-emerald-400 font-medium">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="size-3.5 text-zinc-400" />
                                <span>Copy Report</span>
                              </>
                            )}
                          </button>
                          <span className="text-[11px] text-zinc-400 font-mono bg-zinc-800/60 border border-zinc-700/50 px-2 py-0.5 rounded-full">NVIDIA NIM · Llama 3.1</span>
                        </div>
                      </div>
                      <div className={isLocked ? "blur-[2.5px] select-none pointer-events-none max-h-72 overflow-hidden opacity-50" : ""}>
                        <AIReportSection text={aiReport} />
                      </div>
                      {isLocked && (
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d10] via-[#0d0d10]/95 to-[#0d0d10]/60 flex flex-col items-center justify-center p-6 text-center space-y-3 z-10">
                          <div className="size-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                            <Lock className="size-5" />
                          </div>
                          <div className="space-y-1 max-w-sm">
                            <h4 className="text-sm font-bold text-white">AI Intelligence Analysis Locked</h4>
                            <p className="text-xs text-zinc-400">
                              Upgrade to a paid plan to unlock complete OSINT framework analysis, Google Dorks, social platform presence, and risk scores.
                            </p>
                          </div>
                          <a
                            href="/pricing"
                            className="bg-amber-400 hover:bg-amber-300 text-black font-bold px-5 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-2 shadow-lg"
                          >
                            <Lock className="size-3.5" />
                            <span>Unlock Full Intelligence Report</span>
                          </a>
                        </div>
                      )}
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
                        onChange={(e) => setVehicleInput(e.target.value.toUpperCase())}
                        placeholder="Enter license plate (e.g. RJ27TA1877 or DL01AB1234)"
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
                        <span>Lookup Vehicle</span>
                      )}
                    </button>
                  </div>

                  {isLocked && freeSearchCount === 0 && (
                    <div className="flex items-center gap-2 text-xs text-amber-300/90 bg-amber-500/10 border border-amber-500/20 px-3.5 py-2 rounded-xl">
                      <Lock className="size-3.5 text-amber-400 shrink-0" />
                      <span>You have <strong>1 free preview search</strong> available. Results will be partially masked.</span>
                    </div>
                  )}
                </form>
              </div>

              {/* Loading skeleton */}
              {vehicleLoading && <ReportSkeleton type="vehicle" />}

              {/* Free search limit / insufficient credits */}
              {(vehicleError === 'FREE_SEARCH_LIMIT_REACHED' || vehicleError === 'INSUFFICIENT_CREDITS') ? (
                <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-8 space-y-4 text-center animate-in fade-in duration-300 shadow-xl">
                  <div className="size-12 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto">
                    <Lock className="size-6" />
                  </div>
                  <div className="space-y-2 max-w-md mx-auto">
                    <h3 className="text-lg font-bold text-white">Free Search Limit Reached</h3>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      You have used your 1 free preview search. Upgrade your account to unlock unlimited vehicle lookups, full unmasked identity data, and complete AI reports.
                    </p>
                  </div>
                  <div className="pt-2">
                    <a href="/pricing" className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-black font-bold px-6 py-3 rounded-xl text-xs transition-all shadow-lg">
                      <Lock className="size-4" />
                      <span>Upgrade Plan for Unlimited Searches</span>
                    </a>
                  </div>
                </div>
              ) : vehicleError ? (
                <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 flex items-center gap-3">
                  <AlertCircle className="size-5 text-rose-400 shrink-0" />
                  <p className="text-sm text-rose-300">{vehicleError}</p>
                </div>
              ) : null}

              {/* Vehicle Result Card */}
              {vehicleResult && !vehicleLoading && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  {/* Lock banner for free users */}
                  {isLocked && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl text-xs shadow-lg">
                      <div className="flex items-center gap-2 text-amber-300 font-medium">
                        <Lock className="size-4 shrink-0 text-amber-400" />
                        <span>Preview Mode — Full owner identity & address records are locked.</span>
                      </div>
                      <a href="/pricing" className="bg-amber-400 hover:bg-amber-300 text-black font-bold px-4 py-2 rounded-xl text-xs transition-colors shrink-0 flex items-center justify-center gap-1.5 shadow-md">
                        <Lock className="size-3.5" />
                        <span>Unlock Full Report</span>
                      </a>
                    </div>
                  )}

                  {/* Success header */}
                  <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                    <CheckCircle2 className="size-4" />
                    <span>Vehicle record found for <span className="font-mono text-white">{vehicleResult.registrationNumber}</span></span>
                  </div>

                  {/* Main vehicle card */}
                  <div className="relative rounded-2xl border border-zinc-800/90 bg-[#0d0d10] p-6 space-y-6 shadow-2xl">

                    {/* Header: RC + badges */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-zinc-800/80 pb-5">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <Car className="size-5 text-zinc-400 shrink-0" />
                          <h3 className="text-xl font-bold text-white font-mono tracking-widest">
                            {vehicleResult.registrationNumber}
                          </h3>
                          {vehicleResult.vehicleClass && (
                            <span className="text-[11px] font-semibold text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2.5 py-0.5 rounded-full">
                              {vehicleResult.vehicleClass}
                            </span>
                          )}
                          {vehicleResult.fuelType && (
                            <span className="text-[11px] font-semibold text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2.5 py-0.5 rounded-full">
                              {vehicleResult.fuelType}
                            </span>
                          )}
                        </div>
                        {vehicleResult.modelName && (
                          <p className="text-sm text-zinc-300 pl-8">{vehicleResult.modelName}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full shrink-0">
                        <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Verified Record
                      </div>
                    </div>

                    {/* Owner Info */}
                    <div className="space-y-3">
                      <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Owner Information</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="rounded-xl border border-zinc-800/80 bg-[#121215] p-4 space-y-1">
                          <p className="text-[11px] text-zinc-500 font-medium flex items-center gap-1.5"><User className="size-3" />Owner Name</p>
                          <p className={`text-sm font-semibold text-white ${isLocked ? 'blur-[1.5px] select-none' : ''}`}>
                            {isLocked ? maskText(vehicleResult.ownerName) : (vehicleResult.ownerName || '—')}
                          </p>
                        </div>
                        {vehicleResult.fatherName && (
                          <div className="rounded-xl border border-zinc-800/80 bg-[#121215] p-4 space-y-1">
                            <p className="text-[11px] text-zinc-500 font-medium flex items-center gap-1.5"><User className="size-3" />Father's Name</p>
                            <p className={`text-sm text-white ${isLocked ? 'blur-[1.5px] select-none' : ''}`}>
                              {isLocked ? maskText(vehicleResult.fatherName) : vehicleResult.fatherName}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Vehicle Details */}
                    <div className="space-y-3">
                      <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Vehicle Details</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {vehicleResult.registrationDate && (
                          <div className="rounded-xl border border-zinc-800/80 bg-[#121215] p-4 space-y-1">
                            <p className="text-[11px] text-zinc-500 font-medium flex items-center gap-1.5"><Calendar className="size-3" />Registration Date</p>
                            <p className="text-sm text-white">{vehicleResult.registrationDate}</p>
                          </div>
                        )}
                        {vehicleResult.insuranceExpiry && (
                          <div className="rounded-xl border border-zinc-800/80 bg-[#121215] p-4 space-y-1">
                            <p className="text-[11px] text-zinc-500 font-medium flex items-center gap-1.5"><AlertCircle className="size-3" />Insurance Expiry</p>
                            <p className={`text-sm font-medium ${
                              new Date(vehicleResult.insuranceExpiry.split('-').reverse().join('-')) < new Date()
                                ? 'text-rose-400'
                                : 'text-emerald-400'
                            }`}>{vehicleResult.insuranceExpiry}</p>
                          </div>
                        )}
                        {vehicleResult.registeredRTO && (
                          <div className="rounded-xl border border-zinc-800/80 bg-[#121215] p-4 space-y-1">
                            <p className="text-[11px] text-zinc-500 font-medium flex items-center gap-1.5"><MapPin className="size-3" />Registered RTO</p>
                            <p className="text-sm text-white">{vehicleResult.registeredRTO}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Address */}
                    {vehicleResult.address && (
                      <div className="rounded-xl border border-zinc-800/80 bg-[#121215] p-4 space-y-1">
                        <p className="text-[11px] text-zinc-500 font-medium flex items-center gap-1.5"><MapPin className="size-3" />Registered Address</p>
                        <p className={`text-sm text-zinc-200 leading-relaxed ${isLocked ? 'blur-[1.5px] select-none' : ''}`}>
                          {isLocked ? maskText(vehicleResult.address) : vehicleResult.address}
                        </p>
                      </div>
                    )}

                    {/* Source credit */}
                    {vehicleResult.sourceCredit && (
                      <div className="pt-1 border-t border-zinc-800/60 flex items-center gap-2 text-[10px] text-zinc-600">
                        <span>Source:</span>
                        <span className="font-mono text-zinc-500">{vehicleResult.sourceCredit}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Idle skeleton when no search has been made */}
              {!vehicleLoading && !vehicleResult && !vehicleError && (
                <ReportSkeleton type="vehicle" />
              )}
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
            <div className="rounded-2xl border border-zinc-800/90 bg-[#0d0d10] p-6 sm:p-8 space-y-6 animate-in fade-in duration-300">
              {selectedReport ? (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
                    <button
                      onClick={() => setSelectedReport(null)}
                      className="flex items-center gap-2 text-xs font-semibold text-zinc-300 hover:text-white bg-[#141418] hover:bg-zinc-800 border border-zinc-700/80 px-4 py-2 rounded-xl transition-colors"
                    >
                      <span>← Back to All Reports</span>
                    </button>
                    <span className="text-xs text-zinc-500 font-mono">
                      {new Date(selectedReport.created_at).toLocaleString()}
                    </span>
                  </div>

                  {/* Saved Record Card */}
                  {selectedReport.telemetry_json?.result && (
                    <div className="rounded-2xl border border-zinc-800/90 bg-[#0d0d10] p-6 space-y-5 shadow-2xl">
                      <div className="flex items-start justify-between gap-4 border-b border-zinc-800/80 pb-5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <User className="size-4 text-zinc-400" />
                            <h3 className={`text-lg font-bold text-white ${isLocked ? 'blur-[1.5px] select-none' : ''}`}>
                              {isLocked ? maskText(selectedReport.telemetry_json.result.name) : selectedReport.telemetry_json.result.name}
                            </h3>
                          </div>
                          {selectedReport.telemetry_json.result.fatherName && (
                            <p className="text-xs text-zinc-500">S/O: <span className={`text-zinc-300 ${isLocked ? 'blur-[1.5px] select-none' : ''}`}>{isLocked ? maskText(selectedReport.telemetry_json.result.fatherName) : selectedReport.telemetry_json.result.fatherName}</span></p>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                          <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Verified Record
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="rounded-xl border border-zinc-800/80 bg-[#121215] p-4 space-y-1">
                          <p className="text-[11px] text-zinc-500 font-medium flex items-center gap-1.5"><Phone className="size-3" />Primary Mobile</p>
                          <p className={`text-sm font-mono text-white ${isLocked ? 'blur-[1.5px] select-none' : ''}`}>
                            {isLocked ? maskNumber(selectedReport.telemetry_json.result.mobile) : selectedReport.telemetry_json.result.mobile}
                          </p>
                        </div>
                        {selectedReport.telemetry_json.result.alternativeMobile && (
                          <div className="rounded-xl border border-zinc-800/80 bg-[#121215] p-4 space-y-1">
                            <p className="text-[11px] text-zinc-500 font-medium flex items-center gap-1.5"><Phone className="size-3" />Alternative Mobile</p>
                            <p className={`text-sm font-mono text-white ${isLocked ? 'blur-[1.5px] select-none' : ''}`}>
                              {isLocked ? maskNumber(selectedReport.telemetry_json.result.alternativeMobile) : selectedReport.telemetry_json.result.alternativeMobile}
                            </p>
                          </div>
                        )}
                        {selectedReport.telemetry_json.result.circle && (
                          <div className="rounded-xl border border-zinc-800/80 bg-[#121215] p-4 space-y-1">
                            <p className="text-[11px] text-zinc-500 font-medium flex items-center gap-1.5"><Signal className="size-3" />Carrier / Circle</p>
                            <p className="text-sm text-white">{selectedReport.telemetry_json.result.circle}</p>
                          </div>
                        )}
                      </div>

                      {selectedReport.telemetry_json.result.address && (
                        <div className="rounded-xl border border-zinc-800/80 bg-[#121215] p-4 space-y-1">
                          <p className="text-[11px] text-zinc-500 font-medium flex items-center gap-1.5"><MapPin className="size-3" />Registered Address</p>
                          <p className={`text-sm text-zinc-200 leading-relaxed ${isLocked ? 'blur-[1.5px] select-none' : ''}`}>
                            {isLocked ? maskText(selectedReport.telemetry_json.result.address) : selectedReport.telemetry_json.result.address}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Saved AI Intelligence Report */}
                  {selectedReport.telemetry_json?.aiReport && (
                    <div className="relative rounded-2xl border border-zinc-700/50 bg-[#0d0d10] p-6 space-y-5 shadow-2xl overflow-hidden">
                      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
                        <h3 className="text-sm font-bold text-white">AI Intelligence Report</h3>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleCopyReport(selectedReport.telemetry_json.aiReport)}
                            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700/60 px-3 py-1.5 rounded-lg transition-all"
                          >
                            {copiedReport ? (
                              <>
                                <Check className="size-3.5 text-emerald-400" />
                                <span className="text-emerald-400 font-medium">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="size-3.5 text-zinc-400" />
                                <span>Copy Report</span>
                              </>
                            )}
                          </button>
                          <span className="text-[11px] text-zinc-400 font-mono bg-zinc-800/60 border border-zinc-700/50 px-2 py-0.5 rounded-full">NVIDIA NIM · Llama 3.1</span>
                        </div>
                      </div>
                      <div className={isLocked ? "blur-[2.5px] select-none pointer-events-none max-h-72 overflow-hidden opacity-50" : ""}>
                        <AIReportSection text={selectedReport.telemetry_json.aiReport} />
                      </div>
                      {isLocked && (
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d10] via-[#0d0d10]/95 to-[#0d0d10]/60 flex flex-col items-center justify-center p-6 text-center space-y-3 z-10">
                          <div className="size-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                            <Lock className="size-5" />
                          </div>
                          <div className="space-y-1 max-w-sm">
                            <h4 className="text-sm font-bold text-white">AI Intelligence Analysis Locked</h4>
                            <p className="text-xs text-zinc-400">
                              Upgrade to a paid plan to unlock complete OSINT framework analysis, Google Dorks, social platform presence, and risk scores.
                            </p>
                          </div>
                          <a
                            href="/pricing"
                            className="bg-amber-400 hover:bg-amber-300 text-black font-bold px-5 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-2 shadow-lg"
                          >
                            <Lock className="size-3.5" />
                            <span>Unlock Full Intelligence Report</span>
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold text-white">
                      Investigation Reports
                    </h2>
                    <p className="text-xs text-zinc-400">
                      View and inspect all generated OSINT investigation reports.
                    </p>
                  </div>

                  {reportsLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[1,2].map(i => (
                        <div key={i} className="rounded-xl border border-zinc-800 bg-[#121215] p-5 space-y-3 animate-pulse">
                          <div className="h-4 w-28 bg-zinc-800 rounded" />
                          <div className="h-5 w-48 bg-zinc-700 rounded" />
                          <div className="h-3 w-36 bg-zinc-800/60 rounded" />
                        </div>
                      ))}
                    </div>
                  ) : savedReports.length === 0 ? (
                    <div className="rounded-2xl border border-zinc-800/80 bg-[#121216] p-10 text-center space-y-4">
                      <div className="size-12 rounded-full bg-zinc-800/80 border border-zinc-700/80 flex items-center justify-center text-zinc-400 mx-auto">
                        <FileText className="size-6" />
                      </div>
                      <div className="space-y-1 max-w-sm mx-auto">
                        <h3 className="text-sm font-bold text-white">No Reports Generated Yet</h3>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          You haven't run any OSINT investigations yet. Go to Phone Intelligence and perform a lookup to auto-create reports.
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveTab('phone')}
                        className="bg-white hover:bg-zinc-200 text-black font-semibold px-4 py-2 rounded-xl text-xs transition-colors"
                      >
                        Go to Phone Intelligence
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {savedReports.map((item) => {
                        const res = item.telemetry_json?.result;
                        const rawName = res?.name || 'Subject Report';
                        const targetName = isLocked ? maskText(rawName) : rawName;
                        const targetPhone = item.phone_number ? (isLocked ? maskNumber(item.phone_number) : item.phone_number) : '';
                        return (
                          <div
                            key={item.id}
                            onClick={() => setSelectedReport(item)}
                            className="rounded-2xl border border-zinc-800/90 hover:border-zinc-700 bg-[#121216] hover:bg-[#16161c] p-5 space-y-4 shadow-xl transition-all cursor-pointer group"
                          >
                            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                              <div className="flex items-center gap-2">
                                <User className="size-4 text-zinc-400 group-hover:text-white transition-colors" />
                                <h3 className={`text-sm font-bold text-white ${isLocked ? 'blur-[1px]' : ''}`}>{targetName}</h3>
                              </div>
                              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                                Completed
                              </span>
                            </div>

                            <div className="space-y-1.5 text-xs">
                              <div className="flex items-center justify-between text-zinc-400">
                                <span className="flex items-center gap-1.5"><Phone className="size-3 text-zinc-500" /> Target Phone:</span>
                                <span className={`font-mono text-white ${isLocked ? 'blur-[1px]' : ''}`}>{targetPhone}</span>
                              </div>
                              {item.circle && (
                                <div className="flex items-center justify-between text-zinc-400">
                                  <span className="flex items-center gap-1.5"><Signal className="size-3 text-zinc-500" /> Carrier / Circle:</span>
                                  <span className="text-zinc-300">{item.circle}</span>
                                </div>
                              )}
                              <div className="flex items-center justify-between text-zinc-400 pt-1">
                                <span className="flex items-center gap-1.5 text-[11px] text-zinc-500"><Calendar className="size-3" /> Search Date:</span>
                                <span className="text-[11px] font-mono text-zinc-500">
                                  {new Date(item.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>

                            <div className="pt-2 flex items-center justify-between border-t border-zinc-800/60 text-xs font-semibold text-zinc-300 group-hover:text-white transition-colors">
                              <span className="flex items-center gap-1.5"><Eye className="size-3.5 text-zinc-400" /> View Full Intelligence Report</span>
                              <ChevronRight className="size-4 text-zinc-500 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
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

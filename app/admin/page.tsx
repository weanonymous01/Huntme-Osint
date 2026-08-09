'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Lock, KeyRound, Eye, EyeOff, ArrowRight, LogOut } from 'lucide-react';

type UpstreamStats = {
  totalTopupCreditsEntered: number;
  totalUpstreamCreditsSpent: number;
  remainingUpstreamBalance: number;
  searchesRemaining: number;
  warningThreshold: number;
  status: 'healthy' | 'warning' | 'critical' | 'blocked';
  isLowBalance: boolean;
  isCritical: boolean;
  isBlocked: boolean;
  formula: string;
};

type MonthlyUsersSummary = {
  totalMonthlyUsers: number;
  totalAllUsers: number;
  totalMonthlyUserCreditsSpent: number;
  totalMonthlySearches: number;
  monthlyPhoneSearchesCount: number;
  monthlyVehicleSearchesCount: number;
};

type UserUsageStat = {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  planType: string;
  apiCreditsRemaining: number;
  maxCredits: number;
  userCreditsSpent: number;
  phoneSearchesCount: number;
  vehicleSearchesCount: number;
  totalSearches: number;
  upstreamCreditsSpent: number;
  lastActive: string;
  createdAt: string;
};

type TopupHistoryItem = {
  id: string;
  credits_added: number;
  provider: string;
  cost_amount: number;
  notes: string;
  created_at: string;
};

type SearchLogItem = {
  id: string;
  type: 'phone' | 'vehicle';
  target: string;
  detail: string;
  userEmail: string;
  userName: string | null;
  userCreditsDeducted: number;
  upstreamCreditsSpent: number;
  status: string;
  createdAt: string;
};

export default function AdminApiTrackerPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);
  const [adminKey, setAdminKey] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submittingAuth, setSubmittingAuth] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Core Data
  const [upstreamApi, setUpstreamApi] = useState<UpstreamStats | null>(null);
  const [monthlySummary, setMonthlySummary] = useState<MonthlyUsersSummary | null>(null);
  const [users, setUsers] = useState<UserUsageStat[]>([]);
  const [topupHistory, setTopupHistory] = useState<TopupHistoryItem[]>([]);
  const [recentLogs, setRecentLogs] = useState<SearchLogItem[]>([]);

  // Filters & Search
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'activity' | 'topups' | 'calculator'>('users');

  // Modal / Form States
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [showBaselineModal, setShowBaselineModal] = useState(false);
  const [topupCreditsInput, setTopupCreditsInput] = useState<number>(50);
  const [topupProviderInput, setTopupProviderInput] = useState<string>('Phone + Vehicle Paid API');
  const [topupCostInput, setTopupCostInput] = useState<string>('');
  const [topupNotesInput, setTopupNotesInput] = useState<string>('');
  const [submittingTopup, setSubmittingTopup] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Baseline calibration state
  const [baselineInput, setBaselineInput] = useState<number>(50);

  // Alert Threshold state
  const [thresholdInput, setThresholdInput] = useState<number>(20);

  // Calculator Simulator States
  const [simUsers, setSimUsers] = useState<number>(12);
  const [simSearchesPerUserDay, setSimSearchesPerUserDay] = useState<number>(3);

  // Helper for authenticated headers
  const getHeaders = (overrideKey?: string) => {
    const key = overrideKey || adminKey || (typeof window !== 'undefined' ? sessionStorage.getItem('huntme_admin_key') || '' : '');
    return {
      'Content-Type': 'application/json',
      'x-admin-key': key,
    };
  };

  // Fetch telemetry
  const fetchApiUsageData = async (isManualRefresh = false, overrideKey?: string): Promise<boolean> => {
    if (isManualRefresh) setRefreshing(true);
    setError(null);
    const headers = getHeaders(overrideKey);
    try {
      const res = await fetch('/api/admin/api-usage?plan=monthly', {
        headers: {
          'x-admin-key': headers['x-admin-key'],
        },
        cache: 'no-store',
      });
      const json = await res.json();
      if (res.status === 401 || !json.success) {
        if (res.status === 401) {
          setIsAuthenticated(false);
          setAuthError('Unauthorized: Invalid master admin authorization key.');
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem('huntme_admin_key');
          }
        } else {
          setError(json.message || 'Failed to load data');
        }
        return false;
      }
      setUpstreamApi(json.data.upstreamApi);
      setMonthlySummary(json.data.monthlyUsersSummary);
      setUsers(json.data.users);
      setTopupHistory(json.data.topupHistory);
      setRecentLogs(json.data.recentSearchLogs);
      if (json.data.upstreamApi?.warningThreshold) {
        setThresholdInput(json.data.upstreamApi.warningThreshold);
      }
      return true;
    } catch (err: any) {
      setError(err?.message || 'Network error connecting to database');
      return false;
    } finally {
      setLoading(false);
      if (isManualRefresh) setRefreshing(false);
    }
  };

  // Check persistent session auth on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = sessionStorage.getItem('huntme_admin_key');
      if (savedKey) {
        setAdminKey(savedKey);
        fetchApiUsageData(false, savedKey).then((success) => {
          if (success) {
            setIsAuthenticated(true);
          }
          setCheckingAuth(false);
        });
        return;
      }
    }
    setCheckingAuth(false);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
      fetchApiUsageData();
    }, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, adminKey]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) return;
    setSubmittingAuth(true);
    setAuthError(null);
    try {
      const success = await fetchApiUsageData(false, passwordInput.trim());
      if (success) {
        setIsAuthenticated(true);
        setAdminKey(passwordInput.trim());
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('huntme_admin_key', passwordInput.trim());
        }
      } else {
        setAuthError('Incorrect master passkey. Access denied.');
      }
    } catch {
      setAuthError('Error validating passkey with server.');
    } finally {
      setSubmittingAuth(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminKey('');
    setPasswordInput('');
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('huntme_admin_key');
    }
  };

  // Quick action success notification
  const triggerSuccessNotification = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  // Submit manual topup
  const handleAddTopup = async (e?: React.FormEvent, customCredits?: number) => {
    if (e) e.preventDefault();
    const amount = customCredits !== undefined ? customCredits : topupCreditsInput;
    if (!amount || amount <= 0) return;

    setSubmittingTopup(true);
    try {
      const res = await fetch('/api/admin/api-usage', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          action: 'add_topup',
          credits: amount,
          provider: topupProviderInput,
          cost: topupCostInput ? parseFloat(topupCostInput) : 0,
          notes: topupNotesInput || `Top-Up (+${amount} Credits)`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowTopupModal(false);
        setTopupNotesInput('');
        setTopupCostInput('');
        triggerSuccessNotification(`Added ${amount} paid credits.`);
        await fetchApiUsageData();
      } else {
        alert(data.message || 'Failed to add top-up');
      }
    } catch (err: any) {
      alert('Network error while recording top-up');
    } finally {
      setSubmittingTopup(false);
    }
  };

  // Calibrate baseline
  const handleSetBaseline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (baselineInput === undefined || baselineInput < 0) return;

    setSubmittingTopup(true);
    try {
      const res = await fetch('/api/admin/api-usage', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          action: 'set_baseline',
          credits: baselineInput,
          provider: 'Balance Calibration',
          notes: `Set balance to ${baselineInput} credits`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowBaselineModal(false);
        triggerSuccessNotification(`Balance updated to ${baselineInput}.`);
        await fetchApiUsageData();
      } else {
        alert(data.message || 'Failed to set baseline');
      }
    } catch (err: any) {
      alert('Network error while setting baseline');
    } finally {
      setSubmittingTopup(false);
    }
  };

  // Delete topup record
  const handleDeleteTopup = async (id: string) => {
    if (!confirm('Delete this record?')) return;
    try {
      const res = await fetch('/api/admin/api-usage', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ action: 'delete_topup', id }),
      });
      const data = await res.json();
      if (data.success) {
        triggerSuccessNotification('Record removed.');
        await fetchApiUsageData();
      }
    } catch (err) {
      alert('Failed to delete record');
    }
  };

  // Update threshold
  const handleSaveThreshold = async (val: number) => {
    try {
      await fetch('/api/admin/api-usage', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ action: 'set_threshold', threshold: val }),
      });
      setThresholdInput(val);
      triggerSuccessNotification(`Alert threshold set to ${val}.`);
      await fetchApiUsageData();
    } catch {
      // ignore
    }
  };

  // Filtered users
  const filteredUsers = useMemo(() => {
    if (!userSearchQuery) return users;
    const q = userSearchQuery.toLowerCase();
    return users.filter(u => 
      u.email.toLowerCase().includes(q) || 
      (u.fullName && u.fullName.toLowerCase().includes(q))
    );
  }, [users, userSearchQuery]);

  // Export CSV Report
  const handleExportCsv = () => {
    if (!users || users.length === 0) return;
    const headers = ['Email', 'Name', 'Plan', 'Paid Credits Spent', 'Phone Searches', 'Vehicle Searches', 'Total Searches', 'Last Active'];
    const rows = users.map(u => [
      u.email,
      `"${u.fullName || 'N/A'}"`,
      u.planType,
      u.upstreamCreditsSpent,
      u.phoneSearchesCount,
      u.vehicleSearchesCount,
      u.totalSearches,
      u.lastActive ? new Date(u.lastActive).toISOString() : 'N/A'
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `monthly_paid_users_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculator projections
  const simDailySearches = simUsers * simSearchesPerUserDay;
  const simDaysRemaining = upstreamApi && upstreamApi.remainingUpstreamBalance > 0 && simDailySearches > 0
    ? (upstreamApi.remainingUpstreamBalance / simDailySearches).toFixed(1)
    : '0';

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center">
        <div className="size-6 border-2 border-zinc-700 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#08080a] text-zinc-100 flex flex-col justify-between selection:bg-zinc-800 selection:text-white antialiased">
        <div className="grow flex items-center justify-center p-4">
          <div className="w-full max-w-md space-y-6">
            <div className="rounded-2xl border border-zinc-800/90 bg-[#0d0d0e] p-8 sm:p-10 shadow-2xl space-y-6">
              <div className="text-center space-y-2">
                <div className="size-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-300">
                  <Lock className="size-6 text-zinc-400" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Admin Console Locked
                </h1>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Enter master authorization passkey to access system telemetry, balance tracker, and user analytics.
                </p>
              </div>

              {authError && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 text-center font-medium">
                  {authError}
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                    Master Passkey
                  </label>
                  <div className="relative flex items-center">
                    <KeyRound className="absolute left-3.5 size-4 text-zinc-500 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordInput}
                      onChange={(e) => {
                        setPasswordInput(e.target.value);
                        if (authError) setAuthError(null);
                      }}
                      placeholder="Enter admin passkey..."
                      autoFocus
                      required
                      className="w-full bg-[#08080a] border border-zinc-800 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 text-zinc-500 hover:text-zinc-300 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submittingAuth}
                  className="w-full bg-white hover:bg-zinc-200 text-black font-semibold py-3 px-4 rounded-xl transition-colors text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  <span>{submittingAuth ? 'Verifying...' : 'Unlock Console'}</span>
                  <ArrowRight className="size-4" />
                </button>
              </form>

              <div className="pt-2 text-center">
                <a
                  href="/dashboard"
                  className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors inline-block"
                >
                  ← Return to User Dashboard
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const balanceStatus = upstreamApi?.status || 'healthy';

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-zinc-800 selection:text-white antialiased">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Clean Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <a
                href="/dashboard"
                className="text-xs text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-3 py-1.5 rounded-md transition-colors"
              >
                Back to Dashboard
              </a>
              <span className="text-xs text-zinc-500 font-mono">
                Admin Console
              </span>
            </div>
            <h1 className="text-2xl font-semibold text-white tracking-tight pt-1">
              Paid API & Monthly User Tracker
            </h1>
            <p className="text-xs text-zinc-400">
              1 Search = 1 Paid Credit. Track monthly user searches and balance.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => fetchApiUsageData(true)}
              disabled={refreshing}
              className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer"
            >
              {refreshing ? 'Syncing...' : 'Sync'}
            </button>

            <button
              type="button"
              onClick={() => setShowBaselineModal(true)}
              className="bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              Set Balance
            </button>

            <button
              type="button"
              onClick={() => setShowTopupModal(true)}
              className="bg-white hover:bg-zinc-200 text-black font-medium px-4 py-2 rounded-lg text-xs transition-colors cursor-pointer"
            >
              Add Top-Up
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-rose-300 border border-zinc-800 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
              title="Lock Admin Console"
            >
              <LogOut className="size-3.5" />
              <span>Lock</span>
            </button>
          </div>
        </header>

        {/* Global Toast Success Alert */}
        {actionSuccessMsg && (
          <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 flex items-center justify-between text-xs font-medium">
            <span>{actionSuccessMsg}</span>
            <button onClick={() => setActionSuccessMsg(null)} className="text-zinc-500 hover:text-white">✕</button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PURE TEXT EXECUTIVE METRICS CARDS (3 BALANCED COLUMNS) */}
        {/* ========================================================================= */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: Live Balance */}
          <div className="rounded-xl border border-zinc-800/90 bg-[#111113] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider font-mono">
                Remaining Balance
              </span>
              <span className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded border ${
                balanceStatus === 'healthy'
                  ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5'
                  : balanceStatus === 'warning'
                  ? 'text-amber-400 border-amber-500/20 bg-amber-500/5'
                  : 'text-rose-400 border-rose-500/20 bg-rose-500/5'
              }`}>
                {balanceStatus === 'healthy' ? 'Active' : balanceStatus === 'warning' ? 'Low' : '0 (Blocked)'}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-white font-mono tracking-tight">
                  {loading ? '—' : (upstreamApi?.remainingUpstreamBalance ?? 0).toLocaleString()}
                </span>
                <span className="text-xs text-zinc-500 font-mono">
                  / {(upstreamApi?.totalTopupCreditsEntered ?? 50).toLocaleString()} Total
                </span>
              </div>
              <p className="text-[11px] text-zinc-500">
                Paid credits available for searches
              </p>
            </div>

            <div className="w-full bg-zinc-800/80 rounded-full h-1 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  balanceStatus === 'healthy'
                    ? 'bg-zinc-300'
                    : balanceStatus === 'warning'
                    ? 'bg-amber-400'
                    : 'bg-rose-500'
                }`}
                style={{
                  width: `${upstreamApi && upstreamApi.totalTopupCreditsEntered > 0
                    ? Math.max(0, Math.min(100, Math.round((upstreamApi.remainingUpstreamBalance / upstreamApi.totalTopupCreditsEntered) * 100)))
                    : 0}%`
                }}
              />
            </div>
          </div>

          {/* Card 2: Monthly Subscribers */}
          <div className="rounded-xl border border-zinc-800/90 bg-[#111113] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider font-mono">
                Monthly Subscribers
              </span>
              <span className="text-[11px] font-mono text-zinc-400">
                Plan: Monthly
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-white font-mono tracking-tight">
                  {loading ? '—' : (monthlySummary?.totalMonthlyUsers ?? 0)}
                </span>
                <span className="text-xs text-zinc-500">
                  Users ({monthlySummary?.totalAllUsers ?? 0} total)
                </span>
              </div>
              <p className="text-[11px] text-zinc-500">
                Active monthly accounts
              </p>
            </div>

            <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-500 font-mono">
              <span>Lookups:</span>
              <span className="text-zinc-300">
                {monthlySummary?.monthlyPhoneSearchesCount ?? 0} Phone · {monthlySummary?.monthlyVehicleSearchesCount ?? 0} Vehicle
              </span>
            </div>
          </div>

          {/* Card 3: Total Spent */}
          <div className="rounded-xl border border-zinc-800/90 bg-[#111113] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider font-mono">
                Paid Credits Spent
              </span>
              <span className="text-[11px] font-mono text-zinc-400">
                Total
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-white font-mono tracking-tight">
                  {loading ? '—' : (upstreamApi?.totalUpstreamCreditsSpent ?? 0).toLocaleString()}
                </span>
                <span className="text-xs text-zinc-500">Credits</span>
              </div>
              <p className="text-[11px] text-zinc-500">
                Total searches executed across platform
              </p>
            </div>

            <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-500 font-mono">
              <span>Executed:</span>
              <span className="text-white font-bold">
                {monthlySummary?.totalMonthlySearches ?? 0} Queries
              </span>
            </div>
          </div>

        </section>

        {/* ========================================================================= */}
        {/* QUICK TOP-UP PRESET ACTION BAR */}
        {/* ========================================================================= */}
        <section className="rounded-xl border border-zinc-800/90 bg-[#111113] p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/60 pb-3">
            <div>
              <h2 className="text-sm font-semibold text-white">
                Quick Top-Up
              </h2>
              <p className="text-xs text-zinc-400">
                Select an amount to add to your balance.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
              <span>Alert below:</span>
              <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
                <input
                  type="number"
                  value={thresholdInput}
                  onChange={(e) => setThresholdInput(parseInt(e.target.value) || 10)}
                  onBlur={(e) => handleSaveThreshold(parseInt(e.target.value) || 20)}
                  className="w-8 bg-transparent text-white font-mono focus:outline-none text-center text-xs"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {[
              { amount: 10, label: '+10' },
              { amount: 50, label: '+50' },
              { amount: 100, label: '+100' },
              { amount: 250, label: '+250' },
              { amount: 500, label: '+500' },
            ].map((preset) => (
              <button
                key={preset.amount}
                type="button"
                onClick={() => handleAddTopup(undefined, preset.amount)}
                disabled={submittingTopup}
                className="rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800/80 p-3 text-center transition-colors cursor-pointer disabled:opacity-50"
              >
                <span className="text-sm font-semibold text-white block font-mono">
                  {preset.label}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono block">
                  {preset.amount} searches
                </span>
              </button>
            ))}

            <button
              type="button"
              onClick={() => setShowTopupModal(true)}
              className="rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 p-3 text-center transition-colors cursor-pointer"
            >
              <span className="text-sm font-semibold text-white block">
                Custom
              </span>
              <span className="text-[10px] text-zinc-400 font-mono block">
                Manual entry
              </span>
            </button>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* TABS & NAVIGATION */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-3">
            <nav className="flex items-center gap-1">
              {[
                { id: 'users' as const, label: 'Subscribers', count: users.length },
                { id: 'activity' as const, label: 'Search Activity', count: recentLogs.length },
                { id: 'topups' as const, label: 'Top-Up Log', count: topupHistory.length },
                { id: 'calculator' as const, label: 'Estimator' },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-zinc-800 text-white font-semibold'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span className="text-[10px] font-mono text-zinc-500">
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {activeTab === 'users' && (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  placeholder="Search user..."
                  suppressHydrationWarning
                  className="bg-zinc-900 border border-zinc-800 rounded-md px-3 py-1 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors w-40 sm:w-56 font-normal"
                />
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer"
                >
                  Export CSV
                </button>
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* TAB 1: MONTHLY SUBSCRIBERS BREAKDOWN TABLE */}
          {/* ========================================================================= */}
          {activeTab === 'users' && (
            <div className="rounded-xl border border-zinc-800/90 bg-[#111113] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-900/60 text-[11px] font-medium text-zinc-400 font-mono">
                      <th className="py-3 px-4 sm:px-6">Subscriber</th>
                      <th className="py-3 px-4">Plan</th>
                      <th className="py-3 px-4">Phone Searches</th>
                      <th className="py-3 px-4">Vehicle Searches</th>
                      <th className="py-3 px-4 sm:px-6 text-right">Paid Credits Spent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 text-xs">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="py-10 text-center text-zinc-500 font-mono text-xs">
                          Loading data...
                        </td>
                      </tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-10 text-center text-zinc-500 text-xs">
                          No users found.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-zinc-900/40 transition-colors">
                          <td className="py-3 px-4 sm:px-6">
                            <div className="space-y-0.5 max-w-[200px] sm:max-w-xs truncate">
                              <p className="font-medium text-white truncate">
                                {user.fullName || user.email.split('@')[0]}
                              </p>
                              <p className="text-[11px] text-zinc-500 font-mono truncate">
                                {user.email}
                              </p>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded capitalize">
                              {user.planType}
                            </span>
                          </td>

                          <td className="py-3 px-4 font-mono text-zinc-300">
                            {user.phoneSearchesCount}
                          </td>

                          <td className="py-3 px-4 font-mono text-zinc-300">
                            {user.vehicleSearchesCount}
                          </td>

                          <td className="py-3 px-4 sm:px-6 text-right font-mono font-medium text-white">
                            {user.upstreamCreditsSpent}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: RECENT SEARCH ACTIVITY FEED */}
          {/* ========================================================================= */}
          {activeTab === 'activity' && (
            <div className="rounded-xl border border-zinc-800/90 bg-[#111113] p-4 sm:p-5 space-y-3">
              <div className="border-b border-zinc-800/60 pb-2.5">
                <h3 className="text-xs font-semibold text-white">Recent Activity</h3>
              </div>

              {recentLogs.length === 0 ? (
                <div className="py-10 text-center text-zinc-500 text-xs">
                  No activity recorded yet.
                </div>
              ) : (
                <div className="divide-y divide-zinc-800/50">
                  {recentLogs.map((log) => (
                    <div key={log.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded capitalize">
                          {log.type}
                        </span>
                        <div>
                          <span className="font-mono font-medium text-white">
                            {log.target}
                          </span>
                          <span className="text-zinc-500 text-[11px] pl-2 font-mono">
                            {log.userEmail}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0 font-mono text-xs">
                        <span className="text-zinc-300">-1</span>
                        <span className="text-[11px] text-zinc-500">
                          {new Date(log.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: TOP-UP HISTORY & AUDIT LOG */}
          {/* ========================================================================= */}
          {activeTab === 'topups' && (
            <div className="rounded-xl border border-zinc-800/90 bg-[#111113] p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800/60 pb-2.5">
                <h3 className="text-xs font-semibold text-white">Top-Up Records</h3>
                <button
                  type="button"
                  onClick={() => setShowTopupModal(true)}
                  className="bg-white hover:bg-zinc-200 text-black font-medium px-2.5 py-1 rounded text-xs transition-colors"
                >
                  Add Record
                </button>
              </div>

              {topupHistory.length === 0 ? (
                <div className="py-10 text-center text-zinc-500 text-xs">
                  No top-ups recorded.
                </div>
              ) : (
                <div className="divide-y divide-zinc-800/50">
                  {topupHistory.map((item) => (
                    <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="font-mono font-medium text-white">
                          +{item.credits_added}
                        </span>
                        <span className="text-zinc-400 pl-2">{item.notes}</span>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-[11px] text-zinc-500 font-mono">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteTopup(item.id)}
                          className="text-zinc-500 hover:text-zinc-300 transition-colors text-xs font-mono"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: BURN RATE CALCULATOR & PROJECTION SIMULATOR */}
          {/* ========================================================================= */}
          {activeTab === 'calculator' && (
            <div className="rounded-xl border border-zinc-800/90 bg-[#111113] p-5 space-y-5">
              <div className="border-b border-zinc-800/60 pb-2">
                <h3 className="text-sm font-semibold text-white">Usage Projections</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <label className="text-zinc-400">Monthly Plan Users:</label>
                    <span className="font-mono text-white font-medium">{simUsers}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={simUsers}
                    onChange={(e) => setSimUsers(parseInt(e.target.value))}
                    className="w-full accent-white cursor-pointer"
                  />
                </div>

                <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <label className="text-zinc-400">Searches / User / Day:</label>
                    <span className="font-mono text-white font-medium">{simSearchesPerUserDay}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={simSearchesPerUserDay}
                    onChange={(e) => setSimSearchesPerUserDay(parseInt(e.target.value))}
                    className="w-full accent-white cursor-pointer"
                  />
                </div>
              </div>

              <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div>
                  <span className="text-zinc-500 block text-[11px]">Daily Searches</span>
                  <span className="text-base text-white font-semibold">{simDailySearches}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[11px]">Daily Credits Used</span>
                  <span className="text-base text-white font-semibold">-{simDailySearches}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[11px]">Days Remaining</span>
                  <span className="text-base text-white font-semibold">{simDaysRemaining} Days</span>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* MODAL: ADD TOP-UP */}
      {/* ========================================================================= */}
      {showTopupModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="rounded-xl border border-zinc-800 bg-[#111113] p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
              <h3 className="text-sm font-semibold text-white">Add Paid Credits</h3>
              <button onClick={() => setShowTopupModal(false)} className="text-zinc-500 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddTopup} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-zinc-400">Credit Amount:</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={topupCreditsInput}
                  onChange={(e) => setTopupCreditsInput(parseInt(e.target.value) || 0)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-white font-mono focus:outline-none focus:border-zinc-600 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400">Notes (Optional):</label>
                <input
                  type="text"
                  value={topupNotesInput}
                  onChange={(e) => setTopupNotesInput(e.target.value)}
                  placeholder="e.g. Top-Up"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-white focus:outline-none focus:border-zinc-600"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowTopupModal(false)}
                  className="px-3 py-1.5 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingTopup || topupCreditsInput <= 0}
                  className="bg-white hover:bg-zinc-200 text-black font-medium px-4 py-1.5 rounded-md transition-colors disabled:opacity-50"
                >
                  {submittingTopup ? 'Saving...' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: SET BASELINE */}
      {/* ========================================================================= */}
      {showBaselineModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="rounded-xl border border-zinc-800 bg-[#111113] p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
              <h3 className="text-sm font-semibold text-white">Set Balance</h3>
              <button onClick={() => setShowBaselineModal(false)} className="text-zinc-500 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSetBaseline} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-zinc-400">Current Remaining Credits:</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={baselineInput}
                  onChange={(e) => setBaselineInput(parseInt(e.target.value) || 0)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-white font-mono focus:outline-none focus:border-zinc-600 text-sm"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowBaselineModal(false)}
                  className="px-3 py-1.5 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingTopup}
                  className="bg-white hover:bg-zinc-200 text-black font-medium px-4 py-1.5 rounded-md transition-colors disabled:opacity-50"
                >
                  {submittingTopup ? 'Saving...' : 'Set'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

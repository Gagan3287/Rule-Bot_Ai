"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/context/AuthContext";
import {
  ArrowLeft, Users, MessageCircle, TrendingUp, AlertTriangle,
  RefreshCw, Sparkles, HelpCircle, BarChart3, Bot, Hash,
  Activity, Target
} from "lucide-react";

interface TopQuestion { question: string; count: number; }
interface DailyChat    { date: string; count: number; }
interface AnalyticsData {
  total_users: number;
  total_chats: number;
  unknown_count: number;
  avg_per_session: number;
  most_asked_questions: TopQuestion[];
  daily_chats: DailyChat[];
}

const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: "easeOut" as const }
  })
};

// ── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color, i }: {
  icon: React.ReactNode; label: string; value: string | number;
  sub?: string; color: string; i: number;
}) {
  return (
    <motion.div
      custom={i} variants={cardVariants} initial="hidden" animate="visible"
      whileHover={{ y: -3 }}
      className="glass-premium rounded-2xl p-6 border border-slate-200/50 dark:border-slate-800/50 flex items-center space-x-5 shadow-sm"
    >
      <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{label}</p>
        <h2 className="text-3xl font-extrabold mt-0.5 truncate">{value}</h2>
        {sub && <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{sub}</p>}
      </div>
    </motion.div>
  );
}

export default function AdminPage() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const [data, setData]       = useState<AnalyticsData | null>(null);
  const [fetching, setFetching] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setFetching(true);
    setError(null);
    try {
      const res = await api.get("/analytics");
      setData(res.data);
    } catch (err: any) {
      setError("Failed to load analytics. Is the backend running?");
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!user)    { router.push("/login"); return; }
      if (isAdmin)  { fetchAnalytics(); }
    }
  }, [user, loading, isAdmin, router, fetchAnalytics]);

  // ── Access Denied ──────────────────────────────────────────────────────────
  if (!loading && user && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 dot-grid">
        <motion.div
          className="max-w-md w-full glass-premium rounded-3xl p-8 text-center border border-red-500/20 shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        >
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold">Access Denied</h2>
          <p className="text-sm text-slate-500 mt-3 leading-relaxed">
            Only system administrators can access the analytics dashboard.
          </p>
          <Link href="/chat"
            className="mt-6 inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /><span>Back to Workspace</span>
          </Link>
        </motion.div>
      </div>
    );
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading || fetching || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <RefreshCw className="w-10 h-10 text-indigo-500 animate-spin mx-auto" />
          <p className="text-slate-400 text-xs">Aggregating chat metrics…</p>
        </div>
      </div>
    );
  }

  const maxQ = data.most_asked_questions.length > 0
    ? Math.max(...data.most_asked_questions.map(q => q.count)) : 1;
  const maxD = data.daily_chats.length > 0
    ? Math.max(...data.daily_chats.map(d => d.count)) : 1;

  // Known vs Unknown ratio for mini donut
  const totalIntents = data.most_asked_questions.reduce((s, q) => s + q.count, 0) || 1;
  const unknownPct   = Math.round((data.unknown_count / totalIntents) * 100);
  const knownPct     = 100 - unknownPct;

  // Color palette for intent bars
  const barColors = [
    "from-indigo-500 to-indigo-400",
    "from-purple-500 to-purple-400",
    "from-pink-500 to-pink-400",
    "from-blue-500 to-blue-400",
    "from-cyan-500 to-cyan-400",
    "from-teal-500 to-teal-400",
    "from-violet-500 to-violet-400",
    "from-fuchsia-500 to-fuchsia-400",
    "from-rose-500 to-rose-400",
    "from-orange-500 to-orange-400",
  ];

  return (
    <div className="min-h-screen dot-grid flex flex-col relative">
      {/* Orbs */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-indigo-500/8 rounded-full blur-[120px] pointer-events-none glow-bg" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-purple-500/8 rounded-full blur-[120px] pointer-events-none glow-bg" />

      <div className="max-w-7xl mx-auto w-full px-6 py-8 flex flex-col gap-8 relative z-10 flex-grow">

        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Link href="/chat"
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest block">
                RuleBot Admin
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight">Analytics Dashboard</h1>
            </div>
          </div>
          <button onClick={fetchAnalytics}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer">
            <RefreshCw className="w-4 h-4 text-indigo-500" />
            <span>Refresh</span>
          </button>
        </header>

        {/* Error Banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium flex items-center space-x-3"
            >
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Stat Cards Row ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard i={0} icon={<Users className="w-7 h-7 text-white" />}
            label="Registered Users" value={data.total_users}
            sub="All accounts" color="bg-indigo-500" />
          <StatCard i={1} icon={<MessageCircle className="w-7 h-7 text-white" />}
            label="Total Conversations" value={data.total_chats}
            sub="All sessions" color="bg-purple-500" />
          <StatCard i={2} icon={<HelpCircle className="w-7 h-7 text-white" />}
            label="Unknown Queries" value={data.unknown_count}
            sub={`${unknownPct}% unmatched`} color="bg-rose-500" />
          <StatCard i={3} icon={<Activity className="w-7 h-7 text-white" />}
            label="Avg Msgs / Session" value={data.avg_per_session}
            sub="User messages" color="bg-teal-500" />
        </div>

        {/* ── Charts Row ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow">

          {/* Weekly Bar Chart */}
          <div className="lg:col-span-7 glass-premium rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/50 flex flex-col shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-lg">Weekly Chat Activity</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Daily user queries over the past 7 days</p>
              </div>
              <BarChart3 className="w-5 h-5 text-indigo-400" />
            </div>

            <div className="flex items-end justify-between gap-3 flex-grow min-h-[200px] px-2">
              {data.daily_chats.map((day, i) => {
                const h = maxD > 0 ? (day.count / maxD) * 88 : 4;
                return (
                  <div key={i} className="flex-grow flex flex-col items-center group relative">
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md transition-opacity pointer-events-none">
                      {day.count}
                    </div>
                    <motion.div
                      className="w-full bg-gradient-to-t from-indigo-600 to-purple-400 rounded-xl shadow-sm"
                      style={{ height: `${Math.max(h, 4)}%` }}
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(h, 4)}%` }}
                      transition={{ delay: i * 0.07, type: "spring", stiffness: 80 }}
                    />
                    <span className="text-[10px] font-medium text-slate-400 mt-2">
                      {new Date(day.date).toLocaleDateString([], { weekday: "short" })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Intent Distribution */}
          <div className="lg:col-span-5 glass-premium rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/50 flex flex-col shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg">Intent Distribution</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Most-matched rule engine intents</p>
              </div>
              <Target className="w-5 h-5 text-purple-400" />
            </div>

            <div className="flex-grow overflow-y-auto space-y-3 pr-1 max-h-[340px] scrollbar-thin">
              {data.most_asked_questions.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center py-8 text-xs text-slate-500 space-y-3">
                  <Sparkles className="w-8 h-8 text-slate-400 opacity-50" />
                  <span>No intents matched yet. Send a message first!</span>
                </div>
              ) : (
                data.most_asked_questions.map((item, i) => {
                  const pct = Math.round((item.count / maxQ) * 100);
                  const gradient = barColors[i % barColors.length];
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center space-x-2 font-semibold">
                          <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${gradient}`} />
                          <span className={item.question === "Unknown" ? "text-rose-500" : ""}>
                            {item.question}
                          </span>
                        </span>
                        <span className="text-slate-400 font-mono">{item.count} hits</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800/60 overflow-hidden">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${gradient} rounded-full`}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.7, delay: i * 0.05 }}
                        />
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* ── Known vs Unknown Ratio Card ─────────────────────────────────── */}
        <div className="glass-premium rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Mini Donut */}
            <div className="relative w-28 h-28 shrink-0">
              <svg viewBox="0 0 36 36" className="w-28 h-28 -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor"
                  className="text-slate-200 dark:text-slate-800" strokeWidth="3.8" />
                <circle cx="18" cy="18" r="15.9" fill="none"
                  stroke="url(#grad)" strokeWidth="3.8"
                  strokeDasharray={`${knownPct} ${unknownPct}`}
                  strokeLinecap="round" />
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center rotate-0">
                <span className="text-xl font-extrabold">{knownPct}%</span>
                <span className="text-[10px] text-slate-400">matched</span>
              </div>
            </div>

            <div className="flex-grow">
              <h3 className="font-bold text-base mb-1">Query Resolution Rate</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Percentage of user queries successfully matched to a known intent by the rule engine.
              </p>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
                  <span className="text-xs font-medium">Matched Intent — {knownPct}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="text-xs font-medium">Unknown / Unmatched — {unknownPct}%</span>
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <Link href="/how-it-works"
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:bg-indigo-500/20 transition-colors">
                <Bot className="w-4 h-4" />
                <span>How the Engine Works</span>
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200/50 dark:border-slate-800/50 text-center text-xs text-slate-500 relative z-10">
        © {new Date().getFullYear()} RuleBot Admin · FastAPI + SQLite
      </footer>
    </div>
  );
}

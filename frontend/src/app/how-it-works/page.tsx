"use client";

import React from "react";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import {
  Bot, ArrowLeft, ArrowDown, Search, Regex,
  Brain, Zap, CheckCircle2, XCircle, Sun, Moon,
  MessageSquare, Filter, Tag, Cpu
} from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const }
  })
};

const FlowStep = ({ icon, label, sub, color, i }: {
  icon: React.ReactNode; label: string; sub: string; color: string; i: number;
}) => (
  <motion.div
    custom={i} variants={fadeUp} initial="hidden" animate="visible"
    className="flex flex-col items-center gap-2 relative z-10"
  >
    <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center shadow-lg`}>
      {icon}
    </div>
    <span className="font-bold text-sm text-center">{label}</span>
    <span className="text-[11px] text-slate-500 dark:text-slate-400 text-center max-w-[100px]">{sub}</span>
  </motion.div>
);

export default function HowItWorksPage() {
  const { theme, toggleTheme } = useTheme();

  const concepts = [
    {
      icon: <MessageSquare className="w-6 h-6 text-indigo-500" />,
      title: "What is a Rule-Based Chatbot?",
      body: "A rule-based chatbot responds using handcrafted logical rules rather than probabilistic or neural models. Every response is 100% deterministic — the same input always produces the same output. There is no 'learning' from data.",
    },
    {
      icon: <Tag className="w-6 h-6 text-purple-500" />,
      title: "Intent Recognition",
      body: "Intent recognition is the process of understanding *what the user wants*. RuleBot does this by matching the cleaned input against a set of predefined intent modules (Greetings, Python, AI, etc.). The module with the highest confidence score wins.",
    },
    {
      icon: <Search className="w-6 h-6 text-pink-500" />,
      title: "Keyword Matching",
      body: "The simplest and highest-priority strategy. If the input text is an exact keyword (e.g., \"python\", \"bye\"), the rule instantly returns a confidence of 1.0. Keyword matching is fast and deterministic.",
    },
    {
      icon: <Regex className="w-6 h-6 text-indigo-500" />,
      title: "Regular Expression (Regex) Matching",
      body: "Regex patterns allow flexible matching (e.g., \"what is python\", \"tell me about python\", \"define python\"). These return a confidence of 0.8. Regex is more powerful than exact matching but still fully rule-based.",
    },
    {
      icon: <Filter className="w-6 h-6 text-purple-500" />,
      title: "Pattern Matching",
      body: "Structural patterns check for general keyword presence anywhere in the sentence (e.g., \"pip\" or \"venv\" hints at Python). These return 0.6 confidence and act as fuzzy fallbacks when more specific rules don't match.",
    },
    {
      icon: <Brain className="w-6 h-6 text-pink-500" />,
      title: "Why This is NOT Machine Learning",
      body: "Machine Learning models derive their behaviour from statistical patterns found in training data. RuleBot never 'trains', never updates weights, and never uses neural networks. All responses are hard-coded rules written by a human developer.",
    },
  ];

  const flowSteps = [
    { icon: <MessageSquare className="w-6 h-6 text-white" />, label: "User Input",        sub: "Raw text from UI",         color: "bg-slate-700" },
    { icon: <Cpu           className="w-6 h-6 text-white" />, label: "Normalization",     sub: "Lowercase + strip punct.", color: "bg-indigo-600" },
    { icon: <Search        className="w-6 h-6 text-white" />, label: "Keyword Detection", sub: "Exact match → score 1.0",  color: "bg-indigo-500" },
    { icon: <Regex         className="w-6 h-6 text-white" />, label: "Regex Matching",    sub: "Pattern match → score 0.8",color: "bg-purple-500" },
    { icon: <Filter        className="w-6 h-6 text-white" />, label: "Intent Selection",  sub: "Highest confidence wins",  color: "bg-pink-500"   },
    { icon: <Bot           className="w-6 h-6 text-white" />, label: "Response",          sub: "Rule-based reply returned",color: "bg-green-600"  },
  ];

  return (
    <div className="min-h-screen dot-grid relative overflow-hidden">
      {/* Orbs */}
      <div className="absolute top-0 left-0 w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none glow-bg" />
      <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none glow-bg" />

      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                <Bot className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="font-extrabold text-lg bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">RuleBot</span>
            </Link>
          </div>
          <button onClick={toggleTheme} className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors">
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16 space-y-24 relative z-10">

        {/* Hero */}
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            <span>Rule-Based NLP</span>
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            How <span className="text-shimmer">RuleBot</span> Works
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            A deep dive into the deterministic Natural Language Processing pipeline powering RuleBot — no machine learning, no neural networks, just pure logic.
          </p>
        </motion.div>

        {/* ── Rule Flow Visualizer ────────────────────────────────────────── */}
        <section>
          <motion.h2
            className="text-2xl font-bold text-center mb-12"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          >
            Rule Engine Processing Pipeline
          </motion.h2>

          <div className="glass-premium rounded-3xl p-8 md:p-12 border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-2 flex-wrap">
              {flowSteps.map((step, i) => (
                <React.Fragment key={i}>
                  <FlowStep {...step} i={i} />
                  {i < flowSteps.length - 1 && (
                    <motion.div
                      custom={i + 0.5} variants={fadeUp} initial="hidden" animate="visible"
                      className="flex-shrink-0"
                    >
                      <ArrowDown className="w-5 h-5 text-indigo-400 md:rotate-[-90deg]" />
                    </motion.div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Confidence Legend */}
            <div className="mt-10 pt-8 border-t border-slate-200/40 dark:border-slate-800/40">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center mb-5">
                Confidence Score Priority
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {[
                  { label: "1.0 — Exact keyword match", color: "bg-green-500" },
                  { label: "0.8 — Regex pattern match", color: "bg-indigo-500" },
                  { label: "0.6 — General keyword presence", color: "bg-purple-500" },
                  { label: "< 0.3 — Unknown fallback", color: "bg-slate-500" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-2 text-xs">
                    <span className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-slate-600 dark:text-slate-300 font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Concept Cards ───────────────────────────────────────────────── */}
        <section>
          <motion.h2
            className="text-2xl font-bold text-center mb-12"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          >
            Core AI Concepts Explained
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {concepts.map((c, i) => (
              <motion.div
                key={i} custom={i} variants={fadeUp} initial="hidden" animate="visible"
                className="glass rounded-2xl p-6 border border-slate-200/40 dark:border-slate-800/40 hover:border-indigo-500/30 transition-all hover:-translate-y-1 duration-300 flex flex-col space-y-3"
                whileHover={{ scale: 1.01 }}
              >
                <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  {c.icon}
                </div>
                <h3 className="font-bold text-base">{c.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{c.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Rule Modules Table ──────────────────────────────────────────── */}
        <section>
          <motion.h2
            className="text-2xl font-bold text-center mb-8"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            Modular Rule Engine Architecture
          </motion.h2>
          <div className="glass-premium rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 text-left font-bold">Rule File</th>
                  <th className="px-6 py-4 text-left font-bold">Intent Name</th>
                  <th className="px-6 py-4 text-left font-bold">Matching Strategy</th>
                  <th className="px-6 py-4 text-left font-bold">Example Queries</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/30 dark:divide-slate-800/40">
                {[
                  ["greetings.py",  "Greetings",       "Exact keyword + Regex",        '"hi", "hello", "hey"'],
                  ["farewells.py",  "Bye",             "Exact keyword + Regex",        '"bye", "goodbye", "exit"'],
                  ["help.py",       "Help",            "Exact keyword + Regex",        '"help", "commands", "support"'],
                  ["date.py",       "Date",            "Exact keyword + Regex",        '"date", "what day is today"'],
                  ["time.py",       "Time",            "Exact keyword + Regex",        '"time", "what time is it"'],
                  ["weather.py",    "Weather",         "Regex pattern",                '"weather", "will it rain"'],
                  ["programming.py","Programming",     "Exact keyword + Regex",        '"coding", "software engineering"'],
                  ["python.py",     "Python",          "Exact + Regex + Fuzzy",        '"python", "tell me about python"'],
                  ["java.py",       "Java",            "Exact + Regex + Fuzzy",        '"java", "jvm", "maven"'],
                  ["ai.py",         "AI",              "Exact + Regex + Fuzzy",        '"ai", "artificial intelligence"'],
                  ["ml.py",         "Machine Learning","Exact + Regex + Fuzzy",        '"ml", "deep learning"'],
                  ["web_dev.py",    "Web Development", "Exact + Regex + Fuzzy",        '"html", "react", "web dev"'],
                  ["college.py",    "College",         "Exact + Regex + Fuzzy",        '"college", "admission"'],
                  ["faqs.py",       "General FAQs",    "Regex pattern",                '"who are you", "who made you"'],
                  ["unknown.py",    "Unknown",         "Fallback (confidence < 0.3)",  'Any unrecognized query'],
                ].map(([file, intent, strategy, examples], i) => (
                  <tr key={i} className="hover:bg-slate-100/50 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="px-6 py-3 font-mono text-[11px] text-indigo-500">{file}</td>
                    <td className="px-6 py-3 font-semibold text-xs">{intent}</td>
                    <td className="px-6 py-3 text-xs text-slate-500 dark:text-slate-400">{strategy}</td>
                    <td className="px-6 py-3 text-[11px] text-slate-400 dark:text-slate-500 font-mono">{examples}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── ML vs Rule-Based Comparison ─────────────────────────────────── */}
        <section>
          <motion.h2
            className="text-2xl font-bold text-center mb-8"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            Rule-Based AI vs Machine Learning
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rule-Based */}
            <div className="glass rounded-2xl p-6 border-2 border-indigo-500/20 shadow-md">
              <div className="flex items-center space-x-3 mb-5">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                <h3 className="font-bold text-lg text-green-600 dark:text-green-400">RuleBot (Rule-Based)</h3>
              </div>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                {[
                  "Deterministic — same input always = same output",
                  "No training data or GPU required",
                  "Fully explainable and auditable logic",
                  "Zero hallucination risk",
                  "Instant response with no inference latency",
                  "Code is the model — easy to modify",
                ].map((t, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ML */}
            <div className="glass rounded-2xl p-6 border-2 border-slate-300/20 shadow-md">
              <div className="flex items-center space-x-3 mb-5">
                <XCircle className="w-6 h-6 text-slate-400" />
                <h3 className="font-bold text-lg text-slate-500 dark:text-slate-400">ML / LLM Chatbots</h3>
              </div>
              <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                {[
                  "Probabilistic — responses can vary each run",
                  "Requires large datasets and compute",
                  "Black-box — hard to audit predictions",
                  "Can hallucinate plausible-sounding falsehoods",
                  "High inference cost and latency",
                  "Training pipeline required before deployment",
                ].map((t, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-slate-400 mt-0.5 shrink-0">✗</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <motion.div
          className="text-center space-y-4 pb-8"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        >
          <p className="text-slate-500 dark:text-slate-400">Ready to try the engine yourself?</p>
          <Link
            href="/chat"
            className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-2xl text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 font-semibold shadow-lg shadow-indigo-500/20 transition-all"
          >
            <Bot className="w-5 h-5" />
            <span>Start Chatting with RuleBot</span>
          </Link>
        </motion.div>

      </main>
    </div>
  );
}

"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { 
  Bot, 
  MessageSquare, 
  Shield, 
  Sparkles, 
  ArrowRight, 
  BarChart3, 
  BookOpen, 
  Code2, 
  Moon, 
  Sun,
  ChevronRight
} from "lucide-react";

export default function LandingPage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    }
  };

  const featureCards = [
    {
      icon: <Sparkles className="w-6 h-6 text-indigo-500" />,
      title: "Rule-Based Intent Engine",
      desc: "Fast, predictable, and robust matching using regex, keywords, patterns, and structural matching rules."
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-purple-500" />,
      title: "Premium ChatGPT UI",
      desc: "Autoscroll, typing indicators, formatted code blocks, and dynamic layouts for desktops and mobile."
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-pink-500" />,
      title: "Admin Analytics",
      desc: "Track total active users, chat volumes, hourly usage, and the most frequently matched customer intents."
    },
    {
      icon: <Shield className="w-6 h-6 text-indigo-500" />,
      title: "JWT Authentication",
      desc: "Secure login and registration, managing encrypted user sessions locally with zero external requirements."
    },
    {
      icon: <Code2 className="w-6 h-6 text-purple-500" />,
      title: "Developer Ready",
      desc: "Built on Next.js 15, FastAPI, Prisma, PostgreSQL, Docker, and full OpenAPI/Swagger API schemas."
    },
    {
      icon: <BookOpen className="w-6 h-6 text-pink-500" />,
      title: "Instant PDF Export",
      desc: "Download full transcripts of your chatbot sessions formatted cleanly as multi-page PDF documents."
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden dot-grid flex flex-col">
      {/* Decorative Glow Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full filter blur-[80px] dark:bg-indigo-600/15 pointer-events-none glow-bg" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full filter blur-[80px] dark:bg-purple-600/15 pointer-events-none glow-bg" />

      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              RuleBot
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <a href="#features" className="hover:text-indigo-500 transition-colors">Features</a>
            <a href="#tech" className="hover:text-indigo-500 transition-colors">Tech Stack</a>
            <Link href="/how-it-works" className="hover:text-indigo-500 transition-colors">How It Works</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {user ? (
              <div className="flex items-center space-x-3">
                <Link 
                  href="/chat" 
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl shadow-md transition-all hover:shadow-indigo-500/10 flex items-center space-x-1"
                >
                  <span>Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  href="/login" 
                  className="px-4 py-2 text-sm font-medium hover:text-indigo-500 transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  href="/register" 
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl shadow-md transition-all hover:shadow-indigo-500/10"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Landing Content */}
      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left column: Text */}
        <motion.div 
          className="lg:col-span-7 space-y-8 text-center lg:text-left"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div 
            variants={itemVariants} 
            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold tracking-wide uppercase"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>FastAPI + Next.js 15 Full Stack AI</span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-6xl font-extrabold tracking-tight leading-none"
          >
            Conversations Driven by <br className="hidden md:inline" />
            <span className="text-shimmer">Predictable Logic</span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0"
          >
            Meet RuleBot, an intelligent chatbot engine matching statements using keyword clustering, regular expressions, structured configurations, and if-else flows. Perfect for fast, customizable, and reliable customer response workflows.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <Link 
              href={user ? "/chat" : "/register"} 
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-2xl shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all flex items-center justify-center space-x-2 group"
            >
              <span>Get Started Free</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link 
              href="/login" 
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold border border-slate-200/80 dark:border-slate-800 bg-slate-100/50 hover:bg-slate-200/50 dark:bg-slate-800/30 dark:hover:bg-slate-800/60 rounded-2xl transition-colors flex items-center justify-center space-x-2"
            >
              <BarChart3 className="w-5 h-5 text-indigo-500" />
              <span>Admin Analytics</span>
            </Link>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="pt-6 grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0 border-t border-slate-200/50 dark:border-slate-800/50 text-center lg:text-left"
          >
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">100%</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Rule Predictability</div>
            </div>
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">&lt; 15ms</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Response Latency</div>
            </div>
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Postgres</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Prisma Database</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right column: Graphic preview */}
        <motion.div 
          className="lg:col-span-5 relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Glass frame */}
          <div className="glass-premium rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl relative flex flex-col border border-slate-200/30 dark:border-slate-700/20">
            {/* Header bar */}
            <div className="h-12 bg-slate-100/50 dark:bg-slate-900/60 px-4 flex items-center justify-between border-b border-slate-200/40 dark:border-slate-800/40">
              <div className="flex items-center space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                <div className="w-3 h-3 rounded-full bg-green-400/80" />
              </div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider flex items-center space-x-1">
                <Bot className="w-3.5 h-3.5 text-indigo-500" />
                <span>RuleBot Preview</span>
              </span>
              <div className="w-12" />
            </div>

            {/* Content area: mock chat */}
            <div className="flex-grow p-5 space-y-4 text-xs overflow-y-auto">
              
              {/* Message 1 */}
              <div className="flex justify-end">
                <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-none px-3.5 py-2.5 max-w-[80%] shadow-md">
                  What is Python programming?
                </div>
              </div>

              {/* Message 2 */}
              <div className="flex justify-start items-start space-x-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-slate-200/60 dark:bg-slate-800/60 rounded-2xl rounded-tl-none px-3.5 py-2.5 max-w-[80%] text-slate-800 dark:text-slate-200 border border-slate-200/20 shadow-sm leading-relaxed">
                  Python is a high-level, interpreted programming language known for its readability and simplicity. It is widely used in Web Development, Data Science, automation, and Artificial Intelligence.
                  <div className="mt-1.5 pt-1.5 border-t border-slate-300/30 dark:border-slate-700/50 flex justify-between text-[9px] text-slate-500">
                    <span>Intent: Python</span>
                    <span>Matched: Regex & Keywords</span>
                  </div>
                </div>
              </div>

              {/* Message 3 */}
              <div className="flex justify-end">
                <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-none px-3.5 py-2.5 max-w-[80%] shadow-md">
                  What is the weather today?
                </div>
              </div>

              {/* Message 4 */}
              <div className="flex justify-start items-start space-x-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-slate-200/60 dark:bg-slate-800/60 rounded-2xl rounded-tl-none px-3.5 py-2.5 max-w-[80%] text-slate-800 dark:text-slate-200 border border-slate-200/20 shadow-sm leading-relaxed">
                  I cannot retrieve real-time weather details right now, but you can always check your local forecast. Make sure to carry an umbrella if it rains!
                  <div className="mt-1.5 pt-1.5 border-t border-slate-300/30 dark:border-slate-700/50 flex justify-between text-[9px] text-slate-500">
                    <span>Intent: Weather</span>
                    <span>Matched: Regex Pattern</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </main>

      {/* Feature section */}
      <section id="features" className="py-20 relative z-10 bg-slate-100/30 dark:bg-slate-900/40 border-y border-slate-200/40 dark:border-slate-800/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Engineered For Predictability and Scale</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-4">
              RuleBot integrates modern client interfaces with structured backend matching patterns to achieve zero halluncination rates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featureCards.map((feat, idx) => (
              <motion.div
                key={idx}
                className="glass rounded-2xl p-6 hover:translate-y-[-4px] hover:shadow-lg transition-all duration-300 flex flex-col space-y-4"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="w-12 h-12 rounded-xl bg-slate-200/50 dark:bg-slate-800/80 flex items-center justify-center shadow-inner">
                  {feat.icon}
                </div>
                <h3 className="font-bold text-lg">{feat.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed flex-grow">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack section */}
      <section id="tech" className="py-20 relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold">Cutting-Edge Tech Stack</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Built with modern developer tools for ultra-fast performance.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-6 rounded-2xl bg-slate-100/50 dark:bg-slate-800/20 border border-slate-200/50 dark:border-slate-800/50">
            <div className="font-bold text-lg text-indigo-500">Next.js 15</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">App Router & React</div>
          </div>
          <div className="p-6 rounded-2xl bg-slate-100/50 dark:bg-slate-800/20 border border-slate-200/50 dark:border-slate-800/50">
            <div className="font-bold text-lg text-purple-500">Python FastAPI</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">High-performance async API</div>
          </div>
          <div className="p-6 rounded-2xl bg-slate-100/50 dark:bg-slate-800/20 border border-slate-200/50 dark:border-slate-800/50">
            <div className="font-bold text-lg text-pink-500">Prisma & Postgres</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Robust ORM & Database</div>
          </div>
          <div className="p-6 rounded-2xl bg-slate-100/50 dark:bg-slate-800/20 border border-slate-200/50 dark:border-slate-800/50">
            <div className="font-bold text-lg text-indigo-500">Tailwind CSS v4</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Modern UI styling</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-slate-200/40 dark:border-slate-800/40 bg-slate-100/30 dark:bg-slate-950/20 text-center text-xs text-slate-500 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            © {new Date().getFullYear()} RuleBot Inc. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-indigo-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-500 transition-colors">Terms of Service</a>
            <a href="/docs" className="hover:text-indigo-500 transition-colors">Swagger API Docs</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

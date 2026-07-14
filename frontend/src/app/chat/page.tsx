"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { jsPDF } from "jspdf";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { api } from "@/context/AuthContext";
import { 
  Bot, 
  Send, 
  Plus, 
  Trash2, 
  Download, 
  Search, 
  LogOut, 
  Menu, 
  X, 
  Moon, 
  Sun, 
  BarChart3, 
  User, 
  Clock, 
  MessageSquare,
  HelpCircle,
  Sparkles
} from "lucide-react";

interface Message {
  id: string;
  session_id: string;
  sender: "user" | "bot";
  text: string;
  intent_matched?: string | null;
  created_at: string;
}

interface SessionBrief {
  id: string;
  title: string;
  created_at: string;
}

export default function ChatPage() {
  const { user, token, loading, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  // Chat States
  const [sessions, setSessions] = useState<SessionBrief[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Layout States
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Fetch chat session history on mount
  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  // Fetch messages when active session changes
  useEffect(() => {
    if (activeSessionId) {
      fetchSessionMessages(activeSessionId);
    } else {
      setMessages([]);
    }
  }, [activeSessionId]);

  // Auto scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchHistory = async () => {
    try {
      const response = await api.get("/history");
      setSessions(response.data);
    } catch (err) {
      console.error("Failed to fetch history", err);
    }
  };

  const fetchSessionMessages = async (id: string) => {
    try {
      const response = await api.get(`/history/${id}`);
      setMessages(response.data.messages);
    } catch (err) {
      console.error("Failed to fetch messages for session", err);
    }
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    setInputText("");
    setIsTyping(true);

    // If starting a fresh chat, save a local temporary user message
    const tempUserMsg: Message = {
      id: "temp-user",
      session_id: activeSessionId || "new",
      sender: "user",
      text: textToSend,
      created_at: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, tempUserMsg]);

    try {
      // Build request with session_id query param if available
      const url = activeSessionId ? `/chat?session_id=${activeSessionId}` : "/chat";
      const response = await api.post(url, { text: textToSend });
      
      // Response returns [userMsg, botMsg]
      const [userMsg, botMsg] = response.data;

      // Update current session id if it was a new chat
      if (!activeSessionId) {
        setActiveSessionId(userMsg.session_id);
        fetchHistory(); // Refresh history to see the new item
      }

      // Replace temporary user message and append bot response
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== "temp-user");
        return [...filtered, userMsg, botMsg];
      });
    } catch (err) {
      console.error("Failed to send message", err);
      // Remove temporary message and alert
      setMessages(prev => prev.filter(m => m.id !== "temp-user"));
      alert("Error sending message. Please try again.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewChat = () => {
    setActiveSessionId(null);
    setMessages([]);
    setSidebarOpen(false);
  };

  const handleDeleteSession = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this conversation?")) return;

    try {
      await api.delete(`/history/${id}`);
      if (activeSessionId === id) {
        setActiveSessionId(null);
        setMessages([]);
      }
      fetchHistory();
    } catch (err) {
      console.error("Failed to delete session", err);
    }
  };

  const handleExportPDF = () => {
    if (messages.length === 0) return;

    const doc = new jsPDF();
    const margin = 15;
    const pageWidth = doc.internal.pageSize.width;
    let y = 20;

    // Header
    doc.setFillColor(79, 70, 229); // Brand color Indigo-600
    doc.rect(0, 0, pageWidth, 40, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("RuleBot Conversation Export", margin, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const dateStr = new Date().toLocaleString();
    doc.text(`Generated on: ${dateStr}`, margin, 30);

    y = 55;

    // Messages
    messages.forEach((msg, idx) => {
      // Page break check
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      const isBot = msg.sender === "bot";
      const senderText = isBot ? "RuleBot:" : "You:";
      const timestamp = new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Draw message block border/box
      if (isBot) {
        doc.setFillColor(243, 244, 246); // light gray
      } else {
        doc.setFillColor(238, 242, 255); // light indigo
      }
      
      // Calculate height of text
      const splitText = doc.splitTextToSize(msg.text, pageWidth - (margin * 2) - 10);
      const textHeight = (splitText.length * 5) + 15;

      doc.rect(margin, y, pageWidth - (margin * 2), textHeight, "F");
      
      // Draw details
      doc.setTextColor(79, 70, 229);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(senderText, margin + 5, y + 6);

      doc.setTextColor(107, 114, 128);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text(timestamp, pageWidth - margin - 20, y + 6);

      // Matched intent
      if (isBot && msg.intent_matched) {
        doc.setFillColor(224, 231, 255); // blue-100
        doc.rect(margin + 20, y + 2.5, 30, 4.5, "F");
        doc.setTextColor(67, 56, 202);
        doc.setFontSize(7);
        doc.text(`Intent: ${msg.intent_matched}`, margin + 22, y + 5.5);
      }

      // Draw content
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(splitText, margin + 5, y + 13);

      y += textHeight + 6;
    });

    doc.save(`rulebot_chat_${activeSessionId || "new"}.pdf`);
  };

  const filteredSessions = sessions.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sampleQueries = [
    "What is Python programming?",
    "What is Artificial Intelligence?",
    "What is the system time right now?",
    "I need support or help",
    "Where is the nearest college?",
    "Tell me about web development"
  ];

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center space-y-4">
          <Bot className="w-12 h-12 text-indigo-500 animate-bounce mx-auto" />
          <p className="text-slate-400 text-sm">Synchronizing your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-slate-50 text-slate-800 dark:bg-[#0b0f19] dark:text-slate-200">
      
      {/* Sidebar - Desktop & Mobile Drawer */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-72 glass-premium border-r border-slate-200/50 dark:border-slate-800/40 flex flex-col transition-transform duration-300
        lg:static lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        
        {/* Sidebar Header */}
        <div className="h-16 border-b border-slate-200/50 dark:border-slate-800/40 px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
              <Bot className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              RuleBot
            </span>
          </Link>
          <button 
            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button
            onClick={handleNewChat}
            className="w-full py-2.5 rounded-xl border border-dashed border-indigo-500/30 hover:border-indigo-500 bg-indigo-500/5 hover:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold text-xs transition-all flex items-center justify-center space-x-2 hover:shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat Session</span>
          </button>
        </div>

        {/* Search Past Conversations */}
        <div className="px-4 pb-3">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
              <Search className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              placeholder="Search chat history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-grow overflow-y-auto px-4 pb-4 space-y-1.5 scrollbar-thin">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1.5 block mb-2">
            History
          </span>

          <AnimatePresence initial={false}>
            {filteredSessions.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500 dark:text-slate-500">
                {searchQuery ? "No matching chats found" : "Start a new conversation!"}
              </div>
            ) : (
              filteredSessions.map((session) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onClick={() => {
                    setActiveSessionId(session.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full text-left p-3 rounded-xl flex items-center justify-between text-xs cursor-pointer group transition-all duration-200
                    ${activeSessionId === session.id 
                      ? "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 font-semibold border border-indigo-500/25" 
                      : "hover:bg-slate-100 dark:hover:bg-slate-900/60 border border-transparent"}
                  `}
                >
                  <div className="flex items-center space-x-2.5 truncate max-w-[85%]">
                    <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${activeSessionId === session.id ? "text-indigo-500" : "text-slate-400"}`} />
                    <span className="truncate">{session.title}</span>
                  </div>
                  <button
                    onClick={(e) => handleDeleteSession(e, session.id)}
                    className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-red-500 transition-all cursor-pointer"
                    title="Delete Conversation"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/40 bg-slate-100/50 dark:bg-slate-950/20 text-xs space-y-4">
          {/* User profile info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5 max-w-[70%]">
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="truncate">
                <p className="font-semibold truncate">{user.email}</p>
                <p className="text-[10px] text-slate-400 capitalize">{user.role}</p>
              </div>
            </div>

            {/* Logout button */}
            <button 
              onClick={logout}
              className="p-1.5 rounded-lg bg-slate-200 hover:bg-red-50 dark:bg-slate-800 dark:hover:bg-red-950/30 text-slate-500 hover:text-red-500 transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between gap-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="flex-grow py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors flex items-center justify-center space-x-1.5 font-medium cursor-pointer"
              >
                {theme === "light" ? (
                  <>
                    <Moon className="w-3.5 h-3.5" />
                    <span>Dark Mode</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-3.5 h-3.5" />
                    <span>Light Mode</span>
                  </>
                )}
              </button>

              {/* Admin Link if role === admin */}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex-grow py-2 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 transition-colors flex items-center justify-center space-x-1.5 font-medium"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Analytics</span>
                </Link>
              )}
            </div>

            {/* How It Works Link */}
            <Link
              href="/how-it-works"
              className="w-full py-2 rounded-xl border border-slate-200/50 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/60 hover:bg-slate-200 dark:hover:bg-slate-800/80 transition-colors flex items-center justify-center space-x-1.5 font-semibold text-slate-500 dark:text-slate-400 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
              <span>How It Works</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Chat Workspace */}
      <div className="flex-grow flex flex-col h-full overflow-hidden relative">
        
        {/* Chat Top Header */}
        <header className="h-16 border-b border-slate-200/50 dark:border-slate-800/40 px-6 flex items-center justify-between shrink-0 glass z-30">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
            >
              <Menu className="w-4.5 h-4.5" />
            </button>
            <div>
              <h1 className="font-bold text-sm">
                {activeSessionId 
                  ? sessions.find(s => s.id === activeSessionId)?.title || "Active Chat"
                  : "New Conversation"
                }
              </h1>
              {messages.length > 0 && (
                <p className="text-[10px] text-slate-400">
                  {messages.filter(m => m.sender === 'user').length} queries matched this session
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          {messages.length > 0 && (
            <button
              onClick={handleExportPDF}
              className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export PDF</span>
            </button>
          )}
        </header>

        {/* Message Area */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6 relative z-10 scrollbar-thin">
          <AnimatePresence initial={false}>
            {messages.length === 0 ? (
              // Welcome / Blank Slate Screen
              <motion.div 
                className="max-w-2xl mx-auto py-12 md:py-20 text-center space-y-8"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center mx-auto shadow-inner">
                  <Bot className="w-8 h-8 text-indigo-500" />
                </div>
                <div className="space-y-3">
                  <h2 className="text-2xl font-bold tracking-tight">I am RuleBot</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                    Ask me programming queries, topics in Artificial Intelligence, Java, Python, Web Development, or current time and date. I respond based on structured intent matches.
                  </p>
                </div>

                {/* Sample Prompt Pills */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Test an intent pattern
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto text-left">
                    {sampleQueries.map((query, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(query)}
                        className="p-3 text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/40 dark:hover:bg-slate-800/70 border border-slate-200/50 dark:border-slate-850 rounded-xl hover:translate-y-[-1px] transition-all flex items-center justify-between text-slate-600 dark:text-slate-350 cursor-pointer"
                      >
                        <span className="truncate font-medium">{query}</span>
                        <Sparkles className="w-3 h-3 text-indigo-500 shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              // Message Logs
              <div className="max-w-3xl mx-auto space-y-6">
                {messages.map((msg, index) => {
                  const isBot = msg.sender === "bot";
                  return (
                    <motion.div
                      key={msg.id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex space-x-3.5 ${isBot ? "justify-start" : "justify-end"}`}
                    >
                      {/* Bot Avatar */}
                      {isBot && (
                        <div className="w-8 h-8 rounded-xl bg-indigo-500 flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/10">
                          <Bot className="w-4.5 h-4.5 text-white" />
                        </div>
                      )}

                      {/* Message Bubble */}
                      <div className={`
                        max-w-[80%] rounded-2xl p-4 shadow-sm relative group
                        ${isBot 
                          ? "bg-slate-200/60 dark:bg-slate-800/50 rounded-tl-none border border-slate-200/30 dark:border-slate-800/30" 
                          : "bg-indigo-600 text-white rounded-tr-none"}
                      `}>
                        <p className="text-sm leading-relaxed whitespace-pre-line font-normal">{msg.text}</p>
                        
                        {/* Message Metadata Footer */}
                        <div className="mt-2.5 pt-1.5 border-t border-slate-300/30 dark:border-slate-700/50 flex items-center justify-between gap-6 text-[10px] text-slate-400 dark:text-slate-400">
                          
                          {/* Matched intent tag */}
                          {isBot && msg.intent_matched && (
                            <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold tracking-wider uppercase text-[8px]">
                              {msg.intent_matched}
                            </span>
                          )}

                          <span className="flex items-center space-x-1 ml-auto">
                            <Clock className="w-3 h-3 text-[10px]" />
                            <span>
                              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* User Avatar */}
                      {!isBot && (
                        <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-300/30">
                          <User className="w-4 h-4 text-indigo-500" />
                        </div>
                      )}
                    </motion.div>
                  );
                })}

                {/* Bot Typing Animation Indicator */}
                {isTyping && (
                  <div className="flex space-x-3.5 justify-start">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500 flex items-center justify-center shrink-0">
                      <Bot className="w-4.5 h-4.5 text-white" />
                    </div>
                    <div className="bg-slate-200/60 dark:bg-slate-800/50 rounded-2xl rounded-tl-none px-4 py-3 flex items-center space-x-1 border border-slate-200/30 dark:border-slate-800/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 bounce-dot-1" />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 bounce-dot-2" />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 bounce-dot-3" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Area */}
        <div className="p-6 border-t border-slate-200/50 dark:border-slate-800/40 bg-slate-100/30 dark:bg-slate-950/20 shrink-0 z-20">
          <div className="max-w-3xl mx-auto">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputText);
              }}
              className="flex items-center space-x-3"
            >
              <input
                type="text"
                placeholder="Ask RuleBot something... (e.g. What is programming?)"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isTyping}
                className="flex-grow px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder-slate-400 shadow-sm"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="p-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <p className="text-[10px] text-center text-slate-400 dark:text-slate-500 mt-2">
              RuleBot is configured with strict matching boundaries and zero hallucinations.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}

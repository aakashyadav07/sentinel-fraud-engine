"use client";

import React from "react";
import { ShieldAlert, ShieldCheck, Database, History, BookOpen, Activity, Download } from "lucide-react";

interface HeaderProps {
  activeTab: "scanner" | "simulator" | "sandbox" | "history" | "patterns" | "defense";
  setActiveTab: (tab: "scanner" | "simulator" | "sandbox" | "history" | "patterns" | "defense") => void;
  isBackendConnected: boolean;
  onOpenDownload: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isBackendConnected,
  onOpenDownload,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-cyber-dark/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab("scanner")}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
              <div className="w-full h-full bg-cyber-dark rounded-[10px] flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                  SENTINEL
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
                  v1.2 AI Engine
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Fraud & Scam Pattern Intelligence Platform
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1">
            <button
              onClick={() => setActiveTab("scanner")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                activeTab === "scanner"
                  ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Scanner</span>
            </button>

            <button
              onClick={() => setActiveTab("simulator")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                activeTab === "simulator"
                  ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Defense Academy</span>
            </button>

            <button
              onClick={() => setActiveTab("sandbox")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                activeTab === "sandbox"
                  ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Rule Sandbox</span>
            </button>

            <button
              onClick={() => setActiveTab("history")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                activeTab === "history"
                  ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Threat Log</span>
            </button>

            <button
              onClick={() => setActiveTab("defense")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                activeTab === "defense"
                  ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Incident SOPs</span>
            </button>
          </nav>

          {/* Right Action & Status Indicator */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/30 transition-all shadow-sm shadow-cyan-500/10"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Install App</span>
            </button>

            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-white/10 text-xs">
              <span className={`w-2 h-2 rounded-full ${isBackendConnected ? "bg-emerald-400 shadow-[0_0_8px_#34d399]" : "bg-rose-500 shadow-[0_0_8px_#f43f5e] animate-pulse"}`} />
              <span className="text-slate-300 font-mono">
                {isBackendConnected ? "ENGINE ACTIVE" : "ENGINE OFFLINE"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

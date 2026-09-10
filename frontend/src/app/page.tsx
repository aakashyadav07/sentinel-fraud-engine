"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { ScannerForm } from "@/components/ScannerForm";
import { ReportView } from "@/components/ReportView";
import { PatternExplorer } from "@/components/PatternExplorer";
import { HistoryLog } from "@/components/HistoryLog";
import { DefenseGuide } from "@/components/DefenseGuide";
import { AppDownloadModal } from "@/components/AppDownloadModal";
import { RuleSandbox } from "@/components/RuleSandbox";
import { ScamSimulator } from "@/components/ScamSimulator";
import { ForensicReport } from "@/types";
import { submitScamAnalysis, getSubmissionReport } from "@/lib/api";
import { ShieldCheck, Cpu, Terminal, AlertCircle, ShieldAlert, Sparkles, Activity } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"scanner" | "simulator" | "sandbox" | "history" | "patterns" | "defense">("scanner");
  const [currentReport, setCurrentReport] = useState<ForensicReport | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState(true);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

  // Check backend health on mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch("/api/submissions?limit=1");
        if (res.ok) {
          setIsBackendConnected(true);
        } else {
          setIsBackendConnected(false);
        }
      } catch {
        setIsBackendConnected(false);
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAnalyze = async (formData: FormData) => {
    setIsScanning(true);
    setScanError(null);
    setCurrentReport(null);

    try {
      // 1. Submit analysis to backend
      const submissionResult = await submitScamAnalysis(formData);
      
      // 2. Fetch the complete explainable forensic report
      const report = await getSubmissionReport(submissionResult.submission_id);
      setCurrentReport(report);
      setIsBackendConnected(true);
    } catch (err: any) {
      console.error("Scan failed:", err);
      setScanError(err.message || "Threat scanning encountered an unexpected issue. Please verify backend service.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleSelectFromHistory = async (submissionId: string) => {
    setIsScanning(true);
    setScanError(null);
    try {
      const report = await getSubmissionReport(submissionId);
      setCurrentReport(report);
      setActiveTab("scanner");
    } catch (err: any) {
      console.error("Failed to load historical submission:", err);
      setScanError(err.message || "Could not retrieve historical case details.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#06090e] text-slate-100">
      {/* Top Cyber Navigation Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setScanError(null);
        }}
        isBackendConnected={isBackendConnected}
        onOpenDownload={() => setIsDownloadOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* System Metric Ticker Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="cyber-card p-3 border-white/5 bg-slate-900/40 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Detection Model</p>
              <p className="text-xs font-mono font-bold text-white">Deterministic + OCR</p>
            </div>
          </div>

          <div className="cyber-card p-3 border-white/5 bg-slate-900/40 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Rules Active</p>
              <p className="text-xs font-mono font-bold text-emerald-400">10 Heuristic Categories</p>
            </div>
          </div>

          <div className="cyber-card p-3 border-white/5 bg-slate-900/40 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Scoring Formula</p>
              <p className="text-xs font-mono font-bold text-amber-300">0 - 100 Risk Band</p>
            </div>
          </div>

          <div className="cyber-card p-3 border-white/5 bg-slate-900/40 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Feedback Loop</p>
              <p className="text-xs font-mono font-bold text-indigo-300">Safeguard Enabled</p>
            </div>
          </div>
        </div>

        {/* Global Scan Error Alert */}
        {scanError && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 flex items-start gap-3 animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <strong className="font-semibold text-rose-300">Scan Pipeline Warning:</strong>
              <p>{scanError}</p>
            </div>
          </div>
        )}

        {/* TAB 1: INTELLIGENCE SCANNER */}
        {activeTab === "scanner" && (
          <div className="space-y-8">
            {currentReport ? (
              <ReportView
                report={currentReport}
                onNewScan={() => {
                  setCurrentReport(null);
                  setScanError(null);
                }}
              />
            ) : (
              <ScannerForm onAnalyze={handleAnalyze} isLoading={isScanning} />
            )}
          </div>
        )}

        {/* TAB 2: INTERACTIVE SCAM DEFENSE SIMULATOR ACADEMY */}
        {activeTab === "simulator" && <ScamSimulator />}

        {/* TAB 3: HEURISTIC RULE ENGINEERING SANDBOX */}
        {activeTab === "sandbox" && <RuleSandbox />}

        {/* TAB 4: THREAT AUDIT LOG */}
        {activeTab === "history" && (
          <HistoryLog onSelectSubmission={handleSelectFromHistory} />
        )}

        {/* TAB 5: PATTERN HEURISTIC LIBRARY */}
        {activeTab === "patterns" && <PatternExplorer />}

        {/* TAB 6: CYBER DEFENSE HUB */}
        {activeTab === "defense" && <DefenseGuide />}
      </main>

      {/* App Download & Install Modal */}
      <AppDownloadModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
      />

      {/* Cyber Footer */}
      <footer className="border-t border-white/5 bg-slate-950/60 py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-medium text-slate-400">
            Sentinel Fraud & Scam Intelligence Engine • Deterministic Threat Scoring & Safeguards
          </p>
          <p className="text-[11px] text-slate-600">
            Confidential threat evaluation platform. For emergency financial cyber fraud reporting in India, contact National Helpline 1930 or cybercrime.gov.in.
          </p>
        </div>
      </footer>
    </div>
  );
}

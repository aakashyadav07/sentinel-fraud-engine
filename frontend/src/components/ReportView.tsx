"use client";

import React, { useState } from "react";
import { 
  ForensicReport, 
  SignalItem, 
  TimelineNode 
} from "@/types";
import { RiskMeter } from "./RiskMeter";
import { FeedbackModal } from "./FeedbackModal";
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ExternalLink, 
  Copy, 
  Check, 
  MessageSquare, 
  FileSearch, 
  Layers, 
  Compass, 
  ShieldCheck, 
  Download, 
  ArrowRight,
  Eye,
  AlertOctagon,
  KeyRound,
  DollarSign,
  PhoneCall,
  Flame,
  Printer,
  FileText,
  Lock,
  Globe,
  X
} from "lucide-react";

interface ReportViewProps {
  report: ForensicReport;
  onNewScan: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({ report, onNewScan }) => {
  const [copied, setCopied] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isBriefOpen, setIsBriefOpen] = useState(false);
  const [activeViewTab, setActiveViewTab] = useState<"overview" | "timeline" | "raw">("overview");

  const { submission, extracted_claims, signals, risk_assessment } = report;

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(report, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity.toUpperCase()) {
      case "CRITICAL":
        return "bg-rose-500/20 text-rose-300 border-rose-500/40";
      case "HIGH":
        return "bg-rose-500/15 text-rose-400 border-rose-500/30";
      case "MEDIUM":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30";
      case "LOW":
      default:
        return "bg-blue-500/15 text-blue-400 border-blue-500/30";
    }
  };

  const getDomainReputation = (url?: string | null) => {
    if (!url) return null;
    const lower = url.toLowerCase();
    if (lower.includes(".apk") || lower.includes(".cx") || lower.includes(".top") || lower.includes(".vip") || lower.includes(".club")) {
      return { status: "SUSPICIOUS TLD", color: "text-rose-400 border-rose-500/30 bg-rose-950/40", desc: "Non-standard high-risk domain extension commonly associated with phishing & malware." };
    }
    if (lower.includes("bit.ly") || lower.includes("tinyurl") || lower.includes("cutt.ly") || lower.includes("is.gd")) {
      return { status: "OBFUSCATED SHORTLINK", color: "text-amber-400 border-amber-500/30 bg-amber-950/40", desc: "URL shortener masking the true destination host." };
    }
    return { status: "STANDARD PROTOCOL", color: "text-cyan-400 border-cyan-500/30 bg-cyan-950/40", desc: "Standard web domain structure." };
  };

  const domainRep = getDomainReputation(submission.offer_url);

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 cyber-card p-4 border-white/10 bg-slate-900/60">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <FileSearch className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">
                Forensic Intelligence Report
              </h2>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/5">
                ID: {submission.id.slice(0, 8)}...
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Analyzed on {submission.created_at ? new Date(submission.created_at).toLocaleString() : "Just now"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsBriefOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-300 bg-rose-950/60 hover:bg-rose-900/60 border border-rose-500/30 transition-all shadow-sm shadow-rose-500/10"
          >
            <Printer className="w-3.5 h-3.5 text-rose-400" />
            <span>FIR / Bank Incident Brief</span>
          </button>

          <button
            onClick={() => setIsFeedbackOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-white/10 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
            <span>Feedback</span>
          </button>

          <button
            onClick={copyJson}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-white/10 transition-colors font-mono"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "JSON"}</span>
          </button>

          <button
            onClick={onNewScan}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-sm shadow-cyan-500/20 transition-all"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>New Scan</span>
          </button>
        </div>
      </div>

      {/* Main Executive Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Risk Meter & Summary */}
        <div className="lg:col-span-4 space-y-6">
          <RiskMeter
            score={risk_assessment?.total_score || 0}
            riskBand={risk_assessment?.risk_band || "LOW"}
            confidence={risk_assessment?.confidence_score || 0}
          />

          {/* Quick Findings Card */}
          <div className="cyber-card p-5 border-white/10 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Executive Risk Verdict</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {risk_assessment?.summary_text || "Analysis completed without detecting elevated threat patterns."}
            </p>

            {/* Action advice highlight */}
            <div className={`p-3.5 rounded-lg border text-xs leading-relaxed ${
              (risk_assessment?.total_score || 0) >= 60
                ? "bg-rose-950/40 border-rose-500/40 text-rose-200"
                : (risk_assessment?.total_score || 0) >= 25
                ? "bg-amber-950/40 border-amber-500/40 text-amber-200"
                : "bg-emerald-950/40 border-emerald-500/40 text-emerald-200"
            }`}>
              <div className="font-bold flex items-center gap-1.5 mb-1 text-[11px] uppercase tracking-wider">
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>Recommended Action:</span>
              </div>
              <p className="text-[11px]">
                {risk_assessment?.cautious_action || "Standard safety protocols apply. No immediate mitigation required."}
              </p>
            </div>
          </div>

          {/* Submission Identifiers metadata */}
          <div className="cyber-card p-4 border-white/10 space-y-2 text-xs">
            <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
              Input Provenance
            </span>
            <div className="space-y-1.5 font-mono text-[11px]">
              {submission.offer_url && (
                <div className="flex items-center justify-between truncate bg-slate-900/60 p-2 rounded border border-white/5">
                  <span className="text-slate-400">URL:</span>
                  <a
                    href={submission.offer_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:underline truncate max-w-[200px]"
                  >
                    {submission.offer_url}
                  </a>
                </div>
              )}
              {submission.upi_phone && (
                <div className="flex items-center justify-between truncate bg-slate-900/60 p-2 rounded border border-white/5">
                  <span className="text-slate-400">Target ID:</span>
                  <span className="text-amber-400 truncate">{submission.upi_phone}</span>
                </div>
              )}
              {submission.image_path && (
                <div className="flex items-center justify-between truncate bg-slate-900/60 p-2 rounded border border-white/5">
                  <span className="text-slate-400">OCR Image:</span>
                  <span className="text-cyan-300">Extracted & Processed</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Structured Claims, Signal Table, and Tabs */}
        <div className="lg:col-span-8 space-y-6">
          {/* Tab buttons */}
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <button
              onClick={() => setActiveViewTab("overview")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeViewTab === "overview"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Signal Breakdown & Claims ({signals.length})
            </button>
            <button
              onClick={() => setActiveViewTab("timeline")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeViewTab === "timeline"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Attack Journey Timeline ({risk_assessment?.timeline?.length || 0})
            </button>
            <button
              onClick={() => setActiveViewTab("raw")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeViewTab === "raw"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Raw Input & OCR Transcript
            </button>
          </div>

          {/* TAB 1: OVERVIEW & CLAIMS */}
          {activeViewTab === "overview" && (
            <div className="space-y-6">
              {/* Structured Extracted Claims Grid */}
              <div className="cyber-card p-5 border-white/10">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-cyan-400" />
                  <span>Structured Claim Extraction</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-white/5 space-y-1">
                    <span className="text-[10px] uppercase font-semibold text-slate-400">
                      Promised ROI / Earnings
                    </span>
                    <p className={`font-semibold ${extracted_claims?.promised_return ? "text-rose-400" : "text-slate-400"}`}>
                      {extracted_claims?.promised_return || "None detected"}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/80 border border-white/5 space-y-1">
                    <span className="text-[10px] uppercase font-semibold text-slate-400">
                      Deposit / Fee Request
                    </span>
                    <p className={`font-semibold ${extracted_claims?.deposit_amount || extracted_claims?.payment_requests ? "text-amber-400" : "text-slate-400"}`}>
                      {extracted_claims?.deposit_amount || extracted_claims?.payment_requests || "None detected"}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/80 border border-white/5 space-y-1">
                    <span className="text-[10px] uppercase font-semibold text-slate-400">
                      Urgency Triggers
                    </span>
                    <p className={`font-semibold ${extracted_claims?.urgency_language ? "text-rose-400" : "text-slate-400"}`}>
                      {extracted_claims?.urgency_language || "None detected"}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/80 border border-white/5 space-y-1">
                    <span className="text-[10px] uppercase font-semibold text-slate-400">
                      Entity / Impersonated Brand
                    </span>
                    <p className="font-semibold text-slate-200">
                      {extracted_claims?.entity_name || "Unspecified Entity"}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/80 border border-white/5 space-y-1 sm:col-span-2">
                    <span className="text-[10px] uppercase font-semibold text-slate-400">
                      Contact / Routing Channels
                    </span>
                    <p className="font-semibold text-cyan-400 font-mono">
                      {extracted_claims?.contact_channels || "No external routing channel extracted"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Matched Deterministic Signals List */}
              <div className="cyber-card p-5 border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Flame className="w-4 h-4 text-rose-400" />
                    <span>Matched Heuristic Threat Signals ({signals.length})</span>
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Deterministic Pattern Weights Applied
                  </span>
                </div>

                {signals.length === 0 ? (
                  <div className="p-6 text-center rounded-lg bg-slate-900/50 border border-emerald-500/20 space-y-2">
                    <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
                    <p className="text-sm font-semibold text-emerald-300">
                      Zero Malicious Patterns Detected
                    </p>
                    <p className="text-xs text-slate-400">
                      The heuristic rule engine did not trigger any advance-fee, coercive urgency, or fraudulent promise indicators.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {signals.map((sig, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-lg bg-slate-900/80 border border-white/10 hover:border-slate-700 transition-all space-y-2.5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className={`cyber-badge border text-[10px] ${getSeverityBadge(sig.severity)}`}>
                              {sig.severity}
                            </span>
                            <span className="font-mono text-xs text-cyan-400 font-semibold">
                              [{sig.rule_code}]
                            </span>
                            <span className="text-sm font-bold text-white">
                              {sig.signal_name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-800 border border-white/5">
                              Weight: +{sig.weight} pts
                            </span>
                          </div>
                        </div>

                        {/* Evidence Snippet */}
                        <div className="p-2.5 rounded bg-slate-950/80 border-l-2 border-rose-500 text-xs font-mono text-rose-300/90 italic">
                          &ldquo;{sig.evidence_snippet}&rdquo;
                        </div>

                        {/* Explanation */}
                        {sig.explanation && (
                          <p className="text-xs text-slate-400">
                            {sig.explanation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ATTACK JOURNEY TIMELINE */}
          {activeViewTab === "timeline" && (
            <div className="cyber-card p-6 border-white/10 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Compass className="w-4 h-4 text-cyan-400" />
                  <span>Reconstructed Scam Attack Journey</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  How this attack unfolds sequentially from initial bait to victim entrapment:
                </p>
              </div>

              {!risk_assessment?.timeline || risk_assessment.timeline.length === 0 ? (
                <p className="text-xs text-slate-400 italic">
                  No attack progression steps identified for this input.
                </p>
              ) : (
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:via-amber-500 before:to-rose-500">
                  {risk_assessment.timeline.map((node, i) => (
                    <div key={i} className="relative group">
                      {/* Step Indicator Dot */}
                      <div className="absolute -left-[27px] top-1 w-5 h-5 rounded-full bg-slate-900 border-2 border-cyan-400 flex items-center justify-center text-[10px] font-mono font-bold text-cyan-300">
                        {node.step}
                      </div>

                      <div className="p-4 rounded-lg bg-slate-900/90 border border-white/10 space-y-1.5 hover:border-cyan-500/40 transition-all">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-cyan-300 uppercase tracking-wide">
                            {node.stage}
                          </span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                            node.risk_level === "CRITICAL"
                              ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                              : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          }`}>
                            {node.risk_level}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {node.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: RAW INPUT & OCR TRANSCRIPT */}
          {activeViewTab === "raw" && (
            <div className="cyber-card p-6 border-white/10 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileSearch className="w-4 h-4 text-cyan-400" />
                  <span>Raw Capture & OCR Text Output</span>
                </h3>
              </div>

              {submission.raw_text && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Raw User Text Input:
                  </span>
                  <pre className="p-3 bg-slate-950 rounded-lg border border-white/5 text-xs text-slate-300 whitespace-pre-wrap font-mono">
                    {submission.raw_text}
                  </pre>
                </div>
              )}

              {submission.ocr_text && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                    Extracted Optical Character Recognition (OCR) Stream:
                  </span>
                  <pre className="p-3 bg-slate-950 rounded-lg border border-cyan-500/20 text-xs text-cyan-200 whitespace-pre-wrap font-mono">
                    {submission.ocr_text}
                  </pre>
                </div>
              )}

              {submission.image_path && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Uploaded Evidence Image:
                  </span>
                  <div className="p-2 bg-slate-950 rounded-lg border border-white/10 inline-block">
                    <img
                      src={submission.image_path}
                      alt="Uploaded scam screenshot"
                      className="max-h-72 rounded object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Analyst Feedback Modal */}
      <FeedbackModal
        submissionId={submission.id}
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />

      {/* Official Cyber Crime & Bank FIR Incident Brief Modal */}
      {isBriefOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="cyber-card w-full max-w-3xl bg-slate-900 border-white/20 p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6 relative shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white uppercase tracking-tight">
                    Formal Cyber Incident Forensic Brief (FIR / Bank Evidence)
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Token ID: {submission.id}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-cyan-600/20"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Brief</span>
                </button>
                <button
                  onClick={() => setIsBriefOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Formal Incident Statement Sheet */}
            <div className="bg-slate-950 p-6 rounded-xl border border-white/10 space-y-5 text-xs text-slate-300 font-sans leading-relaxed">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-b border-white/10 pb-4 text-[11px] font-mono">
                <div>
                  <span className="text-slate-500 uppercase block">Complaint Type:</span>
                  <span className="text-rose-400 font-bold">FINANCIAL CYBER FRAUD</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase block">Assessed Risk Score:</span>
                  <span className="text-white font-bold">{Math.round(risk_assessment?.total_score || 0)} / 100 ({risk_assessment?.risk_band})</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase block">Analysis Timestamp:</span>
                  <span className="text-slate-300">{submission.created_at ? new Date(submission.created_at).toUTCString() : "Immediate"}</span>
                </div>
              </div>

              {/* Suspect Artifacts */}
              <div className="space-y-2">
                <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                  1. Suspect Identifiers & Electronic Artifacts:
                </span>
                <div className="p-3 bg-slate-900 rounded-lg border border-white/5 space-y-1 font-mono text-[11px]">
                  <p><strong className="text-slate-400">Suspect UPI / Phone ID:</strong> {submission.upi_phone || "Not specified"}</p>
                  <p><strong className="text-slate-400">Suspect URL / Domain:</strong> {submission.offer_url || "Not specified"}</p>
                  <p><strong className="text-slate-400">Impersonated Entity:</strong> {extracted_claims?.entity_name || "Unspecified Entity"}</p>
                  <p><strong className="text-slate-400">Contact / Routing Channel:</strong> {extracted_claims?.contact_channels || "None"}</p>
                </div>
              </div>

              {/* Extracted Modus Operandi */}
              <div className="space-y-2">
                <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                  2. Forensic Signal Evidence & Modus Operandi:
                </span>
                <div className="space-y-2">
                  {signals.map((s, i) => (
                    <div key={i} className="p-2.5 bg-slate-900/60 rounded border border-white/5 space-y-1">
                      <div className="flex justify-between font-mono text-[10px]">
                        <span className="text-cyan-400 font-bold">[{s.rule_code}] {s.signal_name}</span>
                        <span className="text-rose-400 font-semibold">{s.severity}</span>
                      </div>
                      <p className="font-mono text-rose-300 italic text-[11px]">
                        &ldquo;{s.evidence_snippet}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legal Reference & Action Demand */}
              <div className="p-3.5 bg-slate-900 rounded-lg border border-white/10 space-y-1.5">
                <span className="font-bold text-white text-[11px]">
                  3. Action Requested for Bank Fraud Cell / National Helpline 1930:
                </span>
                <p className="text-[11px] text-slate-400">
                  Please place an immediate debit freeze on beneficiary accounts and UPI handles associated with identifier <strong>{submission.upi_phone || "the suspect transactions"}</strong> in accordance with National Cyber Crime Reporting Portal protocols and Section 66D of the Information Technology Act.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

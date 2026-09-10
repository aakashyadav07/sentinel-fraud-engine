"use client";

import React, { useState, useRef } from "react";
import { 
  UploadCloud, 
  Link as LinkIcon, 
  CreditCard, 
  FileText, 
  Sparkles, 
  Trash2, 
  Scan, 
  AlertCircle, 
  Check, 
  HelpCircle,
  Zap,
  Image as ImageIcon
} from "lucide-react";
import { PresetScenario } from "@/types";

interface ScannerFormProps {
  onAnalyze: (formData: FormData) => Promise<void>;
  isLoading: boolean;
}

const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: "digital-arrest",
    title: "CBI / Police Digital Arrest & Narcotics Threat",
    category: "Authority Impersonation",
    description: "Urgent threat of non-bailable arrest unless transferring ₹50k to RBI verification fund.",
    tag: "Digital Arrest",
    severity: "HIGH",
    data: {
      raw_text: "URGENT NOTICE: Mumbai Police & CBI Cyber Department have issued a Non-Bailable Arrest Warrant against you. A courier parcel containing illegal narcotics and fake passports was seized in your name. You are under Digital Arrest. To verify your innocence, immediately transfer ₹50,000 security bond to the RBI Secret Verification Fund account: rbi.gov.verify@okhdfcbank before video call concludes.",
      offer_url: "https://mumbai-police-warrant.cx/verify",
      upi_phone: "rbi.gov.verify@okhdfcbank"
    }
  },
  {
    id: "task-scam",
    title: "YouTube Task Part-time Job Scam",
    category: "Advance-Fee & Micro-Tasks",
    description: "Earn ₹5000/day for liking videos. Pay ₹500 deposit to activate VIP wallet.",
    tag: "Task Scam",
    severity: "HIGH",
    data: {
      raw_text: "URGENT HIRING: Part-time YouTube Video Liker! Earn ₹3,000 to ₹8,000 daily working 20 mins from mobile. Guaranteed 100% daily payout. To activate your merchant salary wallet and unlock Tier-1 payout tasks, pay a refundable security deposit of ₹500 immediately. Only 4 candidate slots remaining today! Join our Telegram VIP mentor @task_payout_manager.",
      offer_url: "https://bit.ly/yt-daily-income-vip",
      upi_phone: "merchant.salary88@okaxis"
    }
  },
  {
    id: "crypto-doubler",
    title: "Guaranteed 300% Crypto Profit Scam",
    category: "Ponzi & Fake Investment",
    description: "Automated AI trading bot guarantees 300% weekly ROI with zero risk.",
    tag: "Crypto / Ponzi",
    severity: "HIGH",
    data: {
      raw_text: "Exclusive AI Quantum Arbitrage Opportunity! Guaranteed 300% return on investment within 72 hours. Zero risk, 100% principal protection insurance. Minimum deposit $100 in USDT. Send funds now before pool closes in 1 hour.",
      offer_url: "https://quantum-wealth-bot.live/register?ref=vip99",
      upi_phone: "cryptodeposit@ybl"
    }
  },
  {
    id: "electricity-bill",
    title: "Electricity Disconnection APK Scam",
    category: "Urgency Coercion & Malicious APK",
    description: "Urgent SMS threatening power cut tonight unless updating bill via helpline/APK.",
    tag: "Utility Scam",
    severity: "HIGH",
    data: {
      raw_text: "Dear Consumer, your electricity power supply will be DISCONNECTED tonight at 9:30 PM because your previous month bill was not updated. Please immediately contact our Electricity Verification Officer at 9876543210 or install our quick bill update helper app.",
      offer_url: "https://bijli-bill-update.apk.cx",
      upi_phone: "9876543210"
    }
  },
  {
    id: "courier-customs",
    title: "Fake Courier / Customs Clearance SMS",
    category: "Impersonation & Phishing",
    description: "Parcel held at customs. Pay ₹49 handling fee within 12 hours or item seized.",
    tag: "Customs Phishing",
    severity: "HIGH",
    data: {
      raw_text: "IndiaPost Alert: Your parcel #IN88291039 has been held at customs terminal due to incomplete address details and unpaid clearance fee of ₹49. Pay immediately within 12 hours to avoid seizure and legal penalty.",
      offer_url: "https://indiapost-parcel-verify.club/pay",
      upi_phone: "customs.fee@paytm"
    }
  },
  {
    id: "legitimate-offer",
    title: "Legitimate Freelance Project Inquiry",
    category: "Benign / Normal Inquiry",
    description: "Standard web design inquiry without urgency, advance fees, or unrealistic claims.",
    tag: "Safe Inquiry",
    severity: "LOW",
    data: {
      raw_text: "Hi there, I saw your design portfolio on GitHub. We are looking for a UI/UX designer for our B2B SaaS platform next month. Would you be open to an introductory 15-minute call next Tuesday? Here is our company website: https://example-saas-company.com",
      offer_url: "https://example-saas-company.com",
      upi_phone: ""
    }
  }
];

export const ScannerForm: React.FC<ScannerFormProps> = ({ onAnalyze, isLoading }) => {
  const [rawText, setRawText] = useState("");
  const [offerUrl, setOfferUrl] = useState("");
  const [upiPhone, setUpiPhone] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const loadPreset = (preset: PresetScenario) => {
    setActivePreset(preset.id);
    setRawText(preset.data.raw_text);
    setOfferUrl(preset.data.offer_url);
    setUpiPhone(preset.data.upi_phone);
  };

  const handleClearAll = () => {
    setRawText("");
    setOfferUrl("");
    setUpiPhone("");
    setActivePreset(null);
    handleRemoveFile();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim() && !offerUrl.trim() && !upiPhone.trim() && !selectedFile) {
      alert("Please enter text, a URL, a UPI/phone identifier, or upload a screenshot to analyze.");
      return;
    }

    const formData = new FormData();
    if (rawText) formData.append("raw_text", rawText);
    if (offerUrl) formData.append("offer_url", offerUrl);
    if (upiPhone) formData.append("upi_phone", upiPhone);
    if (selectedFile) formData.append("screenshot", selectedFile);
    formData.append("consent_given", "true");

    await onAnalyze(formData);
  };

  return (
    <div className="space-y-6">
      {/* Preset Scenarios Strip */}
      <div className="cyber-card p-4 border border-cyan-500/20 bg-slate-900/60">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
              Instant 1-Click Scam Scenarios
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Click any scenario to auto-fill suspicious test data
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {PRESET_SCENARIOS.map((p) => {
            const isSelected = activePreset === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => loadPreset(p)}
                className={`text-left p-2.5 rounded-lg border text-xs transition-all flex flex-col justify-between ${
                  isSelected
                    ? "bg-cyan-500/20 border-cyan-400 text-white shadow-md shadow-cyan-500/20"
                    : "bg-slate-800/60 border-white/5 text-slate-300 hover:bg-slate-800 hover:border-slate-700"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold truncate text-[11px] text-cyan-200">
                      {p.tag}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                        p.severity === "HIGH"
                          ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                          : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      }`}
                    >
                      {p.severity}
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-200 line-clamp-1">
                    {p.title}
                  </p>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                  {p.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Analysis Form */}
      <form onSubmit={handleSubmit} className="cyber-card p-6 border-white/10 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Scan className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Multi-Input Threat Analysis Studio
            </h2>
          </div>
          {(rawText || offerUrl || upiPhone || selectedFile) && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Inputs</span>
            </button>
          )}
        </div>

        {/* Screenshot Upload Dropzone */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-cyan-400" />
            <span>Screenshot / Ad Banner / Chat OCR Upload</span>
            <span className="text-[10px] font-normal text-slate-400">
              (PNG, JPG, WebP — OCR will auto-extract embedded text)
            </span>
          </label>

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
              selectedFile
                ? "border-cyan-500/50 bg-cyan-950/20"
                : "border-white/10 hover:border-cyan-500/30 bg-slate-900/40 hover:bg-slate-900/70"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {previewUrl ? (
              <div className="flex items-center justify-between bg-slate-900/80 p-3 rounded-lg border border-cyan-500/30">
                <div className="flex items-center gap-3">
                  <img
                    src={previewUrl}
                    alt="Uploaded screenshot"
                    className="w-16 h-16 object-cover rounded border border-white/10"
                  />
                  <div className="text-left">
                    <p className="text-sm font-medium text-white truncate max-w-xs sm:max-w-md">
                      {selectedFile?.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {(selectedFile?.size ? selectedFile.size / 1024 : 0).toFixed(1)} KB • Image Loaded for OCR
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile();
                  }}
                  className="p-2 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-4">
                <UploadCloud className="w-10 h-10 text-slate-400 mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-medium text-slate-200">
                  Drag and drop suspect screenshot or <span className="text-cyan-400 underline">browse files</span>
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Supports Telegram/WhatsApp screenshots, fake payment slips, or social media ads
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Text Input Area */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Suspicious Message / Email / Chat Transcript</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              {rawText.length} characters
            </span>
          </label>
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            rows={4}
            placeholder="Paste suspicious text, Telegram chat, job offer details, or urgent notice here..."
            className="w-full bg-slate-900/80 border border-white/10 rounded-lg p-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
          />
        </div>

        {/* URL & UPI Identifiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-cyan-400" />
              <span>Suspicious URL / Domain / Shortlink</span>
            </label>
            <input
              type="text"
              value={offerUrl}
              onChange={(e) => setOfferUrl(e.target.value)}
              placeholder="e.g. https://bit.ly/task303 or https://apk-update.site"
              className="w-full bg-slate-900/80 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-cyan-400" />
              <span>UPI ID / Phone / VPA Identifier</span>
            </label>
            <input
              type="text"
              value={upiPhone}
              onChange={(e) => setUpiPhone(e.target.value)}
              placeholder="e.g. payment@okaxis, 9876543210, or vpa@paytm"
              className="w-full bg-slate-900/80 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
            />
          </div>
        </div>

        {/* Submit Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-3 shadow-lg ${
              isLoading
                ? "bg-slate-800 text-slate-400 cursor-not-allowed border border-white/5"
                : "bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.008]"
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                <span>Running Deterministic Forensic Pipeline & Risk Scorer...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-cyan-200" />
                <span>Execute Scam & Threat Intelligence Scan</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

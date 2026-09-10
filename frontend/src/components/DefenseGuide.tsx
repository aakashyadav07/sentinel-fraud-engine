"use client";

import React from "react";
import { 
  ShieldAlert, 
  PhoneCall, 
  ExternalLink, 
  Lock, 
  FileWarning, 
  Smartphone, 
  CreditCard, 
  CheckSquare2,
  AlertTriangle,
  Info
} from "lucide-react";

export const DefenseGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="cyber-card p-6 border-white/10 bg-slate-900/60">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white tracking-tight">
            Cyber Defense & Incident Response Playbook
          </h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Standard Operating Procedures (SOPs), emergency asset protection protocols, and national reporting helplines for victims of financial cybercrime.
        </p>
      </div>

      {/* Emergency Hotlines Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="cyber-card p-5 border-rose-500/30 bg-rose-950/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400">
              National Helpline
            </span>
            <PhoneCall className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-black font-mono text-white">
            1930
          </p>
          <p className="text-xs text-rose-200/90">
            Immediate Financial Cyber Fraud Helpline (Dial within the &ldquo;Golden Hour&rdquo; to freeze fraudulent beneficiary accounts).
          </p>
        </div>

        <div className="cyber-card p-5 border-cyan-500/30 bg-cyan-950/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">
              National Cyber Crime Portal
            </span>
            <ExternalLink className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-sm font-bold text-white font-mono">
            cybercrime.gov.in
          </p>
          <p className="text-xs text-cyan-200/90">
            Official Indian portal for lodging formal cybercrime FIRs and tracking digital evidence tokens.
          </p>
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:underline pt-1"
          >
            <span>Visit Portal</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="cyber-card p-5 border-amber-500/30 bg-amber-950/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
              Chakshu (DoT India)
            </span>
            <ExternalLink className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-sm font-bold text-white font-mono">
            sancharsaathi.gov.in/sfc/
          </p>
          <p className="text-xs text-amber-200/90">
            Report fraudulent SMS senders, fake WhatsApp numbers, and suspect calls for carrier deactivation.
          </p>
          <a
            href="https://sancharsaathi.gov.in"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-amber-400 hover:underline pt-1"
          >
            <span>Visit Chakshu</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Action Playbooks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Playbook 1: UPI & Banking Fraud */}
        <div className="cyber-card p-6 border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-rose-400 border-b border-white/10 pb-3">
            <CreditCard className="w-5 h-5" />
            <h3 className="text-sm font-bold text-white">
              SOP: If You Paid Money via UPI / Bank Transfer
            </h3>
          </div>

          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-start gap-2.5">
              <CheckSquare2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Dial 1930 Immediately:</strong> Inform the operator with your transaction UTR / Reference ID, recipient UPI ID/Account, and timestamp.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckSquare2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Call Your Bank&apos;s Fraud Desk:</strong> Request an immediate freeze / chargeback hold on the transaction and disable net-banking access if credentials were shared.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckSquare2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Lodge NPCI Dispute:</strong> Open the UPI app (GPay, PhonePe, Paytm), find the transaction &gt; &ldquo;Report Issue&rdquo; &gt; &ldquo;Fraudulent / Scam Payment&rdquo;.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckSquare2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Preserve Evidence:</strong> Export chat logs, take full screenshots of transaction IDs, numbers, and links before blocking the scammer.
              </div>
            </li>
          </ul>
        </div>

        {/* Playbook 2: Malicious APK & Device Compromise */}
        <div className="cyber-card p-6 border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-amber-400 border-b border-white/10 pb-3">
            <Smartphone className="w-5 h-5" />
            <h3 className="text-sm font-bold text-white">
              SOP: If You Installed a Suspicious APK or Shared Screen
            </h3>
          </div>

          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-start gap-2.5">
              <CheckSquare2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Enable Airplane Mode Instantly:</strong> Cut all Wi-Fi and Mobile Data connections immediately to prevent active remote data exfiltration or SMS forwarding.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckSquare2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Revoke Accessibility & Device Admin:</strong> Go to Settings &gt; Apps &gt; Special App Access &gt; Device Admin Apps & Accessibility &gt; Disable suspicious APKs.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckSquare2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Uninstall Unknown & Sideloaded Apps:</strong> Delete any APKs installed from browser downloads, Telegram, or WhatsApp links.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckSquare2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Change Credentials from Another Device:</strong> Reset your email, bank passwords, and UPI PINs from a clean secondary phone or computer.
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

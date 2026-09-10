"use client";

import React from "react";
import { AlertTriangle, CheckCircle2, AlertOctagon, ShieldCheck } from "lucide-react";

interface RiskMeterProps {
  score: number; // 0 - 100
  riskBand: string; // LOW, MEDIUM, HIGH
  confidence: number; // 0 - 100
  size?: "sm" | "md" | "lg";
}

export const RiskMeter: React.FC<RiskMeterProps> = ({
  score,
  riskBand,
  confidence,
  size = "md",
}) => {
  const normalizedScore = Math.min(100, Math.max(0, score));
  
  // Calculate stroke dash for SVG circle
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  let colorClass = "text-emerald-400 stroke-emerald-500";
  let bgGlowClass = "shadow-[0_0_30px_rgba(16,185,129,0.2)]";
  let badgeBg = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
  let label = "SAFE / LOW RISK";
  let Icon = CheckCircle2;

  if (normalizedScore >= 60 || riskBand.toUpperCase() === "HIGH") {
    colorClass = "text-rose-500 stroke-rose-500";
    bgGlowClass = "shadow-[0_0_35px_rgba(239,68,68,0.3)]";
    badgeBg = "bg-rose-500/10 text-rose-400 border-rose-500/30";
    label = "CRITICAL / HIGH SCAM RISK";
    Icon = AlertOctagon;
  } else if (normalizedScore >= 25 || riskBand.toUpperCase() === "MEDIUM") {
    colorClass = "text-amber-400 stroke-amber-500";
    bgGlowClass = "shadow-[0_0_30px_rgba(245,158,11,0.2)]";
    badgeBg = "bg-amber-500/10 text-amber-400 border-amber-500/30";
    label = "SUSPICIOUS / MEDIUM RISK";
    Icon = AlertTriangle;
  }

  return (
    <div className={`cyber-card p-6 flex flex-col items-center justify-center relative overflow-hidden ${bgGlowClass}`}>
      {/* Background radial highlight */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

      <div className="relative w-44 h-44 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
          {/* Background track circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            className="stroke-slate-800"
            strokeWidth="12"
            fill="transparent"
          />
          {/* Active progress circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            className={`${colorClass} transition-all duration-1000 ease-out`}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center score readout */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-extrabold font-mono tracking-tight text-white">
            {Math.round(normalizedScore)}
          </span>
          <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
            / 100 Score
          </span>
        </div>
      </div>

      {/* Risk Band Badge */}
      <div className="mt-4 flex flex-col items-center gap-2">
        <div className={`cyber-badge px-3 py-1 border ${badgeBg} flex items-center gap-1.5`}>
          <Icon className="w-4 h-4" />
          <span className="font-bold tracking-wide">{label}</span>
        </div>

        {/* Confidence level meter */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
          <span>Confidence:</span>
          <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-cyan-400 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, Math.max(10, confidence))}%` }}
            />
          </div>
          <span className="font-mono text-cyan-300 font-medium">
            {Math.round(confidence)}%
          </span>
        </div>
      </div>
    </div>
  );
};

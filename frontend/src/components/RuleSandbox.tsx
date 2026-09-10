"use client";

import React, { useState } from "react";
import { Terminal, Play, Sparkles, CheckCircle2, AlertTriangle, FileCode, Sliders, RefreshCw } from "lucide-react";

export const RuleSandbox: React.FC = () => {
  const [testText, setTestText] = useState(
    "URGENT NOTICE: CBI Department has intercepted a courier parcel containing 5 fake passports and narcotics in your name. To avoid immediate Digital Arrest warrant, transfer ₹50,000 security deposit to the RBI verification fund account: police.verify@okhdfcbank within 30 minutes."
  );
  const [ruleName, setRuleName] = useState("Custom Digital Arrest & Coercion Detector");
  const [category, setCategory] = useState("Authority Impersonation");
  const [regexPattern, setRegexPattern] = useState("(?:digital\\s*arrest|cbi|narcotics).*?(?:transfer|deposit|account)");
  const [keywords, setKeywords] = useState("cbi, digital arrest, narcotics, rbi verification, avoid arrest");
  const [weight, setWeight] = useState<number>(35);
  const [severity, setSeverity] = useState<"CRITICAL" | "HIGH" | "MEDIUM" | "LOW">("CRITICAL");

  const [matchResult, setMatchResult] = useState<{
    matched: boolean;
    regexMatched: boolean;
    matchedSnippet?: string;
    matchedKeywords: string[];
    calculatedScore: number;
  } | null>(null);

  const handleTestRule = () => {
    let regexMatched = false;
    let snippet: string | undefined;
    let matchedKws: string[] = [];

    // Test regex
    if (regexPattern.trim()) {
      try {
        const re = new RegExp(regexPattern, "i");
        const match = testText.match(re);
        if (match) {
          regexMatched = true;
          snippet = match[0];
        }
      } catch (err) {
        alert("Invalid Regular Expression syntax. Please verify regex format.");
        return;
      }
    }

    // Test keywords
    const kwList = keywords.split(",").map((k) => k.trim().toLowerCase()).filter(Boolean);
    const lowerText = testText.toLowerCase();
    matchedKws = kwList.filter((kw) => lowerText.includes(kw));

    const isMatch = regexMatched || matchedKws.length > 0;
    const score = isMatch ? Math.min(100, weight + (matchedKws.length * 5)) : 0;

    setMatchResult({
      matched: isMatch,
      regexMatched,
      matchedSnippet: snippet,
      matchedKeywords: matchedKws,
      calculatedScore: score,
    });
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="cyber-card p-6 border-white/10 bg-slate-900/60">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white tracking-tight">
            Heuristic Rule Engineering Sandbox
          </h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Draft, simulate, and calibrate custom deterministic regex patterns, keyword taxonomies, and scoring weights against live scam text corpuses.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Rule Editor */}
        <div className="lg:col-span-6 space-y-4 cyber-card p-6 border-white/10">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <FileCode className="w-4 h-4 text-cyan-400" />
            <span>Rule Configuration</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Rule Name
              </label>
              <input
                type="text"
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Severity Level
                </label>
                <select
                  value={severity}
                  onChange={(e: any) => setSeverity(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="HIGH">HIGH</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="LOW">LOW</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between mb-1">
                <span>Deterministic Regex Expression</span>
                <span className="text-[10px] text-cyan-400 font-mono">Case-Insensitive</span>
              </label>
              <input
                type="text"
                value={regexPattern}
                onChange={(e) => setRegexPattern(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-cyan-300 font-mono focus:outline-none focus:border-cyan-500 text-xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Keywords (Comma-separated)
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 text-xs"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-slate-300">
                  Base Weight Score
                </label>
                <span className="font-mono text-cyan-400 font-bold">+{weight} pts</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Test Corpus & Execution */}
        <div className="lg:col-span-6 space-y-4 cyber-card p-6 border-white/10 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Target Test Corpus</span>
            </h3>

            <textarea
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              rows={6}
              placeholder="Paste suspicious message text here to test rule..."
              className="w-full bg-slate-950 border border-white/10 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono leading-relaxed"
            />

            <button
              onClick={handleTestRule}
              className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-cyan-600/20 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Execute Rule Match Simulation</span>
            </button>
          </div>

          {/* Simulation Output Card */}
          {matchResult && (
            <div className={`p-4 rounded-lg border text-xs space-y-2 mt-4 animate-in fade-in ${
              matchResult.matched
                ? "bg-rose-950/30 border-rose-500/40 text-rose-200"
                : "bg-emerald-950/30 border-emerald-500/40 text-emerald-200"
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-1.5 uppercase text-[11px]">
                  {matchResult.matched ? (
                    <>
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <span>Rule Match Triggered! (Score: +{matchResult.calculatedScore})</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>No Match Detected</span>
                    </>
                  )}
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-white/10">
                  Regex: {matchResult.regexMatched ? "MATCHED" : "NO"}
                </span>
              </div>

              {matchResult.matchedSnippet && (
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                    Extracted Regex Snippet:
                  </span>
                  <p className="p-2 rounded bg-slate-950 font-mono text-cyan-300 text-[11px] border border-white/5">
                    &ldquo;{matchResult.matchedSnippet}&rdquo;
                  </p>
                </div>
              )}

              {matchResult.matchedKeywords.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                    Matched Keywords ({matchResult.matchedKeywords.length}):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {matchResult.matchedKeywords.map((kw, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded bg-slate-900 border border-white/10 font-mono text-[10px] text-amber-300">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

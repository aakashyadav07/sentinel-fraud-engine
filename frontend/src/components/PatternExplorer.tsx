"use client";

import React, { useState, useEffect } from "react";
import { PatternRule } from "@/types";
import { getPatternLibrary } from "@/lib/api";
import { Database, Search, Filter, ShieldCheck, Tag, Code, RefreshCw } from "lucide-react";

export const PatternExplorer: React.FC = () => {
  const [patterns, setPatterns] = useState<PatternRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const loadPatterns = async () => {
    setLoading(true);
    try {
      const data = await getPatternLibrary();
      setPatterns(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatterns();
  }, []);

  const categories = ["ALL", ...Array.from(new Set(patterns.map((p) => p.category)))];

  const filteredPatterns = patterns.filter((p) => {
    const matchesCategory = selectedCategory === "ALL" || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="cyber-card p-6 border-white/10 bg-slate-900/60 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Deterministic Heuristic Rule Library
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Browse the active pattern rules, regex matchers, keyword taxonomies, and severity weights driving Sentinel&apos;s detection engine.
          </p>
        </div>

        <button
          onClick={loadPatterns}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-white/10 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${loading ? "animate-spin" : ""}`} />
          <span>Reload Rules</span>
        </button>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search rules by name, rule code (e.g. ADV_001), or keyword..."
            className="w-full bg-slate-900 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Pattern Rules Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span>Loading heuristic pattern repository...</span>
        </div>
      ) : filteredPatterns.length === 0 ? (
        <div className="cyber-card p-12 text-center text-slate-400 text-xs">
          No pattern rules found matching your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPatterns.map((rule) => (
            <div
              key={rule.code}
              className="cyber-card p-5 border-white/10 hover:border-cyan-500/30 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30 font-bold">
                      {rule.code}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {rule.category}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                      rule.severity === "CRITICAL"
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        : rule.severity === "HIGH"
                        ? "bg-rose-500/15 text-rose-400 border border-rose-500/20"
                        : "bg-amber-500/15 text-amber-300 border border-amber-500/20"
                    }`}
                  >
                    {rule.severity} (+{rule.default_weight} pts)
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mb-1.5">
                  {rule.name}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {rule.description}
                </p>
              </div>

              {/* Keywords & Regex tags */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                {rule.keywords && rule.keywords.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1">
                    <Tag className="w-3 h-3 text-slate-400 mr-1" />
                    {rule.keywords.slice(0, 5).map((kw, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-white/5"
                      >
                        {kw}
                      </span>
                    ))}
                    {rule.keywords.length > 5 && (
                      <span className="text-[10px] text-slate-500">
                        +{rule.keywords.length - 5} more
                      </span>
                    )}
                  </div>
                )}

                {rule.regex_patterns && rule.regex_patterns.length > 0 && (
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-300/80 truncate bg-slate-950 p-1.5 rounded border border-white/5">
                    <Code className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span className="truncate">{rule.regex_patterns[0]}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

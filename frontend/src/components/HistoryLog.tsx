"use client";

import React, { useState, useEffect } from "react";
import { SubmissionSummary } from "@/types";
import { getSubmissionHistory } from "@/lib/api";
import { History, Search, Filter, ArrowUpRight, AlertOctagon, AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react";

interface HistoryLogProps {
  onSelectSubmission: (id: string) => void;
}

export const HistoryLog: React.FC<HistoryLogProps> = ({ onSelectSubmission }) => {
  const [history, setHistory] = useState<SubmissionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterBand, setFilterBand] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await getSubmissionHistory(filterBand);
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [filterBand]);

  const filteredHistory = history.filter((item) => {
    const term = search.toLowerCase();
    return (
      item.snippet.toLowerCase().includes(term) ||
      item.entity_name.toLowerCase().includes(term) ||
      item.id.toLowerCase().includes(term)
    );
  });

  const getBadge = (band: string) => {
    switch (band.toUpperCase()) {
      case "HIGH":
        return {
          bg: "bg-rose-500/15 text-rose-400 border-rose-500/30",
          icon: AlertOctagon,
        };
      case "MEDIUM":
        return {
          bg: "bg-amber-500/15 text-amber-400 border-amber-500/30",
          icon: AlertTriangle,
        };
      case "LOW":
      default:
        return {
          bg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
          icon: CheckCircle2,
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="cyber-card p-6 border-white/10 bg-slate-900/60 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Threat Intelligence & Investigation Audit Log
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Historical repository of processed scam queries, risk scores, and extracted entity indicators.
          </p>
        </div>

        <button
          onClick={loadHistory}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-white/10 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Log</span>
        </button>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by snippet, impersonated entity, or submission ID..."
            className="w-full bg-slate-900 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-1" />
          {["ALL", "HIGH", "MEDIUM", "LOW"].map((band) => (
            <button
              key={band}
              onClick={() => setFilterBand(band)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                filterBand === band
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-white/5"
              }`}
            >
              {band}
            </button>
          ))}
        </div>
      </div>

      {/* Table View */}
      <div className="cyber-card border-white/10 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <span>Fetching historical scans...</span>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No historical threat cases found. Run a new scan from the Intelligence Scanner tab!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-white/10 uppercase text-[10px] text-slate-400 tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Risk Verdict</th>
                  <th className="py-3.5 px-4">Input Preview / Snippet</th>
                  <th className="py-3.5 px-4">Entity</th>
                  <th className="py-3.5 px-4">Signals Triggered</th>
                  <th className="py-3.5 px-4">Analyzed At</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredHistory.map((row) => {
                  const badge = getBadge(row.risk_band);
                  const Icon = badge.icon;
                  return (
                    <tr
                      key={row.id}
                      onClick={() => onSelectSubmission(row.id)}
                      className="hover:bg-slate-800/50 cursor-pointer transition-colors group"
                    >
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className={`cyber-badge border px-2.5 py-0.5 text-[10px] ${badge.bg}`}>
                            <Icon className="w-3 h-3 mr-1" />
                            {row.risk_band} ({Math.round(row.risk_score)})
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                        <p className="text-slate-200 truncate font-medium">
                          {row.snippet}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="text-slate-400 font-mono text-[11px]">
                          {row.entity_name}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20 text-[11px]">
                          {row.signals_count} signals
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                        {row.created_at ? new Date(row.created_at).toLocaleDateString() : "Recent"}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button className="text-cyan-400 group-hover:text-cyan-300 font-medium inline-flex items-center gap-1 text-xs">
                          <span>Inspect</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

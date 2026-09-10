"use client";

import React, { useState } from "react";
import { X, MessageSquare, AlertTriangle, CheckCircle2, ShieldQuestion } from "lucide-react";
import { submitFeedback } from "@/lib/api";

interface FeedbackModalProps {
  submissionId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  submissionId,
  isOpen,
  onClose,
}) => {
  const [feedbackType, setFeedbackType] = useState("FALSE_POSITIVE");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      await submitFeedback({
        submission_id: submissionId,
        feedback_type: feedbackType,
        user_comment: comment,
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="cyber-card w-full max-w-lg p-6 bg-slate-900 border-white/10 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <ShieldQuestion className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Analyst Feedback & Model Safeguard
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Submission ID: {submissionId.slice(0, 13)}...
            </p>
          </div>
        </div>

        {isSuccess ? (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-bounce" />
            <h4 className="text-sm font-semibold text-white">Feedback Submitted!</h4>
            <p className="text-xs text-slate-400">
              Thank you for contributing to refine Sentinel’s heuristic engine and prevent false triggers.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
                Feedback Classification
              </label>
              <select
                value={feedbackType}
                onChange={(e) => setFeedbackType(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 font-medium"
              >
                <option value="FALSE_POSITIVE">False Positive (Legitimate marked as scam)</option>
                <option value="FALSE_NEGATIVE">False Negative (Scam missed or scored too low)</option>
                <option value="INACCURATE_EVIDENCE">Inaccurate Evidence Snippet / OCR Issue</option>
                <option value="OTHER">Other Heuristic Suggestion</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
                Analyst Notes / Context
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Describe why this case is legitimate or where the detection rule should be adjusted..."
                className="w-full bg-slate-950 border border-white/10 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 placeholder-slate-500"
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-400 bg-rose-500/10 p-2 rounded border border-rose-500/20">
                {errorMsg}
              </p>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors flex items-center gap-2 shadow-md shadow-cyan-600/20"
              >
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

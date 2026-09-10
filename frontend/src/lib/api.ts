import { ForensicReport, SubmissionSummary, PatternRule } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export async function submitScamAnalysis(formData: FormData): Promise<{
  submission_id: string;
  status: string;
  risk_score: number;
  risk_band: string;
  confidence: number;
}> {
  const response = await fetch(`${API_BASE}/api/submissions`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: "Analysis failed" }));
    throw new Error(err.detail || `Server error (${response.status})`);
  }

  return response.json();
}

export async function getSubmissionReport(submissionId: string): Promise<ForensicReport> {
  const response = await fetch(`${API_BASE}/api/submissions/${submissionId}`);
  if (!response.ok) {
    throw new Error(`Failed to load report for submission ${submissionId}`);
  }
  return response.json();
}

export async function getSubmissionHistory(riskBand?: string): Promise<SubmissionSummary[]> {
  const url = riskBand && riskBand !== "ALL" 
    ? `${API_BASE}/api/submissions?risk_band=${riskBand}` 
    : `${API_BASE}/api/submissions`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to load submission history");
  }
  return response.json();
}

export async function getPatternLibrary(): Promise<PatternRule[]> {
  const response = await fetch(`${API_BASE}/api/patterns`);
  if (!response.ok) {
    throw new Error("Failed to load pattern library");
  }
  return response.json();
}

export async function submitFeedback(data: {
  submission_id: string;
  feedback_type: string;
  user_comment?: string;
}): Promise<{ status: string; message: string }> {
  const response = await fetch(`${API_BASE}/api/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to submit analyst feedback");
  }
  return response.json();
}

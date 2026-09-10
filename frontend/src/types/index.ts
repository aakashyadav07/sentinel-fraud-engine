export interface SubmissionData {
  id: string;
  created_at: string | null;
  raw_text: string | null;
  offer_url: string | null;
  upi_phone: string | null;
  image_path: string | null;
  ocr_text: string | null;
  status: string;
  consent_given: boolean;
}

export interface ExtractedClaims {
  entity_name: string | null;
  promised_return: string | null;
  urgency_language: string | null;
  payment_requests: string | null;
  deposit_amount: string | null;
  contact_channels: string | null;
  raw_claims_json?: Record<string, any>;
}

export interface SignalItem {
  id?: string;
  rule_code: string;
  pattern_category: string;
  signal_name: string;
  evidence_snippet: string;
  weight: number;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | string;
  explanation?: string;
}

export interface TimelineNode {
  step: number;
  stage: string;
  description: string;
  risk_level: string;
}

export interface RiskAssessment {
  total_score: number;
  confidence_score: number;
  risk_band: "LOW" | "MEDIUM" | "HIGH" | string;
  cautious_action: string;
  timeline: TimelineNode[];
  summary_text: string;
  calculated_at?: string;
}

export interface ForensicReport {
  submission: SubmissionData;
  extracted_claims: ExtractedClaims | null;
  signals: SignalItem[];
  risk_assessment: RiskAssessment | null;
}

export interface SubmissionSummary {
  id: string;
  created_at: string | null;
  snippet: string;
  risk_score: number;
  risk_band: string;
  confidence: number;
  signals_count: number;
  entity_name: string;
}

export interface PatternRule {
  id?: string;
  code: string;
  name: string;
  category: string;
  description: string;
  default_weight: number;
  severity: string;
  keywords?: string[];
  regex_patterns?: string[];
  is_active: boolean;
}

export interface PresetScenario {
  id: string;
  title: string;
  category: string;
  description: string;
  tag: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  data: {
    raw_text: string;
    offer_url: string;
    upi_phone: string;
  };
}

from typing import List, Dict, Any

def calculate_risk(
    signals: List[Dict[str, Any]],
    extracted_claims: Dict[str, Any],
    has_image: bool = False,
    has_url: bool = False,
    has_identifier: bool = False,
    has_text: bool = False
) -> Dict[str, Any]:
    """
    Computes weighted risk score, confidence, risk band, dynamic Scam Journey timeline,
    and a single cautious action step.
    """
    if not signals:
        total_score = 0.0
        confidence = 45.0 if (has_image or has_text or has_url or has_identifier) else 20.0
        risk_band = "LOW"
        cautious_action = "No significant scam patterns detected in the submitted material. However, always verify unknown senders independently and never share passwords, OTPs, or financial credentials."
        timeline = [
            {
                "phase": 1,
                "title": "Baseline Assessment",
                "description": "Standard communication or unverified inquiry submitted for review.",
                "status": "neutral",
                "evidence": "No high-risk pattern markers identified in text, URL, or identifiers."
            }
        ]
        return {
            "total_score": round(total_score, 1),
            "confidence_score": round(confidence, 1),
            "risk_band": risk_band,
            "cautious_action": cautious_action,
            "timeline": timeline,
            "summary_text": "The submitted content does not show established deceptive markers, but caution is recommended for any unsolicited offer."
        }

    # 1. Calculate weighted score
    raw_score = sum(s.get("weight", 0) for s in signals)
    
    # Cap at 99.0 (never 100 to emphasize heuristic evaluation)
    total_score = min(98.0, raw_score)

    # 2. Confidence calculation based on evidence diversity
    input_factors = sum([has_image, has_url, has_identifier, has_text])
    signal_count = len(signals)
    confidence = min(95.0, 50.0 + (input_factors * 7.5) + (signal_count * 5.0))

    # 3. Determine Risk Band
    if total_score >= 60.0 or any(s.get("severity") == "CRITICAL" for s in signals):
        risk_band = "HIGH"
    elif total_score >= 30.0:
        risk_band = "MEDIUM"
    else:
        risk_band = "LOW"

    # 4. Build Dynamic Scam Journey Timeline
    timeline = []
    
    # Phase 1: The Hook / Origin
    hook_signals = [s for s in signals if s.get("pattern_category") in ["Guaranteed Returns", "Identity/Legitimacy Signals"]]
    if hook_signals:
        timeline.append({
            "phase": 1,
            "title": "Phase 1: The Lure / False Authority",
            "description": "Unsolicited offer promising high rewards or leveraging brand impersonation to establish quick trust.",
            "status": "flagged",
            "evidence": hook_signals[0].get("evidence_snippet")
        })
    else:
        timeline.append({
            "phase": 1,
            "title": "Phase 1: Initial Contact",
            "description": "Initial engagement initiated via message or listing.",
            "status": "neutral",
            "evidence": "Communication received from unverified source."
        })

    # Phase 2: Psychological Pressure / Urgency
    urgency_signals = [s for s in signals if s.get("pattern_category") == "Urgency/Pressure"]
    if urgency_signals:
        timeline.append({
            "phase": 2,
            "title": "Phase 2: Artificial Urgency & Coercion",
            "description": "Fabricating countdowns, limited slots, or immediate penalties to bypass critical thinking.",
            "status": "flagged",
            "evidence": urgency_signals[0].get("evidence_snippet")
        })

    # Phase 3: The Financial Extraction (Advance Fee)
    fee_signals = [s for s in signals if s.get("pattern_category") == "Advance-Fee Pattern"]
    if fee_signals:
        timeline.append({
            "phase": 3,
            "title": "Phase 3: Upfront Financial Demand",
            "description": "Requesting an upfront deposit, registration charge, or wallet recharge before delivering promised benefits.",
            "status": "critical",
            "evidence": fee_signals[0].get("evidence_snippet")
        })

    # Phase 4: Escalation Trap
    esc_signals = [s for s in signals if s.get("pattern_category") == "Escalating Demands"]
    if esc_signals:
        timeline.append({
            "phase": 4,
            "title": "Phase 4: Sunk-Cost Escalation",
            "description": "Demanding sequentially higher recharges or tax fees to 'unlock' trapped funds.",
            "status": "critical",
            "evidence": esc_signals[0].get("evidence_snippet")
        })

    # 5. Formulate ONE clear, cautious action step (safeguard principle)
    if risk_band == "HIGH":
        cautious_action = "STOP all contact immediately. Do not send any advance fee, registration deposit, or personal OTP. Report this handle and link to the National Cyber Crime Reporting Portal (1930 / cybercrime.gov.in) or your local cyber cell."
    elif risk_band == "MEDIUM":
        cautious_action = "PAUSE and verify independently. Do not click links or send advance payments. Contact the official customer support channel of the claimed organization through their verified public website."
    else:
        cautious_action = "PROCEED WITH CAUTION. Verify any unverified sender identity before sharing personal or financial details."

    summary = f"Detected {len(signals)} risk indicator(s) resulting in an estimated {risk_band} risk assessment ({total_score}/100)."

    return {
        "total_score": round(total_score, 1),
        "confidence_score": round(confidence, 1),
        "risk_band": risk_band,
        "cautious_action": cautious_action,
        "timeline": timeline,
        "summary_text": summary
    }

import re
from typing import List, Dict, Any

DEFAULT_PATTERNS = [
    {
        "code": "ADV_FEE_01",
        "name": "Advance-Fee / Upfront Deposit Demand",
        "category": "Advance-Fee Pattern",
        "description": "Requires an upfront payment, deposit, security fee, or activation charge before receiving money, earnings, or services.",
        "default_weight": 35.0,
        "severity": "CRITICAL",
        "regex_patterns": [
            r'(?:deposit|pay|transfer|send|recharge)[\s:]*[₹$€£]?\s*[\d,]+.*(?:before|to start|to activate|to withdraw|security|registration|verification)',
            r'(?:security deposit|registration fee|activation fee|joining fee|training fee|processing fee)',
            r'(?:pay\s*(?:first|advance|refundable\s*deposit))',
            r'(?:recharge\s*(?:wallet|account)\s*(?:to\s*withdraw|to\s*unlock))',
            r'(?:customs\s*fee|release\s*fee|delivery\s*charge\s*to\s*receive\s*parcel)'
        ],
        "keywords": ["security deposit", "registration fee", "activation fee", "joining fee", "recharge first", "refundable deposit", "processing fee", "unlock withdrawal"]
    },
    {
        "code": "GUAR_ROI_01",
        "name": "Unrealistic Guaranteed Returns / Fast Income",
        "category": "Guaranteed Returns",
        "description": "Promises guaranteed high ROI, impossible daily profits, or high pay for trivial tasks (e.g. liking videos, rating hotels).",
        "default_weight": 30.0,
        "severity": "HIGH",
        "regex_patterns": [
            r'(?:guaranteed|fixed|assured)[\s]*(?:return|profit|income|payout|roi)',
            r'(?:earn|make)[\s:]*[₹$€£]?\s*(?:[1-9]\d{2,}|[\d,]+)\s*(?:per\s*day|daily|\/day|per\s*hour|per\s*task|in\s*\d+\s*(?:mins|hours|minutes))',
            r'(?:like\s*(?:and|&)\s*subscribe|rate\s*hotels?|review\s*products?|watch\s*videos?).*(?:earn|get|salary|₹|\$)',
            r'(?:100%|200%|300%|500%)\s*(?:profit|return|growth|in\s*\d+)',
            r'(?:double\s*your\s*money|instant\s*profit|zero\s*risk\s*investment)'
        ],
        "keywords": ["guaranteed return", "earn daily", "like and subscribe", "rate hotels", "watch videos earn", "double money", "zero risk", "daily income", "part time job 5000"]
    },
    {
        "code": "URGENCY_01",
        "name": "Artificial Urgency & Psychological Pressure",
        "category": "Urgency/Pressure",
        "description": "Uses psychological pressure, countdowns, fear of account suspension, or artificial scarcity to force immediate action.",
        "default_weight": 20.0,
        "severity": "HIGH",
        "regex_patterns": [
            r'(?:account|card|sim|pan|kyc)\s*(?:will\s*be\s*)?(?:blocked|suspended|frozen|deactivated|closed)\s*(?:today|within|immediately|unless)',
            r'(?:limited\s*(?:slots?|seats?|vacancies|spots?|time\s*offer))',
            r'(?:immediate\s*action\s*required|urgent\s*notice|act\s*now\s*or)',
            r'(?:last\s*chance|offer\s*expires\s*in\s*\d+|only\s*\d+\s*(?:slots|spots|left))',
            r'(?:electricity\s*power\s*cut|bill\s*unpaid\s*disconnect\s*tonight)'
        ],
        "keywords": ["account blocked", "suspended today", "immediate action required", "limited slots", "urgent notice", "electricity disconnect", "kyc update urgent", "expires today"]
    },
    {
        "code": "ESC_DEMAND_01",
        "name": "Escalating Demands & Tiered Task Traps",
        "category": "Escalating Demands",
        "description": "Incentivizes initial micro-wins then demands exponentially larger deposits or task upgrades to release funds.",
        "default_weight": 25.0,
        "severity": "CRITICAL",
        "regex_patterns": [
            r'(?:level\s*\d|task\s*\d|tier\s*\d|vip\s*\d).*(?:upgrade|recharge|unlock|complete)',
            r'(?:recharge\s*(?:more|higher|additional)\s*to\s*withdraw)',
            r'(?:funds?\s*(?:frozen|locked)\s*(?:until|need\s*tax|need\s*fee))',
            r'(?:commission\s*trapped|complete\s*all\s*tasks\s*first)',
            r'(?:combo\s*task|merchant\s*order\s*match)'
        ],
        "keywords": ["level upgrade", "task complete recharge", "funds frozen until fee", "vip tier", "combo task", "unlock withdrawal balance", "complete next task"]
    },
    {
        "code": "ID_LEGIT_01",
        "name": "Identity Mismatch & Off-Platform Redirection",
        "category": "Identity/Legitimacy Signals",
        "description": "Impersonates legitimate brand/bank names while redirecting communication to unofficial channels (Telegram/WhatsApp) or personal UPI handles.",
        "default_weight": 20.0,
        "severity": "MEDIUM",
        "regex_patterns": [
            r'(?:amazon|youtube|flipkart|fedex|india\s*post|sbi|hdfc|netflix).*(?:contact\s*on\s*telegram|join\s*telegram|t\.me\/|wa\.me\/|whatsapp)',
            r'(?:t\.me\/[a-zA-Z0-9_]+|telegram\s*group|telegram\s*channel|contact\s*mentor)',
            r'(?:apk\s*download|download\s*our\s*app\s*from\s*link|\.apk)',
            r'(?:bit\.ly|tinyurl\.com|cutt\.ly|is\.gd|t\.co|wa\.link)',
            r'[a-zA-Z0-9.\-_]+@(ybl|okaxis|okhdfcbank|oksbi|paytm|apl|axl|ibl)'
        ],
        "keywords": ["contact on telegram", "t.me/", "wa.me/", "whatsapp manager", "download apk", "shortlink", "unofficial upi"]
    },
    {
        "code": "DIGITAL_ARREST_01",
        "name": "Digital Arrest & Law Enforcement Coercion",
        "category": "Authority Impersonation & Coercion",
        "description": "Impersonates Police, CBI, Customs, or Court officials demanding transfer to a 'safe verification account' or video call isolation.",
        "default_weight": 40.0,
        "severity": "CRITICAL",
        "regex_patterns": [
            r'(?:digital\s*arrest|cbi\s*officer|mumbai\s*police|delhi\s*police|customs\s*department|narcotics\s*control|ed\s*officer)',
            r'(?:parcel\s*has\s*(?:drugs|illegal\s*passport|narcotics|contraband))',
            r'(?:transfer\s*to\s*(?:rbi|government|verification)\s*(?:account|fund)\s*to\s*avoid\s*arrest)',
            r'(?:stay\s*on\s*skype|video\s*call\s*interrogation|do\s*not\s*disconnect\s*or\s*arrest)'
        ],
        "keywords": ["digital arrest", "cbi officer", "narcotics found in parcel", "mumbai police department", "rbi verification account", "skype video interrogation", "avoid arrest warrant"]
    },
    {
        "code": "LOAN_EXTORTION_01",
        "name": "Predatory Loan & Contact Access Extortion",
        "category": "Predatory Loan Extortion",
        "description": "Offers instant paperless loan without CIBIL check, requiring full phone contacts and photo gallery permissions.",
        "default_weight": 30.0,
        "severity": "HIGH",
        "regex_patterns": [
            r'(?:instant\s*loan\s*without\s*(?:cibil|documents?|salary|verification))',
            r'(?:loan\s*approved\s*₹?\s*[\d,]+.*(?:install\s*apk|allow\s*contacts?|gallery\s*permission))',
            r'(?:7\s*days?\s*loan|disbursed\s*instantly.*pay\s*double)',
            r'(?:contacts?\s*will\s*be\s*called|defamation\s*to\s*family)'
        ],
        "keywords": ["instant loan no cibil", "allow contacts permission", "7 day loan repayment", "loan approved install apk", "defame contacts"]
    }
]

def evaluate_patterns(
    raw_text: str,
    ocr_text: str = "",
    offer_url: str = "",
    upi_phone: str = "",
    extracted_claims: Dict[str, Any] = None,
    custom_patterns: List[Dict[str, Any]] = None
) -> List[Dict[str, Any]]:
    """
    Evaluates combined text and metadata against the deterministic pattern library.
    Returns matched signals with evidence snippets, category, severity, and weights.
    """
    combined_corpus = f"{raw_text or ''}\n{ocr_text or ''}\nURL: {offer_url or ''}\nIdentifier: {upi_phone or ''}".strip()
    patterns_to_test = custom_patterns if custom_patterns is not None else DEFAULT_PATTERNS
    
    matched_signals = []

    for pat in patterns_to_test:
        matched_snippet = None
        match_explanation = None

        # 1. Test regex patterns
        for regex_str in pat.get("regex_patterns", []):
            try:
                match = re.search(regex_str, combined_corpus, re.IGNORECASE)
                if match:
                    matched_snippet = match.group(0).strip()
                    # Capture slightly wider context for readability if possible
                    start = max(0, match.start() - 20)
                    end = min(len(combined_corpus), match.end() + 20)
                    matched_snippet = f"...{combined_corpus[start:end].strip()}..."
                    match_explanation = f"Matched pattern rule '{pat['name']}'"
                    break
            except Exception:
                continue

        # 2. Test keyword triggers if regex didn't match
        if not matched_snippet:
            for kw in pat.get("keywords", []):
                if kw.lower() in combined_corpus.lower():
                    idx = combined_corpus.lower().find(kw.lower())
                    start = max(0, idx - 20)
                    end = min(len(combined_corpus), idx + len(kw) + 20)
                    matched_snippet = f"...{combined_corpus[start:end].strip()}..."
                    match_explanation = f"Triggered by indicator keyword: '{kw}'"
                    break

        # 3. Check claims context matches
        if not matched_snippet and extracted_claims:
            if pat["code"] == "ADV_FEE_01" and extracted_claims.get("payment_requests"):
                matched_snippet = f"Extracted payment demand: {extracted_claims.get('payment_requests')}"
                match_explanation = "Identified explicit upfront payment or deposit requirement."
            elif pat["code"] == "GUAR_ROI_01" and extracted_claims.get("promised_return"):
                matched_snippet = f"Promised Return: {extracted_claims.get('promised_return')}"
                match_explanation = "Identified unrealistic guaranteed income or rate."
            elif pat["code"] == "URGENCY_01" and extracted_claims.get("urgency_language"):
                matched_snippet = f"Urgency Cues: {extracted_claims.get('urgency_language')}"
                match_explanation = "Identified high-pressure psychological urgency framing."
            elif pat["code"] == "ID_LEGIT_01" and (offer_url or upi_phone or (extracted_claims.get("entity_name") and "Telegram" in str(extracted_claims.get("contact_channels", "")))):
                if offer_url and any(short in offer_url.lower() for short in ["bit.ly", "tinyurl", "t.me", "wa.link"]):
                    matched_snippet = f"Suspicious or shortened destination URL: {offer_url}"
                    match_explanation = "Uses shortened link or unofficial routing channel."
                elif upi_phone and re.search(r'@[a-z]+', upi_phone.lower()):
                    matched_snippet = f"Direct unverified UPI handle provided: {upi_phone}"
                    match_explanation = "Direct personal VPA used instead of verified enterprise gateway."

        if matched_snippet:
            matched_signals.append({
                "rule_code": pat["code"],
                "pattern_category": pat["category"],
                "signal_name": pat["name"],
                "evidence_snippet": matched_snippet,
                "weight": pat.get("default_weight", 20.0),
                "severity": pat.get("severity", "HIGH"),
                "explanation": match_explanation or pat["description"]
            })

    return matched_signals

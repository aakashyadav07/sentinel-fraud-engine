import re
from typing import Dict, Any, List

def extract_claims(raw_text: str, offer_url: str = "", upi_phone: str = "", ocr_text: str = "") -> Dict[str, Any]:
    """
    Extracts structured claims from combined inputs (text, OCR, URL, UPI/phone).
    """
    combined_text = f"{raw_text or ''}\n{ocr_text or ''}".strip()
    
    # 1. Promised Return extraction
    promised_return = None
    return_patterns = [
        r'(?:earn|get|make|return|profit|daily income|salary|payout)[\s:]*(?:up\s*to\s*)?(?:of\s*)?([₹$€£]?\s*[\d,]+(?:\.\d+)?(?:\s*(?:rs|inr|usd|per\s*day|\/day|daily|per\s*task|per\s*hour|weekly|monthly|%))?)',
        r'(\d+(?:\.\d+)?%\s*(?:roi|return|profit|guaranteed|growth))',
        r'([₹$€£]\s*[\d,]+(?:\s*(?:daily|per\s*day|\/day|per\s*hour|per\s*task|per\s*order)))',
        r'(guaranteed\s*(?:income|payout|returns?|profit))',
        r'(?:earn\s*[\d,]+%)'
    ]
    for pat in return_patterns:
        match = re.search(pat, combined_text, re.IGNORECASE)
        if match:
            promised_return = match.group(0).strip()
            break

    # 2. Urgency language extraction
    urgency_phrases = []
    urgency_patterns = [
        r'(?:limited\s*(?:time|slots?|seats?|vacancies|spots?|remaining))',
        r'(?:urgent|immediately|immediate action|act now|expires\s*(?:today|soon|in\s*\d+\s*(?:mins|hours|minutes)))',
        r'(?:account\s*(?:blocked|suspended|frozen|deactivated)\s*(?:if|unless|within|today))',
        r'(?:last\s*chance|hurry\s*up|only\s*\d+\s*(?:slots?|seats?|spots?|left|remaining))',
        r'(?:within\s*\d+\s*(?:hours|minutes|mins|seconds))'
    ]
    for pat in urgency_patterns:
        matches = re.finditer(pat, combined_text, re.IGNORECASE)
        for m in matches:
            urgency_phrases.append(m.group(0).strip())
    
    urgency_language = "; ".join(list(set(urgency_phrases))) if urgency_phrases else None

    # 3. Payment / Deposit requests
    payment_phrases = []
    deposit_amount = None
    payment_patterns = [
        r'(?:deposit|recharge|pay|transfer|send|fee|security deposit|registration fee|activation fee)[\s:]*(?:of\s*)?([₹$€£]?\s*[\d,]+(?:\s*(?:rs|inr|usd))?)',
        r'(?:refundable\s*security\s*deposit|refundable\s*deposit|registration\s*charge|activation\s*charge)[\s:]*(?:of\s*)?([₹$€£]?\s*[\d,]+)?',
        r'(?:initial\s*(?:investment|deposit|fee)[\s:]*(?:of\s*)?([₹$€£]?\s*[\d,]+))',
        r'(?:first\s*pay\s*(?:of\s*)?([₹$€£]?\s*[\d,]+))',
        r'(?:customs\s*fee|release\s*fee|courier\s*charge|processing\s*fee)'
    ]
    for pat in payment_patterns:
        match = re.search(pat, combined_text, re.IGNORECASE)
        if match:
            matched_str = match.group(0).strip()
            payment_phrases.append(matched_str)
            # Try to grab amount
            amt_match = re.search(r'[₹$€£]\s*[\d,]+|\b\d+\s*(?:rs|inr|usd)\b|\b[\d,]{3,}\b', matched_str, re.IGNORECASE)
            if amt_match:
                deposit_amount = amt_match.group(0).strip()
            break

    # If no amount found yet, check generic payment terms
    if not payment_phrases:
        generic_pay = re.search(r'(?:processing fee|advance payment|kyc fee|courier customs fee|release fee|registration fee|security deposit)', combined_text, re.IGNORECASE)
        if generic_pay:
            payment_phrases.append(generic_pay.group(0).strip())

    payment_requests = "; ".join(payment_phrases) if payment_phrases else None

    # 4. Entity Name / Impersonation
    entity_name = None
    known_entities = [
        "Amazon", "Flipkart", "Telegram", "YouTube", "WhatsApp", "FedEx", "DHL", "India Post",
        "SBI", "HDFC", "ICICI", "Axis Bank", "Paytm", "Google Pay", "PhonePe", "Netflix", "Meesho"
    ]
    for ent in known_entities:
        if re.search(r'\b' + re.escape(ent) + r'\b', combined_text, re.IGNORECASE):
            entity_name = ent
            break

    if not entity_name:
        corp_match = re.search(r'([A-Z][a-zA-Z0-9\s]{2,25}(?:Trading|Enterprises|Investments|Global|Media|Agency|Solutions|Pvt Ltd))', combined_text)
        if corp_match:
            entity_name = corp_match.group(1).strip()

    # 5. Communication channels
    channels = []
    if re.search(r'telegram|t\.me\/|@\w+', combined_text, re.IGNORECASE):
        tg_match = re.search(r'(?:t\.me\/|@)([a-zA-Z0-9_]{4,})', combined_text)
        channels.append(f"Telegram ({tg_match.group(0) if tg_match else 'Telegram Group/User'})")
    if re.search(r'whatsapp|wa\.me\/', combined_text, re.IGNORECASE):
        channels.append("WhatsApp")
    if upi_phone:
        channels.append(f"Identifier: {upi_phone}")
    if offer_url:
        channels.append(f"URL: {offer_url}")

    contact_channels = ", ".join(channels) if channels else None

    return {
        "entity_name": entity_name or "Unspecified Entity",
        "promised_return": promised_return,
        "urgency_language": urgency_language,
        "payment_requests": payment_requests,
        "deposit_amount": deposit_amount,
        "contact_channels": contact_channels,
        "raw_claims_json": {
            "promised_return_found": bool(promised_return),
            "urgency_found": bool(urgency_language),
            "payment_demanded": bool(payment_requests),
            "deposit_value": deposit_amount,
            "detected_channels": channels,
            "url_present": bool(offer_url),
            "upi_phone_present": bool(upi_phone)
        }
    }

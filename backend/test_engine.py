import pytest
from fastapi.testclient import TestClient
from main import app
from claim_extractor import extract_claims
from pattern_engine import evaluate_patterns
from risk_scorer import calculate_risk

client = TestClient(app)

def test_health():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "online"

def test_task_scam_pattern_matching():
    sample_scam = (
        "Part-time Job Offer! YouTube video like and subscribe task. "
        "Earn ₹5000 per day guaranteed income. "
        "Pay refundable security deposit of ₹500 to activate wallet. "
        "Contact Telegram mentor @task_payout_admin immediately. Limited slots remaining!"
    )
    
    claims = extract_claims(raw_text=sample_scam, offer_url="https://bit.ly/task303", upi_phone="payment@okaxis")
    assert claims["promised_return"] is not None
    assert claims["payment_requests"] is not None
    assert claims["urgency_language"] is not None
    assert "Telegram" in claims["contact_channels"]

    signals = evaluate_patterns(
        raw_text=sample_scam,
        offer_url="https://bit.ly/task303",
        upi_phone="payment@okaxis",
        extracted_claims=claims
    )
    assert len(signals) >= 3
    categories = [s["pattern_category"] for s in signals]
    assert "Advance-Fee Pattern" in categories
    assert "Guaranteed Returns" in categories

    risk = calculate_risk(signals=signals, extracted_claims=claims, has_text=True, has_url=True, has_identifier=True)
    assert risk["risk_band"] == "HIGH"
    assert risk["total_score"] >= 60.0
    assert len(risk["timeline"]) >= 2
    assert "STOP all contact" in risk["cautious_action"]

def test_legitimate_content_low_risk():
    sample_legit = (
        "Hey Alex, here is the design draft for the new portfolio website. "
        "Please review the Figma link when you get time this week."
    )
    claims = extract_claims(raw_text=sample_legit)
    signals = evaluate_patterns(raw_text=sample_legit, extracted_claims=claims)
    assert len(signals) == 0

    risk = calculate_risk(signals=signals, extracted_claims=claims, has_text=True)
    assert risk["risk_band"] == "LOW"
    assert risk["total_score"] == 0.0

def test_api_submission_flow():
    data = {
        "raw_text": "Earn 300% profit daily! Pay ₹1000 registration fee now. Only 2 slots left.",
        "offer_url": "https://t.me/crypto_double_vip",
        "upi_phone": "scamtest@ybl",
        "consent_given": True
    }
    response = client.post("/api/submissions", data=data)
    assert response.status_code == 200
    res_json = response.json()
    assert "submission_id" in res_json
    sub_id = res_json["submission_id"]
    assert res_json["risk_band"] == "HIGH"

    # Test get report
    rep_response = client.get(f"/api/submissions/{sub_id}")
    assert rep_response.status_code == 200
    rep_data = rep_response.json()
    assert rep_data["submission"]["id"] == sub_id
    assert len(rep_data["signals"]) > 0
    assert len(rep_data["risk_assessment"]["timeline"]) > 0

    # Test get history
    history_response = client.get("/api/submissions")
    assert history_response.status_code == 200
    assert len(history_response.json()) > 0

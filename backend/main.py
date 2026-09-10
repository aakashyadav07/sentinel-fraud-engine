import os
import shutil
import uuid
from typing import Optional, List
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, UploadFile, File, Form, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import engine, get_db, Base
import models
from ocr_engine import extract_text_from_image
from claim_extractor import extract_claims
from pattern_engine import evaluate_patterns, DEFAULT_PATTERNS
from risk_scorer import calculate_risk

# Create database tables
Base.metadata.create_all(bind=engine)

# Upload directory
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

def seed_pattern_library_sync():
    """Seed initial default pattern library if empty."""
    db = next(get_db())
    try:
        count = db.query(models.PatternLibrary).count()
        if count == 0:
            for p in DEFAULT_PATTERNS:
                db_pat = models.PatternLibrary(
                    code=p["code"],
                    name=p["name"],
                    category=p["category"],
                    description=p["description"],
                    regex_patterns=p["regex_patterns"],
                    keywords=p["keywords"],
                    default_weight=p["default_weight"],
                    severity=p["severity"],
                    is_active=True
                )
                db.add(db_pat)
            db.commit()
    finally:
        db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Seed database patterns
    seed_pattern_library_sync()
    yield

app = FastAPI(
    title="Fraud & Scam Intelligence Engine API",
    description="Multi-input scam pattern detection, structured claim extraction, and explainable risk scoring.",
    version="1.0.0",
    lifespan=lifespan
)

# Seed immediately on module load as well so TestClient has patterns ready
seed_pattern_library_sync()

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploads static folder
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Pydantic models for responses and requests
class FeedbackCreate(BaseModel):
    submission_id: str
    feedback_type: str  # FALSE_POSITIVE, FALSE_NEGATIVE, INACCURATE_EVIDENCE, OTHER
    user_comment: Optional[str] = None

@app.get("/")
def health_check():
    return {
        "status": "online",
        "service": "Fraud & Scam Intelligence Detection Engine",
        "version": "1.0.0"
    }

@app.post("/api/submissions")
async def create_submission(
    raw_text: Optional[str] = Form(None),
    offer_url: Optional[str] = Form(None),
    upi_phone: Optional[str] = Form(None),
    consent_given: bool = Form(True),
    screenshot: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    """
    Multi-input capture endpoint:
    Accepts screenshot upload, offer link, UPI ID/phone, and free-text details.
    Ties all inputs to one submission ID and runs analysis pipeline.
    """
    submission_id = str(uuid.uuid4())
    saved_filename = None
    saved_filepath = None
    ocr_text = ""

    # 1. Handle file upload if provided
    if screenshot and screenshot.filename:
        ext = os.path.splitext(screenshot.filename)[1] or ".png"
        saved_filename = f"{submission_id}{ext}"
        saved_filepath = os.path.join(UPLOAD_DIR, saved_filename)
        
        with open(saved_filepath, "wb") as buffer:
            shutil.copyfileobj(screenshot.file, buffer)

        # Run OCR extraction
        ocr_text = extract_text_from_image(saved_filepath)

    # 2. Persist submission record
    sub = models.Submission(
        id=submission_id,
        raw_text=raw_text,
        offer_url=offer_url,
        upi_phone=upi_phone,
        image_filename=saved_filename,
        image_path=f"/uploads/{saved_filename}" if saved_filename else None,
        ocr_text=ocr_text,
        status="COMPLETED",
        consent_given=consent_given
    )
    db.add(sub)
    db.flush()

    # 3. Structured Claim Extraction
    claims_data = extract_claims(
        raw_text=raw_text or "",
        offer_url=offer_url or "",
        upi_phone=upi_phone or "",
        ocr_text=ocr_text or ""
    )

    extracted_claim = models.ExtractedClaim(
        submission_id=submission_id,
        entity_name=claims_data.get("entity_name"),
        promised_return=claims_data.get("promised_return"),
        urgency_language=claims_data.get("urgency_language"),
        payment_requests=claims_data.get("payment_requests"),
        deposit_amount=claims_data.get("deposit_amount"),
        contact_channels=claims_data.get("contact_channels"),
        extracted_json=claims_data.get("raw_claims_json")
    )
    db.add(extracted_claim)

    # 4. Fetch active patterns from database for evaluation
    db_patterns = db.query(models.PatternLibrary).filter(models.PatternLibrary.is_active == True).all()
    if db_patterns:
        active_patterns = [
            {
                "code": p.code,
                "name": p.name,
                "category": p.category,
                "description": p.description,
                "regex_patterns": p.regex_patterns or [],
                "keywords": p.keywords or [],
                "default_weight": p.default_weight,
                "severity": p.severity
            }
            for p in db_patterns
        ]
    else:
        active_patterns = DEFAULT_PATTERNS

    # 5. Deterministic Pattern Engine Evaluation
    matched_signals = evaluate_patterns(
        raw_text=raw_text or "",
        ocr_text=ocr_text or "",
        offer_url=offer_url or "",
        upi_phone=upi_phone or "",
        extracted_claims=claims_data,
        custom_patterns=active_patterns
    )

    for sig in matched_signals:
        db_sig = models.Signal(
            submission_id=submission_id,
            rule_code=sig["rule_code"],
            pattern_category=sig["pattern_category"],
            signal_name=sig["signal_name"],
            evidence_snippet=sig["evidence_snippet"],
            weight=sig["weight"],
            severity=sig["severity"],
            explanation=sig.get("explanation")
        )
        db.add(db_sig)

    # 6. Risk Scoring & Dynamic Scam Journey Timeline
    risk_data = calculate_risk(
        signals=matched_signals,
        extracted_claims=claims_data,
        has_image=bool(saved_filename),
        has_url=bool(offer_url),
        has_identifier=bool(upi_phone),
        has_text=bool(raw_text)
    )

    risk_score_rec = models.RiskScore(
        submission_id=submission_id,
        total_score=risk_data["total_score"],
        confidence_score=risk_data["confidence_score"],
        risk_band=risk_data["risk_band"],
        cautious_action=risk_data["cautious_action"],
        timeline_json=risk_data["timeline"],
        summary_text=risk_data["summary_text"]
    )
    db.add(risk_score_rec)
    db.commit()

    return {
        "submission_id": submission_id,
        "status": "COMPLETED",
        "risk_score": risk_data["total_score"],
        "risk_band": risk_data["risk_band"],
        "confidence": risk_data["confidence_score"]
    }

@app.get("/api/submissions/{submission_id}")
def get_submission_report(submission_id: str, db: Session = Depends(get_db)):
    """
    Returns the comprehensive explainable risk report for a given submission ID.
    """
    sub = db.query(models.Submission).filter(models.Submission.id == submission_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found")

    claim = db.query(models.ExtractedClaim).filter(models.ExtractedClaim.submission_id == submission_id).first()
    signals = db.query(models.Signal).filter(models.Signal.submission_id == submission_id).all()
    risk = db.query(models.RiskScore).filter(models.RiskScore.submission_id == submission_id).first()

    return {
        "submission": {
            "id": sub.id,
            "created_at": sub.created_at.isoformat() if sub.created_at else None,
            "raw_text": sub.raw_text,
            "offer_url": sub.offer_url,
            "upi_phone": sub.upi_phone,
            "image_path": sub.image_path,
            "ocr_text": sub.ocr_text,
            "status": sub.status,
            "consent_given": sub.consent_given
        },
        "extracted_claims": {
            "entity_name": claim.entity_name if claim else None,
            "promised_return": claim.promised_return if claim else None,
            "urgency_language": claim.urgency_language if claim else None,
            "payment_requests": claim.payment_requests if claim else None,
            "deposit_amount": claim.deposit_amount if claim else None,
            "contact_channels": claim.contact_channels if claim else None,
            "raw_claims_json": claim.extracted_json if claim else {}
        } if claim else None,
        "signals": [
            {
                "id": s.id,
                "rule_code": s.rule_code,
                "pattern_category": s.pattern_category,
                "signal_name": s.signal_name,
                "evidence_snippet": s.evidence_snippet,
                "weight": s.weight,
                "severity": s.severity,
                "explanation": s.explanation
            }
            for s in signals
        ],
        "risk_assessment": {
            "total_score": risk.total_score if risk else 0.0,
            "confidence_score": risk.confidence_score if risk else 0.0,
            "risk_band": risk.risk_band if risk else "LOW",
            "cautious_action": risk.cautious_action if risk else "",
            "timeline": risk.timeline_json if risk else [],
            "summary_text": risk.summary_text if risk else "",
            "calculated_at": risk.calculated_at.isoformat() if risk and risk.calculated_at else None
        } if risk else None
    }

@app.get("/api/submissions")
def list_submissions(
    risk_band: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    List past submissions with risk band summary.
    """
    query = db.query(models.Submission).order_by(models.Submission.created_at.desc())
    subs = query.limit(limit).all()

    results = []
    for s in subs:
        risk = db.query(models.RiskScore).filter(models.RiskScore.submission_id == s.id).first()
        if risk_band and risk and risk.risk_band.upper() != risk_band.upper():
            continue
        
        claim = db.query(models.ExtractedClaim).filter(models.ExtractedClaim.submission_id == s.id).first()
        sig_count = db.query(models.Signal).filter(models.Signal.submission_id == s.id).count()

        results.append({
            "id": s.id,
            "created_at": s.created_at.isoformat() if s.created_at else None,
            "snippet": (s.raw_text[:80] + "...") if s.raw_text else (s.offer_url or s.upi_phone or "Screenshot analysis"),
            "risk_score": risk.total_score if risk else 0.0,
            "risk_band": risk.risk_band if risk else "LOW",
            "confidence": risk.confidence_score if risk else 0.0,
            "signals_count": sig_count,
            "entity_name": claim.entity_name if claim else "Unspecified"
        })
    return results

@app.get("/api/patterns")
def list_patterns(db: Session = Depends(get_db)):
    """
    Returns the config-driven pattern library.
    """
    patterns = db.query(models.PatternLibrary).all()
    return [
        {
            "id": p.id,
            "code": p.code,
            "name": p.name,
            "category": p.category,
            "description": p.description,
            "default_weight": p.default_weight,
            "severity": p.severity,
            "keywords": p.keywords,
            "regex_patterns": p.regex_patterns,
            "is_active": p.is_active
        }
        for p in patterns
    ]

@app.post("/api/feedback")
def submit_feedback(data: FeedbackCreate, db: Session = Depends(get_db)):
    """
    Submit user or analyst false-positive / evidence feedback for safeguards.
    """
    sub = db.query(models.Submission).filter(models.Submission.id == data.submission_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found")

    fb = models.Feedback(
        submission_id=data.submission_id,
        feedback_type=data.feedback_type,
        user_comment=data.user_comment
    )
    db.add(fb)
    db.commit()

    return {"status": "SUCCESS", "message": "Feedback submitted successfully. Thank you for refining detection accuracy."}

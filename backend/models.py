import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, Float, Integer, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from database import Base

def generate_uuid():
    return str(uuid.uuid4())

def get_utc_now():
    return datetime.now(timezone.utc)

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    created_at = Column(DateTime, default=get_utc_now)
    raw_text = Column(Text, nullable=True)
    offer_url = Column(String(500), nullable=True)
    upi_phone = Column(String(100), nullable=True)
    image_filename = Column(String(255), nullable=True)
    image_path = Column(String(500), nullable=True)
    ocr_text = Column(Text, nullable=True)
    status = Column(String(50), default="COMPLETED")  # PENDING, PROCESSING, COMPLETED, FAILED
    consent_given = Column(Boolean, default=True)

    # Relationships
    extracted_claim = relationship("ExtractedClaim", back_populates="submission", uselist=False, cascade="all, delete-orphan")
    signals = relationship("Signal", back_populates="submission", cascade="all, delete-orphan")
    risk_score = relationship("RiskScore", back_populates="submission", uselist=False, cascade="all, delete-orphan")
    feedbacks = relationship("Feedback", back_populates="submission", cascade="all, delete-orphan")

class ExtractedClaim(Base):
    __tablename__ = "extracted_claims"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    submission_id = Column(String(36), ForeignKey("submissions.id"), nullable=False, unique=True)
    entity_name = Column(String(200), nullable=True)
    promised_return = Column(String(200), nullable=True)
    urgency_language = Column(Text, nullable=True)
    payment_requests = Column(Text, nullable=True)
    deposit_amount = Column(String(100), nullable=True)
    contact_channels = Column(String(200), nullable=True)
    extracted_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=get_utc_now)

    submission = relationship("Submission", back_populates="extracted_claim")

class Signal(Base):
    __tablename__ = "signals"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    submission_id = Column(String(36), ForeignKey("submissions.id"), nullable=False)
    rule_code = Column(String(50), nullable=False)
    pattern_category = Column(String(100), nullable=False)  # Advance-Fee, Guaranteed Returns, Urgency, Escalating Demands, Identity Mismatch
    signal_name = Column(String(200), nullable=False)
    evidence_snippet = Column(Text, nullable=False)
    weight = Column(Float, nullable=False)
    severity = Column(String(20), default="HIGH")  # CRITICAL, HIGH, MEDIUM, LOW
    explanation = Column(Text, nullable=True)
    created_at = Column(DateTime, default=get_utc_now)

    submission = relationship("Submission", back_populates="signals")

class RiskScore(Base):
    __tablename__ = "risk_scores"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    submission_id = Column(String(36), ForeignKey("submissions.id"), nullable=False, unique=True)
    total_score = Column(Float, nullable=False)  # 0 - 100
    confidence_score = Column(Float, nullable=False)  # 0 - 100%
    risk_band = Column(String(20), nullable=False)  # LOW, MEDIUM, HIGH
    cautious_action = Column(Text, nullable=False)
    timeline_json = Column(JSON, nullable=True)
    summary_text = Column(Text, nullable=True)
    calculated_at = Column(DateTime, default=get_utc_now)

    submission = relationship("Submission", back_populates="risk_score")

class PatternLibrary(Base):
    __tablename__ = "pattern_library"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    code = Column(String(50), unique=True, nullable=False)
    name = Column(String(200), nullable=False)
    category = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    regex_patterns = Column(JSON, nullable=True)  # List of regex strings
    keywords = Column(JSON, nullable=True)        # List of keywords
    default_weight = Column(Float, default=20.0)
    severity = Column(String(20), default="HIGH")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=get_utc_now)

class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    submission_id = Column(String(36), ForeignKey("submissions.id"), nullable=False)
    feedback_type = Column(String(50), nullable=False)  # FALSE_POSITIVE, FALSE_NEGATIVE, INACCURATE_EVIDENCE, OTHER
    user_comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=get_utc_now)

    submission = relationship("Submission", back_populates="feedbacks")

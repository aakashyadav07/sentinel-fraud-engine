# 🛡️ SENTINEL — Fraud & Scam Pattern Intelligence Engine

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2015-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![Docker](https://img.shields.io/badge/Deployment-Docker%20Compose-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> **An advanced, explainable cybersecurity intelligence platform designed to detect, dissect, and score multi-input digital scams, financial phishing traps, and social engineering attacks across screenshots, URLs, payment handles, and chat transcripts.**

---

## 📌 Problem & Impact
Digital financial crime—ranging from **YouTube Part-Time Task Scams**, **"Digital Arrest" Narcotics Extortions**, **Electricity Disconnection APK Phishing**, to **Unrealistic Crypto Doublers**—costs citizens and enterprises billions annually. 

Most victims cannot distinguish sophisticated social engineering lures from legitimate opportunities. **Sentinel** bridges this gap by combining **optical character recognition (OCR)**, **deterministic heuristic rules**, **structured claim parsing**, and **sequential attack journey reconstruction** into an explainable 0–100 threat assessment.

---

## ✨ Core Features

### 1. 🔍 Multi-Input Threat Ingestion Studio
- **Screenshot OCR Extraction**: Drag-and-drop Telegram/WhatsApp chat screenshots, ad banners, or fake receipts (powered by Tesseract / EasyOCR).
- **Suspicious Domain & URL Analyzer**: Detects obfuscated shortlinks, disposable TLDs (`.apk`, `.cx`, `.top`, `.vip`), and punycode lookalikes.
- **UPI & Payment Identifier Resolver**: Flags suspicious merchant/consumer payment routing handles (`@okaxis`, `@ybl`, `@paytm`).
- **1-Click Test Scenarios**: Instant presets for Task Scams, Digital Arrest, Crypto Ponzi, Utility APKs, and Legitimate inquiries.

### 2. 🧠 Deterministic Pattern Engine & Structured Claims
- **Config-Driven Heuristic Library**: Evaluates evidence against 10 weighted pattern categories:
  - `ADV_FEE_01`: Advance-Fee & Pay-to-Earn Demands
  - `DIGITAL_ARREST_01`: Police/CBI Impersonation & Coercive Video Interrogation
  - `GUAR_ROI_01`: Impossible Guaranteed Returns
  - `URGENCY_01`: Coercive Urgency & Account Disconnection Threats
  - `ESC_DEMAND_01`: Tiered Task Traps & Frozen Wallet Demands
  - `LOAN_EXTORTION_01`: Predatory Instant Loan & Contact Access
- **Structured Claim Extraction**: Automatically parses promised returns, deposit requirements, impersonated entities, and routing channels.

### 3. 📊 Explainable Risk Scoring & Reconstructed Attack Timeline
- **0–100 Risk Score Meter**: Weighted mathematical scoring with confidence percentages and risk bands (`HIGH`, `MEDIUM`, `LOW`).
- **Sequential Attack Journey**: Visualizes how the threat unfolds (*Stage 1: Bait & Hook &rarr; Stage 2: Trust Building &rarr; Stage 3: Micro-Task &rarr; Stage 4: Financial Entrapment*).

### 4. 📄 Formal Police FIR & Bank Incident Brief Generator
- **1-Click Printable Incident Report**: Generates a standardized digital forensic evidence brief containing:
  - Unique Incident Hash (SHA-256) & UTC Timestamp
  - Suspect Identifiers (UPI handle, URL, Phone)
  - Modus Operandi & Quoted Forensic Evidence for legal complaints under **Section 66D of the IT Act** and **National Helpline 1930 protocols**.

### 5. 🎮 Interactive Scam Defense Academy
- Gamified training simulator where users play through branching real-world cyber attack scenarios to test and build psychological vigilance (*0–150 Vigilance Rating*).

### 6. 🧪 Heuristic Rule Engineering Sandbox
- Interactive laboratory for SOC analysts and security researchers to draft, test, and calibrate custom regex patterns and scoring weights against live text corpuses.

---

## 🏗️ System Architecture

```
                       [User Input Channels]
            ┌─────────────────────┬─────────────────────┐
            │                     │                     │
    📷 Screenshot Image     🔗 Offer Link        📝 Chat Transcript / UPI
            │                     │                     │
            ▼                     │                     │
   [OCR Ingestion Engine]         │                     │
    (Tesseract / PIL)             │                     │
            │                     │                     │
            └─────────────────────┼─────────────────────┘
                                  ▼
                    [Structured Claim Extractor]
             (ROI, Fees, Urgency, Entities, Channels)
                                  │
                                  ▼
                   [Deterministic Pattern Engine]
                   (10 Weighted Heuristic Rules)
                                  │
                                  ▼
                   [Explainable Risk Scorer (0-100)]
             (Confidence % • Risk Bands • Incident SOPs)
                                  │
                                  ▼
         ┌────────────────────────┴────────────────────────┐
         │                                                 │
  [Forensic Dashboard &]                        [Formal Police FIR / Bank]
  [Attack Journey Timeline]                     [Incident Evidence Brief]
```

---

## 🛠️ Tech Stack

| Component | Technology |
|---|---|
| **Backend API** | FastAPI (Python 3.11+), Uvicorn |
| **Database & ORM** | SQLite / PostgreSQL, SQLAlchemy, Pydantic |
| **OCR & Forensics** | Tesseract OCR, PIL / Pillow |
| **Frontend Framework** | Next.js 15 (App Router), React 19, TypeScript |
| **Styling & Icons** | Tailwind CSS, Lucide React, Glassmorphism Cyber Theme |
| **Containerization** | Docker, Docker Compose |

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/aakashyadav07/sentinel-fraud-engine.git
cd sentinel-fraud-engine
```

### 2. Run the Backend API
```bash
# Navigate to backend and install dependencies
cd backend
pip install -r requirements.txt

# Start FastAPI server
python -m uvicorn main:app --port 8000 --reload
```
API Documentation will be live at: `http://localhost:8000/docs`

### 3. Run the Next.js Frontend
```bash
# Open a new terminal and navigate to frontend
cd frontend
npm install

# Start Next.js dev server
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

## 🐳 Docker 1-Command Deployment

Run the complete frontend and backend stack together with Docker Compose:

```bash
docker compose up -d --build
```
- **Web Interface**: `http://localhost:3000`
- **API Documentation**: `http://localhost:8000/docs`

---

## 🌐 Cloud Deployment Guide

### Backend (Render.com)
1. Create a **New Web Service** on [Render](https://dashboard.render.com).
2. Connect this repository and set:
   - **Root Directory**: `backend`
   - **Runtime**: `Docker` *(Uses `backend/Dockerfile` with pre-installed Tesseract OCR)*
3. Deploy and copy your public backend URL.

### Frontend (Vercel.com)
1. Import this repository on [Vercel](https://vercel.com/new).
2. Set:
   - **Root Directory**: `frontend`
   - **Environment Variable**: `NEXT_PUBLIC_API_URL` = `https://your-backend.onrender.com`
3. Click **Deploy**.

---

## 🛡️ Emergency Indian Cyber Crime Helplines
- **National Cyber Fraud Helpline**: Dial **1930** *(Golden hour account freeze)*
- **National Cyber Crime Portal**: [cybercrime.gov.in](https://cybercrime.gov.in)
- **DoT Chakshu (Spam / Malicious Calls)**: [sancharsaathi.gov.in](https://sancharsaathi.gov.in)

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).

---

**Developed with ❤️ for Cyber Safety & Fraud Prevention**

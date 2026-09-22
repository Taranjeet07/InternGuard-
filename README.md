# InternGuard

**Verify Before You Trust**

InternGuard is an AI-powered recruitment safety platform that analyzes job and internship messages, screenshots, and URLs to identify suspicious recruitment indicators — giving students an explainable risk assessment and verification guidance *before* they pay money, click links, or share sensitive information.

> "The problem isn't only finding an internship. It's knowing whether you can trust it."

---

## Table of Contents

- [Problem Statement](#problem-statement)
- [Solution](#solution)
- [Core Features](#core-features)
- [Explainable Risk Engine](#explainable-risk-engine)
- [End-to-End Workflow](#end-to-end-workflow)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Database Design](#database-design)
- [API Structure](#api-structure)
---

## Problem Statement

Students and fresh graduates search for internships and jobs through LinkedIn, WhatsApp, Telegram, Instagram, email, and unofficial websites. Fraudulent recruiters exploit this process through fake job offers, company impersonation, registration fees, security deposits, malicious links, and requests for sensitive documents.

Existing verification is fragmented and requires manually checking multiple sources. InternGuard consolidates this into one platform that analyzes the opportunity, explains the warning signals, and guides the student toward safer verification.

**Target users:** Students, fresh graduates, colleges, and placement cells.

**Primary themes:** Cybersecurity · Artificial Intelligence & Machine Learning · Web & Mobile Development · Social Impact.

---

## Solution

Users can submit three types of input:

| Input | Description |
|---|---|
| **Text** | Paste a recruiter message, email, or job description |
| **Screenshot** | Upload a WhatsApp, Telegram, Instagram, or email screenshot |
| **URL** | Submit a recruitment website or application link |

The system combines **OCR**, **AI analysis**, **rule-based indicators**, and **URL/security signals** to produce an explainable risk report.

---

## Core Features

| Feature | What it does |
|---|---|
| **Text Scam Analyzer** | Detects payment requests, urgency, unrealistic promises, sensitive-data requests, and unusual recruitment patterns |
| **Screenshot Analyzer** | OCR extracts text and links from screenshots, then routes them through the analysis pipeline |
| **URL Analyzer** | Checks technical/security signals such as HTTPS, suspicious URL patterns, domain mismatch, and threat intelligence |
| **Company Verification** | Compares company, recruiter, website, and domain signals and flags information needing verification |
| **Explainable AI** | Shows the evidence behind each detected risk signal instead of a black-box verdict |
| **Community Reports** | Lets students report suspicious opportunities and surfaces aggregated warnings when multiple reports exist |

---

## Explainable Risk Engine

InternGuard doesn't simply declare an opportunity a scam — it identifies evidence and communicates uncertainty. The risk score represents **detected risk indicators**, not a legal or definitive determination of fraud.

### Example Scoring Model

| Indicator | Points |
|---|---|
| Upfront payment request | +25 |
| Suspicious URL | +20 |
| Urgency/pressure | +15 |
| Sensitive information request | +15 |
| Unrealistic compensation | +10 |
| Company identity mismatch | +10 |
| Unusual communication channel | +5 |

**Risk bands:** `0–25` Low Risk · `26–60` Needs Verification · `61–100` High Risk

**Example report:** *Risk Score 86/100 — High Risk.* Indicators: payment request, urgency, suspicious URL, and possible company/domain mismatch. The report recommends independent verification rather than blind trust.

---

## End-to-End Workflow

```
User Input → Text/OCR/URL Extraction → Feature Extraction → Rule-Based Checks
           → AI Analysis → Risk Aggregation → Explainable Report → Recommended Action
```

**Screenshot flow:**
```
Screenshot → OCR → Extract Text + URLs → AI Analysis → Risk Engine → Report
```

---

## System Architecture

```
Student
   ↓
React + Tailwind Frontend
   ↓
Node.js + Express Backend
   ↓
OCR | AI API | URL/Security Services
   ↓
Risk Engine
   ↓
MongoDB
   ↓
Explainable Risk Report
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| AI | LLM API with structured output |
| OCR | OCR library/API |
| Security | URL/domain analysis + threat-intelligence API (where available) |
| Cloud | AWS |
| Collaboration | Git + GitHub |

---

## Database Design

**Users**
`_id, name, email, createdAt`

**Analyses**
`_id, userId, inputType, inputText, url, riskScore, riskLevel, indicators, explanation, createdAt`

**Reports**
`_id, userId, company, recruiter, url, reason, evidence, createdAt`

---

## API Structure

```
POST /api/analyze/text
POST /api/analyze/screenshot
POST /api/analyze/url
POST /api/reports
GET  /api/history
GET  /api/reports/company/:name
```

---

## Scalability & Future Scope

```
Student tool → Campus/Placement platform → Recruitment protection layer → Browser/mobile integration
```

Future additions: browser extension, multilingual scam detection, email/WhatsApp integrations (where technically and legally appropriate), college placement dashboards, recruiter verification, real-time threat intelligence, and mobile apps.

---

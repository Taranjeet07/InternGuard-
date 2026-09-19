# InternGuard API Testing Guide

This guide contains example cURL commands and JSON payloads for testing all InternGuard backend endpoints with Postman, Thunder Client, or Terminal.

---

## 1. Health Check

### Request
```bash
curl -X GET http://localhost:5000/api/health
```

### Response
```json
{
  "success": true,
  "message": "InternGuard backend is running"
}
```

---

## 2. Text Analysis API

### Request
`POST /api/analyze/text`

```bash
curl -X POST http://localhost:5000/api/analyze/text \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Congratulations! You have been selected for a work-from-home internship. Pay ₹1499 registration fee immediately.",
    "company": "FakeCorp Technologies",
    "recruiterEmail": "hr@gmail.com",
    "website": "http://fakecorp-careers.xyz"
  }'
```

### Response
```json
{
  "success": true,
  "data": {
    "riskScore": 86,
    "riskLevel": "HIGH",
    "indicators": [
      {
        "type": "Payment Request",
        "severity": "HIGH",
        "points": 25,
        "evidence": "The recruitment content asks the candidate to pay a fee or deposit. Found matched phrases: \"pay\", \"registration fee\", \"₹\"."
      },
      {
        "type": "Urgency",
        "severity": "MEDIUM",
        "points": 15,
        "evidence": "The message creates artificial urgency or pressures immediate action. Found matched phrases: \"immediately\"."
      },
      {
        "type": "URL Risk: Suspicious TLD",
        "severity": "MEDIUM",
        "points": 10,
        "evidence": "Domain uses top-level domain (.xyz) often associated with low-cost spam or scam sites."
      }
    ],
    "explanation": "Potentially high risk detected due to multiple suspicious indicators. Further verification is strongly advised before proceeding or sharing money/data.",
    "recommendedActions": [
      "Do not make any upfront payment, registration fee, or security deposit. Legitimate employers rarely ask candidates to pay for job placement.",
      "Do not let pressure tactics or tight deadlines rush your decisions.",
      "Verify the opportunity through the organization's official website or direct HR department."
    ],
    "aiAnalysisAvailable": false,
    "verificationSignals": [
      "Recruiter email uses a public email domain (gmail.com) rather than an official corporate email domain."
    ]
  }
}
```

---

## 3. URL Analysis API

### Request
`POST /api/analyze/url`

```bash
curl -X POST http://localhost:5000/api/analyze/url \
  -H "Content-Type: application/json" \
  -d '{
    "url": "http://192.168.1.50/verify-job.rf.gd",
    "company": "Microsoft"
  }'
```

### Response
```json
{
  "success": true,
  "data": {
    "url": "http://192.168.1.50/verify-job.rf.gd",
    "isValid": true,
    "riskIndicators": [
      {
        "type": "Insecure Protocol (HTTP)",
        "severity": "MEDIUM",
        "description": "URL uses unencrypted HTTP instead of secure HTTPS."
      },
      {
        "type": "IP Address Host",
        "severity": "HIGH",
        "description": "URL directly targets an IP address rather than a domain name."
      },
      {
        "type": "Company-Domain Mismatch",
        "severity": "MEDIUM",
        "description": "Domain (192.168.1.50) does not appear to match claimed company name (Microsoft)."
      }
    ],
    "riskScore": 75,
    "riskLevel": "HIGH"
  }
}
```

---

## 4. Screenshot Analysis API

### Request (Multipart Form Data)
`POST /api/analyze/screenshot`

In Postman:
- Method: `POST`
- URL: `http://localhost:5000/api/analyze/screenshot`
- Body: `form-data`
- Key: `screenshot` (Type: `File`), select a `.png` or `.jpg` file.

cURL:
```bash
curl -X POST http://localhost:5000/api/analyze/screenshot \
  -F "screenshot=@/path/to/screenshot.png"
```

### Response
```json
{
  "success": true,
  "data": {
    "extractedText": "Urgent internship opportunity! Pay 500 rupees processing fee to confirm seat.",
    "detectedUrls": [],
    "riskScore": 40,
    "riskLevel": "NEEDS_VERIFICATION",
    "indicators": [
      {
        "type": "Payment Request",
        "severity": "HIGH",
        "points": 25,
        "evidence": "The recruitment content asks the candidate to pay a fee or deposit."
      },
      {
        "type": "Urgency",
        "severity": "MEDIUM",
        "points": 15,
        "evidence": "The message creates artificial urgency or pressures immediate action."
      }
    ],
    "explanation": "Suspicious indicators detected requiring additional verification. Proceed with caution."
  }
}
```

---

## 5. Submit Community Scam Report

### Request
`POST /api/reports`

```bash
curl -X POST http://localhost:5000/api/reports \
  -H "Content-Type: application/json" \
  -d '{
    "company": "FakeCorp Inc",
    "recruiter": "John Doe",
    "url": "http://fakecorp.xyz",
    "reason": "Asked for registration fee of ₹1500 before sending offer letter.",
    "evidence": "WhatsApp screenshots attached"
  }'
```

### Response
```json
{
  "success": true,
  "message": "Community report submitted successfully.",
  "data": {
    "_id": "650c829e1f2b...",
    "company": "FakeCorp Inc",
    "recruiter": "John Doe",
    "url": "http://fakecorp.xyz",
    "reason": "Asked for registration fee of ₹1500 before sending offer letter.",
    "evidence": "WhatsApp screenshots attached",
    "createdAt": "2026-09-19T19:30:00.000Z"
  }
}
```

---

## 6. Query Company Community Reports

### Request
`GET /api/reports/company/:name`

```bash
curl -X GET http://localhost:5000/api/reports/company/FakeCorp%20Inc
```

### Response
```json
{
  "success": true,
  "data": {
    "company": "FakeCorp Inc",
    "reportCount": 1,
    "reports": [
      {
        "_id": "650c829e1f2b...",
        "company": "FakeCorp Inc",
        "recruiter": "John Doe",
        "reason": "Asked for registration fee of ₹1500 before sending offer letter.",
        "createdAt": "2026-09-19T19:30:00.000Z"
      }
    ],
    "verificationWarning": "Multiple user reports are available. Additional verification is recommended."
  }
}
```

---

## 7. History API

### Request
`GET /api/history`

```bash
curl -X GET http://localhost:5000/api/history
```

### Response
```json
{
  "success": true,
  "data": [
    {
      "inputType": "text",
      "riskScore": 86,
      "riskLevel": "HIGH",
      "explanation": "Potentially high risk detected...",
      "createdAt": "2026-09-19T19:35:00.000Z"
    }
  ]
}
```

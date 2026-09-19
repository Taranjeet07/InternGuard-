# InternGuard Backend — AI-Powered Recruitment Safety Platform

**InternGuard ("Verify Before You Trust")** is an AI-powered recruitment safety platform for students. It analyzes job/internship messages, uploaded screenshots, and URLs to identify suspicious recruitment indicators and generates explainable risk reports.

---

## 1. Tech Stack

- **Runtime**: Node.js (CommonJS)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM (with in-memory fallback for offline testing)
- **File Uploads**: Multer
- **OCR Engine**: Tesseract.js (local modular service)
- **AI Integration**: Google Gemini API via environment variables
- **Configuration & Middleware**: `dotenv`, `cors`, Centralized Error Handler

---

## 2. Project Structure

```
backend/
│
├── server.js               # Main Express server entry point
├── package.json            # Node.js dependencies & scripts
├── .env.example            # Environment template
├── .env                    # Environment variables file
├── .gitignore              # Git ignore configuration
├── README.md               # Backend documentation
├── API_TESTING.md          # cURL / Postman testing examples
│
├── routes/
│   ├── analysisRoutes.js   # Analysis endpoints (/api/analyze)
│   └── reportRoutes.js     # Community report endpoints (/api/reports)
│
├── controllers/
│   ├── analysisController.js  # Text, screenshot, URL & history handlers
│   └── reportController.js    # Create & fetch community scam reports
│
├── services/
│   ├── aiService.js        # AI API integration (Gemini / REST) with fallback
│   ├── riskEngine.js       # Rule-based recruitment risk scoring engine
│   ├── urlAnalyzer.js      # Non-invasive URL format & security analyzer
│   └── ocrService.js       # Modular OCR text extraction service
│
├── models/
│   ├── Analysis.js         # Mongoose model for analysis records
│   └── Report.js           # Mongoose model for community scam reports
│
├── middleware/
│   ├── errorHandler.js     # Centralized error handler
│   └── uploadMiddleware.js # Multer file upload & validation middleware
│
└── utils/
    └── helpers.js          # Regex URL extractor & string helpers
```

---

## 3. Installation & Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB installed locally or a MongoDB Atlas URI (Optional — backend will fall back to in-memory mode if DB is disconnected).

### Steps

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

   Edit `.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/internguard
   AI_API_KEY=your_optional_gemini_api_key
   AI_MODEL=gemini-1.5-flash
   ```

4. Start the server:
   - **Production mode**:
     ```bash
     npm start
     ```
   - **Development mode** (with auto-reload):
     ```bash
     npm run dev
     ```

5. Run test verification script:
   ```bash
   npm test
   ```

---

## 4. Key Features & Risk Engine

### A. Rule-Based Risk Engine (`services/riskEngine.js`)
Detects suspicious indicators:
- **Payment Request (+25)**: registration fees, security deposits, training/onboarding fees.
- **Urgency (+15)**: immediate payment pressure, limited seats, act now within 24 hours.
- **Guaranteed Selection (+10)**: guaranteed jobs/internships without proper interview screening.
- **Sensitive Info Request (+20)**: requests for OTPs, passwords, bank accounts, UPI PINs.
- **Unrealistic Compensation (+10)**: disproportionately high salary promises for entry-level work.
- **Suspicious Recruitment Patterns (+10)**: messaging solely via non-standard channels or personal domains.

### B. Risk Levels
- `0 – 25`: **LOW**
- `26 – 60`: **NEEDS_VERIFICATION**
- `61 – 100`: **HIGH** (capped at 100)

> **Important Note**: InternGuard uses neutral, explainable terminology such as *"Potentially high risk"*, *"Requires verification"*, or *"Suspicious indicators detected"*.

---

## 5. API Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Server health check |
| `POST` | `/api/analyze/text` | Analyze recruitment text message |
| `POST` | `/api/analyze/screenshot` | Analyze uploaded screenshot image (Multer + OCR) |
| `POST` | `/api/analyze/url` | Analyze recruitment URL / website domain |
| `POST` | `/api/reports` | Submit a community report about a scam recruiter |
| `GET` | `/api/reports/company/:name` | Fetch community reports & verification warning for a company |
| `GET` | `/api/history` | Retrieve recent 20 recruitment analyses |

---

## 6. How Frontend Connects to Backend

The Express backend has **CORS** enabled. A React + Tailwind frontend can call these REST APIs directly using `fetch` or `axios`:

```javascript
// Example React fetch call
const response = await fetch('http://localhost:5000/api/analyze/text', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: "Congratulations! You are selected. Pay ₹1499 registration fee immediately."
  })
});
const result = await response.json();
console.log(result.data.riskScore); // 86
console.log(result.data.riskLevel); // "HIGH"
```

---

## 7. Troubleshooting

- **MongoDB connection warnings**: If MongoDB is not running locally on your computer, the server will display a notice and automatically operate using in-memory fallbacks so your hackathon demo never fails.
- **Missing AI Key**: If `AI_API_KEY` is not provided in `.env`, the backend operates using the rule-based engine and returns `"aiAnalysisAvailable": false`.
- **Upload File Size Limit**: Screenshot uploads are capped at 5 MB in JPG, JPEG, PNG, or WEBP formats.

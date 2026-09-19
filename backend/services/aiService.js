/**
 * AI Service Integration for InternGuard
 * Optional enhancement using Gemini or AI REST API via AI_API_KEY environment variable.
 */

const https = require('https');

/**
 * Analyzes content using external AI model if AI_API_KEY is configured.
 * @param {string} text - Message or extracted OCR content
 * @returns {Promise<object>} Structured AI response or fallback state
 */
async function analyzeWithAI(text) {
  const apiKey = process.env.AI_API_KEY;
  const modelName = process.env.AI_MODEL || 'gemini-1.5-flash';

  if (!apiKey || apiKey.trim() === '') {
    return {
      aiAnalysisAvailable: false,
      indicators: [],
      explanation: null,
      recommendedActions: []
    };
  }

  try {
    const prompt = `You are a recruitment safety AI analyzer. Analyze the following internship/job message for fraud, scam indicators, payment requests, urgency, unrealistic compensation, sensitive information requests, and impersonation signals.

Message:
"${text}"

Return ONLY a valid JSON object with the following structure (no markdown fences, no extra text):
{
  "indicators": [
    {
      "type": "Payment Request",
      "severity": "HIGH",
      "evidence": "Asks candidate to pay registration fee",
      "confidence": 0.95
    }
  ],
  "explanation": "Summarize the findings clearly.",
  "recommendedActions": [
    "Action item 1",
    "Action item 2"
  ]
}`;

    // Standard REST call to Google Gemini API endpoint
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    const requestData = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const responseText = await makeHttpsPostRequest(url, requestData);
    const parsedRes = JSON.parse(responseText);
    
    const candidateText = parsedRes.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error('Empty AI response candidate');
    }

    const aiData = JSON.parse(cleanJsonOutput(candidateText));

    return {
      aiAnalysisAvailable: true,
      indicators: aiData.indicators || [],
      explanation: aiData.explanation || 'AI analysis completed.',
      recommendedActions: aiData.recommendedActions || []
    };

  } catch (error) {
    console.warn('AI Service notice (continuing with rule engine fallback):', error.message);
    return {
      aiAnalysisAvailable: false,
      indicators: [],
      explanation: null,
      recommendedActions: []
    };
  }
}

/**
 * Helper function for HTTPS POST requests without heavy external npm libraries
 */
function makeHttpsPostRequest(url, body) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.write(body);
    req.end();
  });
}

function cleanJsonOutput(raw) {
  return raw.replace(/```json/gi, '').replace(/```/g, '').trim();
}

module.exports = {
  analyzeWithAI
};

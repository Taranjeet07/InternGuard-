const Analysis = require('../models/Analysis');
const { analyzeRisk } = require('../services/riskEngine');
const { analyzeUrl } = require('../services/urlAnalyzer');
const { analyzeWithAI } = require('../services/aiService');
const { extractTextFromImage } = require('../services/ocrService');
const { extractUrlsFromText, extractDomain } = require('../utils/helpers');

// In-memory fallback array for hackathon demo if MongoDB is not running locally
const memoryAnalysisHistory = [];

/**
 * Perform company & recruiter verification consistency signals
 */
function checkCompanyVerificationSignals(company, recruiterEmail, website, textUrls = []) {
  const signals = [];

  const emailDomain = extractDomain(recruiterEmail);
  const websiteDomain = extractDomain(website);

  if (recruiterEmail && emailDomain) {
    const freeEmailProviders = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'rediffmail.com'];
    if (freeEmailProviders.includes(emailDomain)) {
      signals.push(`Recruiter email uses a public email domain (${emailDomain}) rather than an official corporate email domain.`);
    }

    if (websiteDomain && !emailDomain.includes(websiteDomain) && !websiteDomain.includes(emailDomain) && !freeEmailProviders.includes(emailDomain)) {
      signals.push(`Recruiter email domain (${emailDomain}) differs from company website domain (${websiteDomain}).`);
    }
  }

  if (company && websiteDomain) {
    const cleanCompany = company.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanWebDomain = websiteDomain.replace(/[^a-z0-9]/g, '');
    if (cleanCompany.length >= 4 && !cleanWebDomain.includes(cleanCompany)) {
      signals.push(`Provided website domain (${websiteDomain}) does not contain claimed company name (${company}). Verification recommended.`);
    }
  }

  return signals;
}

/**
 * POST /api/analyze/text
 */
async function analyzeText(req, res, next) {
  try {
    const { text, company, recruiterEmail, website, userId } = req.body;

    if (!text || typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Text content is required for analysis.'
      });
    }

    // 1. Run Rule-Based Risk Engine
    const ruleResult = analyzeRisk(text);

    // 2. Extract embedded URLs & perform URL checks
    const extractedUrls = extractUrlsFromText(text);
    let urlRiskAddedPoints = 0;
    const urlIndicators = [];

    if (extractedUrls.length > 0) {
      for (const u of extractedUrls) {
        const urlAnalysis = analyzeUrl(u, company);
        if (urlAnalysis.riskScore > 0) {
          urlIndicators.push(...urlAnalysis.riskIndicators);
          urlRiskAddedPoints = Math.max(urlRiskAddedPoints, urlAnalysis.riskScore);
        }
      }
    }

    // 3. Check Company & Recruiter verification signals
    const verificationSignals = checkCompanyVerificationSignals(company, recruiterEmail, website, extractedUrls);

    // 4. Run AI Service (optional enhancement)
    const aiResult = await analyzeWithAI(text);

    // 5. Combine Indicators & Calculate Final Score
    const combinedIndicators = [...ruleResult.indicators];
    
    // Add URL risk indicators if any
    urlIndicators.forEach(ind => {
      combinedIndicators.push({
        type: `URL Risk: ${ind.type}`,
        severity: ind.severity,
        points: 10,
        evidence: ind.description
      });
    });

    // Merge AI indicators if available
    if (aiResult.aiAnalysisAvailable && Array.isArray(aiResult.indicators)) {
      aiResult.indicators.forEach(aiInd => {
        // avoid duplicating exact types
        if (!combinedIndicators.some(ci => ci.type.toLowerCase() === aiInd.type.toLowerCase())) {
          combinedIndicators.push({
            type: aiInd.type,
            severity: aiInd.severity || 'MEDIUM',
            points: 15,
            evidence: aiInd.evidence || 'AI identified suspicious pattern.'
          });
        }
      });
    }

    let rawScore = ruleResult.riskScore + Math.floor(urlRiskAddedPoints * 0.4);
    if (verificationSignals.length > 0) rawScore += 10;
    const finalRiskScore = Math.min(rawScore, 100);

    let finalRiskLevel = "LOW";
    if (finalRiskScore >= 61) finalRiskLevel = "HIGH";
    else if (finalRiskScore >= 26) finalRiskLevel = "NEEDS_VERIFICATION";

    // Combine recommended actions
    const allRecommendedActions = [
      ...ruleResult.recommendedActions,
      ...(aiResult.recommendedActions || [])
    ];
    const uniqueRecommendedActions = [...new Set(allRecommendedActions)];

    const responseData = {
      riskScore: finalRiskScore,
      riskLevel: finalRiskLevel,
      indicators: combinedIndicators,
      explanation: aiResult.explanation || ruleResult.explanation,
      recommendedActions: uniqueRecommendedActions,
      aiAnalysisAvailable: aiResult.aiAnalysisAvailable,
      verificationSignals
    };

    // 6. Save Analysis to MongoDB (with graceful in-memory fallback if DB not connected)
    try {
      const newAnalysis = new Analysis({
        userId,
        inputType: 'text',
        inputText: text,
        company,
        recruiterEmail,
        website,
        riskScore: finalRiskScore,
        riskLevel: finalRiskLevel,
        indicators: combinedIndicators,
        explanation: responseData.explanation,
        recommendedActions: uniqueRecommendedActions,
        aiAnalysisAvailable: aiResult.aiAnalysisAvailable,
        verificationSignals
      });
      await newAnalysis.save();
    } catch (dbErr) {
      console.warn('MongoDB save fallback (in-memory):', dbErr.message);
      memoryAnalysisHistory.unshift({
        _id: 'mem_' + Date.now(),
        inputType: 'text',
        inputText: text,
        riskScore: finalRiskScore,
        riskLevel: finalRiskLevel,
        indicators: combinedIndicators,
        explanation: responseData.explanation,
        createdAt: new Date()
      });
    }

    return res.status(200).json({
      success: true,
      data: responseData
    });

  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/analyze/screenshot
 */
async function analyzeScreenshot(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded. Please upload a valid screenshot.'
      });
    }

    // 1. Run OCR to extract text
    let extractedText = '';
    try {
      extractedText = await extractTextFromImage(req.file.buffer);
    } catch (ocrErr) {
      return res.status(400).json({
        success: false,
        message: `Failed to process image OCR: ${ocrErr.message}`
      });
    }

    if (!extractedText) {
      return res.status(200).json({
        success: true,
        data: {
          extractedText: "",
          detectedUrls: [],
          riskScore: 0,
          riskLevel: "LOW",
          indicators: [],
          explanation: "No readable text detected in the uploaded screenshot.",
          recommendedActions: ["Please upload a clearer image containing text."]
        }
      });
    }

    // 2. Extract detected URLs
    const detectedUrls = extractUrlsFromText(extractedText);

    // 3. Perform rule risk engine analysis
    const ruleResult = analyzeRisk(extractedText);

    // 4. Perform URL analysis on detected URLs
    const urlIndicators = [];
    let urlRiskPoints = 0;
    for (const url of detectedUrls) {
      const urlRes = analyzeUrl(url);
      if (urlRes.riskScore > 0) {
        urlIndicators.push(...urlRes.riskIndicators);
        urlRiskPoints = Math.max(urlRiskPoints, urlRes.riskScore);
      }
    }

    // 5. Perform AI analysis if enabled
    const aiResult = await analyzeWithAI(extractedText);

    // 6. Combine scores & indicators
    const combinedIndicators = [...ruleResult.indicators];
    urlIndicators.forEach(ind => {
      combinedIndicators.push({
        type: `URL Risk: ${ind.type}`,
        severity: ind.severity,
        points: 10,
        evidence: ind.description
      });
    });

    const finalRiskScore = Math.min(ruleResult.riskScore + Math.floor(urlRiskPoints * 0.4), 100);
    let finalRiskLevel = "LOW";
    if (finalRiskScore >= 61) finalRiskLevel = "HIGH";
    else if (finalRiskScore >= 26) finalRiskLevel = "NEEDS_VERIFICATION";

    const responseData = {
      extractedText,
      detectedUrls,
      riskScore: finalRiskScore,
      riskLevel: finalRiskLevel,
      indicators: combinedIndicators,
      explanation: aiResult.explanation || ruleResult.explanation,
      recommendedActions: ruleResult.recommendedActions,
      aiAnalysisAvailable: aiResult.aiAnalysisAvailable
    };

    // 7. Save to MongoDB
    try {
      const newAnalysis = new Analysis({
        inputType: 'screenshot',
        inputText: extractedText,
        riskScore: finalRiskScore,
        riskLevel: finalRiskLevel,
        indicators: combinedIndicators,
        explanation: responseData.explanation,
        recommendedActions: responseData.recommendedActions,
        aiAnalysisAvailable: aiResult.aiAnalysisAvailable
      });
      await newAnalysis.save();
    } catch (dbErr) {
      memoryAnalysisHistory.unshift({
        _id: 'mem_' + Date.now(),
        inputType: 'screenshot',
        inputText: extractedText,
        riskScore: finalRiskScore,
        riskLevel: finalRiskLevel,
        indicators: combinedIndicators,
        explanation: responseData.explanation,
        createdAt: new Date()
      });
    }

    return res.status(200).json({
      success: true,
      data: responseData
    });

  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/analyze/url
 */
async function analyzeUrlEndpoint(req, res, next) {
  try {
    const { url, company } = req.body;

    if (!url || typeof url !== 'string' || url.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'URL parameter is required.'
      });
    }

    const urlResult = analyzeUrl(url, company);

    // Save analysis
    try {
      const newAnalysis = new Analysis({
        inputType: 'url',
        url: urlResult.url,
        company,
        riskScore: urlResult.riskScore,
        riskLevel: urlResult.riskLevel,
        indicators: urlResult.riskIndicators.map(i => ({
          type: i.type,
          severity: i.severity,
          points: 10,
          evidence: i.description
        })),
        explanation: urlResult.riskIndicators.length > 0 
          ? "URL structural risk indicators detected." 
          : "URL structure appears standard with low risk indicators.",
        recommendedActions: [
          "Verify the official URL of the target organization.",
          "Check for domain name misspellings (typosquatting)."
        ]
      });
      await newAnalysis.save();
    } catch (dbErr) {
      memoryAnalysisHistory.unshift({
        _id: 'mem_' + Date.now(),
        inputType: 'url',
        url: urlResult.url,
        riskScore: urlResult.riskScore,
        riskLevel: urlResult.riskLevel,
        createdAt: new Date()
      });
    }

    return res.status(200).json({
      success: true,
      data: urlResult
    });

  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/history
 */
async function getHistory(req, res, next) {
  try {
    let history = [];
    try {
      history = await Analysis.find().sort({ createdAt: -1 }).limit(20);
    } catch (dbErr) {
      history = memoryAnalysisHistory.slice(0, 20);
    }

    return res.status(200).json({
      success: true,
      data: history
    });

  } catch (error) {
    next(error);
  }
}

module.exports = {
  analyzeText,
  analyzeScreenshot,
  analyzeUrlEndpoint,
  getHistory,
  memoryAnalysisHistory
};

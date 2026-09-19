/**
 * Rule-Based Risk Engine for InternGuard
 * Analyzes recruitment text for suspicious risk indicators.
 */

const INDICATOR_RULES = [
  {
    type: "Payment Request",
    severity: "HIGH",
    points: 25,
    keywords: [
      "pay", "registration fee", "security deposit", "processing fee", 
      "onboarding fee", "refundable fee", "payment required", "enrollment fee",
      "laptop fee", "training fee", "deposit amount", "transfer money", "₹", "rupees"
    ],
    defaultEvidence: "The recruitment content asks the candidate to pay a fee or deposit."
  },
  {
    type: "Urgency",
    severity: "MEDIUM",
    points: 15,
    keywords: [
      "immediately", "urgent", "today only", "within 24 hours", "act now", 
      "limited seats", "hurry up", "expiring soon", "last chance", "before midnight"
    ],
    defaultEvidence: "The message creates artificial urgency or pressures immediate action."
  },
  {
    type: "Guaranteed Selection",
    severity: "MEDIUM",
    points: 10,
    keywords: [
      "guaranteed job", "guaranteed internship", "100% selection", 
      "guaranteed placement", "direct selection", "no rejection", "selected without interview"
    ],
    defaultEvidence: "The offer promises guaranteed selection or employment without typical screening."
  },
  {
    type: "Sensitive Information Request",
    severity: "HIGH",
    points: 20,
    keywords: [
      "otp", "password", "bank account", "upi pin", "card details", 
      "banking information", "cvv", "aadhar pin", "netbanking"
    ],
    defaultEvidence: "The request solicits sensitive banking or authentication credentials."
  },
  {
    type: "Unrealistic Compensation",
    severity: "MEDIUM",
    points: 10,
    keywords: [
      "extremely high salary", "guaranteed high income", "unrealistic work-from-home earnings",
      "earn 50k", "earn 1 lakh", "no experience required for high pay", "earn $500 daily"
    ],
    defaultEvidence: "Promises compensation that is disproportionately high for entry-level/no-experience roles."
  },
  {
    type: "Suspicious Recruitment Pattern",
    severity: "MEDIUM",
    points: 10,
    keywords: [
      "no interview", "pressure to pay", "pressure to send documents immediately",
      "telegram only", "whatsapp only for interview", "contact on whatsapp",
      "work from home typing job", "data entry registration"
    ],
    defaultEvidence: "Displays non-standard recruitment channels or suspicious hiring procedures."
  }
];

/**
 * Analyzes text against defined rules and calculates total risk score.
 * @param {string} text - Message or extracted OCR text to analyze
 * @returns {object} Analysis result containing riskScore, riskLevel, indicators, explanation, recommendedActions
 */
function analyzeRisk(text) {
  if (!text || typeof text !== 'string') {
    return {
      riskScore: 0,
      riskLevel: "LOW",
      indicators: [],
      explanation: "No suspicious content detected.",
      recommendedActions: ["Verify all recruitment communications through official channels."]
    };
  }

  const lowerText = text.toLowerCase();
  const detectedIndicators = [];
  let totalScore = 0;

  for (const rule of INDICATOR_RULES) {
    const matchedKeywords = rule.keywords.filter(keyword => lowerText.includes(keyword.toLowerCase()));

    if (matchedKeywords.length > 0) {
      totalScore += rule.points;
      
      detectedIndicators.push({
        type: rule.type,
        severity: rule.severity,
        points: rule.points,
        evidence: `${rule.defaultEvidence} Found matched phrases: "${matchedKeywords.slice(0, 3).join('", "')}".`
      });
    }
  }

  // Cap score at 100
  const riskScore = Math.min(totalScore, 100);

  // Determine risk level based on score ranges:
  // 0–25: LOW
  // 26–60: NEEDS_VERIFICATION
  // 61–100: HIGH
  let riskLevel = "LOW";
  if (riskScore >= 61) {
    riskLevel = "HIGH";
  } else if (riskScore >= 26) {
    riskLevel = "NEEDS_VERIFICATION";
  }

  // Generate explainable summary & recommended actions using prudent wording
  const explanation = generateExplanation(riskLevel, detectedIndicators);
  const recommendedActions = generateRecommendedActions(riskLevel, detectedIndicators);

  return {
    riskScore,
    riskLevel,
    indicators: detectedIndicators,
    explanation,
    recommendedActions
  };
}

/**
 * Generates human-readable explanation using prudent, non-accusatory language
 */
function generateExplanation(riskLevel, indicators) {
  if (indicators.length === 0 || riskLevel === "LOW") {
    return "Low risk signals detected. However, standard verification of any offer is always recommended.";
  }

  if (riskLevel === "HIGH") {
    return "Potentially high risk detected due to multiple suspicious indicators. Further verification is strongly advised before proceeding or sharing money/data.";
  }

  return "Suspicious indicators detected requiring additional verification. Proceed with caution.";
}

/**
 * Generates tailored recommended actions based on detected indicators
 */
function generateRecommendedActions(riskLevel, indicators) {
  const actions = [];
  const indicatorTypes = indicators.map(i => i.type);

  if (indicatorTypes.includes("Payment Request")) {
    actions.push("Do not make any upfront payment, registration fee, or security deposit. Legitimate employers rarely ask candidates to pay for job placement.");
  }
  if (indicatorTypes.includes("Sensitive Information Request")) {
    actions.push("Never share OTPs, passwords, bank account numbers, or personal PINs with recruiters.");
  }
  if (indicatorTypes.includes("Urgency")) {
    actions.push("Do not let pressure tactics or tight deadlines rush your decisions.");
  }

  actions.push("Verify the opportunity through the organization's official website or direct HR department.");
  actions.push("Cross-check the recruiter's email domain against the company's official public domain.");

  return actions;
}

module.exports = {
  analyzeRisk,
  INDICATOR_RULES
};

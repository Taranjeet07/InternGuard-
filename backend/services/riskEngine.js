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
      "registration fee",
      "security deposit",
      "processing fee",
      "onboarding fee",
      "refundable fee",
      "payment required",
      "enrollment fee",
      "laptop fee",
      "training fee",
      "deposit amount",
      "transfer money",
      "application fee",
      "joining fee",
      "verification fee",
      "placement fee",
      "pay the fee",
      "pay a fee",
      "pay registration",
      "pay the registration",
      "pay deposit",
      "pay the deposit",
      "make a payment",
      "make payment",
      "send payment",
      "payment of",
      "pay ₹",
      "pay rs",
      "pay inr",
      "pay rupees"
    ],
    defaultEvidence:
      "The recruitment content asks the candidate to pay a fee or deposit."
  },

  {
    type: "Urgency",
    severity: "MEDIUM",
    points: 15,
    keywords: [
      "immediately",
      "urgent",
      "today only",
      "within 24 hours",
      "act now",
      "limited seats",
      "hurry up",
      "expiring soon",
      "last chance",
      "before midnight"
    ],
    defaultEvidence:
      "The message creates artificial urgency or pressures immediate action."
  },

  {
    type: "Guaranteed Selection",
    severity: "MEDIUM",
    points: 10,
    keywords: [
      "guaranteed job",
      "guaranteed internship",
      "100% selection",
      "guaranteed placement",
      "direct selection",
      "no rejection",
      "selected without interview"
    ],
    defaultEvidence:
      "The offer promises guaranteed selection or employment without typical screening."
  },

  {
    type: "Sensitive Information Request",
    severity: "HIGH",
    points: 20,
    keywords: [
      "otp",
      "password",
      "bank account",
      "upi pin",
      "card details",
      "banking information",
      "cvv",
      "aadhar pin",
      "aadhaar pin",
      "netbanking"
    ],
    defaultEvidence:
      "The request solicits sensitive banking or authentication credentials."
  },

  {
    type: "Unrealistic Compensation",
    severity: "MEDIUM",
    points: 10,
    keywords: [
      "extremely high salary",
      "guaranteed high income",
      "unrealistic work-from-home earnings",
      "earn 50k",
      "earn 1 lakh",
      "no experience required for high pay",
      "earn $500 daily"
    ],
    defaultEvidence:
      "Promises compensation that is disproportionately high for entry-level/no-experience roles."
  },

  {
    type: "Suspicious Recruitment Pattern",
    severity: "MEDIUM",
    points: 10,
    keywords: [
      "no interview",
      "pressure to pay",
      "pressure to send documents immediately",
      "telegram only",
      "whatsapp only for interview",
      "contact on whatsapp",
      "work from home typing job",
      "data entry registration"
    ],
    defaultEvidence:
      "Displays non-standard recruitment channels or suspicious hiring procedures."
  }
];

/**
 * Special payment detection.
 *
 * Currency symbols such as ₹ or words such as "salary", "stipend"
 * should NOT automatically be treated as payment requests.
 *
 * A payment request should have contextual language indicating
 * that the candidate is being asked to SEND/PAY money.
 */
function detectPaymentRequest(text) {
  const lowerText = text.toLowerCase();

  const paymentPatterns = [
    /\bregistration\s+fee\b/,
    /\bsecurity\s+deposit\b/,
    /\bprocessing\s+fee\b/,
    /\bonboarding\s+fee\b/,
    /\brefundable\s+fee\b/,
    /\bpayment\s+required\b/,
    /\benrollment\s+fee\b/,
    /\blaptop\s+fee\b/,
    /\btraining\s+fee\b/,
    /\bdeposit\s+amount\b/,
    /\bapplication\s+fee\b/,
    /\bjoining\s+fee\b/,
    /\bverification\s+fee\b/,
    /\bplacement\s+fee\b/,
    /\bpay\s+(?:the\s+)?fee\b/,
    /\bpay\s+(?:the\s+)?deposit\b/,
    /\bpay\s+(?:the\s+)?registration\b/,
    /\bmake\s+(?:a\s+)?payment\b/,
    /\bsend\s+(?:the\s+)?payment\b/,
    /\bpayment\s+of\b/,
    /\btransfer\s+money\b/,
    /\bpay\s+(?:₹|rs\.?|inr|rupees)\b/,
    /\bpay\s+\d+/,
    /\bpay\s+(?:us|our|the)\b/
  ];

  const matched = [];

  for (const pattern of paymentPatterns) {
    const match = lowerText.match(pattern);

    if (match && !matched.includes(match[0])) {
      matched.push(match[0]);
    }
  }

  return matched;
}

/**
 * Analyzes text against defined rules and calculates total risk score.
 *
 * @param {string} text
 * @returns {object}
 */
function analyzeRisk(text) {
  if (!text || typeof text !== "string") {
    return {
      riskScore: 0,
      riskLevel: "LOW",
      indicators: [],
      explanation: "No suspicious content detected.",
      recommendedActions: [
        "Verify all recruitment communications through official channels."
      ]
    };
  }

  const lowerText = text.toLowerCase();
  const detectedIndicators = [];
  let totalScore = 0;

  for (const rule of INDICATOR_RULES) {

    // Payment Request uses special contextual detection
    if (rule.type === "Payment Request") {
      const matchedKeywords = detectPaymentRequest(text);

      if (matchedKeywords.length > 0) {
        totalScore += rule.points;

        detectedIndicators.push({
          type: rule.type,
          severity: rule.severity,
          points: rule.points,
          evidence:
            `${rule.defaultEvidence} Found matched phrases: ` +
            `"${matchedKeywords.slice(0, 3).join('", "')}".`
        });
      }

      continue;
    }

    // Normal keyword detection for other indicators
    const matchedKeywords = rule.keywords.filter(keyword =>
      lowerText.includes(keyword.toLowerCase())
    );

    if (matchedKeywords.length > 0) {
      totalScore += rule.points;

      detectedIndicators.push({
        type: rule.type,
        severity: rule.severity,
        points: rule.points,
        evidence:
          `${rule.defaultEvidence} Found matched phrases: ` +
          `"${matchedKeywords.slice(0, 3).join('", "')}".`
      });
    }
  }

  // Cap score at 100
  const riskScore = Math.min(totalScore, 100);

  // Determine risk level:
  // 0–25   = LOW
  // 26–60  = NEEDS_VERIFICATION
  // 61–100 = HIGH

  let riskLevel = "LOW";

  if (riskScore >= 61) {
    riskLevel = "HIGH";
  } else if (riskScore >= 26) {
    riskLevel = "NEEDS_VERIFICATION";
  }

  const explanation = generateExplanation(
    riskLevel,
    detectedIndicators
  );

  const recommendedActions = generateRecommendedActions(
    riskLevel,
    detectedIndicators
  );

  return {
    riskScore,
    riskLevel,
    indicators: detectedIndicators,
    explanation,
    recommendedActions
  };
}

/**
 * Generates human-readable explanation.
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
 * Generates tailored recommended actions.
 */
function generateRecommendedActions(riskLevel, indicators) {
  const actions = [];
  const indicatorTypes = indicators.map(i => i.type);

  if (indicatorTypes.includes("Payment Request")) {
    actions.push(
      "Do not make any upfront payment, registration fee, or security deposit. Legitimate employers rarely ask candidates to pay for job placement."
    );
  }

  if (indicatorTypes.includes("Sensitive Information Request")) {
    actions.push(
      "Never share OTPs, passwords, bank account numbers, or personal PINs with recruiters."
    );
  }

  if (indicatorTypes.includes("Urgency")) {
    actions.push(
      "Do not let pressure tactics or tight deadlines rush your decisions."
    );
  }

  actions.push(
    "Verify the opportunity through the organization's official website or direct HR department."
  );

  actions.push(
    "Cross-check the recruiter's email domain against the company's official public domain."
  );

  return actions;
}

module.exports = {
  analyzeRisk,
  INDICATOR_RULES
};
